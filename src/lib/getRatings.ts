import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { favorites } from "~/store/favorites";

const limit = 400;

export const getRatings = async ({
  ids: selectIds,
  categoryType: selectType = "songs",
}: {
  ids: string[];
  categoryType?: MusicKit.AppleMusicAPI.RatingCategoryType;
}) => {
  if (selectIds.length === 0) {
    return [];
  }

  let ratings: MusicKit.Ratings[] = [];

  const librarySongs = selectIds.filter((id) => id.startsWith("i."));
  const songs = selectIds.filter((id) => !librarySongs.includes(id));
  const libraryAlbums = selectIds.filter((id) => id.startsWith("l."));
  const albums = selectIds.filter((id) => !libraryAlbums.includes(id));

  const pattern = {
    albums,
    "library-albums": libraryAlbums,
    "library-songs": librarySongs,
    songs,
  };

  const selectPattern = {
    albums: ["library-albums", "albums"],
    artists: ["library-artists", "artists"],
    playlists: ["library-playlists", "playlists"],
    songs: ["library-songs", "songs"],
  };

  for (const [type, ids] of Object.entries(pattern) as [keyof typeof pattern, string[]][]) {
    if (ids.length > 0 && selectPattern[selectType].includes(type)) {
      let count = 0;
      while (ids.length > count) {
        ratings = [
          ...ratings,
          ...(
            await CapacitorMusicKit.getRatings({
              ids: ids.slice(count, count + limit),
              type,
            })
          ).data,
        ];
        count += limit;
      }
    }
  }

  favorites.updateAll(
    ratings.map((rating) => ({
      id: rating.id,
      value: rating.attributes.value,
    })),
  );
};
