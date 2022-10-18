<script lang="ts">
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import { mergeMeta } from "~/lib/mergeMeta";
  import { accountService as account } from "~/machines/apple-music-account-machine";

  $: meta = mergeMeta<{ label: string }>($account.meta);
  const onClick = () => account.send("LOGIN_OR_LOGOUT");
</script>

<ItemDivider title="Settings" />
<ion-item button on:click={onClick}>
  <ion-label> Apple Music {meta.label} </ion-label>
</ion-item>
