export type OmdbErrorCode =
  | "NOT_FOUND"
  | "TOO_MANY_RESULTS"
  | "RATE_LIMIT"
  | "INVALID_KEY"
  | "MISSING_KEY"
  | "INVALID_RESPONSE"
  | "NETWORK"
  | "API_ERROR";

export interface OmdbError {
  code: OmdbErrorCode;
  message: string;
}

// Discriminated union forces callers to handle errors instead of throwing.
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: OmdbError };

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function err(code: OmdbErrorCode, message: string): Result<never> {
  return { ok: false, error: { code, message } };
}

export function mapOmdbError(rawMessage: string): OmdbError {
  const message = rawMessage.toLowerCase();

  if (message.includes("not found")) {
    return { code: "NOT_FOUND", message: "No matching titles found." };
  }
  if (message.includes("too many results")) {
    return {
      code: "TOO_MANY_RESULTS",
      message: "Search is too broad — please refine your query.",
    };
  }
  if (message.includes("request limit")) {
    return {
      code: "RATE_LIMIT",
      message: "Daily OMDb request limit reached. Please try again later.",
    };
  }
  if (message.includes("invalid api key")) {
    return { code: "INVALID_KEY", message: "Invalid OMDb API key." };
  }

  return { code: "API_ERROR", message: rawMessage };
}
