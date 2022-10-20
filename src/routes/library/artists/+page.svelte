<script lang="ts">
  import { CapacitorMusicKit, type GetLibraryArtistsResult } from "capacitor-plugin-musickit";
  import LibraryAlbumItem from "./library-artist-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { isAuthorized } from "~/store/isAuthorized";

  let result: GetLibraryArtistsResult | undefined;

  const getItems = async () => {
    result = await CapacitorMusicKit.getLibraryArtists({
      limit: 100,
      offset: 0,
    });
  };

  $: if ($isAuthorized) {
    getItems();
  }
</script>

<ion-list>
  <ItemDivider title="Library Artists" />
  {#if result}
    <VirtualScroll itemHeight={46} items={result.artists} let:item>
      <LibraryAlbumItem {item} />
    </VirtualScroll>
  {/if}
</ion-list>
