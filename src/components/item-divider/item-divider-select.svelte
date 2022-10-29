<script lang="ts">
  import type { IonSelectCustomEvent, SelectChangeEventDetail } from "@ionic/core";
  import type { Option, Select } from "./item-divider";

  export let item: Select;

  const onChange = (event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) =>
    item.onChange(event.detail as Option);
</script>

<ion-item>
  <ion-label position="stacked">{item.label}</ion-label>
  <ion-select
    cancel-text="キャンセル"
    interface="action-sheet"
    value={item.value}
    on:ionChange={onChange}
  >
    {#each item.options as option}
      <ion-select-option value={option.value}>{option.label}</ion-select-option>
    {/each}
  </ion-select>
</ion-item>
