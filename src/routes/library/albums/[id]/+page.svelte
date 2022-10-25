<script lang="ts">
  import { CapacitorMusicKit } from "capacitor-plugin-musickit";
  import { onDestroy, onMount } from "svelte";
  import { interpret } from "xstate";
  import LibraryArtistItem from "../../artists/library-artist-item.svelte";
  import type { PageData } from "./$types";
  import CenterItem from "~/components/center-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { toTrackItem } from "~/lib/toTrackItem";
  import { accountService } from "~/machines/apple-music-account-machine";
  import { createLibraryItemsMachine as createMachine } from "~/machines/apple-music-library-items-machine";
  import LibraryTrackItem from "~/routes/library/tracks/library-track-item.svelte";

  export let data: PageData;

  const albumsService = interpret(createMachine(CapacitorMusicKit.getLibraryAlbums));
  $: albums = $albumsService?.context?.items ?? [];
  const songsService = interpret(createMachine(CapacitorMusicKit.getLibrarySongs));
  $: songs = $songsService?.context?.items ?? [];
  const artistsService = interpret(createMachine(CapacitorMusicKit.getLibraryArtists));
  $: artists = $artistsService?.context?.items ?? [];

  const getItem = () => {
    albumsService.send({
      props: { ids: [data.id] },
      type: "SET_PROPS",
    });
    songsService.send({
      props: {
        albumId: data.id,
        limit: 100,
      },
      type: "SET_PROPS",
    });
    artistsService.send({
      props: {
        albumId: data.id,
        limit: 10,
      },
      type: "SET_PROPS",
    });
  };

  $: if ($accountService && $accountService.matches("authorized")) {
    getItem();
  }

  onMount(() => {
    albumsService.start();
    songsService.start();
    artistsService.start();
  });
  onDestroy(() => {
    albumsService.stop();
    songsService.stop();
    artistsService.stop();
  });
</script>

<ion-item-group>
  <ItemDivider title="Album" />

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
  {/if}

  {#if songs.length > 0}
    <ion-item>
      <ion-label class="ion-text-wrap"> 曲数 </ion-label>
      <ion-note slot="end">
        {songs.length}曲
      </ion-note>
    </ion-item>
    <ion-item>
      <ion-buttons>
        <ion-button>
          <ion-icon name="heart" color="red" />
        </ion-button>
      </ion-buttons>
    </ion-item>
    <ItemDivider title="Tracks" />
    <VirtualScroll itemHeight={46} items={songs} let:index let:item>
      <LibraryTrackItem
        ids={songs.map((track) => track.id)}
        {index}
        item={toTrackItem(item)}
        viewImage={false}
      />
    </VirtualScroll>
  {/if}

  {#if artists.length > 0}
    <ItemDivider title="Artists" />
    <VirtualScroll itemHeight={46} items={artists} let:item>
      <LibraryArtistItem {item} />
    </VirtualScroll>
  {/if}
</ion-item-group>
