<script lang="ts">
  import LibraryAlbumItem from "./library-album-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { libraryAlbumsService } from "~/machines/apple-music-library-albums-machine";

  $: albums = $libraryAlbumsService.context.albums;
</script>

<ion-list>
  <ItemDivider title="Library Albums" />
  {#if albums}
    <VirtualScroll items={albums} thumbnail let:item>
      <LibraryAlbumItem {item} />
    </VirtualScroll>
  {/if}
</ion-list>
