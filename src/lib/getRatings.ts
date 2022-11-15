import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { favorites } from "~/store/favorites";

export const getRatings = async (ids: string[]) => {
  if (ids.length === 0) {
    return [];
  }

  let ratings: MusicKit.Ratings[] = [];

  const SongIds = ids.filter((id) => !id.startsWith("i."));
  if (SongIds.length > 0) {
    ratings = [
      ...ratings,
      ...(
        await CapacitorMusicKit.getRatings({
          ids: SongIds,
          type: "songs",
        })
      ).data,
    ];
  }

  const librarySongIds = ids.filter((id) => id.startsWith("i."));
  if (librarySongIds.length > 0) {
    ratings = [
      ...ratings,
      ...(
        await CapacitorMusicKit.getRatings({
          ids: librarySongIds,
          type: "library-songs",
        })
      ).data,
    ];
  }

  favorites.updateAll(
    ratings.map((rating) => ({
      id: rating.id,
      value: rating.attributes.value,
    })),
  );
};
