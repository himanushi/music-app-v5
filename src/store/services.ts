import { writable } from "svelte/store";
import type {
  BaseActionObject,
  Interpreter,
  ResolveTypegenMeta,
  ServiceMap,
  TypegenDisabled,
} from "xstate";
import type { Context, Event, State } from "~/machines/apple-music-library-albums-machine";

export const libraryAlbumsService = writable<Interpreter<
  Context,
  any,
  Event,
  State,
  ResolveTypegenMeta<TypegenDisabled, Event, BaseActionObject, ServiceMap>
> | null>(null);
