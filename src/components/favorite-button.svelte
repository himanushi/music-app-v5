<script lang="ts">
  import { CapacitorMusicKit } from "capacitor-plugin-musickit";
  import Icon from "~/components/icon.svelte";
  import { getRatings } from "~/lib/getRatings";
  import { openToast } from "~/lib/ionicController";
  import { favorites } from "~/store/favorites";
  import { hasMusicSubscription } from "~/store/hasMusicSubscription";

  export let id: string | undefined;
  export let favorite = false;
  export let categoryType: MusicKit.AppleMusicAPI.RatingCategoryType = "songs";
  export let size: "l" | "m" | "s" = "s";

  let type: MusicKit.AppleMusicAPI.RatingType = "songs";
  if (id && categoryType === "songs") {
    type = id.startsWith("i.") ? "library-songs" : "songs";
  } else if (id && categoryType === "albums") {
    type = id.startsWith("l.") ? "library-albums" : "albums";
  } else if (id && categoryType === "artists") {
    type = id.startsWith("r.") ? "library-artists" : "artists";
  }

  const changeFavorite = async () => {
    if (!id) {
      return;
    }
    try {
      if (favorite) {
        await CapacitorMusicKit.deleteRating({
          id,
          type,
        });
        favorites.delete(id);
      } else {
        await CapacitorMusicKit.addRating({
          id,
          type,
          value: 1,
        });
        getRatings({
          categoryType,
          ids: [id],
        });
      }
    } catch (error) {
      // nothing
    }
  };

  const favoriteInfo = () => {
    openToast({
      color: "main",
      duration: 10000,
      message: "Apple Music サブスクリプション加入で使用できます",
    });
  };
</script>

{#if type}
  {#if hasMusicSubscription}
    <ion-button color="black" on:click|preventDefault|stopPropagation={changeFavorite}>
      {#if favorite}
        <Icon name="favorite" color="red" fill {size} />
      {:else}
        <Icon name="favorite" color="white" {size} />
      {/if}
    </ion-button>
  {:else}
    <ion-button color="black" on:click|preventDefault|stopPropagation={favoriteInfo}>
      <Icon name="favorite" color="gray" fill {size} />
    </ion-button>
  {/if}
{:else}
  <ion-button color="black" disabled>
    <Icon name="favorite" color="gray" {size} />
  </ion-button>
{/if}
