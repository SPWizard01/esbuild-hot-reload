import type { Plugin, Loader } from "esbuild";
import { esbuildHotReloadString } from "./reload";
import { readFile } from "fs/promises";

export function esbuildHMRPlugin(devPort: number) {
    const bunHMRPlugin: Plugin = {
        name: "esbuild-hot-reload",
        setup(build) {
            const entryPoints: string[] = [];
            const addedEnryPoints = new Set<string>();
            if (build.initialOptions.entryPoints) {
                if (Array.isArray(build.initialOptions.entryPoints)) {
                    build.initialOptions.entryPoints.forEach(entry => {
                        let entryPath = "";
                        if (typeof entry === "string") {
                            entryPath = entry.replace(/^\.*/, "");
                        } else {
                            entryPath = entry.in.replace(/^\.*/, "");
                        }
                        if (process.platform === "win32") {
                            entryPath = entryPath.replace(/\//g, "\\");
                        }
                        entryPoints.push(entryPath);
                    })
                }
                else {
                    const entryObject = build.initialOptions.entryPoints as Record<string, string>;
                    Object.keys(entryObject).forEach(entry => {
                        let entryPath = entryObject[entry].replace(/^\.*/, "");
                        if (process.platform === "win32") {
                            entryPath = entryPath.replace(/\//g, "\\");
                        }
                        entryPoints.push(entryPath);
                    });
                }
            }
            build.onStart(() => {
                addedEnryPoints.clear();
            })
            build.onLoad({ filter: /\.m?[t|j]sx?$/ }, async (args) => {
                const contents = await readFile(args.path, { encoding: "utf-8" });
                const isTSx = /\.m?tsx$/.test(args.path);
                const isJSx = /\.m?jsx$/.test(args.path);
                const isJS = /\.m?js$/.test(args.path);
                const isTS = /\.m?ts$/.test(args.path);
                const loader: Loader = isTSx ? "tsx" : isJSx ? "jsx" : isTS ? "ts" : isJS ? "js" : "empty";
                const isEntry = entryPoints.some(entry => args.path.endsWith(entry))
                if (!addedEnryPoints.has(args.path) && isEntry) {
                    addedEnryPoints.add(args.path);
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
