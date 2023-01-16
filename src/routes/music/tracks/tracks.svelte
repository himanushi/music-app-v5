<script lang="ts">
  import ItemCard from "./track-item.svelte";
  import Items from "~/components/items.svelte";
  import { TracksDocument } from "~/graphql/types";
  import { toTrackItem } from "~/lib/toTrackItem";

  export let variables: any | undefined = undefined;
  export let loaded = false;
</script>

<Items document={TracksDocument} type="track" {variables} bind:loaded let:index let:item let:items>
  <ItemCard
    ids={items.map((it) => toTrackItem(it)).map((it) => it.id)}
    {index}
    item={toTrackItem(item)}
  />
</Items>
