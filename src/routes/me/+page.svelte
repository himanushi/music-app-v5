<script lang="ts">
  import { CapacitorAppleMusic } from "capacitor-plugin-applemusic";

  const onClick = () => CapacitorAppleMusic.authorize();
</script>

<ion-item on:click={onClick}>
  <ion-label> ログイン </ion-label>
</ion-item>
