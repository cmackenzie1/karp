import { JSONParseError } from "../errors.ts";

export interface ReadJSONTransformerOptions {
  mode?: "drop" | "fail" | "null";
  multiLine?: boolean;
  lineSeparator?: RegExp;
}

const defaultOptions: ReadJSONTransformerOptions = {
  mode: "drop",
  multiLine: false,
  lineSeparator: /\r\n|\n\r|\n|\r/,
};

const parseJSON = (text: string) => JSON.parse(text);

export class ReadJSONTransformer implements Transformer {
  options: ReadJSONTransformerOptions;

  constructor(options?: ReadJSONTransformerOptions) {
    this.options = { ...defaultOptions, ...options };
  }

  transform(chunk: string, controller: TransformStreamDefaultController) {
    console.log(`[ReadJSONTransformer] received ${typeof chunk}`);
    if (typeof chunk !== "string") {
      switch (this.options.mode) {
        case "fail":
          controller.error(
            new JSONParseError(`unsupported input: ${typeof chunk}`),
          );
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
      if (d) controller.enqueue(d);
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

  flush(_controller: TransformStreamDefaultController) {
    console.log("[ReadJSONTransformer] received all inputs");
  }
}
