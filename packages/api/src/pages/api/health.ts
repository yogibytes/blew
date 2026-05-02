import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
      version: '0.1.0'
    })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
