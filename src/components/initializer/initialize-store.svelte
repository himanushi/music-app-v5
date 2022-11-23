<script lang="ts">
  import { onMount } from "svelte";
  import { favorites, storeId, type FavoriteType } from "~/store/favorites";
  import { store } from "~/store/store";

  onMount(async () => {
    favorites.remember((await store.get(storeId)) as FavoriteType);
  });
</script>
