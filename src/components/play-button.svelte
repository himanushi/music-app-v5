<!-- <script lang="ts">
  import { playerService } from "~/machines/apple-music-player-machine";

  export let index: number;
  export let songIds: string[];

  const onClick = () => {
    playerService.send([
      {
        currentPlaybackNo: index,
        songIds,
        type: "REPLACE_AND_PLAY",
      },
    ]);
  };
</script>

<ion-button on:click={onClick}>
  <ion-icon name="play" />
</ion-button> -->
