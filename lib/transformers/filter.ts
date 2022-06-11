export class FilterTransformer<I> implements Transformer {
  fn: (chunk: I) => boolean;

  constructor(fn: (chunk: I) => boolean) {
    this.fn = fn;
  }

  transform(chunk: I, controller: TransformStreamDefaultController) {
    if (this.fn(chunk)) controller.enqueue(chunk);
  }

  flush() {
    console.log("[FilterTransformer] received all inputs");
  }
}
