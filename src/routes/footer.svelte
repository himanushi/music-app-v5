<script lang="ts">
  import SquareImage from "~/components/square-image.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { matches } from "~/lib/matches";
  import { playerService } from "~/machines/apple-music-player-machine";

  const playOrPause = () => playerService.send("PLAY_OR_PAUSE");

  const nextPlay = () => playerService.send("NEXT_PLAY");

  $: loading = matches($playerService, ["loading"]);
</script>

<ion-footer translucent={true}>
  <ion-toolbar color="main">
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
        {$playerService.context.currentTrack.title}
      </ion-title>
    {:else}
      <ion-thumbnail slot="start">
        <SquareImage src={convertImageUrl({ px: 300 })} />
      </ion-thumbnail>
    {/if}
    <ion-buttons slot="end">
      <ion-button disabled={loading || !$playerService.context.currentTrack} on:click={playOrPause}>
        {#if matches($playerService, ["playing"])}
          <ion-icon name="pause" />
        {:else if loading}
          <ion-icon name="sync" />
        {:else}
          <ion-icon name="play" />
        {/if}
      </ion-button>
      <ion-button disabled={loading || !$playerService.context.currentTrack} on:click={nextPlay}>
        <ion-icon name="play-forward" />
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-footer>
