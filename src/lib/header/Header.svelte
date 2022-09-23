<script lang="ts">
  import logo from "./svelte-logo.svg";
  import { page } from "$app/stores";
</script>

<header>
  <div class="corner">
    <a href="https://kit.svelte.dev">
      <img alt="SvelteKit" src={logo} />
    </a>
  </div>

  <nav data-sveltekit-prefetch>
    <svg aria-hidden="true" viewBox="0 0 2 3">
      <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg>
    <ul>
      <li class:active={$page.url.pathname === "/"}>
        <a href="/">Home</a>
      </li>
      <li class:active={$page.url.pathname === "/about"}>
        <a href="/about">About</a>
      </li>
      <li class:active={$page.url.pathname === "/todos"}>
        <a href="/todos">Todos</a>
      </li>
    </ul>
    <svg aria-hidden="true" viewBox="0 0 2 3">
      <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
    </svg>
  </nav>

  <div class="corner">
    <!-- TODO put something else here? github link? -->
  </div>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
  }

  .corner {
    width: 3em;
    height: 3em;
  }

  .corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  nav {
    display: flex;
    justify-content: center;

    --background: rgb(255 255 255 / 70%);
  }

  svg {
    display: block;
    width: 2em;
    height: 3em;
  }

  path {
    fill: var(--background);
  }

  ul {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    height: 3em;
    margin: 0;
    padding: 0;
    background: var(--background);
    background-size: contain;
    list-style: none;
  }

  li {
    position: relative;
    height: 100%;
  }

  li.active::before {
    --size: 6px;

    content: "";
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    width: 0;
    height: 0;
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--accent-color);
  }

  nav a {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 1em;
    transition: color 0.2s linear;
    color: var(--heading-color);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-decoration: none;
    text-transform: uppercase;
  }

  a:hover {
    color: var(--accent-color);
  }
</style>
