export class TextEncodeTransformer implements Transformer {
  encoder: TextEncoder;

  constructor() {
    this.encoder = new TextEncoder();
  }

  transform(
    chunk: string,
    controller: TransformStreamDefaultController<ArrayBuffer>,
  ) {
    controller.enqueue(this.encoder.encode(chunk));
  }

  get encoding() {
    return this.encoder.encoding;
  }
}
