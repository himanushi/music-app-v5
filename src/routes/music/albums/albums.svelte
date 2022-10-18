<script lang="ts">
  import Item from "./item.svelte";
  import Items from "~/components/items.svelte";
  import { AlbumsDocument } from "~/graphql/types";

  export let variables: any | undefined = undefined;
  export let loaded = false;
</script>

<Items document={AlbumsDocument} type="album" {variables} bind:loaded let:item>
  <Item {item} />
</Items>
