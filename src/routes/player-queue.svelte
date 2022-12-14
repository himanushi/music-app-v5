<script lang="ts">
  import { fade } from "svelte/transition";
  import FavoriteButton from "~/components/favorite-button.svelte";
  import Icon from "~/components/icon.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { getRatings } from "~/lib/getRatings";
  import { isFavorite } from "~/lib/isFavorite";
  import { matches } from "~/lib/matches";
  import { playerService } from "~/machines/apple-music-player-machine";
  import { favorites } from "~/store/favorites";

  const playOrPause = () => playerService.send("PLAY_OR_PAUSE");

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

  const remove = (index: number) => {
    playerService.send({
      index,
      type: "REMOVE_QUEUE_TRACK",
    });
  };

  $: loading = matches($playerService, ["loading"]);

  $: if ($playerService?.context?.queueTracks?.length > 0) {
    getRatings({ ids: $playerService.context.queueTracks.map((track) => track.id) });
  }
</script>

<ion-content style="padding: 10px 0" color="dark-gray" in:fade>
  <ItemDivider title="Queue" />
  <ion-reorder-group disabled={false} on:ionItemReorder={decide}>
    {#each $playerService.context.queueTracks as track, index (`${track.id}_${index}`)}
      <ion-item-sliding>
        <ion-item
          color={$playerService.context.currentPlaybackNo === index ? "main" : "dark-gray"}
          on:click={() => play(index)}
        >
          <ion-reorder slot="start">
            <Icon name="reorder" fill size="s" />
          </ion-reorder>
          {#if $playerService.context.currentPlaybackNo === index}
            <ion-thumbnail slot="start" on:click|preventDefault|stopPropagation>
              <SquareImage
                src={convertImageUrl({
                  px: 300,
                  url: track.artworkURL,
                })}
              />
            </ion-thumbnail>
            <ion-buttons
              slot="start"
              class="thumbnail-button"
              on:click|preventDefault|stopPropagation
            >
              <ion-button
                color="black"
                disabled={loading || !$playerService.context.currentTrack}
                size="large"
                on:click={playOrPause}
              >
                {#if matches($playerService, ["playing"])}
                  <Icon name="pause" fill />
                {:else if loading}
                  <Icon name="sync" fill />
                {:else}
                  <Icon name="play_arrow" fill />
                {/if}
              </ion-button>
            </ion-buttons>
          {:else}
            <ion-thumbnail slot="start">
              <SquareImage
                src={convertImageUrl({
                  px: 300,
                  url: track.artworkURL,
                })}
              />
            </ion-thumbnail>
          {/if}
          <ion-label>
            {track.title}
          </ion-label>
          <ion-buttons>
            <FavoriteButton id={track.id} favorite={isFavorite($favorites, track.id)} />
          </ion-buttons>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option color="danger" on:click={() => remove(index)}>
            <ion-icon name="trash" slot="icon-only" />
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    {/each}
  </ion-reorder-group>
</ion-content>
