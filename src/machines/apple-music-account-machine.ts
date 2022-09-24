// xstate では順序を見やすくするため object key sort は無効にする
/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */

import type { PluginListenerHandle } from "@capacitor/core";
import type { AuthorizationStatusDidChangeListener } from "capacitor-plugin-musickit";
import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import type { Sender } from "xstate";
import { assign, interpret, Machine as machine } from "xstate";

export type accountContext = {
  config?: MusicKit.Config;
};

export type accountSchema = {
  states: {
    idle: {};
    checking: {};
    authorized: {};
    unauthorized: {};
  };
};

export type accountEvent =
  | { type: "SET_TOKEN"; config: MusicKit.Config }
  | { type: "CHECKING" }
  | { type: "LOGIN_OR_LOGOUT" }
  | { type: "LOGIN" }
  | { type: "LOGOUT" };

export const accountMachine = machine<accountContext, accountSchema, accountEvent>(
  {
    id: "apple-music-account",

    initial: "idle",

    context: { config: undefined },

    states: {
      idle: {
        on: {
          SET_TOKEN: {
            actions: "setConfig",
            target: "checking",
          },
          CHECKING: "checking",
        },
        meta: { label: "initializing" },
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
          LOGIN: "authorized",
          LOGOUT: "unauthorized",
        },

        meta: { label: "loading" },
      },

      authorized: {
        invoke: {
          id: "authorize",

          src: () => (callback: Sender<accountEvent>) => {
            const changeStatus: AuthorizationStatusDidChangeListener = (state) => {
              if (state.result !== "authorized") {
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
        },

        on: {
          LOGIN_OR_LOGOUT: { actions: "logout" },
          LOGOUT: "unauthorized",
        },

        meta: { label: "ログアウト" },
      },

      unauthorized: {
        invoke: {
          id: "unauthorize",

          src: () => (callback: Sender<accountEvent>) => {
            const changeStatus: AuthorizationStatusDidChangeListener = (state) => {
              if (state.result === "authorized") {
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
        },

        on: {
          LOGIN_OR_LOGOUT: { actions: "login" },
          LOGIN: "authorized",
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
        config: (_, event) => "config" in event ? event.config : undefined,
      }),
    },
  },
);

export const accountService = interpret(accountMachine).start();
