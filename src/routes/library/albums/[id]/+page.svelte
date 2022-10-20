<script lang="ts">
  import { CapacitorMusicKit, type GetLibraryAlbumResult } from "capacitor-plugin-musickit";
  import LibraryArtistItem from "../../artists/library-artist-item.svelte";
  import type { PageData } from "./$types";
  import CenterItem from "~/components/center-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { toTrackItem } from "~/lib/toTrackItem";
  import { accountService } from "~/machines/apple-music-account-machine";
  import LibraryTrackItem from "~/routes/library/tracks/library-track-item.svelte";

  export let data: PageData;
  let result: GetLibraryAlbumResult | undefined;

  const getItem = async () => {
    result = await CapacitorMusicKit.getLibraryAlbum({
      id: data.id,
      include: ["tracks", "artists"],
    });
  };

  $: if ($accountService && $accountService.matches("authorized")) {
    getItem();
  }
</script>

<ion-item-group>
  <ItemDivider title="Album" />

  {#if result?.album}
    <CenterItem>
      <SquareImage
        src={convertImageUrl({
          px: 500,
          url: result.album.artworkUrl,
        })}
      />
    </CenterItem>
    <ion-item>
      <ion-label>
        {result.album.name}
      </ion-label>
    </ion-item>
  {/if}

  {#if result?.tracks}
    <ion-item>
      <ion-label class="ion-text-wrap"> 曲数 </ion-label>
      <ion-note slot="end">
        {result.tracks.length}曲
      </ion-note>
    </ion-item>
    <ItemDivider title="Tracks" />
    <VirtualScroll itemHeight={46} items={result.tracks} let:index let:item>
      <LibraryTrackItem
        ids={result.tracks.map((track) => track.id)}
        {index}
        item={toTrackItem(item)}
        viewImage={false}
      />
    </VirtualScroll>
  {/if}

  {#if result?.artists}
    <ItemDivider title="Artists" />
    <VirtualScroll itemHeight={46} items={result.artists} let:item>
      <LibraryArtistItem {item} />
    </VirtualScroll>
  {/if}
</ion-item-group>
