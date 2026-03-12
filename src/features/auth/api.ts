import { client } from "../../shared/api/client";
import type { User } from "../../shared/types";

interface SSEStatus {
  step: string;
  message: string;
}

export const authApi = {
  getState: () =>
    client.get("api/auth/state").json<{ state: string }>(),

  login: async (
    code: string,
    state: string,
    onStatus: (status: SSEStatus) => void,
  ): Promise<User> => {
    const res = await fetch("/api/auth/login", {
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

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const raw = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        let event = "";
        let data = "";
        for (const line of raw.split("\n")) {
          if (line.startsWith("event: ")) event = line.slice(7);
          else if (line.startsWith("data: ")) data = line.slice(6);
        }

        try {
          if (event === "status" && data) {
            onStatus(JSON.parse(data));
          } else if (event === "done" && data) {
            result = JSON.parse(data);
          } else if (event === "error" && data) {
            const parsed = JSON.parse(data);
            onStatus({ step: parsed.step, message: parsed.message });
          }
        } catch {
          // skip malformed SSE data
        }

        boundary = buffer.indexOf("\n\n");
      }
    }

    if (!result) throw new Error("login stream ended without done event");
    return result;
  },

  logout: () => client.post("api/auth/logout"),
  refresh: () => client.post("api/auth/refresh"),
};
