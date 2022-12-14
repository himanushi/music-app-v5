import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";

const ios = process.env.PLATFORM === "ios";

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
    files: {
      appTemplate: ios ? "src/app-ios.html" : "src/app.html",
    },
    prerender: { entries: [] },
  },
  onwarn: (warning, handler) => {
    // ref: https://github.com/sveltejs/language-tools/issues/650#issuecomment-1181354795
    if (warning.code.startsWith("a11y-")) {
      return;
    }
    handler(warning);
  },
  preprocess: preprocess(),
};

export default config;
