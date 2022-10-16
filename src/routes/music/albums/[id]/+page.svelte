<script lang="ts">
  import type { ApolloQueryResult } from "@apollo/client";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import CenterItem from "~/components/center-item.svelte";
  import ItemDivider from "~/components/item-divider.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import { client } from "~/graphql/client";
  import {
    AlbumDocument,
    type AlbumObject,
    type AlbumQuery,
    type TrackObject,
  } from "~/graphql/types";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import Item from "~/routes/music/tracks/item.svelte";

  export let data: PageData;

  let album: AlbumObject;
  let tracks: TrackObject[] = [];
  let result: ApolloQueryResult<AlbumQuery>;

  $: if (result?.data?.album) {
    album = result.data.album as AlbumObject;
    tracks = album.tracks.map((track) => track);
  }

  onMount(async () => {
    result = await client.query({
      fetchPolicy: "cache-first",
      query: AlbumDocument,
      variables: { id: data.id },
    });
  });
</script>

<ion-item-group>
  <ItemDivider title="Album" />
  <CenterItem>
    <SquareImage
      src={convertImageUrl({
        px: 300,
        url: album?.artworkL?.url,
      })}
    />
  </CenterItem>

  <ItemDivider title="Tracks" />
  <VirtualScroll itemHeight={44} items={tracks} let:index let:item>
    <Item {index} {item} items={tracks} viewImage={false} />
  </VirtualScroll>
</ion-item-group>
