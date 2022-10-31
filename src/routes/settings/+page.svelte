<script lang="ts">
  import { goto } from "$app/navigation";
  import ItemDivider from "~/components/item-divider/item-divider.svelte";
</script>

<ion-list>
  <ItemDivider title="Settings" />
  <ion-item button on:click={() => goto("/settings/me")}>
    <ion-label> 設定 </ion-label>
  </ion-item>
  <ItemDivider title="About" />
  <ion-item button on:click={() => goto("/settings/about")}>
    <ion-label> このアプリについて </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/settings/terms")}>
    <ion-label> 利用規約 </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/settings/privacy")}>
    <ion-label> プライバシーポリシー </ion-label>
  </ion-item>
  <ion-item button on:click={() => goto("/settings/cookie-policy")}>
    <ion-label> クッキーポリシー </ion-label>
  </ion-item>
</ion-list>
