<script lang="ts">
  import { goto } from "$app/navigation";
  import SquareImage from "~/components/square-image.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";

  export let item: MusicKit.LibraryAlbums;
</script>

<ion-item button detail={false} on:click={() => goto(`/library/albums/${item.id}`)}>
  <ion-thumbnail slot="start">
    <SquareImage
      src={convertImageUrl({
        px: 300,
        url: item.attributes.artwork?.url,
      })}
    />
  </ion-thumbnail>
  <ion-label>{item.attributes.name}</ion-label>
  <ion-buttons slot="end">
    <ion-icon name="heart-outline" slot="icon-only" />
  </ion-buttons>
</ion-item>
