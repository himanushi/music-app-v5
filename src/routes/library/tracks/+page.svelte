<script lang="ts">
  import type { PageData } from "./$types";
  import LibraryItem from "./library-track-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { libraryAlbumsService } from "~/machines/apple-music-library-albums-machine";

  export let data: PageData;

  $: items = $libraryAlbumsService.context.filteredItems;
</script>

<ion-list>
  <ItemDivider menu={data.menu} title="Library Albums" />
  {#if items}
    <VirtualScroll {items} thumbnail let:item />
  {/if}
</ion-list>
