import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { interpret } from "xstate";
import type { PageLoad } from "./$types";
import { createLibraryItemsMachine as createMachine } from "~/machines/apple-music-library-items-machine";

export const load: PageLoad = ({ params }) => {
  const albumsService = interpret(createMachine(CapacitorMusicKit.getLibraryAlbums)).start();
  const songsService = interpret(createMachine(CapacitorMusicKit.getLibrarySongs)).start();
  const artistsService = interpret(createMachine(CapacitorMusicKit.getLibraryArtists)).start();

  const getItem = () => {
    albumsService.send({
      props: { ids: [params.id] },
      type: "SET_PROPS",
    });
    songsService.send({
      props: {
        albumId: params.id,
        limit: 100,
      },
      type: "SET_PROPS",
    });
    artistsService.send({
      props: {
        albumId: params.id,
        limit: 10,
      },
      type: "SET_PROPS",
    });
  };

  return {
    albumsService,
    artistsService,
    getItem,
    songsService,
  };
};
