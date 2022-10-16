<script lang="ts">
  import { goto } from "$app/navigation";
  import ItemDivider from "~/components/item-divider.svelte";
</script>

<ion-list>
  <ItemDivider title="Settings" />
  <ion-item button on:click={() => goto("/settings/me")}>
    <ion-label> 設定 </ion-label>
  </ion-item>
</ion-list>
