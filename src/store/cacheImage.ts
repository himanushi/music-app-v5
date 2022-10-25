import { writable } from "svelte/store";

export type cacheImageType = {
  [key: string]: string;
};

const createCacheImage = () => {
  const { subscribe, update } = writable<cacheImageType>({});

  return {
    subscribe,
    update: (src: string, base64: string) => {
      update((object) => {
        object[src] = base64;
        return object;
      });
    },
  };
};

export const cacheImage = createCacheImage();
