<script lang="ts">
  import { goto } from "$app/navigation";
  import FavoriteButton from "~/components/favorite-button.svelte";
  import SquareImage from "~/components/square-image.svelte";
  import { convertImageUrl } from "~/lib/convertImageUrl";
  import { isFavorite } from "~/lib/isFavorite";
  import { favorites } from "~/store/favorites";

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
    <FavoriteButton id={item.id} categoryType="albums" favorite={isFavorite($favorites, item.id)} />
  </ion-buttons>
</ion-item>
