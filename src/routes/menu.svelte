<script>
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";

  const back = () => window.history.back();
  const forward = () => window.history.forward();
</script>

<ion-header in:fade>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button on:click={back}>
        <ion-icon name="chevron-back" />
      </ion-button>
    </ion-buttons>

    <ion-segment value="music">
      <ion-segment-button value="music" on:click={() => goto("/music")}>
        <ion-icon name="musical-notes" color="main" />
        <ion-label>Music</ion-label>
      </ion-segment-button>
      <ion-segment-button value="library" on:click={() => goto("/library")}>
        <ion-icon name="library" />
        <ion-label>Library</ion-label>
      </ion-segment-button>
      <ion-segment-button value="settings" on:click={() => goto("/settings")}>
        <ion-icon name="settings" />
        <ion-label>Settings</ion-label>
      </ion-segment-button>
    </ion-segment>

    <ion-buttons slot="end">
      <ion-button on:click={forward}>
        <ion-icon name="chevron-forward" />
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
