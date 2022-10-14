<script lang="ts">
  import { Capacitor } from "@capacitor/core";
  import AppleMusicIosAccount from "./apple-music-ios-account.svelte";
  import AppleMusicLibraryAlbums from "~/components/initializer/apple-music-library-albums.svelte";
  import AppleMusicWebAccount from "~/components/initializer/apple-music-web-account.svelte";
</script>

<AppleMusicLibraryAlbums />
{#if Capacitor.getPlatform() === "web"}
  <AppleMusicWebAccount />
{:else if Capacitor.getPlatform() === "ios"}
  <AppleMusicIosAccount />
{/if}
