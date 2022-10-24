<script lang="ts">
  import { goto } from "$app/navigation";

  export let item: MusicKit.LibraryArtists;
</script>

<ion-item button detail={false} on:click={() => goto(`/library/artists/${item.id}`)}>
  <ion-label>{item.attributes.name}</ion-label>
</ion-item>
