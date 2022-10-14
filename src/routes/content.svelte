<script lang="ts">
  import type { Components } from "@ionic/core";
  import BackButton from "./back-button.svelte";
  import { scrollElement } from "~/store/scroll-element";

  let content: Components.IonContent;
  $: if (content && !$scrollElement) {
    content.getScrollElement().then((element) => {
      scrollElement.set(element);
    });
  }
</script>

<ion-content bind:this={content}>
  <slot />
  <BackButton />
</ion-content>

<style>
  ion-content {
    --padding-bottom: 150px;
  }
</style>
