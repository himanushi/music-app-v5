<script lang="ts">
  import { goto } from "$app/navigation";
  import Icon from "~/components/icon.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
</script>

<ion-list>
  <ItemDivider title="Library" />
  <ion-item button on:click={() => goto("/library/artists")}>
    <Icon name="person" fill start />
    <ion-label> アーティスト </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/library/albums")}>
    <Icon name="album" fill start />
    <ion-label> アルバム </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/library/tracks")}>
    <Icon name="music_note" fill start />
    <ion-label> 曲 </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/library/playlists")}>
    <Icon name="playlist_play" fill start />
    <ion-label> プレイリスト </ion-label>
  </ion-item>
</ion-list>
