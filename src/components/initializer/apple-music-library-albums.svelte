<script lang="ts">
  import { accountService } from "~/machines/apple-music-account-machine";
  import { libraryAlbumsService } from "~/machines/apple-music-library-albums-machine";

  $: if ($accountService && $accountService.matches("authorized")) {
    libraryAlbumsService.send("LOAD");
  }
</script>
