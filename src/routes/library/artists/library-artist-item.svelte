<script lang="ts">
  import type { ArtistResult } from "capacitor-plugin-musickit";
  import { goto } from "$app/navigation";

  export let item: ArtistResult;
</script>

<ion-item button detail={false} on:click={() => goto(`/library/artists/${item.id}`)}>
  <ion-label>{item.name}</ion-label>
</ion-item>
