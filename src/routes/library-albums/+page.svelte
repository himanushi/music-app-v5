<script lang="ts">
  import type { LibraryAlbum } from "~/machines/apple-music-library-albums-machine";
  import { libraryAlbumsService } from "~/store/services";

  let albums: LibraryAlbum[];
  $: albums = [];
  $: if ($libraryAlbumsService) {
    $libraryAlbumsService.subscribe((state) => {
      albums = state.context.albums;
    });
  }
</script>

<ion-list>
  {#each albums as album}
    <ion-item>
      <ion-label>
        {album.name}
      </ion-label>
    </ion-item>
  {/each}
</ion-list>
