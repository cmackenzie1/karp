// @ts-ignore: disable TS2691
import { FilterTransformer } from "./lib/transformers/filter.ts";
// @ts-ignore: disable TS2691
import { ReadJSONTransformer } from "./lib/transformers/jsonRead.ts";
// @ts-ignore: disable TS2691
import { WriteJSONTransformer } from "./lib/transformers/jsonWrite.ts";
// @ts-ignore: disable TS2691
import { FlatMapTransformer, MapTransformer } from "./lib/transformers/map.ts";
// @ts-ignore: disable TS2691
import { ReadlineTransformer } from "./lib/transformers/readline.ts";
// @ts-ignore: disable TS2691
import { TextDecodeTransformer } from "./lib/transformers/textDecode.ts";
// @ts-ignore: disable TS2691
import { TextEncodeTransformer } from "./lib/transformers/textEncode.ts";

export {
  FilterTransformer,
  FlatMapTransformer,
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
  private _transformer: TextEncodeTransformer;
  constructor() {
    const transformer = new TextEncodeTransformer();
    super(transformer);
    this._transformer = transformer;
  }

  get encoding() {
    return this._transformer.encoding;
  }
}

export class TextDecoderStream extends TransformStream {
  private _transformer: TextDecodeTransformer;
  constructor(encoding = "utf-8") {
    const transformer = new TextDecodeTransformer(encoding);
    super(transformer);
    this._transformer = transformer;
  }

  get encoding() {
    return this._transformer.encoding;
  }
  get ignoreBOM() {
    return this._transformer.ignoreBOM;
  }
  get fatal() {
    return this._transformer.fatal;
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

export class FlatMapStream<I, O> extends TransformStream {
  constructor(fn: (a: I) => O) {
    super(new FlatMapTransformer(fn));
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
