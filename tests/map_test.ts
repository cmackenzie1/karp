import { MapStream } from "../streams/index.ts";
import { fail } from "https://deno.land/std@0.143.0/testing/asserts.ts";

Deno.test("map stream", async () => {
  const { readable, writable } = new TransformStream();
  const data = [1, 2, 3, 4, 5];
  const oddStream = new MapStream((a: number) => a * 10);

  const source = new ReadableStream({
    start(controller: ReadableStreamDefaultController) {
      data.forEach((e) => {
        controller.enqueue(e);
      });
      controller.close();
    },
  });

  source.pipeThrough(oddStream).pipeTo(writable);
  for await (const result of readable) {
    if (typeof result !== "number") {
      fail("exptected number but got " + typeof result);
    }
    if (result % 10 !== 0) fail("expected everything to be a multiple of 10");
  }
});
