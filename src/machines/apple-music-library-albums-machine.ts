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
  | { type: "SORT"; order: keyof MusicKit.LibraryAlbums["attributes"]; direction: "asc" | "desc" }
  | { type: "LOAD" }
  | { type: "IDLE" }
  | { type: "LOADING" }
  | { type: "RESET" }
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
    predictableActionArguments: true,

    id,

    initial: "idle",

    context: {
      hasNext: true,
      offset: 0,
      albums: [],
      version,
    },

    on: {
      RESET: {
        actions: "reset",
        target: "checking",
      },
    },

    states: {
      idle: {
        invoke: {
          src: () => (callback) => {
            (async () => {
              try {
                const context = await store.get<Context>(id);
                if (context && context.version === version) {
                  callback({
                    type: "REMEMBER",
                    context,
                  });
                }
              } catch (error) {
                // nothing
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

          onError: "done",
        },
        on: {},
      },

      done: {
        on: {
          SORT: { actions: "sort" },
        },
      },
    },
  },
  {
    actions: {
      reset: assign({
        hasNext: (_) => true,
        offset: (_) => 0,
        albums: (_) => [],
        version: (_) => version,
      }),

      memory: (context) => store.set(id, context),

      remember: assign({
        hasNext: (_, event) => ("context" in event ? event.context.hasNext : false),
        offset: (_, event) => ("context" in event ? event.context.offset : 0),
        albums: (_, event) => ("context" in event ? event.context.albums : []),
        version: (_, event) => ("context" in event ? event.context.version : version),
      }),

      sort: assign({
        albums: (context, event) => {
          console.log("aaaa");
          if ("order" in event) {
            return context.albums.sort((albumA, albumB) => {
              const contentA = albumA.attributes[event.order];
              const contentB = albumB.attributes[event.order];
              if (contentA && contentB && contentA > contentB) {
                return event.direction === "asc" ? 1 : -1;
              }
              return -1;
            });
          }
          return context.albums;
        },
      }),
    },
  },
);

export const libraryAlbumsService = interpret(libraryAlbumsMachine).start();
