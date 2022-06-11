import { JSONParseError } from "../errors.ts";

interface ToJSONTransformerOptions {
  mode?: "drop" | "fail" | "null";
}

const defaultOptions: ToJSONTransformerOptions = {
  mode: "fail",
};

const toJSON = (obj: unknown) => JSON.stringify(obj) + "\n";

export class WriteJSONTransformer implements Transformer {
  options: ToJSONTransformerOptions;

  constructor(options?: ToJSONTransformerOptions) {
    this.options = { ...defaultOptions, ...options };
  }

  transform(chunk: unknown, controller: TransformStreamDefaultController) {
    try {
      if (chunk) controller.enqueue(toJSON(chunk));
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
}
