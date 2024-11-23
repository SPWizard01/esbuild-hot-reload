import type { Plugin, Loader } from "esbuild";
import { esbuildHotReloadString } from "./reload";
import { readFile } from "fs/promises";

export function esbuildHMRPlugin(devPort: number) {
    const bunHMRPlugin: Plugin = {
        name: "esbuild-hot-reload",
        setup(build) {
            let hmrAdded = false;
            build.onStart(()=>{
                hmrAdded = false;
            })
            build.onLoad({ filter: /\.m?[t|j]sx?$/ }, async (args) => {
                const contents = await readFile(args.path, { encoding: "utf-8" });
                const isTSx = /\.m?tsx$/.test(args.path);
                const isJSx = /\.m?jsx$/.test(args.path);
                const isJS = /\.m?js$/.test(args.path);
                const isTS = /\.m?ts$/.test(args.path);
                const loader: Loader = isTSx ? "tsx" : isJSx ? "jsx" : isTS ? "ts" : isJS ? "js" : "empty";
                if (!hmrAdded) {
                    hmrAdded = true;
                    return { contents: `import "esbuild-hot-reload"\n` + contents, loader };
                }
                return { contents, loader };
            });

            build.onResolve({ filter: /^esbuild-hot-reload$/ }, (args) => {
                return { path: args.path, namespace: "esbuild-hot-reload" };
            })

            build.onLoad({ filter: /./, namespace: "esbuild-hot-reload" }, async (args) => {
                return { contents: esbuildHotReloadString(devPort), loader: "ts" };
            });

        },
    }
    return bunHMRPlugin;
}
