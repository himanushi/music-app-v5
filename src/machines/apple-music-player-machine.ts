// xstate では順序を見やすくするため object key sort は無効にする
/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */
import type { PluginListenerHandle } from "@capacitor/core";
import type { PlaybackStates, TrackResult } from "capacitor-plugin-musickit";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { assign, interpret, createMachine } from "xstate";
import { store } from "~/store/store";

const version = 1;

type Context = {
  currentTrack?: TrackResult;
  currentPlaybackNo: number;
  trackIds: string[];
  version: number;
};

type Event =
  | { type: "SET_CURRENT_TRACK"; currentTrack?: TrackResult }
  | { type: "SET_CURRENT_PLAYBACK_NO"; currentPlaybackNo: number }
  | { type: "REPLACE_AND_PLAY"; trackIds: string[]; currentPlaybackNo: number }
  | { type: "LOADING" }
  | { type: "WAITING" }
  | { type: "PLAY_OR_PAUSE" }
  | { type: "PLAY" }
  | { type: "PLAYING" }
  | { type: "PAUSE" }
  | { type: "PAUSED" }
  | { type: "STOP" }
  | { type: "STOPPED" }
  | { type: "MEMORY" }
  | { type: "REMEMBER"; context: Context };

type State =
  | { value: "idle"; context: Context }
  | { value: "playing"; context: Context }
  | { value: "loading"; context: Context }
  | { value: "paused"; context: Context }
  | { value: "stopped"; context: Context };

const setEvents = (callback: any, events: string[][]) => {
  // eslint-disable-next-line no-unused-vars
  const didChange: (state: { result: PlaybackStates }) => any = (state) => {
    events.forEach((event) => {
      if (state.result === event[0]) {
        callback(event[1]);
      }
    });
  };

  let listener: PluginListenerHandle;
  (async () => {
    listener = await CapacitorMusicKit.addListener("playbackStateDidChange", didChange);
  })();

  return () => {
    if (listener) {
      listener.remove();
    }
  };
};

const id = "AppleMusicPlayer";

export const playerMachine = createMachine<Context, Event, State>(
  {
    context: {
      currentTrack: undefined,
      currentPlaybackNo: -1,
      trackIds: [],
      version,
    },

    id,

    initial: "idle",

    on: {
      REPLACE_AND_PLAY: {
        target: `#${id}.loading.queueing`,
        actions: ["setTrackIds", "setCurrentPlaybackNo"],
      },
    },

    invoke: {
      src: () => () => {
        let listener: PluginListenerHandle;
        (async () => {
          listener = await CapacitorMusicKit.addListener("playbackStateDidChange", (result) => {
            console.log(result.result);
          });
        })();

        return () => {
          if (listener) {
            listener.remove();
          }
        };
      },
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
          PLAY_OR_PAUSE: `#${id}.loading.queueing`,
        },
      },

      loading: {
        states: {
          queueing: {
            invoke: {
              src: (context) => CapacitorMusicKit.setQueue({ ids: context.trackIds }),
              onDone: "fetching",
              onError: `#${id}.stopped`,
            },
          },
          fetching: {
            entry: ["playIndex"],
            invoke: {
              src: () => (callback) => setEvents(callback, [["playing", "PLAYING"]]),
            },
            on: { PLAYING: `#${id}.playing` },
          },

          waiting: {
            invoke: {
              src: () => (callback) => setEvents(callback, [["playing", "PLAYING"]]),
            },
            on: { PLAYING: `#${id}.playing` },
          },
        },
      },

      playing: {
        invoke: [
          {
            src: () => (callback) => {
              (async () => {
                callback({
                  type: "SET_CURRENT_PLAYBACK_NO",
                  currentPlaybackNo: (await CapacitorMusicKit.getCurrentIndex()).index,
                });
                callback({
                  type: "SET_CURRENT_TRACK",
                  currentTrack: (await CapacitorMusicKit.getCurrentTrack()).track,
                });
                callback("MEMORY");
              })();

              return setEvents(callback, [
                ["waiting", "WAITING"],
                ["paused", "PAUSED"],
                ["completed", "STOPPED"],
              ]);
            },
          },
        ],
        on: {
          LOADING: "loading",
          PAUSED: "paused",
          STOPPED: "stopped",
          WAITING: `#${id}.loading.waiting`,
          PLAY_OR_PAUSE: { actions: "pause" },
          SET_CURRENT_PLAYBACK_NO: { actions: "setCurrentPlaybackNo" },
          SET_CURRENT_TRACK: { actions: "setCurrentTrack" },
          MEMORY: { actions: "memory" },
        },
      },

      paused: {
        invoke: {
          src: () => (callback) =>
            setEvents(callback, [
              ["loading", "LOADING"],
              ["playing", "PLAYING"],
              ["ended", "STOPPED"],
              ["completed", "STOPPED"],
            ]),
        },
        on: {
          PLAY_OR_PAUSE: { actions: "play" },
          LOADING: "loading",
          PLAYING: "playing",
          STOPPED: "stopped",
        },
      },

      stopped: {
        invoke: {
          src: () => (callback) => setEvents(callback, [["playing", "PLAYING"]]),
        },
        on: {
          PLAY: { actions: "play" },
          PLAYING: "playing",
        },
      },
    },
  },
  {
    actions: {
      play: () => CapacitorMusicKit.play({}),

      playIndex: (context) => CapacitorMusicKit.play({ index: context.currentPlaybackNo }),

      pause: () => CapacitorMusicKit.pause(),

      memory: (context) => store.set(id, context),

      remember: assign({
        currentTrack: (_, event) => "context" in event ? event.context.currentTrack : undefined,
        currentPlaybackNo: (_, event) =>
          "context" in event ? event.context.currentPlaybackNo : -1,
        trackIds: (_, event) => "context" in event ? event.context.trackIds : [],
        version: (_, event) => "context" in event ? event.context.version : version,
      }),

      setTrackIds: assign({
        trackIds: (_, event) => "trackIds" in event ? event.trackIds : [],
      }),

      setCurrentPlaybackNo: assign({
        currentPlaybackNo: (_, event) =>
          "currentPlaybackNo" in event ? event.currentPlaybackNo : -1,
      }),

      setCurrentTrack: assign({
        currentTrack: (_, event) => "currentTrack" in event ? event.currentTrack : undefined,
      }),
    },
  },
);

export const playerService = interpret(playerMachine).start();
