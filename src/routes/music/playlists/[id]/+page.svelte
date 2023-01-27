<script lang="ts">
  import type { PageData } from "./$types";
  import CenterItem from "~/components/center-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import type { PlaylistObject, TrackObject } from "~/graphql/types";
  import { convertDate, convertTime, toMs } from "~/lib/convert";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { toTrackItem } from "~/lib/toTrackItem";
  import { accountService } from "~/machines/apple-music-account-machine";
  import TrackItem from "~/routes/music/tracks/track-item.svelte";

  export let data: PageData;

  let playlist: PlaylistObject | undefined;
  let tracks: TrackObject[] = [];

  $: if (!playlist && $accountService && $accountService.matches("authorized")) {
    data.getItems({
      callback: (items) => {
        playlist = items.playlist;
        tracks = items.tracks;
      },
      id: data.id,
    });
  }
</script>

<ion-item-group>
  {#if playlist}
    <ItemDivider title="Playlist" />
    <CenterItem>
      <SquareImage
        src={convertImageUrl({
          px: 300,
          url: playlist.track?.artworkM.url,
        })}
      />
    </CenterItem>
    <ion-item class="text-select">
      <ion-label class="ion-text-wrap">
        {playlist.name}
      </ion-label>
    </ion-item>
    <ion-item class="text-select">
      <ion-label class="ion-text-wrap"> 作成日 </ion-label>
      <ion-note slot="end">
        {convertDate(playlist.createdAt)}
      </ion-note>
    </ion-item>
    <ion-item class="text-select">
      <ion-label class="ion-text-wrap"> 更新日 </ion-label>
      <ion-note slot="end">
        {convertDate(playlist.updatedAt)}
      </ion-note>
    </ion-item>
    <ion-item class="text-select">
      <ion-label class="ion-text-wrap"> 曲数 </ion-label>
      <ion-note slot="end">
        {playlist.items.length}曲
      </ion-note>
    </ion-item>
    <ion-item>
      <ion-label class="ion-text-wrap"> 再生時間 </ion-label>
      <ion-note slot="end">
        {playlist ? convertTime(toMs(playlist.items.map((item) => item.track))) : ""}
      </ion-note>
    </ion-item>
  {:else}
    <ItemDivider title="Playlist" />
    <CenterItem>
      <SquareImage src={convertImageUrl({ px: 300 })} />
    </CenterItem>
  {/if}

  <ItemDivider title="Tracks" />
  <VirtualScroll items={tracks} thumbnail let:index let:item>
    <TrackItem ids={tracks.map((track) => track.appleMusicId)} {index} item={toTrackItem(item)} />
  </VirtualScroll>
</ion-item-group>
