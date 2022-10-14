<script lang="ts">
  import { goto } from "$app/navigation";
</script>

<ion-item button on:click={() => goto("/me")}>
  <ion-icon name="add-circle-outline" />
  <ion-label>Main Content</ion-label>
</ion-item>

<ion-item button on:click={() => goto("/library-albums")}>
  <ion-icon name="add-circle-outline" />
  <ion-label>Library Albums</ion-label>
</ion-item>
