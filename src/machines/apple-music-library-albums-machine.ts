// xstate では順序を見やすくするため object key sort は無効にする
/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */

import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { assign, send, createMachine } from "xstate";
import type { DoneInvokeEvent } from "xstate";
import { store } from "~/store/store";

export type LibraryAlbum = {
  libraryId: string;
  name: string;
  artworkUrl?: string;
};

const version = 1;

export type Context = {
  hasNext: boolean;
  offset: number;
  albums: LibraryAlbum[];
  version: number;
};

export type Event = { type: "LOAD" } | { type: "IDLE" } | { type: "LOADING" };

export type State =
  | {
      value: "idle";
      context: Context;
    }
  | {
      value: "loading";
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
        on: {
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
              albums: (
                context,
                event: DoneInvokeEvent<
                  Awaited<ReturnType<typeof CapacitorMusicKit.getLibraryAlbums>>
                >,
              ) => [
                ...context.albums,
                ...event.data.albums.map((album) => ({
                  libraryId: album.id,
                  name: album.title,
                  artworkUrl: album.artworkUrl,
                })),
              ],
              offset: (context) => context.offset + limit,
              hasNext: (_, event) => event.data.hasNext,
            }),
          },

          onError: "idle",
        },
        on: {},
      },
    },
  },
  {
    actions: {
      memory: (context) => store.set(id, context),
    },
  },
);
