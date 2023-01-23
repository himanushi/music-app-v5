<script lang="ts">
  import ItemCard from "./playlist-item.svelte";
  import Items from "~/components/items.svelte";
  import { PlaylistsDocument } from "~/graphql/types";
  import { toTrackItem } from "~/lib/toTrackItem";
  import { limitTrackCount } from "~/machines/apple-music-player-machine";

  export let variables: any | undefined = undefined;
  export let loaded = false;
</script>

<Items
  document={PlaylistsDocument}
  type="playlist"
  {variables}
  bind:loaded
  let:index
  let:item
  let:items
>
  <div>
    {item}
  </div>
  <!-- <ItemCard
    ids={items.
      map((it) => toTrackItem(it)).
      map((it) => it.id).
      slice(index, index + limitTrackCount)}
    index={0}
    item={toTrackItem(item)}
  /> -->
</Items>
