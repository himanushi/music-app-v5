<script lang="ts">
  import { CapacitorMusicKit } from "capacitor-plugin-musickit";
  import { fade } from "svelte/transition";
  import PlayerSeekBar from "./player-seek-bar.svelte";
  import CenterItem from "~/components/center-item.svelte";
  import Icon from "~/components/icon.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { matches } from "~/lib/matches";
  import { playerService } from "~/machines/apple-music-player-machine";

  const playOrPause = () => playerService.send("PLAY_OR_PAUSE");

  const nextPlay = () => playerService.send("NEXT_PLAY");

  const previousPlay = () => playerService.send("PREVIOUS_PLAY");

  const switchRepeatMode = () => playerService.send("SWITCH_REPEAT_MODE");

  const switchShuffleMode = () => playerService.send("SWITCH_SHUFFLE_MODE");

  let favorite = false;
  const changeFavorite = async () => {
    const item = $playerService.context.currentTrack;
    if (!item) {
      return;
    }

    const type = item.id.startsWith("i.") ? "library-songs" : "songs";

    const ratings = (
      await CapacitorMusicKit.getRatings({
        ids: [item.id],
        type,
      })
    ).data;
    const value = ratings.find((rating) => rating.id === item.id)?.attributes?.value;
    if (value === 1) {
      await CapacitorMusicKit.deleteRating({
        id: item.id,
        type,
      });
      favorite = false;
    } else {
      await CapacitorMusicKit.addRating({
        id: item.id,
        type,
        value: 1,
      });
      favorite = true;
    }
  };

  $: loading = matches($playerService, ["loading"]);

  // change item event
  let prevId = "";
  $: if (
    $playerService &&
    $playerService.context.currentTrack?.id &&
    prevId !== $playerService.context.currentTrack.id
  ) {
    prevId = $playerService.context.currentTrack.id;

    (async () => {
      const type = prevId.startsWith("i.") ? "library-songs" : "songs";
      const ratings = (
        await CapacitorMusicKit.getRatings({
          ids: [prevId],
          type,
        })
      ).data;
      favorite = Boolean(ratings.find((rating) => rating.id === prevId)?.attributes?.value);
    })();
  }
</script>

<ion-content color="dark-gray" in:fade>
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
    <ion-row>
      <ion-col style="padding: 10px">
        {#if $playerService.context.currentTrack}
          <CenterItem>
            <SquareImage
              src={convertImageUrl({
                px: 500,
                url: $playerService.context.currentTrack.artworkURL,
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
        <ion-button color="black" size="large" on:click={changeFavorite}>
          {#if favorite}
            <Icon name="favorite" color="red" fill size="l" />
          {:else}
            <Icon name="favorite" size="l" />
          {/if}
        </ion-button>
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
