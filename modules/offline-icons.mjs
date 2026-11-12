import { readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { addPluginTemplate, defineNuxtModule } from "@nuxt/kit";
import { getIcons } from "@iconify/utils";

// nuxt-icon fetches every icon from the public Iconify API at runtime. When that API is slow
// or unreachable the icon falls back to printing its own name ("ph:sun-bold") as text. This
// module scans the source for icon names and ships just those icons inside the app bundle.
const PREFIXES = ["ph", "simple-icons", "svg-spinners"];
const SCAN = ["app.vue", "error.vue", "components", "composables", "data", "layouts", "pages"];

function* sourceFiles(path) {
  if (statSync(path, { throwIfNoEntry: false })?.isDirectory()) {
    for (const entry of readdirSync(path)) yield* sourceFiles(join(path, entry));
  } else if (/\.(vue|js|ts)$/.test(path)) {
    yield path;
  }
}

export default defineNuxtModule({
  meta: { name: "offline-icons" },
  setup(_, nuxt) {
    const require = createRequire(import.meta.url);
    const pattern = new RegExp(`\\b(${PREFIXES.join("|")}):([a-z0-9-]+)`, "g");

    const collections = () => {
      const wanted = Object.fromEntries(PREFIXES.map((prefix) => [prefix, new Set()]));
      for (const entry of SCAN) {
        for (const file of sourceFiles(join(nuxt.options.rootDir, entry))) {
          for (const [, prefix, name] of readFileSync(file, "utf8").matchAll(pattern)) wanted[prefix].add(name);
        }
      }
      return PREFIXES.map((prefix) => {
        const set = JSON.parse(readFileSync(require.resolve(`@iconify-json/${prefix}/icons.json`), "utf8"));
        return getIcons(set, [...wanted[prefix]]);
      }).filter(Boolean);
    };

    addPluginTemplate({
      filename: "offline-icons.mjs",
      getContents: () => `import { addCollection } from "@iconify/vue";
import { defineNuxtPlugin } from "#app";

const collections = ${JSON.stringify(collections())};

export default defineNuxtPlugin(() => {
  for (const collection of collections) addCollection(collection);
});
`,
    });

    // Icons added while `nuxi dev` runs are fetched from the API until the next restart.
  },
});
