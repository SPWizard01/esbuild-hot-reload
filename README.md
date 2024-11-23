# esbuild-hot-reload

A simple Hot Reload plugin.

`npm i esbuild-hot-reload`
or
`bun i esbuild-hot-reload`

Available in 2 falvors,

```ts
import { esbuildHMRPlugin } from "esbuild-hot-reload";
export const esbuildConfig = {
    //...
    plugins: [
        esbuildHMRPlugin(123)
    ]
}
```

Results in 1 addition of a JS code in your bundle;

```ts
import { esbuildHotRealoadFooterPlugin } from "esbuild-hot-reload";
export const esbuildConfig = {
    //...
    plugins: [
        esbuildHotRealoadFooterPlugin(123)
    ]
}
```
Results in addition of a JS code to each of your files in `footer` region


```ts
import { esbuildHotReloadString } from "esbuild-hot-reload";
const aStringJs = esbuildHotReloadString(123);
```

Gives you the string that is added, in case you want to do anything with it.