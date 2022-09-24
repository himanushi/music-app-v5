<script lang="ts">
  import { onMount } from "svelte";
  import { client } from "~/graphql/client";
  import { AppleMusicTokenDocument } from "~/graphql/types";
  import { accountService } from "~/machines/apple-music-account-machine";

  onMount(async () => {
    const res = await client.query({
      query: AppleMusicTokenDocument,
    });

    accountService.send({
      config: {
        app: {
          build: "5.0.1",
          name: "video-game-music.net",
        },
        developerToken: res.data.appleMusicToken,
      },
      type: "SET_TOKEN",
    });
  });
</script>
