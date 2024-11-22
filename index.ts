import type { Plugin } from "esbuild";

function initReload() {
  if (!window.ESBuildReloadSources) {
    window.ESBuildReloadSources = [];
  }
  const esBuildSrc = "[ESBUILD_SOURCE]";
  if ((window.ESBuildReloadSources?.indexOf(esBuildSrc) ?? -1) > -1) return;
  window.ESBuildReloadSources?.push(esBuildSrc);
  console.log(`[ESBuild Hot Reaload] Initializing reload for ->`, esBuildSrc);
  new EventSource(esBuildSrc).addEventListener("change", (e) => {
    console.log(`[ESBuild Hot Reaload] Reloading for ->`, esBuildSrc, e);
    location.reload();
  });
}

export function esbuildHotReaload(devPort: number): Plugin {
  const eventSource = `https://localhost:${devPort}/esbuild`;

  const funcAsString = initReload
    .toString()
    .replace("[ESBUILD_SOURCE]", eventSource);
  return {
    name: "esbuild-hot-reload",
    setup(build) {
      if (!build.initialOptions.footer) {
        build.initialOptions.footer = {};
      }
      if (build.initialOptions.footer?.js) {
        build.initialOptions.footer.js += funcAsString;
      }
    },
  };
}
