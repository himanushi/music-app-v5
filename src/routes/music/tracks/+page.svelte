<script lang="ts">
  import { clearCache } from "./+page";
  import SearchDivider from "./search-divider.svelte";
  import Tracks from "./tracks.svelte";
  import Refresher from "~/components/refresher.svelte";
  import { isAllowed } from "~/lib/me";
  import { me } from "~/store/me";

  let toggle = true;
  let loaded = false;

  const refresh = () => {
    clearCache();
    toggle = !toggle;
  };
</script>

{#if $me && isAllowed($me, "tracks")}
  <Refresher {refresh} bind:loaded />
  <ion-item-group>
    <SearchDivider {refresh} />
    <ion-list>
      {#key toggle}
        <Tracks bind:loaded />
      {/key}
    </ion-list>
  </ion-item-group>
{/if}
