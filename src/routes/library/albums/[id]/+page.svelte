<script lang="ts">
  import { onDestroy } from "svelte";
  import LibraryArtistItem from "../../artists/library-artist-item.svelte";
  import type { PageData } from "./$types";
  import CenterItem from "~/components/center-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import SkeletonItems from "~/components/skeleton-items.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { toTrackItem } from "~/lib/toTrackItem";
  import { accountService } from "~/machines/apple-music-account-machine";
  import LibraryTrackItem from "~/routes/library/tracks/library-track-item.svelte";

  export let data: PageData;

  const { albumsService, songsService, artistsService, getItem, stopServices } = data;
  $: albums = $albumsService.context.items;
  $: songs = $songsService.context.items;
  $: artists = $artistsService.context.items;

  $: if ($accountService.matches("authorized")) {
    getItem();
  }

  onDestroy(() => stopServices());
</script>

<ion-item-group>
  <ItemDivider title="Album" />
  {#if $albumsService.matches("done")}
    {#if albums[0]}
      <CenterItem>
        <SquareImage
          src={convertImageUrl({
            px: 500,
            url: albums[0].attributes.artwork.url,
          })}
        />
      </CenterItem>
      <ion-item>
        <ion-label>
          {albums[0].attributes.name}
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-label class="ion-text-wrap"> 曲数 </ion-label>
        <ion-note slot="end">
          {albums[0].attributes.trackCount}曲
        </ion-note>
      </ion-item>
      <ion-item>
        <ion-buttons>
          <ion-button>
            <ion-icon name="heart" color="red" />
          </ion-button>
        </ion-buttons>
      </ion-item>
    {/if}
  {:else}
    <CenterItem>
      <SquareImage src={convertImageUrl({ px: 500 })} />
    </CenterItem>
    <SkeletonItems length={3} />
  {/if}

  <ItemDivider title="Tracks" />
  {#if $songsService.matches("done")}
    {#if songs.length > 0}
      <VirtualScroll itemHeight={49} items={songs} let:index let:item>
        <LibraryTrackItem
          ids={songs.map((track) => track.id)}
          {index}
          item={toTrackItem(item)}
          viewImage={false}
        />
      </VirtualScroll>
    {/if}
  {:else}
    <SkeletonItems length={50} />
  {/if}

  <ItemDivider title="Artists" />
  {#if $artistsService.matches("done")}
    {#if artists.length > 0}
      <VirtualScroll itemHeight={48} items={artists} let:item>
        <LibraryArtistItem {item} />
      </VirtualScroll>
    {/if}
  {:else}
    <SkeletonItems length={50} />
  {/if}
</ion-item-group>
