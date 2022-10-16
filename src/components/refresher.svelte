<script lang="ts">
  export let refresh: () => void;
  export let loaded: boolean;

  // eslint-disable-next-line no-undef
  let refresher: HTMLIonRefresherElement;
  $: if (refresher && !refresher.slot) {
    refresher.setAttribute("slot", "fixed");
  }

  const ionRefresh = () => {
    loaded = false;
    refresh();
  };

  $: if (loaded) {
    refresher.complete();
  }
</script>

<ion-refresher bind:this={refresher} on:ionRefresh={ionRefresh}>
  <ion-refresher-content refreshing-spinner="lines" />
</ion-refresher>
