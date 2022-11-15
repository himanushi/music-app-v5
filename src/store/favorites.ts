import { writable } from "svelte/store";

export type FavoriteType = {
  [key: string]: number;
};

const createFavorites = () => {
  const { subscribe, update } = writable<FavoriteType>({});

  return {
    delete: (id: string) => {
      update((object) => {
        delete object[id];
        return object;
      });
    },
    subscribe,
    update: (id: string, value: number) => {
      update((object) => {
        object[id] = value;
        return object;
      });
    },
    updateAll: (favoriteArr: { id: string; value: number }[]) => {
      update((object) => {
        favoriteArr.forEach((favorite) => {
          object[favorite.id] = favorite.value;
        });
        return object;
      });
    },
  };
};

export const favorites = createFavorites();
