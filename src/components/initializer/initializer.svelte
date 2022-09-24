<script lang="ts">
  import { Capacitor } from "@capacitor/core";
  import AppleMusicLibraryAlbums from "~/components/initializer/apple-music-library-albums.svelte";
  import AppleMusicWebAccount from "~/components/initializer/apple-music-web-account.svelte";
</script>

<AppleMusicLibraryAlbums />
{#if Capacitor.getPlatform() === "web"}
  <AppleMusicWebAccount />
{/if}
