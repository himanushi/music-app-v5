<script lang="ts">
  import { goto } from "$app/navigation";
  import ItemDivider from "~/components/item-divider.svelte";
</script>

<ion-list>
  <ItemDivider title="Music" />
  <ion-item button on:click={() => goto("/music/albums")}>
    <ion-label> アーティストを探す </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/music/albums")}>
    <ion-label> アルバムを探す </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/music/albums")}>
    <ion-label> 曲を探す </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/music/albums")}>
    <ion-label> プレイリストを探す </ion-label>
  </ion-item>
</ion-list>
