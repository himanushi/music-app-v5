<script lang="ts">
  import "~/theme/variables.css";
  import "~/theme/custom.css";
  import ChangePage from "./change-page.svelte";
  import Content from "./content.svelte";
  import Footer from "./footer.svelte";
  import Initializer from "~/components/initializer/initializer.svelte";
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
