<script lang="ts">
  import type { IonRangeCustomEvent, RangeKnobMoveStartEventDetail } from "@ionic/core";

  import { tweened } from "svelte/motion";
  import { playerService } from "~/machines/apple-music-player-machine";

  // seek を滑らかに動かす
  const seek = tweened(0, {
    duration: (from, to) => {
      // seek が大幅に動いた時は滑らかでは不自然なので無効にする
      const tick = 1000;
      const diff = Math.abs(to - from);

      if (diff > tick + 500) {
        return 0;
      }

      return tick;
    },
  });

  $: disabled = $playerService.value === "loading";

  $: if ($playerService) {
    seek.set($playerService.context.seek);
  }

  const toMMSS = (duration: number) => {
    const sec = Math.floor(duration / 1000);
    const minutes = Math.floor(sec / 60);
    const seconds = sec - minutes * 60;

    const padding = (num: number) => `0${num}`.slice(-2);

    return `${padding(minutes)}:${padding(seconds)}`;
  };

  let seeking = false;
  let seekValue = 0;

  const onStart = (event: IonRangeCustomEvent<RangeKnobMoveStartEventDetail>) => {
    seeking = true;

    if (playerService && typeof event.detail.value === "number") {
      seekValue = event.detail.value;
    }
  };

  const onStop = (event: IonRangeCustomEvent<RangeKnobMoveStartEventDetail>) => {
    seeking = false;

    if (playerService && typeof event.detail.value === "number") {
      playerService.send({
        seek: event.detail.value,
        type: "CHANGE_SEEK",
      });
    }
  };

  $: seekValue = seeking ? seekValue : $seek;

  // eslint-disable-next-line no-undef
  let ionRange: HTMLIonRangeElement | undefined;
  $: if (ionRange && !ionRange.pinFormatter) {
    // eslint-disable-next-line no-shadow
    const pinFormatter = (value: number) => toMMSS(value);
    ionRange.pinFormatter = pinFormatter;
  }
</script>

{#if $playerService}
  <ion-item color="dark-gray" lines="none">
    <ion-note slot="start">{toMMSS($playerService.context.seek)}</ion-note>
    <ion-note slot="end">{toMMSS($playerService.context.currentTrack?.durationMs ?? 0)}</ion-note>
  </ion-item>
  <ion-range
    bind:this={ionRange}
    {disabled}
    max={$playerService.context.currentTrack?.durationMs ?? 0}
    min={0}
    pin
    value={seekValue}
    on:ionKnobMoveStart={onStart}
    on:ionKnobMoveEnd={onStop}
  />
{/if}

<style lang="scss">
  ion-range {
    padding: 0 20px;
    --bar-height: 15px;
    --bar-border-radius: 2px;
    --bar-background-active: #14b8a6;
    --knob-background: #14b8a6;
    --knob-size: 15px;
    --knob-box-shadow: none;
    --knob-border-radius: 2px;
  }
</style>