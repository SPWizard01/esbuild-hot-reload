import { $, build } from "bun";

await $`rm -rf dist`;

await build({ entrypoints: ["index.ts"], outdir: "dist", target: "node", minify: false });

await $`tsc`