<script lang="ts">
  import type { PageData } from "./$types";
  import Albums from "./albums.svelte";
  import ItemDivider from "~/components/item-divider.svelte";
  import Refresher from "~/components/refresher.svelte";
  import { client } from "~/graphql/client";
  import { isAllowed } from "~/lib/me";
  import { me } from "~/store/me";

  export let data: PageData;

  let tggle = true;
  let loaded = false;

  const refresh = () => {
    client.cache.evict({
      fieldName: "albums",
      id: "ROOT_QUERY",
    });

    tggle = !tggle;
  };
</script>

{#if $me && isAllowed($me, "albums")}
  <Refresher {refresh} bind:loaded />
  <ion-item-group>
    <ItemDivider title="Album" />
    <ion-list>
      {#key tggle}
        <Albums params={data.params} bind:loaded />
      {/key}
    </ion-list>
  </ion-item-group>
{/if}
