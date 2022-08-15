import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default function initMiddleware<T = unknown, R = unknown>(
  middleware: (
    req: NextApiRequest,
    res: NextApiResponse,
    next: (result: T) => void
  ) => R
): NextApiHandler {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: T) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}
