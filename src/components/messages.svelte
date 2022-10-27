<script lang="ts">
  export let type: "info" | "warn" | "error" = "info";
  export let messages: string[] | undefined;
  let color = "";
  let iconName = "";

  $: if (type === "info") {
    color = "blue";
    iconName = "information-circle-outline";
  } else if (type === "warn") {
    color = "yellow";
    iconName = "alert-circle-outline";
  } else if (type === "error") {
    color = "red";
    iconName = "alert-circle-outline";
  }
</script>

{#if messages}
  {#each messages as message}
    <ion-item>
      <ion-icon name={iconName} slot="start" {color} />
      <ion-label class="ion-text-wrap">{message}</ion-label>
    </ion-item>
  {/each}
{/if}
