import { TextEncoderStream } from "../streams/index.ts";

import { assertEquals } from "https://deno.land/std@0.143.0/testing/asserts.ts";

Deno.test("encode test", async () => {
  try {
    const { readable, writable } = new TransformStream();
    const resp = await fetch("https://httpbin.org/stream/10");
    const encodeStream = new TextEncoderStream();

    const data = await resp.text();

    const stream = new ReadableStream({
      start(controller: ReadableStreamDefaultController) {
        controller.enqueue(data);
        controller.close();
      },
    });

    stream.pipeThrough(encodeStream).pipeTo(writable);
    let length = 0;
    for await (const chunk of readable) {
      length += chunk.length;
    }
    assertEquals(length, data.length);
  } catch (e) {
    Promise.reject(e);
  }
});
