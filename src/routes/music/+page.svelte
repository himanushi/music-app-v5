<script lang="ts">
  import { goto } from "$app/navigation";
  import ItemDivider from "~/components/item-divider.svelte";
</script>

<ion-list>
  <ItemDivider title="ゲーム音楽" />
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
  <ItemDivider title="Library" />
  <ion-item button on:click={() => goto("/music/library-albums")}>
    <ion-label> アーティスト </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/music/library-albums")}>
    <ion-label> アルバム </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/music/library-albums")}>
    <ion-label> 曲 </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/music/library-albums")}>
    <ion-label> プレイリスト </ion-label>
  </ion-item>
</ion-list>
