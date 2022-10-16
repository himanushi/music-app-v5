<script lang="ts">
  import SquareImage from "~/components/square-image.svelte";
  import type { TrackObject } from "~/graphql/types";
  import { playerService } from "~/machines/apple-music-player-machine";

  export let index: number;
  export let item: TrackObject;
  export let items: TrackObject[];
  export let viewImage = true;

  const play = () => {
    if (items) {
      playerService.send({
        currentPlaybackNo: index,
        trackIds: items.map((track) => track.appleMusicId),
        type: "REPLACE_AND_PLAY",
      });
    }
  };
</script>

<ion-item button detail={false} on:click={play}>
  {#if viewImage}
    <ion-thumbnail slot="start" on:click|preventDefault|stopPropagation>
      <SquareImage src={item.artworkM.url ?? undefined} />
    </ion-thumbnail>
  {:else}
    <ion-note slot="start">
      {item.trackNumber}
    </ion-note>
  {/if}
  <ion-label>
    {item.name}
  </ion-label>
</ion-item>
