<script lang="ts">
  import { goto } from "$app/navigation";
  import type { ArtistObject } from "~/graphql/types";
  import { convertImageUrl } from "~/lib/convertImageUrl";

  export let item: ArtistObject;

  const path = `/music/artists/${item.id}`;
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
  {#if item.status !== "ACTIVE"}
    <ion-icon
      name="hourglass-outline"
      slot="start"
      color={item.status === "PENDING" ? "yellow" : "red"}
    />
  {/if}
  <ion-label>{item.name}</ion-label>
</ion-item>
