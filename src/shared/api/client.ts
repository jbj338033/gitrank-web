import ky from "ky";
import type { ApiError } from "../types";

class ApiHttpError extends Error {
  code: string;

  constructor({ code, message }: ApiError) {
    super(message);
    this.code = code;
  }
}

export { ApiHttpError };

export const client = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL || "/",
  credentials: "include",
  hooks: {
    beforeError: [
      async (error) => {
        const body = await error.response.json<ApiError>().catch(() => null);
        if (body?.code) throw new ApiHttpError(body);
        return error;
      },
    ],
  },
});
