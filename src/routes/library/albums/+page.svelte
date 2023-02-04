<script lang="ts">
  import type { PageData } from "./$types";
  import LibraryAlbums from "./library-albums.svelte";
  import SearchDivider from "./search-divider.svelte";

  export let data: PageData;

  let toggle = true;

  const refresh = () => {
    toggle = !toggle;
  };
</script>

<ion-list>
  <SearchDivider {refresh} />
  {#if toggle}
    <LibraryAlbums />
  {/if}
</ion-list>
