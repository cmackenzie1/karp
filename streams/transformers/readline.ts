interface ReadlineTransformerOptions {
  skipEmpty: boolean;
}

const defaultOptions: ReadlineTransformerOptions = {
  skipEmpty: true,
};

export class ReadlineTransformer implements Transformer {
  options: ReadlineTransformerOptions;

  lastString: string;

  separator: RegExp;

  constructor(options?: ReadlineTransformerOptions) {
    this.options = { ...defaultOptions, ...options };
    this.lastString = "";
    this.separator = /[\r\n]+/;
  }

  transform(
    chunk: string,
    controller: TransformStreamDefaultController<string>
  ) {
    console.log(`[ReadlineTransformer] received ${chunk.length} bytes`);
    // prepend with previous string (empty if none)
    const str = `${this.lastString}${chunk}`;
    // Extract lines from chunk
    const lines = str.split(this.separator);
    // Save last line as it might be incomplete
    this.lastString = (lines.pop() || "").trim();

    for (const line of lines) {
      const d = this.options.skipEmpty ? line.trim() : line;
      if (d.length > 0) controller.enqueue(d);
    }
  }

  flush(controller: TransformStreamDefaultController<string>) {
    console.log("[ReadlineTransformer] flushed");
    if (this.lastString.length > 0) controller.enqueue(this.lastString);
  }
}
