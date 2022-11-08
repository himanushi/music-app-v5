<script lang="ts">
  // ref: https://github.com/Prinzhorn/better-svelte-virtual-list
  import { onMount } from "svelte";
  import { scrollElement } from "~/store/scroll-element";

  // ref: https://github.com/sveltejs/language-tools/issues/273#issuecomment-1003496094
  // eslint-disable-next-line no-undef
  type T = $$Generic;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  interface $$Slots {
    default: {
      // slot name
      item: T;
      index: number;
    };
  }
  export let items: T[] = [];
  export let thumbnail = false;
  export let itemHeight = thumbnail ? 60 : 48.4;

  const dummySymbol = Symbol("dummy item");

  let scrollTop: number;
  let visibleHeight: number;
  let virtualElement: HTMLElement;

  const sliceArray = (arr: any[], start: number, end: number) => {
    const sliceArr = arr.slice(start, end);
    const expectedLength = end - start;
    while (sliceArr.length < expectedLength) {
      sliceArr.push(dummySymbol);
    }

    return sliceArr;
  };

  const shiftArray = (arr: any[], count: number) => {
    for (let index = 0; index < count; index += 1) {
      arr.unshift(arr.pop());
    }
    return arr;
  };

  $: if ($scrollElement) {
    const maxHeight = items.length * itemHeight;
    if ($scrollElement.clientHeight > maxHeight) {
      visibleHeight = maxHeight;
    } else {
      visibleHeight = $scrollElement.clientHeight;
    }
  }

  $: spacerHeight = Math.max(visibleHeight, items.length * itemHeight);
  $: numItems = Math.ceil(visibleHeight / itemHeight) + 15;
  $: startIndex = Math.floor(scrollTop / itemHeight);
  $: endIndex = startIndex + numItems;
  $: numOverlap = startIndex % numItems;
  $: blockHeight = numItems * itemHeight;
  $: globalOffset = blockHeight * Math.floor(scrollTop / blockHeight);
  $: slice = shiftArray(sliceArray(items, startIndex, endIndex), numOverlap);

  onMount(() => {
    let frame: number;

    const loop = () => {
      if (virtualElement && $scrollElement && $scrollElement.scrollTop !== scrollTop) {
        if ($scrollElement.scrollTop - virtualElement.offsetTop >= 0) {
          scrollTop = $scrollElement.scrollTop - virtualElement.offsetTop || 1;
        } else {
          scrollTop = 1;
        }
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frame);
  });

  const calcIndex = (index: number) => {
    let result = 0;

    if (index >= numOverlap) {
      result = index - numOverlap + startIndex;
    } else {
      result = numItems - numOverlap + index + startIndex;
    }

    return result;
  };
</script>

<div
  bind:this={virtualElement}
  style="height: {spacerHeight}px;"
  class="spacer"
  tabindex="-1"
  on:keydown
  on:wheel
>
  {#each slice as item, index (`${item.id}_${index}`)}
    <div
      style={`top: ${
        globalOffset + (index < numOverlap ? blockHeight : 0)
      }px;height: ${itemHeight}px;`}
      class="item"
    >
      {#if item !== dummySymbol}
        <slot index={calcIndex(index)} {item} />
      {/if}
    </div>
  {/each}
</div>

<style>
  .spacer {
    width: 100%;
    overflow: hidden;
    font-size: 0;
  }

  .item {
    position: relative;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
