<script>
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import Icon from "~/components/icon.svelte";

  const back = () => window.history.back();
  const forward = () => window.history.forward();
</script>

<ion-header in:fade>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button on:click={back}>
        <Icon name="chevron_left" fill />
        <ion-ripple-effect type="unbounded" />
      </ion-button>
    </ion-buttons>

    <ion-buttons>
      <ion-segment-button value="music" on:click={() => goto("/music")}>
        <Icon name="music_note" />
        <ion-label>Music</ion-label>
        <ion-ripple-effect type="unbounded" />
      </ion-segment-button>
      <ion-segment-button value="library" on:click={() => goto("/library")}>
        <Icon name="library_music" />
        <ion-label>Library</ion-label>
        <ion-ripple-effect type="unbounded" />
      </ion-segment-button>
      <ion-segment-button value="settings" on:click={() => goto("/settings")}>
        <Icon name="settings" fill />
        <ion-label>Settings</ion-label>
        <ion-ripple-effect type="unbounded" />
      </ion-segment-button>
    </ion-buttons>

    <ion-buttons slot="end">
      <ion-button on:click={forward}>
        <Icon name="chevron_right" fill />
        <ion-ripple-effect type="unbounded" />
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
