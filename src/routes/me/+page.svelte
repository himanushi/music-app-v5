<script lang="ts">
  import { mergeMeta } from "~/lib/xstate/merge-meta";
  import { accountService as account } from "~/machines/apple-music-account-machine";

  $: meta = mergeMeta<{ label: string }>($account.meta);
  const onClick = () => account.send("LOGIN_OR_LOGOUT");
</script>

<ion-item on:click={onClick}>
  <ion-label> Apple Music {meta.label} </ion-label>
</ion-item>
