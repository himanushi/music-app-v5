// xstate では順序を見やすくするため object key sort は無効にする
/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */

import { CapacitorMusicKit, type GetLibraryAlbumsResult } from "capacitor-plugin-musickit";
import { assign, send, createMachine, interpret } from "xstate";
import type { DoneInvokeEvent } from "xstate";
import { store } from "~/store/store";

const version = 1;

export type Context = {
  hasNext: boolean;
  offset: number;
  albums: MusicKit.LibraryAlbums[];
  version: number;
};

export type Event =
  | { type: "LOAD" }
  | { type: "IDLE" }
  | { type: "LOADING" }
  | { type: "REMEMBER"; context: Context };

export type State =
  | {
      value: "idle";
      context: Context;
    }
  | {
      value: "checking";
      context: Context;
    }
  | {
      value: "loading";
      context: Context;
    }
  | {
      value: "done";
      context: Context;
    };

export const id = "AppleMusicLibraryAlbums";

const limit = 100;

export const libraryAlbumsMachine = createMachine<Context, Event, State>(
  {
    id,

    initial: "idle",

    context: {
      hasNext: true,
      offset: 0,
      albums: [],
      version,
    },

    states: {
      idle: {
        invoke: {
          src: () => (callback) => {
            (async () => {
              const context = await store.get<Context>(id);
              if (context && context.version === version) {
                callback({
                  type: "REMEMBER",
                  context,
                });
              }
            })();
          },
        },
        on: {
          REMEMBER: { actions: "remember" },
          LOAD: "checking",
        },
      },

      checking: {
        entry: [send("LOADING"), "memory"],
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
          id: "getLibraryAlbums",

          src: (context) =>
            CapacitorMusicKit.getLibraryAlbums({
              limit,
              offset: context.offset,
            }),

          onDone: {
            target: "checking",
            actions: assign({
              albums: (context, event: DoneInvokeEvent<GetLibraryAlbumsResult>) => [
                ...context.albums,
                ...event.data.data,
              ],
              offset: (context) => context.offset + limit,
              hasNext: (_, event) => Boolean(event.data.next),
            }),
          },

          onError: "idle",
        },
        on: {},
      },

      done: {},
    },
  },
  {
    actions: {
      memory: (context) => store.set(id, context),

      remember: assign({
        hasNext: (_, event) => ("context" in event ? event.context.hasNext : false),
        offset: (_, event) => ("context" in event ? event.context.offset : 0),
        albums: (_, event) => ("context" in event ? event.context.albums : []),
        version: (_, event) => ("context" in event ? event.context.version : version),
      }),
    },
  },
);

export const libraryAlbumsService = interpret(libraryAlbumsMachine).start();
