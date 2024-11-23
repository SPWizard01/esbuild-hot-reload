import { esbuildHotReloadString } from "./reload";
import type { Plugin } from "esbuild";


export function esbuildHotRealoadFooterPlugin(devPort: number): Plugin {
    return {
        name: "esbuild-hot-reload-footer",
        setup(build) {
            if (!build.initialOptions.footer) {
                build.initialOptions.footer = {};
            }
            if (!build.initialOptions.footer?.js) {
                build.initialOptions.footer.js = ""
            }
            build.initialOptions.footer.js += esbuildHotReloadString(devPort);
        },
    };
}