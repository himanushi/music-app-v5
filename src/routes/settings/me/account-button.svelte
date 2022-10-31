<script lang="ts">
  import LogoutButton from "./logout-button.svelte";
  import { goto } from "$app/navigation";
  import Icon from "~/components/icon.svelte";
  import Messages from "~/components/messages.svelte";
  import { isAllowed } from "~/lib/me";
  import { me } from "~/store/me";

  const go = (path: string) => () => {
    goto(path);
  };
</script>

{#if $me && isAllowed($me, "updateMe") && $me.registered}
  <ion-item button on:click={go("/settings/me/edit")}>
    <Icon name="edit" color="green" start />
    設定を変更する
  </ion-item>
{/if}

{#if $me && isAllowed($me, "logout") && $me.registered}
  <LogoutButton />
{:else if $me && isAllowed($me, "login")}
  <ion-item button on:click={go("/settings/me/login")}>
    <Icon name="login" color="blue" start />
    ログイン
  </ion-item>
  <ion-item button on:click={go("/settings/me/signup")}>
    <Icon name="person_add" color="green" start />
    登録する
  </ion-item>
  <Messages messages={["登録すると Web でもログインできるようになります。"]} />
{/if}
