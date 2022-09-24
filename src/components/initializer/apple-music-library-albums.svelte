<script lang="ts">
  import { interpret } from "xstate";
  import { accountService } from "~/machines/apple-music-account-machine";
  import type { Context } from "~/machines/apple-music-library-albums-machine";
  import { libraryAlbumsMachine, id } from "~/machines/apple-music-library-albums-machine";
  import { libraryAlbumsService } from "~/store/services";
  import { store } from "~/store/store";

  const startService = async () => {
    const context = await store.get<Context>(id);
    let machine = libraryAlbumsMachine;
    if (context) {
      machine = libraryAlbumsMachine.withContext(context);
    }
    libraryAlbumsService.set(interpret(machine).start());
  };

  $: if ($accountService && $accountService.matches("authorized")) {
    startService();
  }

  $: if ($libraryAlbumsService) {
    $libraryAlbumsService.send("LOAD");
  }
</script>
