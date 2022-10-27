// xstate では順序を見やすくするため object key sort は無効にする
/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */

import type { GetMultiDataOptions } from "capacitor-plugin-musickit";
import { assign, send, createMachine } from "xstate";
import type { DoneInvokeEvent } from "xstate";

const version = 1;

type BaseType = (options: {}) => Promise<MusicKit.Relationship<{}>>;

export type Context<T extends BaseType> = {
  hasNext: boolean;
  offset: number;
  props: Parameters<T>[0] & GetMultiDataOptions;
  items: Awaited<ReturnType<T>>["data"];
  version: number;
};

export type Event<T extends BaseType> =
  | { type: "SET_PROPS"; props: Parameters<T>[0] & GetMultiDataOptions }
  | { type: "LOAD" }
  | { type: "IDLE" }
  | { type: "LOADING" }
  | { type: "REMEMBER"; context: Context<T> };

export type State<T extends BaseType> =
  | {
      value: "idle";
      context: Context<T>;
    }
  | {
      value: "checking";
      context: Context<T>;
    }
  | {
      value: "loading";
      context: Context<T>;
    }
  | {
      value: "done";
      context: Context<T>;
    };

export const id = "AppleMusicLibraryItems";

export const createLibraryItemsMachine = <T extends BaseType>(getLibraryItems: T) =>
  createMachine<Context<T>, Event<T>, State<T>>(
    {
      id,

      initial: "idle",

      context: {
        hasNext: true,
        offset: 0,
        props: {},
        items: [],
        version,
      },

      states: {
        idle: {
          on: {
            SET_PROPS: {
              target: "checking",
              actions: ["setProps", "setLimit"],
            },
          },
        },

        checking: {
          entry: [send("LOADING")],
          on: {
            LOADING: [
              {
                cond: (context) => context.hasNext,
                target: "loading",
              },
              {
                target: "done",
              },
            ],
          },
        },

        loading: {
          invoke: {
            id: "getLibraryItems",

            src: (context) =>
              getLibraryItems({
                offset: context.offset,
                ...context.props,
              }),

            onDone: {
              target: "checking",
              actions: assign({
                items: (context, event: DoneInvokeEvent<Awaited<ReturnType<T>>>) => [
                  ...context.items,
                  ...event.data.data,
                ],
                offset: (context) => context.offset + (context.props.limit ?? 1),
                hasNext: (_, event) => Boolean(event.data.next),
              }),
            },

            onError: {
              target: "checking",
              actions: assign({
                hasNext: (_) => false,
              }),
            },
          },
          on: {},
        },

        done: {},
      },
    },
    {
      actions: {
        setProps: assign({
          props: (_, event) => ("props" in event ? event.props : {}),
        }),
      },
    },
  );
