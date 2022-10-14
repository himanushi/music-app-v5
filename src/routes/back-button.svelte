<script lang="ts">
  export let iconName = "chevron-back-outline";

  const back = () => {
    window.history.go(-1);
  };

  let component: HTMLElement;
  $: if (component) {
    component.setAttribute("slot", "fixed");
  }
</script>

<ion-fab bind:this={component} horizontal="start" vertical="bottom">
  <ion-fab-button on:click={back}>
    <ion-icon name={iconName} />
  </ion-fab-button>
</ion-fab>

<style>
  ion-fab {
    bottom: 90px;
  }
</style>
