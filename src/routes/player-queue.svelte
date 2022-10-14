<script lang="ts">
  import { fade } from "svelte/transition";
  import SquareImage from "~/components/square-image.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { playerService } from "~/machines/apple-music-player-machine";

  const decide = (
    event: CustomEvent & {
      detail: { from: number; to: number; complete: Function };
    },
  ) => {
    playerService.send({
      from: event.detail.from,
      to: event.detail.to,
      type: "MOVE_QUEUE_TRACKS",
    });

    event.detail.complete();
  };

  const play = (index: number) => {
    if ($playerService.context.queueTracks) {
      playerService.send({
        currentPlaybackNo: index,
        trackIds: $playerService.context.queueTracks.map((track) => track.id),
        type: "REPLACE_AND_PLAY",
      });
    }
  };
</script>

<ion-content style="padding: 10px 0" color="dark-gray" in:fade>
  <ion-reorder-group disabled={false} on:ionItemReorder={decide}>
    {#each $playerService.context.queueTracks as track, index}
      <ion-item-sliding>
        <ion-item color="dark-gray">
          <ion-reorder slot="start">
            <ion-icon name="reorder-two" />
          </ion-reorder>
          <ion-thumbnail slot="start" on:click|preventDefault|stopPropagation>
            <SquareImage
              src={convertImageUrl({
                px: 300,
                url: track.artworkUrl,
              })}
            />
          </ion-thumbnail>
          <ion-buttons
            slot="start"
            class="thumbnail-button"
            on:click|preventDefault|stopPropagation
          >
            {#if $playerService.context.currentPlaybackNo === index}
              <ion-button>
                <ion-icon name="musical-note" slot="icon-only" color="main" />
              </ion-button>
            {:else}
              <ion-button on:click={() => play(index)}>
                <ion-icon name="play" slot="icon-only" />
              </ion-button>
            {/if}
          </ion-buttons>
          <ion-label>
            {track.name}
          </ion-label>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option color="danger">
            <ion-icon name="trash" slot="icon-only" />
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    {/each}
  </ion-reorder-group>
</ion-content>
