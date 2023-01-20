import type { PageLoad } from "./$types";
import { client } from "~/graphql/client";
import {
  AlbumsDocument,
  ArtistDocument,
  type AlbumObject,
  type ArtistObject,
  type StatusEnum,
} from "~/graphql/types";

export const load: PageLoad = ({ params }) => {
  const getItems = async ({
    id,
    status,
    callback,
  }: {
    id: string;
    status: StatusEnum[];
    callback: ({ albums, artist }: { albums: AlbumObject[]; artist?: ArtistObject }) => void;
  }) => {
    const artist = (
      await client.query({
        fetchPolicy: "cache-first",
        query: ArtistDocument,
        variables: { id },
      })
    ).data.artist as ArtistObject;

    let albums: AlbumObject[] = [];
    if (artist) {
      albums = (
        await client.query({
          fetchPolicy: "cache-first",
          query: AlbumsDocument,
          variables: {
            conditions: {
              artistIds: [artist.id],
              status,
            },
            sort: {
              direction: "DESC",
              order: "POPULARITY",
            },
          },
        })
      ).data.items as AlbumObject[];
    }

    callback({
      albums,
      artist,
    });
  };

  return {
    getItems,
    id: params.id,
  };
};
