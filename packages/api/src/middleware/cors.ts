import { NextApiRequest, NextApiResponse } from 'next'

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*' // tighten this in production

export function withCors(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>
) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return
  }

  return handler(req, res);
}
