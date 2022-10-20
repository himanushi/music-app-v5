<script lang="ts">
  import { CapacitorMusicKit, type GetLibraryAlbumsResult } from "capacitor-plugin-musickit";
  import LibraryAlbumItem from "./library-album-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { isAuthorized } from "~/store/isAuthorized";

  let result: GetLibraryAlbumsResult | undefined;

  const getItems = async () => {
    result = await CapacitorMusicKit.getLibraryAlbums({
      limit: 100,
      offset: 0,
    });
  };

  $: if ($isAuthorized) {
    getItems();
  }
</script>

<ion-list>
  <ItemDivider title="Library Albums" />
  {#if result}
    <VirtualScroll items={result.albums} let:item>
      <LibraryAlbumItem {item} />
    </VirtualScroll>
  {/if}
</ion-list>
