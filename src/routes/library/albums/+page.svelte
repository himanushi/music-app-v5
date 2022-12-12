<script lang="ts">
  import type { PageData } from "./$types";
  import LibraryAlbumItem from "./library-album-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import Refresher from "~/components/refresher.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { libraryAlbumsService } from "~/machines/apple-music-library-albums-machine";

  export let data: PageData;

  $: albums = $libraryAlbumsService.context.filteredAlbums;

  let loaded = false;
  const refresh = () => {
    libraryAlbumsService.send("RESET");
    loaded = true;
  };
</script>

<Refresher {refresh} bind:loaded />
<ion-list>
  <ItemDivider menu={data.menu} title="Library Albums" />
  {#if albums}
    <VirtualScroll items={albums} thumbnail let:item>
      <LibraryAlbumItem {item} />
    </VirtualScroll>
  {/if}
</ion-list>
