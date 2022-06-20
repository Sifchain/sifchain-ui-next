import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default function initMiddleware<T = unknown>(
  middleware: (
    req: NextApiRequest,
    res: NextApiResponse,
    next: (result: T) => void,
  ) => any,
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
