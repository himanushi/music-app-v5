<script lang="ts">
  import "../app.css";
  import Header from "$lib/header/Header.svelte";

  const a = {
    aa: 1,
    bb: 2,
  };
</script>

<Header />

<main>
  <slot />
</main>

<footer>
  <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer>

<style>
  main {
    display: flex;
    box-sizing: border-box;
    flex: 1;
    flex-direction: column;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    padding: 1rem;
  }

  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
