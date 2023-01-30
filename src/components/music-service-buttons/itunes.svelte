<script lang="ts">
  import { appleAffiliateToken } from "~/lib/variable";

  export let id: string;
  export let libraryAlbum: MusicKit.LibraryAlbums | undefined = undefined;

  let token = "";
  if (appleAffiliateToken) {
    token = `&at=${appleAffiliateToken}`;
  }
</script>

<ion-item button href={`itmss://music.apple.com/jp/album/${id}?app=itunes${token}`} target="_blank">
  <ion-icon slot="start" src="/assets/logo-itunes.svg" />
  iTunes で聴く
  {#if libraryAlbum}
    (購入済み)
  {:else}
    (未購入)
  {/if}
</ion-item>
