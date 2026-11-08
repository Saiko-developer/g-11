/** Bound both the network request and response decoding; abort on timeout. */
export async function voiceRequest<T>(
  input: RequestInfo | URL,
  init: RequestInit,
  decode: (response: Response) => Promise<T>,
  timeoutMs = 30000,
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      fetch(input, { ...init, signal: controller.signal }).then(async (response) => {
        if (!response.ok) throw new Error(`Voice request failed (${response.status})`);
        return decode(response);
      }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Error("Voice request timed out"));
        }, timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
