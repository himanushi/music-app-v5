<script lang="ts">
  import "~/theme/variables.css";
  import "~/theme/custom.css";
  import Initializer from "~/components/initializer/initializer.svelte";
</script>

<Initializer />
<ion-app>
  <ion-header>
    <ion-toolbar>
      <ion-title>Header</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <slot />
  </ion-content>
  <ion-footer>
    <ion-toolbar color="main">
      <ion-title>Footer</ion-title>
    </ion-toolbar>
  </ion-footer>
</ion-app>
