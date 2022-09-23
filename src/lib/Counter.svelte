<script lang="ts">
  import { spring } from "svelte/motion";

  let count = 0;

  const displayed_count = spring();
  $: displayed_count.set(count);
  $: offset = modulo($displayed_count, 1);

  function modulo (n: number, m: number) {
    // handle negative numbers
    return (n % m + m) % m;
  }
</script>

<div class="counter">
  <button aria-label="Decrease the counter by one" on:click={() => count -= 1}>
    <svg aria-hidden="true" viewBox="0 0 1 1">
      <path d="M0,0.5 L1,0.5" />
    </svg>
  </button>

  <div class="counter-viewport">
    <div style="transform: translate(0, {100 * offset}%)" class="counter-digits">
      <strong class="hidden" aria-hidden="true">{Math.floor($displayed_count + 1)}</strong>
      <strong>{Math.floor($displayed_count)}</strong>
    </div>
  </div>

  <button aria-label="Increase the counter by one" on:click={() => count += 1}>
    <svg aria-hidden="true" viewBox="0 0 1 1">
      <path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
    </svg>
  </button>
</div>

<style>
  .counter {
    display: flex;
    margin: 1rem 0;
    border-top: 1px solid rgb(0 0 0 / 10%);
    border-bottom: 1px solid rgb(0 0 0 / 10%);
  }

  .counter button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2em;
    padding: 0;
    border: 0;
    background-color: transparent;
    color: var(--text-color);
    font-size: 2rem;
    touch-action: manipulation;
  }

  .counter button:hover {
    background-color: var(--secondary-color);
  }

  svg {
    width: 25%;
    height: 25%;
  }

  path {
    vector-effect: non-scaling-stroke;
    stroke-width: 2px;
    stroke: var(--text-color);
  }

  .counter-viewport {
    position: relative;
    width: 8em;
    height: 4em;
    overflow: hidden;
    text-align: center;
  }

  .counter-viewport strong {
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--accent-color);
    font-size: 4rem;
    font-weight: 400;
  }

  .counter-digits {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .hidden {
    top: -100%;
    user-select: none;
  }
</style>
