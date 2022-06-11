import { FilterTransformer } from "./transformers/filter.ts";
import { ReadJSONTransformer } from "./transformers/jsonRead.ts";
import { WriteJSONTransformer } from "./transformers/jsonWrite.ts";
import { MapTransformer } from "./transformers/map.ts";
import { ReadlineTransformer } from "./transformers/readline.ts";
import { TextDecodeTransformer } from "./transformers/textDecode.ts";
import { TextEncodeTransformer } from "./transformers/textEncode.ts";

export {
  FilterTransformer,
  MapTransformer,
  ReadJSONTransformer,
  ReadlineTransformer,
  WriteJSONTransformer,
};

export class ReadlineStream extends TransformStream {
  constructor() {
    super(new ReadlineTransformer({ skipEmpty: true }));
  }
}

export class TextEncoderStream extends TransformStream {
  constructor() {
    super(new TextEncodeTransformer());
  }
}

export class TextDecoderStream extends TransformStream {
  constructor(encoding = "utf-8") {
    super(new TextDecodeTransformer(encoding));
  }
}

export class FilterStream<I> extends TransformStream {
  constructor(fn: (a: I) => boolean) {
    super(new FilterTransformer(fn));
  }
}

export class MapStream<I, O> extends TransformStream {
  constructor(fn: (a: I) => O) {
    super(new MapTransformer(fn));
  }
}

interface FromJSONOptions {
  mode: "drop" | "fail";
}
export class FromJSON extends TransformStream {
  constructor(options: FromJSONOptions = { mode: "fail" }) {
    super(new ReadJSONTransformer(options));
  }
}
