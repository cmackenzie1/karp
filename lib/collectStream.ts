/**
 * Takes a readable stream and collects it into a UInt8Array
 * @param stream
 */
export async function collectStream(
  stream: ReadableStream,
): Promise<Uint8Array> {
  let res = new Uint8Array(0);
  const reader = stream.getReader();
  let isDone = false;
  while (!isDone) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();
    if (value) {
      const prior = res;
      res = new Uint8Array(prior.length + value.length);
      res.set(prior);
      res.set(value, prior.length);
    }
    isDone = done;
  }
  return res;
}
