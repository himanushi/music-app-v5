<script lang="ts">
  import { CapacitorMusicKit } from "capacitor-plugin-musickit";
  import Icon from "~/components/icon.svelte";
  import { openToast } from "~/lib/ionicController";
  import { hasMusicSubscription } from "~/store/hasMusicSubscription";

  export let id: string | undefined;
  export let favorite = false;
  export let type: MusicKit.AppleMusicAPI.RatingType | undefined = undefined;
  export let size: "l" | "m" | "s" = "s";

  const changeFavorite = async () => {
    if (!type || !id) {
      return;
    }
    if (favorite) {
      await CapacitorMusicKit.deleteRating({
        id,
        type,
      });
      favorite = false;
    } else {
      await CapacitorMusicKit.addRating({
        id,
        type,
        value: 1,
      });
      favorite = true;
    }
  };

  $: if ($hasMusicSubscription && id) {
    type = id.startsWith("i.") ? "library-songs" : "songs";
  }

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
