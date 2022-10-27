<script lang="ts">
  import { fade } from "svelte/transition";
  import Icon from "~/components/icon.svelte";
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
            url: $playerService.context.currentTrack.artworkURL,
          })}
        />
      </ion-thumbnail>
      <ion-title>
        {$playerService.context.currentTrack.title}
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
          <Icon name="pause" fill />
        {:else if loading}
          <Icon name="sync" fill />
        {:else}
          <Icon name="play_arrow" fill />
        {/if}
        <ion-ripple-effect type="unbounded" />
      </ion-button>
      <ion-button
        disabled={loading || !$playerService.context.currentTrack}
        on:click|preventDefault|stopPropagation={nextPlay}
      >
        <Icon name="skip_next" fill />
        <ion-ripple-effect type="unbounded" />
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<style lang="scss">
  ion-toolbar {
    cursor: pointer;
  }
</style>
