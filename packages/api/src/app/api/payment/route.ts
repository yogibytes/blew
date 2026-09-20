import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { PublicKey } from '@solana/web3.js'

const supportedTokens = new Set(['SOL'])
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

function withCors(response: NextResponse, request: NextRequest) {
  const origin = request.headers.get('origin')
  const isAllowed = allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))

  if (isAllowed && origin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Vary', 'Origin')
  }
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

async function handlePost(request: NextRequest) {
  try {
    const body = await request.json()
    const { api, userWalletAddress, amount, token = 'SOL', metadata, signature } = body

    if (typeof api !== 'string' || !api.trim()) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 })
    }

    const amountNumber = Number(amount)
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
    }

    if (!supportedTokens.has(token)) {
      return NextResponse.json({ error: 'Only SOL payments are currently supported' }, { status: 400 })
    }

    const merchant = await prisma.merchant.findUnique({
      where: { apiKey: api },
      select: { id: true, walletAddress: true },
    })
    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 })
    }

    try {
      new PublicKey(merchant.walletAddress)
    } catch {
      return NextResponse.json({ error: 'Merchant wallet address is invalid' }, { status: 500 })
    }

    if (!signature) {
      return NextResponse.json({
        success: true,
        data: { recipientPublicKey: merchant.walletAddress, token },
      })
    }

    if (typeof signature !== 'string' || !userWalletAddress) {
      return NextResponse.json({ error: 'Wallet address and transaction signature are required' }, { status: 400 })
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { solanaSignature: signature },
      select: { id: true, amount: true, token: true, status: true, expiresAt: true, customerWallet: true },
    })
    if (existingPayment) {
      return NextResponse.json({ success: true, data: { ...existingPayment, signature } })
    }

    const payment = await prisma.payment.create({
      data: {
        merchantId: merchant.id,
        amount: amountNumber,
        token,
        solanaSignature: signature,
        customerWallet: userWalletAddress,
        status: 'pending',
        metadata: metadata ?? undefined,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: payment.id,
        amount: payment.amount,
        token: payment.token,
        status: payment.status,
        recipientPublicKey: merchant.walletAddress,
        expiresAt: payment.expiresAt,
        metadata: payment.metadata,
        signature,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      {
        error: 'Something went wrong',
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return withCors(await handlePost(request), request)
}

export async function OPTIONS(request: NextRequest) {
  return withCors(new NextResponse(null, { status: 204 }), request)
}

