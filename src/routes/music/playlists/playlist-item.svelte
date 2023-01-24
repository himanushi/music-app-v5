<script lang="ts">
  import { goto } from "$app/navigation";
  import SquareImage from "~/components/square-image.svelte";
  import type { PlaylistObject } from "~/graphql/types";

  export let item: PlaylistObject;

  const path = `/playlist/${item.id}`;
</script>

<ion-item button detail={false} on:click={() => goto(path)}>
  <ion-thumbnail slot="start">
    <SquareImage alt={item.name} src={item.track?.artworkM?.url ?? undefined} />
  </ion-thumbnail>
  <ion-label>{item.name}</ion-label>
</ion-item>
