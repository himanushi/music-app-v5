<script lang="ts">
  import LogoutButton from "./logout-button.svelte";
  import { goto } from "$app/navigation";
  import Messages from "~/components/messages.svelte";
  import { isAllowed } from "~/lib/me";
  import { me } from "~/store/me";

  const go = (path: string) => () => {
    goto(path);
  };
</script>

{#if $me && isAllowed($me, "updateMe") && $me.registered}
  <ion-item button on:click={go("/settings/me/edit")}>
    <ion-icon name="build-outline" slot="start" />
    設定を変更する
  </ion-item>
{/if}

{#if $me && isAllowed($me, "logout") && $me.registered}
  <LogoutButton />
{:else if $me && isAllowed($me, "login")}
  <ion-item button on:click={go("/settings/me/login")}>
    <ion-icon name="log-in-outline" slot="start" color="blue" />
    ログイン
  </ion-item>
  <ion-item button on:click={go("/settings/me/signup")}>
    <ion-icon name="person-add-outline" slot="start" color="green" />
    登録する
  </ion-item>
  <Messages messages={["ログインすると、みんなのプレイリストの作成公開が出来るようになります。"]} />
{/if}
