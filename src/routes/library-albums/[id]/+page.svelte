<script lang="ts">
  import { CapacitorMusicKit, type GetLibraryAlbumResult } from "capacitor-plugin-musickit";
  import type { PageData } from "./$types";
  import CenterItem from "~/components/center-item.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { accountService } from "~/machines/apple-music-account-machine";
  import { playerService } from "~/machines/apple-music-player-machine";

  export let data: PageData;
  let result: GetLibraryAlbumResult;

  const play = (index: number) => {
    if (result.album?.tracks) {
      playerService.send({
        currentPlaybackNo: index,
        trackIds: result.album.tracks.map((track) => track.id),
        type: "REPLACE_AND_PLAY",
      });
    }
  };

  const getAlbum = async () => {
    result = await CapacitorMusicKit.getLibraryAlbum({ id: data.id });
  };

  $: if ($accountService && $accountService.matches("authorized")) {
    getAlbum();
  }
</script>

<ion-item-group>
  <ion-item-divider sticky>
    <ion-label>Album</ion-label>
  </ion-item-divider>

  {#if result?.album}
    <CenterItem>
      <SquareImage src={convertImageUrl({ px: 300,
        url: result.album.artworkUrl })} />
    </CenterItem>
    <ion-item>
      <ion-label>
        {result.album.title}
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-label class="ion-text-wrap"> 曲数 </ion-label>
      <ion-note slot="end">
        {result.album.tracks.length}曲
      </ion-note>
    </ion-item>
    <ion-item-divider sticky>
      <ion-label>Tracks</ion-label>
    </ion-item-divider>
    <VirtualScroll itemHeight={46} items={result.album.tracks} let:index let:item>
      <ion-item button detail={false} on:click={() => play(index)}>
        <ion-note slot="start">
          {item.trackNumber}
        </ion-note>
        <ion-label>{item.title}</ion-label>
      </ion-item>
    </VirtualScroll>
  {/if}
</ion-item-group>
