<script lang="ts">
  import ArtistItem from "../../artists/artist-item.svelte";
  import type { PageData } from "./$types";
  import AlbumMenu from "./album-menu.svelte";
  import CenterItem from "~/components/center-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { client } from "~/graphql/client";
  import {
    AlbumDocument,
    ArtistsDocument,
    type AlbumObject,
    type ArtistObject,
    type TrackObject,
    type StatusEnum,
  } from "~/graphql/types";
  import { convertDate, convertTime, toMs } from "~/lib/convert";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { toTrackItem } from "~/lib/toTrackItem";
  import { accountService } from "~/machines/apple-music-account-machine";
  import TrackItem from "~/routes/music/tracks/track-item.svelte";

  export let data: PageData;

  let album: AlbumObject | undefined;
  let tracks: TrackObject[] = [];
  let artists: ArtistObject[] = [];
  const status: StatusEnum[] = ["ACTIVE"];

  $: if (!album && $accountService && $accountService.matches("authorized")) {
    (async () => {
      album = (
        await client.query({
          fetchPolicy: "cache-first",
          query: AlbumDocument,
          variables: { id: data.id },
        })
      ).data.album as AlbumObject;
      tracks = album.tracks.map((track) => track);
      if (album) {
        artists = (
          await client.query({
            fetchPolicy: "cache-first",
            query: ArtistsDocument,
            variables: {
              conditions: {
                albumIds: [album.id],
                status,
              },
              sort: {
                direction: "DESC",
                order: "POPULARITY",
              },
            },
          })
        ).data.items as ArtistObject[];
      }
    })();
  }
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
  {/if}

  <ItemDivider title="Tracks" />
  <VirtualScroll items={tracks} let:index let:item>
    <TrackItem
      ids={tracks.map((track) => track.appleMusicId)}
      {index}
      item={toTrackItem(item)}
      viewImage={false}
    />
  </VirtualScroll>

  <ItemDivider title="Artists" />
  <VirtualScroll items={artists} thumbnail={true} let:item>
    <ArtistItem {item} />
  </VirtualScroll>
</ion-item-group>
