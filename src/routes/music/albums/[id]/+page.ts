import type { PageLoad } from "./$types";
import { client } from "~/graphql/client";
import {
  AlbumDocument,
  ArtistsDocument,
  type AlbumObject,
  type ArtistObject,
  type StatusEnum,
  type TrackObject,
} from "~/graphql/types";

export const load: PageLoad = ({ params }) => {
  const getItems = async ({
    id,
    status,
    callback,
  }: {
    id: string;
    status: StatusEnum[];
    callback: ({
      album,
      tracks,
      artists,
    }: {
      album?: AlbumObject;
      tracks: TrackObject[];
      artists: ArtistObject[];
    }) => void;
  }) => {
    const album = (
      await client.query({
        fetchPolicy: "cache-first",
        query: AlbumDocument,
        variables: { id },
      })
    ).data.album as AlbumObject;

    const tracks = album.tracks.map((track) => track);
    let artists: ArtistObject[] = [];

    if (album) {
      artists = (
        await client.query({
          fetchPolicy: "cache-first",
          query: ArtistsDocument,
          variables: {
            conditions: {
              albumIds: [album.id],
              status,
            },
            sort: {
              direction: "DESC",
              order: "POPULARITY",
            },
          },
        })
      ).data.items as ArtistObject[];
    }

    callback({
      album,
      artists,
      tracks,
    });
  };

  return {
    getItems,
    id: params.id,
  };
};
