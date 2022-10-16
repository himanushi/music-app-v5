<script lang="ts">
  import { goto } from "$app/navigation";
  import ItemDivider from "~/components/item-divider.svelte";
</script>

<ion-list>
  <ItemDivider title="Library" />
  <ion-item button on:click={() => goto("/library/albums")}>
    <ion-label> ライブラリアルバム </ion-label>
  </ion-item>
</ion-list>
