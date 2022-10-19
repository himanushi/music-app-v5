<script lang="ts">
  import type { ApolloQueryResult } from "@apollo/client";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import CenterItem from "~/components/center-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import { client } from "~/graphql/client";
  import { ArtistDocument, type ArtistObject, type ArtistQuery } from "~/graphql/types";
  import { convertImageUrl } from "~/lib/convertImageUrl";

  export let data: PageData;

  let artist: ArtistObject | undefined = undefined;
  let result: ApolloQueryResult<ArtistQuery>;

  $: if (result?.data?.artist) {
    artist = result.data.artist as ArtistObject;
  }

  onMount(async () => {
    result = await client.query({
      fetchPolicy: "cache-first",
      query: ArtistDocument,
      variables: { id: data.id },
    });
  });
</script>

<ion-item-group>
  <ItemDivider title="Artist" />
  <CenterItem>
    <SquareImage
      src={convertImageUrl({
        px: 300,
        url: artist?.artworkL?.url,
      })}
    />
  </CenterItem>
  <ion-item>
    <ion-label>
      {artist?.name}
    </ion-label>
  </ion-item>
</ion-item-group>
