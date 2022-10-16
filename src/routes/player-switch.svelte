<script lang="ts">
  import PlayerMain from "./player-main.svelte";
  import PlayerQueue from "./player-queue.svelte";

  export let switchBreakpoint: () => void;
</script>

<ion-tabs>
  <ion-tab tab="player"><PlayerMain /></ion-tab>
  <ion-tab tab="queue"><PlayerQueue /></ion-tab>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="player">
      <ion-icon name="musical-note" />
    </ion-tab-button>
    <ion-tab-button tab="queue">
      <ion-icon name="list" />
    </ion-tab-button>
    <ion-tab-button on:click={switchBreakpoint}>
      <ion-icon name="close" />
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
