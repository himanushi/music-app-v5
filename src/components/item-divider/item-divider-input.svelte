<script lang="ts">
  import type { InputChangeEventDetail, IonInputCustomEvent } from "@ionic/core";
  import type { Input } from "./item-divider";

  export let item: Input;

  const onChange = (event: IonInputCustomEvent<InputChangeEventDetail>) =>
    item.onChange(event.detail.value);
</script>

<ion-item>
  <ion-label position="stacked">{item.label}</ion-label>
  <ion-input value={item.value} on:ionChange={onChange} />
</ion-item>
