// xstate では順序を見やすくするため object key sort は無効にする
/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */

import { CapacitorMusicKit, type GetLibraryAlbumsResult } from "capacitor-plugin-musickit";
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
  albums: MusicKit.LibraryAlbums[];
  version: number;
  filteredAlbums: MusicKit.LibraryAlbums[];
  filterOrder?: keyof MusicKit.LibraryAlbums["attributes"];
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
      needFetchFavorites: false,
      hasNext: true,
      offset: 0,
      albums: [],
      filteredAlbums: [],
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
        albums: (_) => [],
        version: (_) => version,
        filteredAlbums: (_) => [],
        filterName: (_) => undefined,
        filterOrder: (_) => undefined,
        filterDirection: (_) => undefined,
        filterFavorite: (_) => undefined,
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

      setFavorites: assign({
        filterFavorites: (_, event) => ("favorites" in event ? event.favorites : []),
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
        filteredAlbums: (context) => {
          let filteredAlbums: MusicKit.LibraryAlbums[] = context.albums.slice();
          if (context.filterOrder) {
            filteredAlbums = filteredAlbums.sort((albumA, albumB) => {
              const contentA = albumA.attributes[context.filterOrder!];
              const contentB = albumB.attributes[context.filterOrder!];
              if (contentA && contentB && contentA > contentB) {
                return context.filterDirection === "asc" ? 1 : -1;
              }
              return context.filterDirection === "asc" ? -1 : 1;
            });
          }
          if (context.filterName) {
            const re = new RegExp(`${context.filterName}`, "igu");
            filteredAlbums = filteredAlbums.filter((album) =>
              Boolean(album.attributes.name.match(re)),
            );
          }
          if (context.filterFavorite) {
            filteredAlbums = filteredAlbums.filter((album) =>
              context.filterFavorites.includes(album.id),
            );
          }
          return filteredAlbums;
        },
      }),
    },
  },
);

export const libraryAlbumsService = interpret(libraryAlbumsMachine).start();
