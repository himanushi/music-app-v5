<script lang="ts">
  import type { Components } from "@ionic/core";
  import { scrollElement } from "~/store/scroll-element";

  let content: Components.IonContent;
  $: if (content && !$scrollElement) {
    content.getScrollElement().then((element) => {
      scrollElement.set(element);
    });
  }
</script>

<ion-content bind:this={content} fullscreen>
  <slot />
</ion-content>

<style>
  ion-content {
    --padding-bottom: 76px;
  }
</style>
