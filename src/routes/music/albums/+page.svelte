<script lang="ts">
  import type { PageData } from "./$types";
  import Albums from "./albums.svelte";
  import Refresher from "~/components/refresher.svelte";
  import { client } from "~/graphql/client";

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

<Refresher {refresh} bind:loaded />

<ion-item-group>
  <ion-item-divider sticky>
    <ion-label>Albums</ion-label>
  </ion-item-divider>
  <ion-list>
    {#key tggle}
      <Albums params={data.params} bind:loaded />
    {/key}
  </ion-list>
</ion-item-group>
