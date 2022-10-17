<script lang="ts">
  import "~/theme/variables.css";
  import "~/theme/custom.css";
  import ChangePage from "./change-page.svelte";
  import Content from "./content.svelte";
  import Footer from "./footer.svelte";
  import Initializer from "~/components/initializer/initializer.svelte";
  import { playerService } from "~/machines/apple-music-player-machine";

  $: window.player = $playerService;
</script>

<ChangePage />
<Initializer />
<ion-app>
  <ion-toolbar color="black" />
  <Content>
    <slot />
  </Content>
  <Footer />
</ion-app>
