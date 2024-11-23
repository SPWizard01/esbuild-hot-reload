function initReload() {
    if (!window.ESBuildReloadSources) {
        window.ESBuildReloadSources = [];
    }
    const esBuildSrc = "[ESBUILD_SOURCE]";
    if ((window.ESBuildReloadSources?.indexOf(esBuildSrc) ?? -1) > -1) return;
    window.ESBuildReloadSources?.push(esBuildSrc);
    console.log(`[ESBuild Hot Reload] Initializing reload for ->`, esBuildSrc);
    new EventSource(esBuildSrc).addEventListener("change", (e) => {
        if (e.data) {
            console.log(`[ESBuild Hot Reload] Data ->`, esBuildSrc, JSON.stringify(e.data));
            location.reload();
        }
    });
}


export function esbuildHotReloadString(devPort: number) {
    const eventSource = `https://localhost:${devPort}/esbuild`;
    const funcAsString = initReload
        .toString()
        .replace("[ESBUILD_SOURCE]", eventSource);
    return `;(${funcAsString})();\n`
}