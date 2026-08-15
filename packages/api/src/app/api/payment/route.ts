import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'
import signatureInitiatorFunction from '../../../lib/signature'

function isLocalDevOrigin(origin: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function dynamicCorsHeaders(request: Request) {
  const origin = request.headers.get('origin');
  const allowOrigin = origin && isLocalDevOrigin(origin) ? origin : 'http://localhost:5173';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, Accept, Origin',
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: dynamicCorsHeaders(request),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      merchantId,
      userWalletAddress, // Reminding: This must be a Base58 Private Key text string for backend execution!
      amount,
      token,             // FIX: Destructure 'token' to match your payload key ("token": "SOL")
      metadata: {
        orderId,
        productName
      }
    } = body;

    // FIX: merchantId is directly the wallet string in your JSON example payload.
    // If you fetch from Prisma later, uncomment the DB lookup block.
    const targetMerchantWallet = merchantId; 
    const senderSecretKey = userWalletAddress;

    // FIX: Removed the non-existent property access (.walletAddress) and used the 'token' variable
    const signature = await signatureInitiatorFunction(
      senderSecretKey,
      targetMerchantWallet, 
      token,
      amount
    );  

    console.log("signature is:", signature);
    console.log("type of the signature is:", typeof(signature));

    if (!signature) {
      return NextResponse.json({
        success: false, // Fixed typo "sucees"
        message: "Blockchain transaction execution failed"
      }, {
        status: 500,
        headers: dynamicCorsHeaders(request)
      });
    }

    return NextResponse.json({
        success: true,
        message: "payment created successfully",
        data: {
          signature,
        },
    }, {
      status: 200,
      headers: dynamicCorsHeaders(request)
    });
    
  } catch (error) {
    console.error("Payload parsing error:", error);
    return NextResponse.json({
        success: false,
        message: "invalid request body"
    }, {
        status: 400,
        headers: dynamicCorsHeaders(request)
    });
  }
}
