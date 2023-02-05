<script lang="ts">
  import { onDestroy } from "svelte";
  import ArtistItem from "../../artists/artist-item.svelte";
  import type { PageData } from "./$types";
  import AlbumMenu from "./album-menu.svelte";
  import CenterItem from "~/components/center-item.svelte";
  import FavoriteButton from "~/components/favorite-button.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import LoadingItems from "~/components/loading-items.svelte";
  import AmazonMusic from "~/components/music-service-buttons/amazon-music.svelte";
  import AppleMusic from "~/components/music-service-buttons/apple-music.svelte";
  import Itunes from "~/components/music-service-buttons/itunes.svelte";
  import LineMusic from "~/components/music-service-buttons/line-music.svelte";
  import Spotify from "~/components/music-service-buttons/spotify.svelte";
  import YoutubeMusic from "~/components/music-service-buttons/youtube-music.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import type { AlbumObject, ArtistObject, TrackObject, StatusEnum } from "~/graphql/types";
  import { convertDate, convertTime, toMs } from "~/lib/convert";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { toTrackItem } from "~/lib/toTrackItem";
  import { accountService } from "~/machines/apple-music-account-machine";
  import TrackItem from "~/routes/music/tracks/track-item.svelte";

  export let data: PageData;
  const { librarySongsService, getItems, stopServices, id } = data;

  let album: AlbumObject | undefined;
  let libraryAlbum: MusicKit.LibraryAlbums | undefined;
  let tracks: TrackObject[] = [];
  let artists: ArtistObject[] = [];
  const status: StatusEnum[] = ["ACTIVE"];
  let librarySongs: MusicKit.LibrarySongs[] = [];
  $: librarySongs = $librarySongsService.context.items;

  $: if (!album && $accountService && $accountService.matches("authorized")) {
    getItems({
      callback: (event) => {
        album = event.album;
        libraryAlbum = event.libraryAlbum;
        tracks = event.tracks;
        artists = event.artists;
      },
      id,
      status,
    });
  }

  onDestroy(() => stopServices());
</script>

<ion-item-group>
  {#if album}
    <AlbumMenu id={data.id} albumStatus={album.status} />
    <CenterItem>
      <SquareImage
        src={convertImageUrl({
          px: 300,
          url: album?.artworkL?.url,
        })}
      />
    </CenterItem>
    <ion-item class="text-select">
      <ion-label class="ion-text-wrap">
        {album.name}
      </ion-label>
    </ion-item>
    <ion-item class="text-select">
      <ion-label class="ion-text-wrap">
        {album.copyright}
      </ion-label>
    </ion-item>
    <ion-item class="text-select">
      <ion-label class="ion-text-wrap"> 発売日/配信日 </ion-label>
      <ion-note slot="end">
        {convertDate(album.releaseDate)}
      </ion-note>
    </ion-item>
    <ion-item class="text-select">
      <ion-label class="ion-text-wrap"> 曲数 </ion-label>
      <ion-note slot="end">
        {album.totalTracks}曲
      </ion-note>
    </ion-item>
    <ion-item>
      <ion-label class="ion-text-wrap"> 再生時間 </ion-label>
      <ion-note slot="end">
        {album ? convertTime(toMs(album.tracks)) : ""}
      </ion-note>
    </ion-item>
    <ion-item>
      <ion-buttons slot="end">
        <FavoriteButton id={album.id} />
      </ion-buttons>
    </ion-item>
    {#if album.status !== "ACTIVE"}
      <ion-item>
        <ion-label class="ion-text-wrap" color={album.status === "PENDING" ? "yellow" : "red"}>
          {album.status}
        </ion-label>
      </ion-item>
    {/if}
  {:else}
    <ItemDivider title="Album" />
    <CenterItem>
      <SquareImage src={convertImageUrl({ px: 300 })} />
    </CenterItem>
    <LoadingItems count={6} />
  {/if}

  <ItemDivider title="Music Services" />
  {#if album}
    {#if album.appleMusicPlayable}
      <AppleMusic id={album.appleMusicId} />
    {/if}
    <Itunes id={album.appleMusicId} {libraryAlbum} />
    <Spotify name={album.name} />
    <AmazonMusic name={album.name} />
    <YoutubeMusic name={album.name} />
    <LineMusic name={album.name} />
  {:else}
    <LoadingItems count={5} />
  {/if}

  <ItemDivider title="Tracks" />
  {#if libraryAlbum}
    {#if librarySongs.length > 0}
      <VirtualScroll items={librarySongs} let:index let:item>
        <TrackItem
          ids={librarySongs.map((track) => track.id)}
          {index}
          item={toTrackItem(item)}
          viewImage={false}
        />
      </VirtualScroll>
    {:else}
      <LoadingItems count={10} />
    {/if}
  {:else}
    <VirtualScroll items={tracks} let:index let:item>
      <TrackItem
        ids={tracks.map((track) => track.appleMusicId)}
        {index}
        item={toTrackItem(item)}
        viewImage={false}
      />
    </VirtualScroll>
  {/if}

  <ItemDivider title="Artists" />
  <VirtualScroll items={artists} thumbnail={true} let:item>
    <ArtistItem {item} />
  </VirtualScroll>
</ion-item-group>
