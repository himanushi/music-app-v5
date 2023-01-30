import { CapacitorMusicKit } from "capacitor-plugin-musickit";
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
      libraryAlbum,
      tracks,
      artists,
    }: {
      album?: AlbumObject;
      libraryAlbum?: MusicKit.LibraryAlbums;
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

    let libraryAlbum: MusicKit.LibraryAlbums | undefined;

    if (album) {
      try {
        [libraryAlbum] = (
          await CapacitorMusicKit.getLibraryAlbums({ catalogId: album.appleMusicId })
        ).data;
      } catch {
        // nothing
      }
    }

    callback({
      album,
      artists,
      libraryAlbum,
      tracks,
    });
  };

  return {
    getItems,
    id: params.id,
  };
};
