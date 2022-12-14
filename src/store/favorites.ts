import { writable } from "svelte/store";
import { store } from "./store";

export type FavoriteType = {
  [key: string]: number;
};

export const favoritesStoreId = "Favorites";

const createFavorites = () => {
  const { subscribe, update } = writable<FavoriteType>({});

  return {
    delete: (id: string) => {
      update((object) => {
        delete object[id];
        store.set(favoritesStoreId, object);
        return object;
      });
    },
    remember: (object: FavoriteType | undefined = {}) => {
      update(() => object);
    },
    subscribe,
    update: (id: string, value: number) => {
      update((object) => {
        object[id] = value;
        store.set(favoritesStoreId, object);
        return object;
      });
    },
    updateAll: (favoriteArr: { id: string; value: number }[]) => {
      update((object) => {
        favoriteArr.forEach((favorite) => {
          object[favorite.id] = favorite.value;
        });
        store.set(favoritesStoreId, object);
        return object;
      });
    },
  };
};

export const favorites = createFavorites();
