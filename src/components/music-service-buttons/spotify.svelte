<script lang="ts">
  import { Capacitor } from "@capacitor/core";

  export let name: string;

  let href = `https://open.spotify.com/search/${name}`;
  if (Capacitor.isNativePlatform()) {
    href = `https://open.spotify.com/search/results/${name}`;
  }
</script>

<ion-item button {href} target="_blank">
  <ion-icon slot="start" src="/assets/logo-spotify.svg" />
  <ion-label> Spotify で検索 </ion-label>
</ion-item>
