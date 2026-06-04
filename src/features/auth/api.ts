import { client } from "../../shared/api/client";
import type { User } from "../../shared/types";

interface SSEStatus {
  step: string;
  message: string;
}

interface SSEEvent {
  event: string;
  data: string;
}

function parseSSEEvent(raw: string): SSEEvent {
  let event = "";
  const dataLines: string[] = [];

  for (const line of raw.split("\n")) {
    if (!line || line.startsWith(":")) continue;

    const separator = line.indexOf(":");
    const field = separator === -1 ? line : line.slice(0, separator);
    const value =
      separator === -1
        ? ""
        : line.slice(separator + 1).replace(/^ /, "");

    if (field === "event") event = value;
    else if (field === "data") dataLines.push(value);
  }

  return { event, data: dataLines.join("\n") };
}

function parseErrorMessage(data: string) {
  const parsed = JSON.parse(data) as Partial<SSEStatus>;
  return parsed.message ?? "login failed";
}

export const authApi = {
  getState: () =>
    client.get("api/auth/state").json<{ state: string }>(),

  login: async (
    code: string,
    state: string,
    onStatus: (status: SSEStatus) => void,
  ): Promise<User> => {
    const baseUrl = import.meta.env.VITE_API_URL || "";
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("login request failed");
    if (!res.body) throw new Error("login response has no body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let result: User | null = null;
    let streamError: string | null = null;

    const handleEvent = (raw: string) => {
      const { event, data } = parseSSEEvent(raw);
      if (!event || !data) return;

      try {
        if (event === "status") {
          onStatus(JSON.parse(data) as SSEStatus);
        } else if (event === "done") {
          result = JSON.parse(data) as User;
        } else if (event === "error") {
          streamError = parseErrorMessage(data);
        }
      } catch {
        // skip malformed SSE data
      }
    };

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true }).replace(/\r\n?/g, "\n");

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const raw = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        handleEvent(raw);

        boundary = buffer.indexOf("\n\n");
      }
    }

    buffer += decoder.decode().replace(/\r\n?/g, "\n");
    if (buffer.trim()) handleEvent(buffer);

    if (!result) throw new Error(streamError ?? "login stream ended without done event");
    return result;
  },

  logout: () => client.post("api/auth/logout"),
  refresh: () => client.post("api/auth/refresh"),
};
