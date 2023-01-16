<script lang="ts">
  import { goto } from "$app/navigation";
  import type { AlbumObject } from "~/graphql/types";
  import { convertImageUrl } from "~/lib/convertImageUrl";

  export let item: AlbumObject;

  const path = `/music/albums/${item.id}`;
</script>

<ion-item button detail={false} on:click={() => goto(path)}>
  <ion-thumbnail slot="start">
    <ion-img
      alt={item.name}
      src={convertImageUrl({
        px: 300,
        url: item.artworkM?.url,
      })}
    />
  </ion-thumbnail>
  {#if item.appleMusicPlayable}
    <ion-icon slot="start" src="/assets/logo-apple-music.svg" />
  {:else}
    <ion-icon slot="start" src="/assets/logo-itunes.svg" />
  {/if}
  {#if item.status !== "ACTIVE"}
    <ion-icon
      name="hourglass-outline"
      slot="start"
      color={item.status === "PENDING" ? "yellow" : "red"}
    />
  {/if}
  <ion-label>{item.name}</ion-label>
  <ion-buttons slot="end">
    <!-- <Favorite id={item.id} type="album" /> -->
  </ion-buttons>
</ion-item>
