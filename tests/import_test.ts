Deno.test("test import from github", () => {
  import("https://github.com/cmackenzie1/karp/raw/main/index.ts")
    .then(() => console.log("imported successfully"))
    .catch((e) => {
      console.log("import failed!");
      throw e;
    });
});
