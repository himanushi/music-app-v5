<script lang="ts">
  export let length = 1;
</script>

{#each [...Array(length)] as _}
  <ion-item>
    <ion-label>
      <ion-skeleton-text />
    </ion-label>
  </ion-item>
{/each}
