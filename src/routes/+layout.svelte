<script lang="ts">
  import "~/theme/variables.css";
  import "~/theme/custom.css";
  import ChangePage from "./change-page.svelte";
  import Content from "./content.svelte";
  import Player from "./player.svelte";
  import Initializer from "~/components/initializer/initializer.svelte";
</script>

<ChangePage />
<Initializer />
<ion-app>
  <ion-header>
    <ion-toolbar>
      <ion-title>ゲーム音楽 Light</ion-title>
    </ion-toolbar>
  </ion-header>
  <Content>
    <slot />
    <Player />
  </Content>
</ion-app>
