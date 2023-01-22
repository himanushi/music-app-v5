<script lang="ts">
  import FavoriteButton from "~/components/favorite-button.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import { isFavorite } from "~/lib/isFavorite";
  import type { TrackItem } from "~/lib/toTrackItem";
  import { playerService } from "~/machines/apple-music-player-machine";
  import { favorites } from "~/store/favorites";
  import { hasMusicSubscription } from "~/store/hasMusicSubscription";

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
  {#if $hasMusicSubscription}
    <ion-buttons slot="end">
      <FavoriteButton id={item.id} favorite={isFavorite($favorites, item.id)} />
    </ion-buttons>
  {/if}
</ion-item>
