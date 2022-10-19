import { writable } from "svelte/store";

export const isAuthorized = writable<boolean>(false);
