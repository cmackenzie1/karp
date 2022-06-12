export class MapTransformer<I, O = unknown> implements Transformer {
  fn: (chunk: I) => O;

  constructor(fn: (chunk: I) => O) {
    this.fn = fn;
  }

  transform(chunk: I, controller: TransformStreamDefaultController<O>) {
    controller.enqueue(this.fn(chunk));
  }
}

export class FlatMapTransformer<I, O = unknown> implements Transformer {
  fn: (chunk: I) => O;

  constructor(fn: (chunk: I) => O) {
    this.fn = fn;
  }

  transform(chunk: I, controller: TransformStreamDefaultController<O>) {
    const result = this.fn(chunk);
    if (Array.isArray(result)) {
      result.forEach((e) => {
        controller.enqueue(e);
      });
    } else {
      controller.error(new Error("result of map was not an array"));
    }
  }
}
