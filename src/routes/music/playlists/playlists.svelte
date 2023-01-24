<script lang="ts">
  import ItemCard from "./playlist-item.svelte";
  import Items from "~/components/items.svelte";
  import { PlaylistsDocument } from "~/graphql/types";

  export let variables: any | undefined = undefined;
  export let loaded = false;
</script>

<Items document={PlaylistsDocument} type="playlist" {variables} bind:loaded let:item>
  <ItemCard {item} />
</Items>
