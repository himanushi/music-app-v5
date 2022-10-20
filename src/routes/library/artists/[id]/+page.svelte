<script lang="ts">
  import { CapacitorMusicKit, type GetLibraryArtistResult } from "capacitor-plugin-musickit";
  import LibraryAlbumItem from "../../albums/library-album-item.svelte";
  import type { PageData } from "./$types";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { accountService } from "~/machines/apple-music-account-machine";

  export let data: PageData;
  let result: GetLibraryArtistResult | undefined;

  const getItem = async () => {
    result = await CapacitorMusicKit.getLibraryArtist({
      id: data.id,
      include: ["albums"],
    });
  };

  $: if ($accountService && $accountService.matches("authorized")) {
    getItem();
  }
</script>

<ion-item-group>
  <ItemDivider title="Artist" />

  {#if result?.artist}
    <ion-item>
      <ion-label>
        {result.artist.name}
      </ion-label>
    </ion-item>
  {/if}

  {#if result?.albums}
    <ItemDivider title="Albums" />
    <VirtualScroll items={result.albums} let:item>
      <LibraryAlbumItem {item} />
    </VirtualScroll>
  {/if}
</ion-item-group>
