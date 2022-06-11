export class TextDecodeTransformer implements Transformer {
  private _decoder: TextDecoder;

  constructor(encoding = "utf-8") {
    this._decoder = new TextDecoder(encoding);
  }

  transform(
    chunk: ArrayBuffer,
    controller: TransformStreamDefaultController<string>,
  ) {
    controller.enqueue(this._decoder.decode(chunk, { stream: true }));
  }

  flush(_controller: TransformStreamDefaultController) {
    this._decoder.decode();
  }

  get encoding() {
    return this._decoder.encoding;
  }
  get fatal() {
    return this._decoder.fatal;
  }
  get ignoreBOM() {
    return this._decoder.ignoreBOM;
  }
}
