import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // SPA mode
      fallback: "index.html",
    }),
    alias: {
      "~": "src",
    },
    prerender: { entries: [] },
  },
  preprocess: preprocess(),
};

export default config;
