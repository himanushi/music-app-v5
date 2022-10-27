<script lang="ts">
  import type { AutocompleteTypes, InputChangeEventDetail, TextFieldTypes } from "@ionic/core";
  import Messages from "./messages.svelte";

  export let placeholder: string | undefined = undefined;
  export let label = "";
  export let errorMessages: string[] | undefined = undefined;
  export let value = "";
  export let type: TextFieldTypes | undefined = undefined;
  export let autocomplete: AutocompleteTypes | undefined = undefined;

  const onChange = (event: CustomEvent<InputChangeEventDetail>) => {
    if (event.detail.value) {
      value = event.detail.value;
    }
  };
</script>

<ion-item>
  <ion-label position="stacked">{label}</ion-label>
  <ion-input {autocomplete} {placeholder} {type} {value} on:ionChange={onChange} />
</ion-item>
{#if errorMessages}
  <Messages messages={errorMessages} type="error" />
{/if}
