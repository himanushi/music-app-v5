// xstate では順序を見やすくするため object key sort は無効にする
/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */

import { CapacitorMusicKit, type GetLibraryAlbumsResult } from "capacitor-plugin-musickit";
import { assign, send, createMachine, interpret } from "xstate";
import type { DoneInvokeEvent } from "xstate";
import { getRatings } from "~/lib/getRatings";
import { store } from "~/store/store";

const version = 1;

export type Context = {
  needFetchFavorites: boolean;
  hasNext: boolean;
  offset: number;
  albums: MusicKit.LibraryAlbums[];
  version: number;
  filteredAlbums: MusicKit.LibraryAlbums[];
  filterOrder?: keyof MusicKit.LibraryAlbums["attributes"];
  filterDirection?: "asc" | "desc";
};

export type Event =
  | { type: "SORT"; order: Context["filterOrder"]; direction: Context["filterDirection"] }
  | { type: "LOAD" }
  | { type: "IDLE" }
  | { type: "LOADING" }
  | { type: "FETCH_FAVORITES" }
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
      needFetchFavorites: false,
      hasNext: true,
      offset: 0,
      albums: [],
      filteredAlbums: [],
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
            actions: [
              assign({
                albums: (context, event: DoneInvokeEvent<GetLibraryAlbumsResult>) => [
                  ...context.albums,
                  ...event.data.data,
                ],
                offset: (context) => context.offset + limit,
                hasNext: (_, event) => Boolean(event.data.next),
              }),
              assign({
                filteredAlbums: (context) => context.albums,
              }),
            ],
          },

          onError: "done",
        },
        on: {},
      },

      done: {
        entry: [send("FETCH_FAVORITES")],
        on: {
          SORT: { actions: "sort" },
          FETCH_FAVORITES: {
            cond: (context) => context.needFetchFavorites,
            actions: ["fetchFavorites", "memory"],
          },
        },
      },
    },
  },
  {
    actions: {
      reset: assign({
        needFetchFavorites: (_) => true,
        hasNext: (_) => true,
        offset: (_) => 0,
        albums: (_) => [],
        version: (_) => version,
        filteredAlbums: (_) => [],
        filterOrder: (_) => undefined,
        filterDirection: (_) => undefined,
      }),

      fetchFavorites: assign({
        needFetchFavorites: (context) => {
          const ids = context.albums.map((album) => album.id);
          try {
            getRatings({
              categoryType: "albums",
              ids,
            });
          } catch {
            // nothing
          }
          return false;
        },
      }),

      memory: (context) => store.set(id, context),

      remember: assign({
        needFetchFavorites: (_, event) =>
          "context" in event ? event.context.needFetchFavorites : true,
        hasNext: (_, event) => ("context" in event ? event.context.hasNext : true),
        offset: (_, event) => ("context" in event ? event.context.offset : 0),
        albums: (_, event) => ("context" in event ? event.context.albums : []),
        version: (_, event) => ("context" in event ? event.context.version : version),
        filteredAlbums: (_, event) => ("context" in event ? event.context.filteredAlbums : []),
        filterOrder: (_, event) => ("context" in event ? event.context.filterOrder : undefined),
        filterDirection: (_, event) =>
          "context" in event ? event.context.filterDirection : undefined,
      }),

      sort: assign({
        filteredAlbums: (context, event) => {
          if ("order" in event) {
            return context.albums.slice().sort((albumA, albumB) => {
              const contentA = albumA.attributes[event.order!];
              const contentB = albumB.attributes[event.order!];
              if (contentA && contentB && contentA > contentB) {
                return event.direction === "asc" ? 1 : -1;
              }
              return event.direction === "asc" ? -1 : 1;
            });
          }
          return context.albums;
        },
        filterOrder: (_, event) => ("order" in event ? event.order : undefined),
        filterDirection: (_, event) => ("direction" in event ? event.direction : undefined),
      }),
    },
  },
);

export const libraryAlbumsService = interpret(libraryAlbumsMachine).start();
