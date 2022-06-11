import * as esbuild from "https://deno.land/x/esbuild/mod.js";

const emptyDir = (path: string) => {
  Deno.removeSync(path, { recursive: true });
  Deno.mkdirSync(path);
};

emptyDir("dist/");

esbuild
  .build({
    entryPoints: ["./index.ts"],
    bundle: true,
    format: "esm",
    outfile: "dist/index.js",
  })
  .then(() => {
    esbuild.stop();
  });

const tsc = Deno.run({
  cmd: [
    "tsc",
    "--emitDeclarationOnly",
    "--declaration",
    "--project",
    "tsconfig.build.json",
  ],
});

await tsc.status();

Deno.writeTextFileSync(
  "./dist/package.json",
  JSON.stringify(
    {
      name: "karp",
      version: Deno.args[0] || "dev",
      author: {
        name: "Cole Mackenize",
      },
      description: "A Web API Streams utility library",
      types: "./index.d.ts",
      exports: "./index.js",
    },
    null,
    2,
  ),
);
