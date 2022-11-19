<script lang="ts">
  import { onDestroy } from "svelte";
  import LibraryArtistItem from "../../artists/library-artist-item.svelte";
  import type { PageData } from "./$types";
  import CenterItem from "~/components/center-item.svelte";
  import FavoriteButton from "~/components/favorite-button.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import SkeletonItems from "~/components/skeleton-items.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { getRatings } from "~/lib/getRatings";
  import { isFavorite } from "~/lib/isFavorite";
  import { toTrackItem } from "~/lib/toTrackItem";
  import LibraryTrackItem from "~/routes/library/tracks/library-track-item.svelte";
  import { favorites } from "~/store/favorites";
  import { isAuthorized } from "~/store/isAuthorized";

  export let data: PageData;

  const { albumsService, songsService, artistsService, getItem, stopServices } = data;
  $: albums = $albumsService.context.items;
  $: songs = $songsService.context.items;
  $: artists = $artistsService.context.items;

  $: if ($isAuthorized) {
    getItem();
  }

  $: if ($songsService.value === "done") {
    if (albums[0]) {
      getRatings({
        categoryType: "albums",
        ids: [albums[0].id],
      });
    }
    getRatings({ ids: $songsService.context.items.map((item) => item.id) });
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
            url: albums[0].attributes.artwork?.url,
          })}
        />
      </CenterItem>
      <ion-item>
        <ion-label class="ion-text-wrap text-select">
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
        <ion-buttons slot="end">
          <FavoriteButton
            id={albums[0].id}
            categoryType="albums"
            favorite={isFavorite($favorites, albums[0].id)}
          />
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
      <VirtualScroll items={songs} let:index let:item>
        <LibraryTrackItem
          favorite={isFavorite($favorites, item.id)}
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
      <VirtualScroll items={artists} let:item>
        <LibraryArtistItem {item} />
      </VirtualScroll>
    {/if}
  {:else}
    <SkeletonItems length={50} />
  {/if}
</ion-item-group>
