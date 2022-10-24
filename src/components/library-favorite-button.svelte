<!-- <script lang="ts">
  import { CapacitorMusicKit, type Rating } from "capacitor-plugin-musickit";

  export let rating: -1 | 1;

  const changeRating = async () => {
    if (rating) {
      await CapacitorMusicKit.deleteRating({
        id: data.id,
        type: "library-albums",
      });
      // eslint-disable-next-line require-atomic-updates
      ratings = {};
    } else {
      await CapacitorMusicKit.addRating({
        id: data.id,
        type: "library-albums",
        value: 1,
      });
      // eslint-disable-next-line require-atomic-updates
      ratings = {
        [data.id]: 1,
      };
    }
  };
</script>

<ion-button on:click={changeRating}>
  {#if ratings[data.id]}
    <ion-icon name="heart" color="red" />
  {:else}
    <ion-icon name="heart-outline" />
  {/if}
</ion-button> -->
