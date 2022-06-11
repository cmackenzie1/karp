import { FilterTransformer } from "./lib/transformers/filter.ts";
import { ReadJSONTransformer } from "./lib/transformers/jsonRead.ts";
import { WriteJSONTransformer } from "./lib/transformers/jsonWrite.ts";
import { MapTransformer } from "./lib/transformers/map.ts";
import { ReadlineTransformer } from "./lib/transformers/readline.ts";
import { TextDecodeTransformer } from "./lib/transformers/textDecode.ts";
import { TextEncodeTransformer } from "./lib/transformers/textEncode.ts";

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

interface ToJSONOptions {
  mode: "drop" | "fail";
}
export class ToJSON extends TransformStream {
  constructor(options: ToJSONOptions = { mode: "fail" }) {
    super(new WriteJSONTransformer(options));
  }
}
