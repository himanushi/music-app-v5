<script lang="ts">
  import { Capacitor } from "@capacitor/core";
  import { fade } from "svelte/transition";
  import PlayerSeekBar from "./player-seek-bar.svelte";
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

  const nextPlay = () => playerService.send("NEXT_PLAY");

  const previousPlay = () => playerService.send("PREVIOUS_PLAY");

  const switchRepeatMode = () => playerService.send("SWITCH_REPEAT_MODE");

  const switchShuffleMode = () => playerService.send("SWITCH_SHUFFLE_MODE");

  $: loading = matches($playerService, ["loading"]);

  $: favorite = isFavorite($favorites, $playerService?.context?.currentTrack?.id);

  let prevId = "";
  $: if (
    $playerService?.context?.currentTrack?.id &&
    prevId !== $playerService.context.currentTrack.id
  ) {
    prevId = $playerService.context.currentTrack.id;
    getRatings([prevId]);
  }

  let artworkEle: HTMLIonColElement;
  $: if (artworkEle) {
    const height =
      Capacitor.getPlatform() === "ios" ? "calc(100vh - 500px)" : "calc(100vh - 410px)";
    artworkEle.style.height = height;
  }
</script>

<ion-content color="dark-gray" force-overscroll={false} in:fade>
  <ItemDivider
    menu={{
      items: [],
      onOk: () => {
        // nothing
      },
      title: "",
    }}
    title="Player"
  />
  <ion-grid>
    <ion-row class="ion-justify-content-center ion-align-items-center">
      <ion-col
        bind:this={artworkEle}
        style="display:flex;"
        class="ion-no-padding ion-justify-content-center ion-align-items-center"
      >
        {#if $playerService.context.currentTrack}
          <SquareImage
            src={convertImageUrl({
              px: 500,
              url: $playerService.context.currentTrack.artworkURL,
            })}
          />
        {:else}
          <SquareImage src={convertImageUrl({ px: 500 })} />
        {/if}
      </ion-col>
    </ion-row>

    {#if $playerService.context.currentTrack}
      <ion-row>
        <ion-col>
          <ion-label class="text-select">
            {$playerService.context.currentTrack.title}
          </ion-label>
        </ion-col>
      </ion-row>
    {/if}

    <PlayerSeekBar />

    <ion-row>
      <ion-col>
        <ion-button
          color="black"
          disabled={loading || !$playerService.context.currentTrack}
          size="large"
          on:click={previousPlay}
        >
          <Icon name="skip_previous" fill size="l" />
        </ion-button>
      </ion-col>
      <ion-col>
        <ion-button
          color="black"
          disabled={loading || !$playerService.context.currentTrack}
          size="large"
          on:click={playOrPause}
        >
          {#if matches($playerService, ["playing"])}
            <Icon name="pause" fill size="l" />
          {:else if loading}
            <Icon name="sync" fill size="l" />
          {:else}
            <Icon name="play_arrow" fill size="l" />
          {/if}
        </ion-button>
      </ion-col>
      <ion-col>
        <ion-button
          color="black"
          disabled={loading || !$playerService.context.currentTrack}
          size="large"
          on:click={nextPlay}
        >
          <Icon name="skip_next" fill size="l" />
        </ion-button>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col>
        <FavoriteButton id={$playerService?.context?.currentTrack?.id} {favorite} size="l" />
      </ion-col>
      <ion-col>
        <ion-button color="black" size="large" on:click={switchRepeatMode}>
          <Icon
            name={$playerService.context.repeatMode === "one" ? "repeat_one" : "repeat"}
            color={$playerService.context.repeatMode === "none" ? "gray" : "main"}
            size="l"
          />
        </ion-button>
      </ion-col>
      <ion-col>
        <ion-button color="black" size="large" on:click={switchShuffleMode}>
          <Icon
            name="shuffle"
            color={$playerService.context.shuffleMode === "off" ? "gray" : "main"}
            size="l"
          />
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-grid>
</ion-content>

<style lang="scss">
  ion-col {
    text-align: center;
  }
</style>
