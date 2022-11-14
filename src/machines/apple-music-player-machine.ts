// xstate では順序を見やすくするため object key sort は無効にする
/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */
import type { PluginListenerHandle } from "@capacitor/core";
import type {
  GetQueueSongsResult,
  PlaybackStateDidChangeListener,
  RepeatMode,
  ShuffleMode,
} from "capacitor-plugin-musickit";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { assign, interpret, createMachine, type DoneInvokeEvent } from "xstate";
import { store } from "~/store/store";

const version = 1;

type Context = {
  currentTrack?: MusicKit.MediaItem;
  currentPlaybackNo: number;
  queueTracks: MusicKit.MediaItem[];
  trackIds: string[];
  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;
  version: number;
};

type Event =
  | { type: "SET_CURRENT_TRACK"; currentTrack?: MusicKit.MediaItem }
  | { type: "SET_CURRENT_PLAYBACK_NO"; currentPlaybackNo: number }
  | { type: "SET_QUEUE_TRACKS"; queueTracks: MusicKit.MediaItem[] }
  | { type: "MOVE_QUEUE_TRACKS"; from: number; to: number }
  | { type: "REMOVE_QUEUE_TRACK"; index: number }
  | { type: "SWITCH_REPEAT_MODE" }
  | { type: "SWITCH_SHUFFLE_MODE" }
  | { type: "REPLACE_AND_PLAY"; trackIds: string[]; currentPlaybackNo: number }
  | { type: "LOADING" }
  | { type: "WAITING" }
  | { type: "PLAY_OR_PAUSE" }
  | { type: "PLAY" }
  | { type: "NEXT_PLAY" }
  | { type: "PREVIOUS_PLAY" }
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
  const didChange: PlaybackStateDidChangeListener = ({ state }) => {
    events.forEach((event) => {
      if (state === event[0]) {
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

// ref: https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
const move = <T>(array: (T | undefined)[], old_index: number, new_index: number) => {
  const arr = [...array];
  if (new_index >= arr.length) {
    let count = new_index - arr.length + 1;
    // eslint-disable-next-line no-plusplus
    while (count--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr as T[];
};

const toMediaItem = (item?: MusicKit.MediaItem): MusicKit.MediaItem | undefined =>
  item ? {
    albumInfo: item.albumInfo,
    albumName: item.albumName,
    artistName: item.artistName,
    artwork: item.artwork,
    artworkURL: item.artworkURL,
    attributes: item.attributes,
    contentRating: item.contentRating,
    discNumber: item.discNumber,
    id: item.id,
    info: item.info,
    isExplicitItem: item.isExplicitItem,
    isPlayable: item.isPlayable,
    isPreparedToPlay: item.isPreparedToPlay,
    isrc: item.isrc,
    playbackDuration: item.playbackDuration,
    playlistArtworkURL: item.playlistArtworkURL,
    playlistName: item.playlistName,
    previewURL: item.previewURL,
    releaseDate: item.releaseDate,
    title: item.title,
    trackNumber: item.trackNumber,
    type: item.type,
    prepareToPlay: item.prepareToPlay,
  } : undefined;

const id = "AppleMusicPlayer";

export const playerMachine = createMachine<Context, Event, State>(
  {
    context: {
      currentTrack: undefined,
      currentPlaybackNo: -1,
      queueTracks: [],
      trackIds: [],
      repeatMode: "none",
      shuffleMode: "off",
      version,
    },

    id,

    initial: "idle",

    on: {
      REPLACE_AND_PLAY: {
        target: `#${id}.loading.queueing`,
        actions: ["setTrackIds", "setCurrentPlaybackNo"],
      },
      MOVE_QUEUE_TRACKS: {
        target: `#${id}.loading.onlyQueueing`,
        actions: "moveQueueTracks",
      },
      REMOVE_QUEUE_TRACK: {
        target: `#${id}.loading.onlyQueueing`,
        actions: "removeQueueTrack",
      },
      SWITCH_REPEAT_MODE: { actions: "switchRepeatMode" },
      SWITCH_SHUFFLE_MODE: { actions: "switchShuffleMode" },
      NEXT_PLAY: { actions: "nextPlay" },
      PREVIOUS_PLAY: { actions: "previousPlay" },
    },

    states: {
      idle: {
        invoke: { src: "remember" },
        on: {
          REMEMBER: { actions: "remember" },
          PLAY_OR_PAUSE: `#${id}.loading.queueing`,
        },
      },

      loading: {
        states: {
          queueing: {
            entry: ["stop"],
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
            on: {
              PLAYING: "setQueueing",
            },
          },
          setQueueing: {
            invoke: {
              src: () => CapacitorMusicKit.getQueueSongs(),
              onDone: {
                target: `#${id}.playing`,
                actions: assign({
                  queueTracks: (_, event: DoneInvokeEvent<GetQueueSongsResult>) => event.data.items,
                }),
              },
              onError: `#${id}.stopped`,
            },
          },

          onlyQueueing: {
            entry: ["stop"],
            invoke: {
              src: ({ trackIds }) => CapacitorMusicKit.setQueue({ ids: trackIds }),
              onDone: "setOnlyQueueing",
              onError: `#${id}.stopped`,
            },
          },
          setOnlyQueueing: {
            invoke: {
              src: () => CapacitorMusicKit.getQueueSongs(),
              onDone: {
                target: `#${id}.stopped`,
                actions: assign({
                  queueTracks: (_, event: DoneInvokeEvent<GetQueueSongsResult>) => event.data.items,
                }),
              },
              onError: `#${id}.stopped`,
            },
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
            src: () => (callback) =>
              setEvents(callback, [
                ["waiting", "WAITING"],
                ["paused", "PAUSED"],
                ["completed", "STOPPED"],
              ]),
          },
          {
            src: () => (callback) => {
              (async () => {
                callback({
                  type: "SET_QUEUE_TRACKS",
                  queueTracks: (await CapacitorMusicKit.getQueueSongs()).items,
                });
                callback({
                  type: "SET_CURRENT_PLAYBACK_NO",
                  currentPlaybackNo: (await CapacitorMusicKit.getCurrentIndex()).index,
                });
                callback({
                  type: "SET_CURRENT_TRACK",
                  currentTrack: (await CapacitorMusicKit.getCurrentSong()).item,
                });
                callback("MEMORY");
              })();
            },
          },
          { src: "nowPlayingItemDidChange" },
          { src: "ticktack" },
        ],
        on: {
          LOADING: "loading",
          PAUSED: "paused",
          STOPPED: "stopped",
          WAITING: `#${id}.loading.waiting`,
          PLAY_OR_PAUSE: { actions: "pause" },
          SET_CURRENT_PLAYBACK_NO: { actions: "setCurrentPlaybackNo" },
          SET_CURRENT_TRACK: { actions: "setCurrentTrack" },
          SET_QUEUE_TRACKS: { actions: "setQueueTracks" },
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
          PLAY_OR_PAUSE: `#${id}.loading.queueing`,
          PLAY: { actions: "play" },
          PLAYING: "playing",
        },
      },
    },
  },
  {
    actions: {
      play: () => CapacitorMusicKit.play({}),

      nextPlay: () => CapacitorMusicKit.nextPlay(),

      previousPlay: () => CapacitorMusicKit.previousPlay(),

      playIndex: ({ currentPlaybackNo }) => CapacitorMusicKit.play({ index: currentPlaybackNo }),

      pause: () => CapacitorMusicKit.pause(),

      stop: () => CapacitorMusicKit.stop(),

      memory: (context) => store.set(id, context),

      remember: assign({
        currentTrack: (_, event) => ("context" in event ? event.context.currentTrack : undefined),
        currentPlaybackNo: (_, event) =>
          "context" in event ? event.context.currentPlaybackNo : -1,
        queueTracks: (_, event) => ("context" in event ? event.context.queueTracks : []),
        trackIds: (_, event) => ("context" in event ? event.context.trackIds : []),
        version: (_, event) => ("context" in event ? event.context.version : version),
      }),

      setTrackIds: assign({
        trackIds: (_, event) => ("trackIds" in event ? event.trackIds : []),
      }),

      setCurrentPlaybackNo: assign({
        currentPlaybackNo: (_, event) =>
          "currentPlaybackNo" in event ? event.currentPlaybackNo : -1,
      }),

      setCurrentTrack: assign({
        currentTrack: (_, event) =>
          "currentTrack" in event ? ({ ...toMediaItem(event.currentTrack) } as MusicKit.MediaItem) : undefined,
      }),

      setQueueTracks: assign({
        queueTracks: (_, event) =>
          "queueTracks" in event ? event.queueTracks.map((track) => ({ ...toMediaItem(track) } as MusicKit.MediaItem)) : [],
      }),

      switchRepeatMode: assign({
        repeatMode: ({ repeatMode }) => {
          const modeMap: { [key in RepeatMode]: RepeatMode } = {
            none: "all",
            all: "one",
            one: "none",
          };
          const mode = modeMap[repeatMode];
          CapacitorMusicKit.setRepeatMode({ mode });
          return mode;
        },
      }),

      switchShuffleMode: assign({
        shuffleMode: ({ shuffleMode }) => {
          const modeMap: { [key in ShuffleMode]: ShuffleMode } = {
            off: "songs",
            songs: "off",
          };
          const mode = modeMap[shuffleMode];
          CapacitorMusicKit.setShuffleMode({ mode });
          return mode;
        },
      }),

      moveQueueTracks: assign({
        currentPlaybackNo: ({ currentPlaybackNo }, event) => {
          if ("from" in event && "to" in event) {
            if (currentPlaybackNo === event.from) {
              return event.to;
            } else if (event.from < currentPlaybackNo && currentPlaybackNo <= event.to) {
              return currentPlaybackNo - 1;
            } else if (event.from > currentPlaybackNo && currentPlaybackNo >= event.to) {
              return currentPlaybackNo + 1;
            }
          }
          return currentPlaybackNo;
        },
        trackIds: ({ trackIds }, event) => {
          if ("from" in event && "to" in event) {
            return move(trackIds, event.from, event.to);
          }
          return trackIds;
        },
      }),

      removeQueueTrack: assign({
        currentPlaybackNo: ({ currentPlaybackNo }, event) => {
          if ("index" in event) {
            if (event.index <= currentPlaybackNo) {
              return currentPlaybackNo - 1;
            } else if (currentPlaybackNo > event.index) {
              return currentPlaybackNo + 1;
            }
          }
          return currentPlaybackNo;
        },
        trackIds: ({ trackIds }, event) => {
          if ("index" in event) {
            const ids = trackIds.slice();
            ids.splice(event.index, 1);
            return ids;
          }
          return trackIds;
        },
      }),
    },

    services: {
      remember: () => (callback) => {
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

      nowPlayingItemDidChange: () => (callback) => {
        let listener: PluginListenerHandle;
        (async () => {
          listener = await CapacitorMusicKit.addListener("nowPlayingItemDidChange", () => {
            (async () => {
              callback({
                type: "SET_QUEUE_TRACKS",
                queueTracks: (await CapacitorMusicKit.getQueueSongs()).items,
              });
              callback({
                type: "SET_CURRENT_PLAYBACK_NO",
                currentPlaybackNo: (await CapacitorMusicKit.getCurrentIndex()).index,
              });
              callback({
                type: "SET_CURRENT_TRACK",
                currentTrack: (await CapacitorMusicKit.getCurrentSong()).item,
              });
              callback("MEMORY");
            })();
          });
        })();

        return () => {
          if (listener) {
            listener.remove();
          }
        };
      },
    },
  },
);

export const playerService = interpret(playerMachine).start();
