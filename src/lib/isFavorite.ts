import type { FavoriteType } from "~/store/favorites";

export const isFavorite = (favorites: FavoriteType, id: string | undefined) =>
  id ? Boolean(favorites[id]) : false;
