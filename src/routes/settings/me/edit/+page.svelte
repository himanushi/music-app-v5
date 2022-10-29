<script lang="ts">
  import { ApolloError } from "@apollo/client/core";
  import { goto } from "$app/navigation";
  import InputText from "~/components/input-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import Messages from "~/components/messages.svelte";
  import { client } from "~/graphql/client";
  import { UpdateMeDocument, MeDocument, ChangePasswordDocument } from "~/graphql/types";
  import { errorMessages } from "~/lib/error";
  import { openToast } from "~/lib/ionicController";

  export let name: string;
  let currentPassword: string;
  let newPassword: string;
  let newPasswordConfirmation: string;
  let messages: Record<string, string[]> = {};
  let disabled = false;

  const updateMe = async () => {
    disabled = true;
    try {
      await client.mutate({
        mutation: UpdateMeDocument,
        refetchQueries: [{ query: MeDocument }],
        variables: {
          input: {
            name,
          },
        },
      });

      openToast({
        color: "main",
        duration: 5000,
        message: "更新しました",
      });

      goto("/settings/me");
    } catch (error) {
      disabled = false;

      if (error instanceof ApolloError) {
        messages = errorMessages(error);
      }
    }
  };

  const changePassword = async () => {
    disabled = true;
    try {
      await client.mutate({
        mutation: ChangePasswordDocument,
        variables: {
          input: {
            currentPassword,
            newPassword,
            newPasswordConfirmation,
          },
        },
      });

      openToast({
        color: "main",
        duration: 5000,
        message: "更新しました",
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
    <ItemDivider title="User" />
    <InputText
      autocomplete="nickname"
      errorMessages={messages.name}
      label="名前"
      bind:value={name}
    />
    <ion-item button {disabled} on:click={updateMe}>
      <ion-icon name="build-outline" slot="start" />
      更新する
    </ion-item>
    <Messages messages={messages._} type="error" />

    <ItemDivider title="Password" />
    <form on:submit|preventDefault>
      <InputText
        autocomplete="current-password"
        errorMessages={messages.currentPassword}
        label="現在のパスワード"
        type="password"
        bind:value={currentPassword}
      />
      <InputText
        autocomplete="new-password"
        errorMessages={messages.newPassword}
        label="新しいパスワード"
        type="password"
        bind:value={newPassword}
      />
      <InputText
        autocomplete="new-password"
        errorMessages={messages.newPasswordConfirmation}
        label="新しいパスワード再確認"
        type="password"
        bind:value={newPasswordConfirmation}
      />
      <ion-item button {disabled} on:click={changePassword}>
        <ion-icon name="build-outline" slot="start" />
        更新する
      </ion-item>
      <Messages messages={messages._} type="error" />
    </form>
  </ion-item-group>
</ion-list>
