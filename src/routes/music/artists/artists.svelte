<script lang="ts">
  import Item from "./artist-item.svelte";
  import Items from "~/components/items.svelte";
  import { ArtistsDocument } from "~/graphql/types";

  export let variables: any | undefined = undefined;
  export let loaded = false;
</script>

<Items document={ArtistsDocument} type="artist" {variables} bind:loaded let:item>
  <Item {item} />
</Items>
