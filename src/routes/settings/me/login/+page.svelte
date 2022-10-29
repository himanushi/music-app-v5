<script lang="ts">
  import { ApolloError } from "@apollo/client/core";
  import { goto } from "$app/navigation";
  import InputText from "~/components/input-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import Messages from "~/components/messages.svelte";
  import { client } from "~/graphql/client";
  import { LoginDocument, MeDocument } from "~/graphql/types";
  import { errorMessages } from "~/lib/error";
  import { openToast } from "~/lib/ionicController";

  let currentPassword: string;
  let username: string;
  let messages: Record<string, string[]> = {};
  let disabled = false;

  const login = async () => {
    disabled = true;
    try {
      await client.mutate({
        mutation: LoginDocument,
        refetchQueries: [{ query: MeDocument }],
        variables: {
          input: {
            currentPassword,
            username,
          },
        },
      });

      openToast({
        color: "main",
        duration: 5000,
        message: "ログインしました",
      });

      goto("/settings/me");
    } catch (error) {
      disabled = false;

      if (error instanceof ApolloError) {
        messages = errorMessages(error);
      }
    }
  };
</script>

<ion-list>
  <ion-item-group>
    <ItemDivider title="Login" />
    <form on:submit|preventDefault>
      <InputText
        autocomplete="username"
        errorMessages={messages.username}
        label="ユーザー名"
        bind:value={username}
      />
      <InputText
        autocomplete="current-password"
        errorMessages={messages.currentPassword}
        label="パスワード"
        type="password"
        bind:value={currentPassword}
      />
      <ion-item button {disabled} on:click={login}>
        <ion-icon name="log-in-outline" slot="start" color="blue" />
        <ion-label>ログイン</ion-label>
      </ion-item>
      <Messages messages={messages._} type="error" />
    </form>
  </ion-item-group>
</ion-list>
