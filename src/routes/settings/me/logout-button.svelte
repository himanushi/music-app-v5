<script lang="ts">
  import { ApolloError } from "@apollo/client/core";
  import { goto } from "$app/navigation";
  import Messages from "~/components/messages.svelte";
  import { client } from "~/graphql/client";
  import { LogoutDocument, MeDocument } from "~/graphql/types";
  import { errorMessages } from "~/lib/error";
  import { openToast } from "~/lib/ionicController";

  let messages: Record<string, string[]> = {};
  let disabled = false;

  const logout = async () => {
    disabled = true;
    try {
      await client.mutate({
        mutation: LogoutDocument,
        refetchQueries: [{ query: MeDocument }],
        variables: { input: {} },
      });

      openToast({
        color: "main",
        duration: 3000,
        message: "ログアウトしました",
      });

      goto("/me");
    } catch (error) {
      disabled = false;

      if (error instanceof ApolloError) {
        messages = errorMessages(error);
      }
    }
  };
</script>

<ion-item button {disabled} on:click={logout}>
  <ion-icon name="exit-outline" slot="start" color="red" />
  ログアウト
</ion-item>
<Messages messages={messages._} type="error" />
