<script lang="ts">
  import { goto } from "$app/navigation";
  import Icon from "~/components/icon.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
</script>

<ion-list>
  <ItemDivider title="Music" />
  <ion-item button on:click={() => goto("/music/artists")}>
    <Icon name="person" fill start />
    <ion-label> アーティストを探す </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/music/albums")}>
    <Icon name="album" fill start />
    <ion-label> アルバムを探す </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/music/tracks")}>
    <Icon name="music_note" fill start />
    <ion-label> 曲を探す </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/music/playlists")}>
    <Icon name="playlist_play" fill start />
    <ion-label> みんなのプレイリストを探す </ion-label>
  </ion-item>
</ion-list>
