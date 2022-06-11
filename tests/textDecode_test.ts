import { TextDecoderStream } from "../streams/index.ts";

import { fail } from "https://deno.land/std@0.143.0/testing/asserts.ts";

Deno.test("decode test", async () => {
  const { readable, writable } = new TransformStream();
  const resp = await fetch("https://httpbin.org/stream/10");
  const decodeStream = new TextDecoderStream();
  resp.body?.pipeThrough(decodeStream).pipeTo(writable);

  for await (const chunk of readable) {
    if (typeof chunk !== "string") {
      fail("expected type of string but got " + typeof chunk);
    }
  }
});
