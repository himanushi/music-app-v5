// xstate では順序を見やすくするため object key sort は無効にする
/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { assign, interpret, createMachine } from "xstate";

type Context = {
  seek: number;
};

type Event =
  | { type: "IDLE" }
  | { type: "ACTIVE" }
  | { type: "SET_SEEK"; seek: number }
  | { type: "CHANGE_SEEK"; seek: number };

type State = { value: "idle"; context: Context } | { value: "active"; context: Context };

const id = "AppleMusicPlayerSeek";

export const playerSeekMachine = createMachine<Context, Event, State>(
  {
    id,

    context: {
      seek: 0,
    },

    initial: "idle",

    on: {
      CHANGE_SEEK: { actions: "changeSeek" },
      IDLE: "idle",
      ACTIVE: "active",
    },

    states: {
      idle: {},

      active: {
        invoke: [{ src: "ticktack" }],
        on: {
          SET_SEEK: { actions: "setSeek" },
        },
      },
    },
  },
  {
    actions: {
      changeSeek: (_, event) =>
        "seek" in event ? CapacitorMusicKit.seekToTime({ time: event.seek / 1000 }) : undefined,

      setSeek: assign({
        seek: (_, event) => ("seek" in event ? event.seek : 0),
      }),
    },

    services: {
      ticktack: () => (callback) => {
        const interval = setInterval(
          async () =>
            callback({
              type: "SET_SEEK",
              seek: (await CapacitorMusicKit.getCurrentPlaybackTime()).time * 1000,
            }),
          1000,
        );

        return () => clearInterval(interval);
      },
    },
  },
);

export const playerSeekService = interpret(playerSeekMachine).start();
