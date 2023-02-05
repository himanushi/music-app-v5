import { CapacitorMusicKit } from "capacitor-plugin-musickit";
import { interpret } from "xstate";
import type { PageLoad } from "./$types";
import { createLibraryItemsMachine as createMachine } from "~/machines/apple-music-library-items-machine";

export const load: PageLoad = () => {
  const itemsService = interpret(createMachine(CapacitorMusicKit.getCatalogArtists)).start();

  const stopServices = () => {
    itemsService.stop();
  };

  return {
    itemsService,
    stopServices,
  };
};
