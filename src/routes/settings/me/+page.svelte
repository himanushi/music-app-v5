<script lang="ts">
  import AccountButton from "./account-button.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import { mergeMeta } from "~/lib/mergeMeta";
  import { accountService as account } from "~/machines/apple-music-account-machine";
  import { me } from "~/store/me";

  $: meta = mergeMeta<{ label: string }>($account.meta);
  const onClick = () => account.send("LOGIN_OR_LOGOUT");
</script>

<ItemDivider title="User Settings" />

{#if $me?.registered}
  <ion-item>
    <ion-label> ユーザーID </ion-label>
    <ion-note slot="end" color="white">
      {$me.username}
    </ion-note>
  </ion-item>
  <ion-item>
    <ion-label> 名前 </ion-label>
    <ion-note slot="end" color="white">
      {$me.name}
    </ion-note>
  </ion-item>
  <ion-item>
    <ion-label> 権限 </ion-label>
    <ion-note slot="end">
      {$me.role.description}
    </ion-note>
  </ion-item>
{/if}

<AccountButton />

<ItemDivider title="Apple Music" />
<ion-item button on:click={onClick}>
  <ion-icon slot="start" src="/assets/logo-apple-music.svg" />
  <ion-label> Apple Music {meta.label} </ion-label>
</ion-item>
