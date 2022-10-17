<script lang="ts">
  import SquareImage from "~/components/square-image.svelte";
  import type { TrackItem } from "~/lib/toTrackItem";
  import { playerService } from "~/machines/apple-music-player-machine";

  export let index: number;
  export let item: TrackItem;
  export let ids: string[];
  export let viewImage = true;

  const play = () => {
    playerService.send({
      currentPlaybackNo: index,
      trackIds: ids,
      type: "REPLACE_AND_PLAY",
    });
  };
</script>

<ion-item button detail={false} on:click={play}>
  {#if viewImage}
    <ion-thumbnail slot="start" on:click|preventDefault|stopPropagation>
      <SquareImage src={item.artworkUrl ?? undefined} />
    </ion-thumbnail>
  {:else}
    <ion-note slot="start">
      {item.index}
    </ion-note>
  {/if}
  <ion-label>
    {item.name}
  </ion-label>
</ion-item>
