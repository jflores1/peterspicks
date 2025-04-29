// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    define: {
      "import.meta.env.TYPESENSE_API_KEY": JSON.stringify(
        process.env.TYPESENSE_API_KEY,
      ),
    },
  },
});
