import { FromJSON } from "../index.ts";
import { assertEquals } from "https://deno.land/std@0.143.0/testing/asserts.ts";

Deno.test("fromJSON", async () => {
  try {
    const { readable, writable } = new TransformStream();

    const data = [
      { hello: "world" },
      [],
      true,
      1,
      { a: { b: { c: { d: {} } } } },
    ];
    const fromJSONStream = new FromJSON();

    const source = new ReadableStream({
      start(controller: ReadableStreamDefaultController) {
        data.forEach((e) => {
          controller.enqueue(JSON.stringify(e));
        });
        controller.close();
      },
    });

    source.pipeThrough(fromJSONStream).pipeTo(writable);
    let curr = 0;
    for await (const result of readable) {
      assertEquals(result, data[curr]);
      curr += 1;
    }
  } catch (e) {
    Promise.reject(e);
  }
});
