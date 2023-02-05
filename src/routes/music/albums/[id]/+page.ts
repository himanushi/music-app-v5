import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { interpret } from "xstate";
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
import { getRatings } from "~/lib/getRatings";
import { createLibraryItemsMachine as createMachine } from "~/machines/apple-music-library-items-machine";

export const load: PageLoad = ({ params }) => {
  const librarySongsService = interpret(createMachine(CapacitorMusicKit.getLibrarySongs)).start();

  const stopServices = () => {
    librarySongsService.stop();
  };

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

      if (libraryAlbum) {
        librarySongsService.send({
          props: {
            albumId: libraryAlbum.id,
            limit: 100,
          },
          type: "SET_PROPS",
        });
        librarySongsService.subscribe((service) => {
          if (service.matches("done")) {
            getRatings({ ids: service.context.items.map((item) => item.id) });
          }
        });
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
    librarySongsService,
    stopServices,
  };
};
