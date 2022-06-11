import * as esbuild from "https://deno.land/x/esbuild/mod.js";

esbuild
  .build({
    entryPoints: ["./index.ts"],
    bundle: true,
    format: "esm",
    outfile: "dist/karp.bundle.js",
  })
  .then(() => {
    esbuild.stop();
  });
