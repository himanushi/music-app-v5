<script lang="ts">
  import { fade } from "svelte/transition";
  import PlayerSeekBar from "./player-seek-bar.svelte";
  import CenterItem from "~/components/center-item.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { matches } from "~/lib/matches";
  import { playerService } from "~/machines/apple-music-player-machine";

  const playOrPause = () => playerService.send("PLAY_OR_PAUSE");

  const nextPlay = () => playerService.send("NEXT_PLAY");

  const previousPlay = () => playerService.send("PREVIOUS_PLAY");

  const switchRepeatMode = () => playerService.send("SWITCH_REPEAT_MODE");

  $: loading = matches($playerService, ["loading"]);
</script>

<ion-content color="dark-gray" in:fade>
  {#key $playerService.context.currentTrack?.id}
    <ion-grid>
      <ion-row>
        <ion-col style="padding: 10px">
          {#if $playerService.context.currentTrack}
            <CenterItem>
              <SquareImage
                src={convertImageUrl({
                  px: 500,
                  url: $playerService.context.currentTrack.artworkUrl,
                })}
              />
            </CenterItem>
          {:else}
            <CenterItem>
              <SquareImage src={convertImageUrl({ px: 500 })} />
            </CenterItem>
          {/if}
        </ion-col>
      </ion-row>

      {#if $playerService.context.currentTrack}
        <ion-row>
          <ion-col style="padding: 10px">
            <ion-label>
              {$playerService.context.currentTrack.name}
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
            <ion-icon name="play-skip-back" slot="icon-only" />
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
              <ion-icon name="pause" slot="icon-only" />
            {:else if loading}
              <ion-icon name="sync" slot="icon-only" />
            {:else}
              <ion-icon name="play" slot="icon-only" />
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
            <ion-icon name="play-skip-forward" slot="icon-only" />
          </ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-button color="black" size="large">
            <ion-icon name="heart" slot="icon-only" color="red" />
          </ion-button>
        </ion-col>
        <ion-col>
          <ion-button color="black" size="large" on:click={switchRepeatMode}>
            <ion-icon
              name="repeat"
              slot="icon-only"
              color={$playerService.context.repeatMode === "none" ? "gray" : "main"}
            />
          </ion-button>
        </ion-col>
        <ion-col>
          <ion-button id="player-main-option" color="black" size="large">
            <ion-icon name="ellipsis-horizontal" slot="icon-only" />
          </ion-button>
          <ion-popover dismiss-on-select="true" side={"top"} trigger="player-main-option">
            <ion-content>
              <ion-list>
                <ion-item button detail={false}> リンク </ion-item>
                <ion-item button detail={false}> プレイリストに追加 </ion-item>
              </ion-list>
            </ion-content>
          </ion-popover>
        </ion-col>
      </ion-row>
    </ion-grid>
  {/key}
</ion-content>

<style lang="scss">
  ion-col {
    text-align: center;
  }
</style>
