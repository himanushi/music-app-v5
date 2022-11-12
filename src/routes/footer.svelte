<script lang="ts">
  import type { IonModalCustomEvent, ModalBreakpointChangeEventDetail } from "@ionic/core";
  import Menu from "./menu.svelte";
  import PlayerFooter from "./player-footer.svelte";
  import PlayerSwitch from "./player-switch.svelte";

  const min = 0.2;
  const max = 1.0;

  let open = false;
  const creakpointDidChange = (event: IonModalCustomEvent<ModalBreakpointChangeEventDetail>) => {
    open = event.detail.breakpoint === max;
  };

  // eslint-disable-next-line no-undef
  let modal: HTMLIonModalElement;
  const switchBreakpoint = () => {
    modal.setCurrentBreakpoint(open ? min : max);
    open = !open;
  };
</script>

<ion-modal
  bind:this={modal}
  backdrop-breakpoint={1}
  backdrop-dismiss={false}
  breakpoints={[min, max]}
  handle-behavior="cycle"
  initial-breakpoint={min}
  is-open={true}
  show-backdrop={false}
  swipe-to-close={false}
  on:ionBreakpointDidChange={creakpointDidChange}
>
  <ion-content color="dark-gray" force-overscroll={false}>
    {#if open}
      <PlayerSwitch {switchBreakpoint} />
    {:else}
      <PlayerFooter {switchBreakpoint} />
      <Menu />
    {/if}
  </ion-content>
</ion-modal>
