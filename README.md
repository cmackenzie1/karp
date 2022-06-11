# Karp

A streaming utility library built for the modern [Web Stream API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) era and works with Deno and Cloudlfare Workers runtimes!

Note: This library is in its very early stages so all API's are subject to change until the first major release. :) 

## Usage

```ts
import { MapStream } from "./streams/index.ts";

// Create an destination for the final result to be piped to.
const { readable, writable } = new TransformStream();
const data = [1, 2, 3, 4, 5];

// Define your mapping transformation
const multiplyBy10 = new MapStream((a: number) => a * 10);

// Create a stream of data
const source = new ReadableStream({
start(controller: ReadableStreamDefaultController) {
    data.forEach((e) => {
    controller.enqueue(e);
    });
    controller.close();
},
});

// Apply your mapping operation to the stream of data
source.pipeThrough(multiplyBy10).pipeTo(writable);
for await (const result of readable) {
    console.log(result)
}
```

For more examples, checkout the `tests/` directory.

## Developing

To contribute, ensure you have the latest version of [Deno](https://deno.land/) installed. 

### Running Tests

```bash
deno test --allow-all --watch
```

## Contributing

Want to see a feature added? Go ahead and create an new feature request or feel free to even create a PR yourself to add it! Just remember to run the following steps before opening the pull request.

```bash
deno lint # ensure there is nothing forbidden by the linter
deno fmt # ensure consistent code style is used.
```
