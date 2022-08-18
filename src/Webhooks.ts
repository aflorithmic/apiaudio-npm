import type CryptoProvider from "./crypto/CryptoProvider";
import NodeCryptoProvider from "./crypto/NodeCryptoProvider";
import SubtleCryptoProvider from "./crypto/SubtleCryptoProvider";

type Header = {
  timestamp: number;
  signatures: string[];
};

const signature = {
  EXPECTED_SCHEME: "v1",

  verifyHeader(
    encodedPayload: string,
    encodedHeader: string,
    secret: string,
    tolerance: number,
    cryptoProvider: CryptoProvider
  ): boolean {
    const { decodedPayload: payload, details } = parseEventDetails(
      encodedPayload,
      encodedHeader,
      this.EXPECTED_SCHEME
    );

    cryptoProvider = cryptoProvider || new NodeCryptoProvider();
    const expectedSignature = cryptoProvider.computeHMACSignature(
      makeHMACContent(payload, details),
      secret
    );

    validateComputedSignature(details, expectedSignature, tolerance);

    return true;
  },

  async verifyHeaderAsync(
    encodedPayload: string,
    encodedHeader: string,
    secret: string,
    tolerance: number,
    cryptoProvider: CryptoProvider
  ): Promise<boolean> {
    const { decodedPayload: payload, details } = parseEventDetails(
      encodedPayload,
      encodedHeader,
      this.EXPECTED_SCHEME
    );

    cryptoProvider = cryptoProvider || new SubtleCryptoProvider();

    const expectedSignature = await cryptoProvider.computeHMACSignatureAsync(
      makeHMACContent(payload, details),
      secret
    );

    return validateComputedSignature(details, expectedSignature, tolerance);
  }
};

function makeHMACContent(payload: string, details: Header) {
  return `${details.timestamp}.${payload}`;
}

function parseEventDetails(
  encodedPayload: Buffer | string,
  encodedHeader: Buffer | string,
  expectedScheme: string
) {
  const decodedPayload = Buffer.isBuffer(encodedPayload)
    ? encodedPayload.toString("utf8")
    : encodedPayload;

  // Express's type for `Request#headers` is `string | []string`
  // which is because the `set-cookie` header is an array,
  // but no other headers are an array (docs: https://nodejs.org/api/http.html#http_message_headers)
  // (Express's Request class is an extension of http.IncomingMessage, and doesn't appear to be relevantly modified: https://github.com/expressjs/express/blob/master/lib/request.js#L31)
  if (Array.isArray(encodedHeader)) {
    throw new Error(
      "Unexpected: An array was passed as a header, which should not be possible for the X-Aflr-Secret header."
    );
  }

  const decodedHeader = Buffer.isBuffer(encodedHeader)
    ? encodedHeader.toString("utf8")
    : encodedHeader;

  const details = parseHeader(decodedHeader, expectedScheme);

  if (!details || details.timestamp === -1) {
    throw new Error("Unable to extract timestamp and signatures from header");
  }

  if (!details.signatures.length) {
    throw new Error("No signatures found with expected scheme");
  }

  return {
    decodedPayload,
    decodedHeader,
    details
  };
}

function validateComputedSignature(details: Header, expectedSignature: string, tolerance: number) {
  const signatureFound = !!details.signatures.filter(s => s === expectedSignature).length;

  if (!signatureFound) {
    throw new Error(
      "No signatures found matching the expected signature for payload. Are you passing the raw request body you received from apiaudio?"
    );
  }

  const timestampAge = Math.floor(Date.now() / 1000) - details.timestamp;

  if (tolerance > 0 && timestampAge > tolerance) {
    throw new Error("Timestamp outside the tolerance zone");
  }

  return true;
}

function parseHeader(header: string, scheme: string): Header | null {
  if (typeof header !== "string") {
    return null;
  }

  return header.split(",").reduce(
    (accum: Header, item: string) => {
      const kv = item.split("=");

      if (kv[0] === "t") {
        accum.timestamp = parseInt(kv[1]);
      }

      if (kv[0] === scheme) {
        accum.signatures.push(kv[1]);
      }

      return accum;
    },
    {
      timestamp: -1,
      signatures: []
    }
  );
}

export class WebhooksClass {
  #DEFAULT_TOLERANCE = 300; // 5 minutes
  #signature = signature;

  public verify(
    payload: string,
    header: string,
    secret: string,
    tolerance: number,
    cryptoProvider: CryptoProvider
  ): boolean {
    this.#signature.verifyHeader(
      payload,
      header,
      secret,
      tolerance || this.#DEFAULT_TOLERANCE,
      cryptoProvider
    );

    return true;
  }

  public async verifyAsync(
    payload: string,
    header: string,
    secret: string,
    tolerance: number,
    cryptoProvider: CryptoProvider
  ): Promise<boolean> {
    await this.#signature.verifyHeaderAsync(
      payload,
      header,
      secret,
      tolerance || this.#DEFAULT_TOLERANCE,
      cryptoProvider
    );

    return true;
  }
}

export const Webhooks = new WebhooksClass();
