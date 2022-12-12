<script lang="ts">
  import { onMount } from "svelte";
  import { favorites, favoritesStoreId, type FavoriteType } from "~/store/favorites";
  import { store } from "~/store/store";

  onMount(async () => {
    favorites.remember((await store.get(favoritesStoreId)) as FavoriteType);
  });
</script>
