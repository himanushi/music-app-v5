<script lang="ts">
  import { v4 as uuid } from "uuid";
  import type { Menu } from "./item-divider";
  import ItemDividerCheckbox from "./item-divider-checkbox.svelte";
  import ItemDividerInput from "./item-divider-input.svelte";
  import ItemDividerSelect from "./item-divider-select.svelte";
  import { scrollElement } from "~/store/scroll-element";

  export let title: string;
  export let height = 44;
  export let menu: Menu | undefined = undefined;

  const popoverId = menu ? uuid() : "";
  let popup: HTMLIonPopoverElement;
  const onOk = () => {
    popup.dismiss();
    if (menu?.onOk) {
      menu.onOk();
    }
    if ($scrollElement) {
      $scrollElement.scrollTop = 0;
    }
  };
</script>

<ion-item-divider style="height: {height}px" color="dark-gray" sticky>
  <ion-note> {title} </ion-note>
  {#if menu}
    <ion-buttons slot="end">
      <ion-button id={popoverId}>
        <ion-icon name="ellipsis-vertical" />
      </ion-button>
      <ion-popover bind:this={popup} color="dark-gray" trigger={popoverId} trigger-action="click">
        <ion-content>
          <ion-list>
            <ion-item lines={"none"}>
              <ion-note>{menu.title}</ion-note>
            </ion-item>
            {#each menu.items as item}
              {#if item.type === "input"}
                <ItemDividerInput {item} />
              {:else if item.type === "checkbox"}
                <ItemDividerCheckbox {item} />
              {:else if item.type === "select"}
                <ItemDividerSelect {item} />
              {/if}
            {/each}
          </ion-list>
          <ion-item button color="main" detail on:click={onOk}>OK</ion-item>
        </ion-content>
      </ion-popover>
    </ion-buttons>
  {/if}
</ion-item-divider>
