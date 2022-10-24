<script lang="ts">
  import { CapacitorMusicKit } from "capacitor-plugin-musickit";
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
  let album: MusicKit.LibraryAlbums | undefined;
  let songs: MusicKit.LibrarySongs[] = [];
  let artists: MusicKit.LibraryArtists[] = [];

  const getItem = async () => {
    album = (
      await CapacitorMusicKit.getLibraryAlbums({
        ids: [data.id],
      })
    ).data[0];
    songs = (
      await CapacitorMusicKit.getLibrarySongs({
        albumId: data.id,
        limit: 100,
      })
    ).data;
    artists = (
      await CapacitorMusicKit.getLibraryArtists({
        albumId: data.id,
        limit: 10,
      })
    ).data;
  };

  $: if ($accountService && $accountService.matches("authorized")) {
    getItem();
  }
</script>

<ion-item-group>
  <ItemDivider title="Album" />

  {#if album}
    <CenterItem>
      <SquareImage
        src={convertImageUrl({
          px: 500,
          url: album.attributes.artwork.url,
        })}
      />
    </CenterItem>
    <ion-item>
      <ion-label>
        {album.attributes.name}
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
