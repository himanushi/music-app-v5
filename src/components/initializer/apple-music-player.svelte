<script lang="ts">
  import { playerService } from "~/machines/apple-music-player-machine";
  import { playerSeekService } from "~/machines/apple-music-player-seek-machine";

  $: if ($playerService.value === "playing") {
    playerSeekService.send("ACTIVE");
  } else {
    playerSeekService.send("IDLE");
  }
</script>
