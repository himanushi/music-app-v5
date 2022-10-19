<script lang="ts">
  import { CapacitorMusicKit, type GetLibraryAlbumsResult } from "capacitor-plugin-musickit";
  import { goto } from "$app/navigation";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
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
      <ion-item button detail={false} on:click={() => goto(`/library/albums/${item.id}`)}>
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
  {/if}
</ion-list>
