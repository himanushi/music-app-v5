// xstate では順序を見やすくするため object key sort は無効にする
/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */

import type { PluginListenerHandle } from "@capacitor/core";
import type { AuthorizationStatusDidChangeListener } from "capacitor-plugin-musickit";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { assign, interpret, createMachine } from "xstate";
import { isAuthorized } from "~/store/isAuthorized";

export type Context = {
  config?: MusicKit.Config;
};

export type Event =
  | { type: "SET_TOKEN"; config: MusicKit.Config }
  | { type: "CHECKING" }
  | { type: "LOGIN_OR_LOGOUT" }
  | { type: "LOGIN" }
  | { type: "LOGOUT" };

export type State =
  | { value: "idle"; context: Context & { config: undefined } }
  | { value: "checking"; context: Context }
  | { value: "authorized"; context: Context }
  | { value: "unauthorized"; context: Context };

export const accountMachine = createMachine<Context, Event, State>(
  {
    context: { config: undefined },

    id: "AppleMusicAccount",

    initial: "idle",

    states: {
      idle: {
        on: {
          SET_TOKEN: {
            actions: "setConfig",
            target: "checking",
          },
          CHECKING: {
            target: "checking",
          },
        },
        meta: { label: "idle" },
      },

      checking: {
        invoke: {
          src:
            ({ config }) =>
              (callback) => {
                (async () => {
                  if (config) {
                    await CapacitorMusicKit.configure({ config });
                  }

                  if ((await CapacitorMusicKit.isAuthorized()).result) {
                    callback({ type: "LOGIN" });
                  } else {
                    callback({ type: "LOGOUT" });
                  }
                })();
              },
        },
        on: {
          LOGIN: {
            target: "authorized",
          },
          LOGOUT: {
            target: "unauthorized",
          },
        },

        meta: { label: "loading" },
      },

      authorized: {
        invoke: {
          src: () => (callback) => {
            isAuthorized.set(true);

            const changeStatus: AuthorizationStatusDidChangeListener = ({ status }) => {
              if (status !== "authorized") {
                callback("LOGOUT");
              }
            };

            let cleaner: PluginListenerHandle;
            (async () => {
              cleaner = await CapacitorMusicKit.addListener(
                "authorizationStatusDidChange",
                changeStatus,
              );
            })();

            return () => {
              if (cleaner) {
                cleaner.remove();
              }
            };
          },
          id: "authorize",
        },
        on: {
          LOGIN_OR_LOGOUT: {
            actions: "logout",
          },
          LOGOUT: {
            target: "unauthorized",
          },
        },
        meta: { label: "ログアウト" },
      },

      unauthorized: {
        invoke: {
          src: () => (callback) => {
            isAuthorized.set(false);

            const changeStatus: AuthorizationStatusDidChangeListener = ({ status }) => {
              if (status === "authorized") {
                callback("LOGIN");
              }
            };

            let cleaner: PluginListenerHandle;
            (async () => {
              cleaner = await CapacitorMusicKit.addListener(
                "authorizationStatusDidChange",
                changeStatus,
              );
            })();

            return () => {
              if (cleaner) {
                cleaner.remove();
              }
            };
          },
          id: "unauthorize",
        },
        on: {
          LOGIN_OR_LOGOUT: {
            actions: "login",
          },
          LOGIN: {
            target: "authorized",
          },
        },
        meta: { label: "ログイン" },
      },
    },
  },
  {
    actions: {
      login: () => CapacitorMusicKit.authorize(),

      logout: () => CapacitorMusicKit.unauthorize(),

      setConfig: assign({
        config: (_, event) => ("config" in event ? event.config : undefined),
      }),
    },
  },
);

export const accountService = interpret(accountMachine).start();
