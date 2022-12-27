// xstate では順序を見やすくするため object key sort は無効にする
/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */

import { CapacitorMusicKit, type GetLibrarySongsResult } from "capacitor-plugin-musickit";
import { assign, send, createMachine, interpret } from "xstate";
import type { DoneInvokeEvent } from "xstate";
import { getRatings } from "~/lib/getRatings";
import { favoritesStoreId, type FavoriteType } from "~/store/favorites";
import { store } from "~/store/store";

const version = 1;

export type Context = {
  needFetchFavorites: boolean;
  hasNext: boolean;
  offset: number;
  items: MusicKit.LibrarySongs[];
  version: number;
  filteredItems: MusicKit.LibrarySongs[];
  filterOrder?: keyof MusicKit.LibrarySongs["attributes"];
  filterDirection?: "asc" | "desc";
  filterName?: string | null;
  filterFavorite?: boolean;
  filterFavorites: string[];
};

export type Event =
  | {
      type: "FILTER";
      order: Context["filterOrder"];
      direction: Context["filterDirection"];
      name?: string | null;
      favorite: boolean;
    }
  | { type: "DONE" }
  | { type: "LOAD" }
  | { type: "IDLE" }
  | { type: "LOADING" }
  | { type: "FETCH_FAVORITES" }
  | { type: "SET_FAVORITES"; favorites: string[] }
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
    }
  | {
      value: "filtering";
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
      version,
      needFetchFavorites: true,
      hasNext: true,
      offset: 0,
      items: [],
      filteredItems: [],
      filterFavorites: [],
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
          id: "getLibrarySongs",

          src: (context) =>
            CapacitorMusicKit.getLibrarySongs({
              limit,
              offset: context.offset,
            }),

          onDone: {
            target: "checking",
            actions: [
              assign({
                items: (context, event: DoneInvokeEvent<GetLibrarySongsResult>) => [
                  ...context.items,
                  ...event.data.data,
                ],
                offset: (context) => context.offset + limit,
                hasNext: (_, event) => Boolean(event.data.next),
              }),
              assign({
                filteredItems: (context) => context.items,
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
          FILTER: {
            target: "filtering",
            actions: "setFilters",
          },
          FETCH_FAVORITES: {
            cond: (context) => context.needFetchFavorites,
            actions: ["fetchFavorites", "memory"],
          },
        },
      },

      filtering: {
        exit: ["filter", "memory"],
        invoke: {
          src: () => (callback) => {
            (async () => {
              const favorites = await store.get<FavoriteType>(favoritesStoreId);
              const favoriteKeys = Object.keys(favorites!);
              callback({
                type: "SET_FAVORITES",
                favorites: favoriteKeys,
              });
              callback({ type: "DONE" });
            })();
          },
        },
        on: {
          DONE: "done",
          SET_FAVORITES: { actions: "setFavorites" },
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
        items: (_) => [],
        version: (_) => version,
        filteredItems: (_) => [],
        filterName: (_) => undefined,
        filterOrder: (_) => undefined,
        filterDirection: (_) => undefined,
        filterFavorite: (_) => undefined,
      }),

      fetchFavorites: assign({
        needFetchFavorites: (context) => {
          const ids = context.items.map((item) => item.id);
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

      setFavorites: assign({
        filterFavorites: (_, event) => ("favorites" in event ? event.favorites : []),
      }),

      memory: (context) => store.set(id, context),

      remember: assign({
        needFetchFavorites: (_, event) =>
          "context" in event ? event.context.needFetchFavorites : true,
        hasNext: (_, event) => ("context" in event ? event.context.hasNext : true),
        offset: (_, event) => ("context" in event ? event.context.offset : 0),
        items: (_, event) => ("context" in event ? event.context.items : []),
        version: (_, event) => ("context" in event ? event.context.version : version),
        filteredItems: (_, event) => ("context" in event ? event.context.filteredItems : []),
        filterName: (_, event) => ("context" in event ? event.context.filterName : undefined),
        filterOrder: (_, event) => ("context" in event ? event.context.filterOrder : undefined),
        filterDirection: (_, event) =>
          "context" in event ? event.context.filterDirection : undefined,
        filterFavorite: (_, event) =>
          "context" in event ? event.context.filterFavorite : undefined,
      }),

      setFilters: assign({
        filterName: (_, event) => ("name" in event ? event.name : undefined),
        filterOrder: (_, event) => ("order" in event ? event.order : undefined),
        filterDirection: (_, event) => ("direction" in event ? event.direction : undefined),
        filterFavorite: (_, event) => ("favorite" in event ? event.favorite : undefined),
      }),

      filter: assign({
        filteredItems: (context) => {
          let filteredItems: MusicKit.LibrarySongs[] = context.items.slice();
          if (context.filterOrder) {
            filteredItems = filteredItems.sort((itemA, itemB) => {
              const contentA = itemA.attributes[context.filterOrder!];
              const contentB = itemB.attributes[context.filterOrder!];
              if (contentA && contentB && contentA > contentB) {
                return context.filterDirection === "asc" ? 1 : -1;
              }
              return context.filterDirection === "asc" ? -1 : 1;
            });
          }
          if (context.filterName) {
            const re = new RegExp(`${context.filterName}`, "igu");
            filteredItems = filteredItems.filter((item) => Boolean(item.attributes.name.match(re)));
          }
          if (context.filterFavorite) {
            filteredItems = filteredItems.filter((item) =>
              context.filterFavorites.includes(item.id),
            );
          }
          return filteredItems;
        },
      }),
    },
  },
);

export const libraryAlbumsService = interpret(libraryAlbumsMachine).start();
