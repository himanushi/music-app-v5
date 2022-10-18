import { writable } from "svelte/store";

export const queryParameters = writable<Record<string, string>>({});
