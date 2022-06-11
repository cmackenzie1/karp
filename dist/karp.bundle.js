// lib/transformers/filter.ts
var FilterTransformer = class {
  constructor(fn) {
    this.fn = fn;
  }
  transform(chunk, controller) {
    if (this.fn(chunk))
      controller.enqueue(chunk);
  }
  flush() {
    console.log("[FilterTransformer] received all inputs");
  }
};

// lib/errors.ts
var JSONParseError = class extends Error {
  constructor(message) {
    super(`JSONParseError: ${message}`);
  }
};

// lib/transformers/jsonRead.ts
var defaultOptions = {
  mode: "drop",
  multiLine: false,
  lineSeparator: /\r\n|\n\r|\n|\r/
};
var parseJSON = (text) => JSON.parse(text);
var ReadJSONTransformer = class {
  constructor(options) {
    this.options = { ...defaultOptions, ...options };
  }
  transform(chunk, controller) {
    console.log(`[ReadJSONTransformer] received ${typeof chunk}`);
    if (typeof chunk !== "string") {
      switch (this.options.mode) {
        case "fail":
          controller.error(new JSONParseError(`unsupported input: ${typeof chunk}`));
          return;
        case "null":
          controller.enqueue(null);
          return;
        case "drop":
          return;
        default:
          return;
      }
    }
    if (this.options.multiLine) {
      controller.enqueue(parseJSON(chunk));
      return;
    }
    try {
      const d = parseJSON(chunk);
      if (d)
        controller.enqueue(d);
    } catch (_e) {
      switch (this.options.mode) {
        case "null":
          controller.enqueue(null);
          break;
        case "fail":
          controller.error(new JSONParseError("invalid json"));
          break;
        case "drop":
        default:
      }
    }
  }
  flush(_controller) {
    console.log("[ReadJSONTransformer] received all inputs");
  }
};

// lib/transformers/jsonWrite.ts
var defaultOptions2 = {
  mode: "fail"
};
var toJSON = (obj) => JSON.stringify(obj) + "\n";
var WriteJSONTransformer = class {
  constructor(options) {
    this.options = { ...defaultOptions2, ...options };
  }
  transform(chunk, controller) {
    console.log(`[WriteJSONTransformer] received ${typeof chunk}:`, chunk);
    try {
      if (chunk)
        controller.enqueue(toJSON(chunk));
    } catch (e) {
      switch (this.options.mode) {
        case "null":
          controller.enqueue(null);
          break;
        case "fail":
          controller.error(new JSONParseError(`unserializable input: ${e}`));
          break;
        case "drop":
        default:
      }
    }
  }
  flush(_controller) {
    console.log("[WriteJSONTransformer] received all inputs");
  }
};

// lib/transformers/map.ts
var MapTransformer = class {
  constructor(fn) {
    this.fn = fn;
  }
  transform(chunk, controller) {
    controller.enqueue(this.fn(chunk));
  }
  flush(_controller) {
    console.log("[MapTransformer] received all inputs");
  }
};

// lib/transformers/readline.ts
var defaultOptions3 = {
  skipEmpty: true
};
var ReadlineTransformer = class {
  constructor(options) {
    this.options = { ...defaultOptions3, ...options };
    this.lastString = "";
    this.separator = /[\r\n]+/;
  }
  transform(chunk, controller) {
    console.log(`[ReadlineTransformer] received ${chunk.length} bytes`);
    const str = `${this.lastString}${chunk}`;
    const lines = str.split(this.separator);
    this.lastString = (lines.pop() || "").trim();
    for (const line of lines) {
      const d = this.options.skipEmpty ? line.trim() : line;
      if (d.length > 0)
        controller.enqueue(d);
    }
  }
  flush(controller) {
    console.log("[ReadlineTransformer] flushed");
    if (this.lastString.length > 0)
      controller.enqueue(this.lastString);
  }
};

// lib/transformers/textDecode.ts
var TextDecodeTransformer = class {
  constructor(encoding = "utf-8") {
    this._decoder = new TextDecoder(encoding);
  }
  transform(chunk, controller) {
    controller.enqueue(this._decoder.decode(chunk, { stream: true }));
  }
  flush(_controller) {
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
};

// lib/transformers/textEncode.ts
var TextEncodeTransformer = class {
  constructor() {
    this.encoder = new TextEncoder();
  }
  transform(chunk, controller) {
    controller.enqueue(this.encoder.encode(chunk));
  }
  get encoding() {
    return this.encoder.encoding;
  }
};

// index.ts
var ReadlineStream = class extends TransformStream {
  constructor() {
    super(new ReadlineTransformer({ skipEmpty: true }));
  }
};
var TextEncoderStream = class extends TransformStream {
  constructor() {
    super(new TextEncodeTransformer());
  }
};
var TextDecoderStream = class extends TransformStream {
  constructor(encoding = "utf-8") {
    super(new TextDecodeTransformer(encoding));
  }
};
var FilterStream = class extends TransformStream {
  constructor(fn) {
    super(new FilterTransformer(fn));
  }
};
var MapStream = class extends TransformStream {
  constructor(fn) {
    super(new MapTransformer(fn));
  }
};
var FromJSON = class extends TransformStream {
  constructor(options = { mode: "fail" }) {
    super(new ReadJSONTransformer(options));
  }
};
export {
  FilterStream,
  FilterTransformer,
  FromJSON,
  MapStream,
  MapTransformer,
  ReadJSONTransformer,
  ReadlineStream,
  ReadlineTransformer,
  TextDecoderStream,
  TextEncoderStream,
  WriteJSONTransformer
};
