export class JSONParseError extends Error {
  constructor(message: string) {
    super(`JSONParseError: ${message}`);
  }
}
