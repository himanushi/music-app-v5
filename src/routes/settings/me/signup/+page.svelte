<script lang="ts">
  import { ApolloError } from "@apollo/client/core";
  import { goto } from "$app/navigation";
  import InputCheckbox from "~/components/input-checkbox.svelte";
  import InputText from "~/components/input-item.svelte";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
  import Messages from "~/components/messages.svelte";
  import { client } from "~/graphql/client";
  import { SignupDocument, MeDocument } from "~/graphql/types";
  import { errorMessages } from "~/lib/error";
  import { openToast } from "~/lib/ionicController";

  let name: string;
  let username: string;
  let newPassword: string;
  let newPasswordConfirmation: string;
  let messages: Record<string, string[]> = {};
  let term: boolean;
  let disabled = false;

  const signup = async () => {
    disabled = true;
    try {
      await client.mutate({
        mutation: SignupDocument,
        refetchQueries: [{ query: MeDocument }],
        variables: {
          input: {
            name,
            newPassword,
            newPasswordConfirmation,
            username,
          },
        },
      });

      openToast({
        color: "main",
        duration: 8000,
        message: "登録しました。音楽を楽しみましょう！",
      });

      goto("/");
    } catch (error) {
      disabled = false;

      if (error instanceof ApolloError) {
        messages = errorMessages(error);
      }
    }
  };

  const openTerms = () => {
    modal.isOpen = false;
    modal.isOpen = true;
  };

  let modal: HTMLIonModalElement;
</script>

<ion-list>
  <ion-item-group>
    <ItemDivider title="ユーザー登録" />
    <form on:submit|preventDefault>
      <InputText errorMessages={messages.name} label="名前(変更可能)" bind:value={name} />
      <InputText
        autocomplete="username"
        errorMessages={messages.username}
        label="ユーザーID(変更不可, 半角英数 と _ のみ)"
        bind:value={username}
      />
      <InputText
        autocomplete="new-password"
        errorMessages={messages.newPassword}
        label="パスワード(8文字以上, 半角英数)"
        type="password"
        bind:value={newPassword}
      />
      <InputText
        errorMessages={messages.newPasswordConfirmation}
        label="パスワード再確認"
        type="password"
        bind:value={newPasswordConfirmation}
      />

      <ion-item button on:click={openTerms}>
        <ion-icon name="document-text-outline" slot="start" color="yellow" />
        <ion-label>利用規約はこちら</ion-label>
      </ion-item>

      <InputCheckbox label="利用規約に同意する" bind:checked={term} />

      <ion-item
        button
        disabled={!term || !name || !newPassword || !newPasswordConfirmation || disabled}
        on:click={signup}
      >
        <ion-icon name="person-add-outline" slot="start" color="green" />
        <ion-label>登録</ion-label>
      </ion-item>
      <Messages messages={messages._} type="error" />
    </form>
  </ion-item-group>
</ion-list>

<ion-modal bind:this={modal}>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-title> a </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content />
    <ion-footer>
      <ion-toolbar>
        <ion-title> b </ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-content>
</ion-modal>
