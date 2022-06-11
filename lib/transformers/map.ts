export class MapTransformer<I, O = unknown> implements Transformer {
  fn: (chunk: I) => O;

  constructor(fn: (chunk: I) => O) {
    this.fn = fn;
  }

  transform(chunk: I, controller: TransformStreamDefaultController<O>) {
    controller.enqueue(this.fn(chunk));
  }

  flush(_controller: TransformStreamDefaultController) {
    console.log("[MapTransformer] received all inputs");
  }
}
