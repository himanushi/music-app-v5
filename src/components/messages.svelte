<script lang="ts">
  import Icon from "./icon.svelte";
  import type { IconNames } from "~/@types/icon";

  export let type: "info" | "warn" | "error" = "info";
  export let messages: string[] | undefined;

  let color = "";
  let name: IconNames;

  $: if (type === "info") {
    color = "blue";
    name = "info";
  } else if (type === "warn") {
    color = "yellow";
    name = "warning";
  } else if (type === "error") {
    color = "red";
    name = "warning";
  }
</script>

{#if messages}
  {#each messages as message}
    <ion-item>
      <Icon {name} {color} start />
      <ion-label class="ion-text-wrap">{message}</ion-label>
    </ion-item>
  {/each}
{/if}
