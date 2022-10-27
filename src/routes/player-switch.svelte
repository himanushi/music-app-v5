<script lang="ts">
  import PlayerMain from "./player-main.svelte";
  import PlayerQueue from "./player-queue.svelte";
  import Icon from "~/components/icon.svelte";

  export let switchBreakpoint: () => void;
</script>

<ion-tabs>
  <ion-tab tab="player"><PlayerMain /></ion-tab>
  <ion-tab tab="queue"><PlayerQueue /></ion-tab>
  <ion-tab-bar slot="bottom">
    <ion-tab-button on:click={switchBreakpoint}>
      <Icon name="close" size="l" />
    </ion-tab-button>
    <ion-tab-button tab="player">
      <Icon name="music_note" size="l" />
    </ion-tab-button>
    <ion-tab-button tab="queue">
      <Icon name="queue_music" size="l" />
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
