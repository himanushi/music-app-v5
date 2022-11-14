<script lang="ts">
  import "~/theme/variables.css";
  import "~/theme/custom.css";
  import { initialize } from "@ionic/core";
  import { onMount } from "svelte";
  import ChangePage from "./change-page.svelte";
  import Content from "./content.svelte";
  import Footer from "./footer.svelte";
  import Initializer from "~/components/initializer/initializer.svelte";

  onMount(() => {
    initialize({
      animated: true,
      mode: "ios",
    });
  });
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
