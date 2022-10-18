<script lang="ts">
  import { goto } from "$app/navigation";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
</script>

<ion-list>
  <ItemDivider title="Library" />
  <ion-item button on:click={() => goto("/library/artists")}>
    <ion-label> アーティスト </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/library/albums")}>
    <ion-label> アルバム </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/library/tracks")}>
    <ion-label> 曲 </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/library/playlists")}>
    <ion-label> プレイリスト </ion-label>
  </ion-item>
</ion-list>
