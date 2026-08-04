import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'
import {signatureInitiatorFunction} from '../../../lib/signature' 
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

function dynamicCorsHeaders(request: Request) {
  const origin = request.headers.get('origin');
  const allowOrigin = origin && allowedOrigins.has(origin) ? origin : 'http://localhost:5173';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, x-api-key, Accept, Origin',
  };
}

// Handles browser Preflight (the 204 options check)
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: dynamicCorsHeaders(request),
  });
}

// Handles actual checkout payload
export async function POST(request: Request) {
  try {
    // const jsonData = await request.json(); 
    const body = await request.json();
    const {
      merchantID,
      userwalletAddress,
      amount,
      coin, 
      metadata: {
        orderId,
        productName
      }
    } = body;
    const apiKey = body.merchantId;
    const MerchantWalletAddress = prisma.merchant.findUnique({
      where:{apiKey},
    })
    const senderWalletAddress = body.userWalletAddress;
    const signature = signatureInitiatorFunction(senderWalletAddress, MerchantWalletAddress, coin, amount);
    
    
    /* what data we need ? 
      merchatID,
      merchnat Name,
      amount,
      token,
      coin,
      metadata:{
      "orderId":11212,
      "productName":"sexOy",
      solanaSignature,
      customerWallet,
      status pending ,success,failed,expired,

      }

      how you do it ?
    
    function (
      customerWalletAddress, 
      merchantWalletAddress,
      amount,
      coin,
      token,
      ){
      return signature;
      }
    
    const status = verifyTransaction(wAddress, signature){
    if(signature===rpc.signature)
    return true;
    else false;
    }

    if(status === true){
    setState = "success",
    }else if (status === false )
    setState = "true";
    else if(status )


    */
    return NextResponse.json({
        success: true,
        message: "payment created successfully"
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
