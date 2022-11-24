<script lang="ts">
  import { goto } from "$app/navigation";
  import FavoriteButton from "~/components/favorite-button.svelte";
  import { isFavorite } from "~/lib/isFavorite";
  import { favorites } from "~/store/favorites";

  export let item: MusicKit.LibraryArtists;
</script>

<ion-item button detail={false} on:click={() => goto(`/library/artists/${item.id}`)}>
  <ion-label>{item.attributes.name}</ion-label>
  <ion-buttons>
    <FavoriteButton
      id={item.id}
      categoryType="artists"
      favorite={isFavorite($favorites, item.id)}
    />
  </ion-buttons>
</ion-item>
