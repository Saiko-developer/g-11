declare module "mammoth/mammoth.browser" {
  export function extractRawText(input: { arrayBuffer: ArrayBufferLike }): Promise<{ value: string }>;
}
declare module "word-extractor" {
  export default class WordExtractor { extract(buffer: import("node:buffer").Buffer): Promise<{ getBody(): string }>; }
}