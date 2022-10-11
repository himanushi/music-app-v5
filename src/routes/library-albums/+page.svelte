<script lang="ts">
  import SquareImage from "~/components/square-image.svelte";

  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
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
  <VirtualScroll items={albums} let:item>
    <ion-item button detail={false} href={`library-albums/${item.libraryId}`}>
      <ion-thumbnail slot="start">
        <SquareImage src={convertImageUrl({ px: 300,
          url: item.artworkUrl })} />
      </ion-thumbnail>
      <ion-label>{item.name}</ion-label>
      <ion-buttons slot="end">
        <ion-icon name="heart-outline" slot="icon-only" />
      </ion-buttons>
    </ion-item>
  </VirtualScroll>
</ion-list>
