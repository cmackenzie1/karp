import { ReadlineStream } from "../streams/index.ts";

import { assertEquals } from "https://deno.land/std@0.143.0/testing/asserts.ts";

Deno.test("readline test", async () => {
  const { readable, writable } = new TransformStream();
  const resp = await fetch("https://httpbin.org/stream/10");
  const readlineStream = new ReadlineStream();

  const data = await resp.text();
  const stream = new ReadableStream({
    start(controller: ReadableStreamDefaultController) {
      controller.enqueue(data);
      controller.close();
    },
  });

  stream.pipeThrough(readlineStream).pipeTo(writable);
  let length = 0;
  for await (const _chunk of readable) {
    length += 1;
  }
  assertEquals(length, 10);
});
