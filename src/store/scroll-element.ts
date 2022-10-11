import { writable } from "svelte/store";

export const scrollElement = writable<HTMLElement | null>(null);
