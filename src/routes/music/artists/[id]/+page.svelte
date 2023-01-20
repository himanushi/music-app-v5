<script lang="ts">
  import AlbumItem from "../../albums/album-item.svelte";
  import type { PageData } from "./$types";
  import CenterItem from "~/components/center-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import VirtualScroll from "~/components/virtual-scroll.svelte";
  import type { AlbumObject, ArtistObject, StatusEnum } from "~/graphql/types";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { accountService } from "~/machines/apple-music-account-machine";

  export let data: PageData;

  let artist: ArtistObject | undefined;
  let albums: AlbumObject[] = [];
  const status: StatusEnum[] = ["ACTIVE"];

  $: if (!artist && $accountService && $accountService.matches("authorized")) {
    data.getItems({
      callback: (items) => {
        artist = items.artist;
        albums = items.albums;
      },
      id: data.id,
      status,
    });
  }
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

  <ItemDivider title="Albums" />
  <VirtualScroll items={albums} thumbnail let:item>
    <AlbumItem {item} />
  </VirtualScroll>
</ion-item-group>
