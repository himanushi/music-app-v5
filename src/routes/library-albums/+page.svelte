<script lang="ts">
  import type { AlbumResult } from "capacitor-plugin-musickit";
  import { goto } from "$app/navigation";
  import SquareImage from "~/components/square-image.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { libraryAlbumsService } from "~/machines/apple-music-library-albums-machine";

  let albums: AlbumResult[];
  $: albums = [];
  $: if ($libraryAlbumsService) {
    albums = $libraryAlbumsService.context.albums;
  }
</script>

<ion-list>
  <VirtualScroll items={albums} let:item>
    <ion-item button detail={false} on:click={() => goto(`library-albums/${item.id}`)}>
      <ion-thumbnail slot="start">
        <SquareImage
          src={convertImageUrl({
            px: 300,
            url: item.artworkUrl,
          })}
        />
      </ion-thumbnail>
      <ion-label>{item.name}</ion-label>
      <ion-buttons slot="end">
        <ion-icon name="heart-outline" slot="icon-only" />
      </ion-buttons>
    </ion-item>
  </VirtualScroll>
</ion-list>
