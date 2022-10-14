<script lang="ts">
  import { onMount } from "svelte";
  import { accountService } from "~/machines/apple-music-account-machine";

  onMount(() => {
    accountService.send("CHECKING");
  });
</script>
