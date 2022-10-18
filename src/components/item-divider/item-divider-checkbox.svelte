<script lang="ts">
  import type { CheckboxChangeEventDetail, IonCheckboxCustomEvent } from "@ionic/core";
  import type { Checkbox } from "./item-divider";

  export let item: Checkbox;

  const onChange = (event: IonCheckboxCustomEvent<CheckboxChangeEventDetail>) =>
    item.onChange(event.detail.checked);
</script>

<ion-item>
  <ion-label>{item.label}</ion-label>
  <ion-checkbox slot="end" checked={item.checked} color="main" on:ionChange={onChange} />
</ion-item>
