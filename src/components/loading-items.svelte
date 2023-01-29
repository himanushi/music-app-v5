<script lang="ts">
  export let count = 1;
</script>

{#each new Array(count) as _item}
  <ion-item>
    <ion-skeleton-text animated />
  </ion-item>
{/each}
