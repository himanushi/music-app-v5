<script lang="ts">
  import { fade } from "svelte/transition";
  import SquareImage from "~/components/square-image.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { matches } from "~/lib/matches";
  import { playerService } from "~/machines/apple-music-player-machine";

  export let switchBreakpoint: () => void;

  const playOrPause = () => playerService.send("PLAY_OR_PAUSE");

  const nextPlay = () => playerService.send("NEXT_PLAY");

  $: loading = matches($playerService, ["loading"]);
</script>

<ion-header in:fade>
  <ion-toolbar on:click={switchBreakpoint}>
    {#if $playerService.context.currentTrack}
      <ion-thumbnail slot="start">
        <SquareImage
          src={convertImageUrl({
            px: 300,
            url: $playerService.context.currentTrack.artworkUrl,
          })}
        />
      </ion-thumbnail>
      <ion-title>
        {$playerService.context.currentTrack.name}
      </ion-title>
    {:else}
      <ion-thumbnail slot="start">
        <SquareImage src={convertImageUrl({ px: 300 })} />
      </ion-thumbnail>
    {/if}
    <ion-buttons slot="end">
      <ion-button
        disabled={loading || !$playerService.context.currentTrack}
        on:click|preventDefault|stopPropagation={playOrPause}
      >
        {#if matches($playerService, ["playing"])}
          <ion-icon name="pause" slot="icon-only" />
        {:else if loading}
          <ion-icon name="sync" slot="icon-only" />
        {:else}
          <ion-icon name="play" slot="icon-only" />
        {/if}
      </ion-button>
      <ion-button
        disabled={loading || !$playerService.context.currentTrack}
        on:click|preventDefault|stopPropagation={nextPlay}
      >
        <ion-icon name="play-forward" slot="icon-only" />
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<style lang="scss">
  ion-toolbar {
    cursor: pointer;
  }
</style>
