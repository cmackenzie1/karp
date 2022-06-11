import { ToJSON } from "../index.ts";
import { assertEquals } from "https://deno.land/std@0.143.0/testing/asserts.ts";

Deno.test("toJSON", async () => {
  try {
    const { readable, writable } = new TransformStream();

    const data = [
      { hello: "world" },
      [],
      true,
      1,
      { a: { b: { c: { d: {} } } } },
    ];
    const toJSONStream = new ToJSON();

    const source = new ReadableStream({
      start(controller: ReadableStreamDefaultController) {
        data.forEach((e) => {
          controller.enqueue(e);
        });
        controller.close();
      },
    });

    source.pipeThrough(toJSONStream).pipeTo(writable);
    let curr = 0;
    for await (const result of readable) {
      assertEquals(result.trim(), JSON.stringify(data[curr]));
      curr += 1;
    }
  } catch (e) {
    Promise.reject(e);
  }
});
