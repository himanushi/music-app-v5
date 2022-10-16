<script lang="ts">
  import { goto } from "$app/navigation";
  import ItemDivider from "~/components/item-divider.svelte";
</script>

<ion-list>
  <ItemDivider title="Music" />
  <ion-item button on:click={() => goto("/music/me")}>
    <ion-label> アルバムを探す </ion-label>
  </ion-item>
</ion-list>
