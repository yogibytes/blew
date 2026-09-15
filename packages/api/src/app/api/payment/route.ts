import { NextRequest,NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request:NextRequest) {
  try {
    const body = await request.json();
    const { merchantID ,api , userWalletAddress, amount, token,metadata } = body;
    const { orderId, ProductName } = metadata ?? {};

    const merchant = await prisma.merchant.findUnique({
      where:
        { apiKey: api },
      select:
        { walletAddress: true }
    })
    if (!merchant) {
     return NextResponse.json({ msg: "error", error: "Merchant not found" }, { status: 404 })
    }
    
    const merchantWalletAddress = merchant?.walletAddress;
    return NextResponse.json({
      msg: "success",
      response: {
        merchantwallet: merchantWalletAddress
      },
      status: 200,
    })
    
    } catch(error) {
    console.log("error is ",error);
    return NextResponse.json(
      {
        msg: "error",
        error: "Something went wrong",
      },
      {
        status: 500,
      })
  }
}

export async function GET(reqest: NextRequest, response: NextResponse) {
  
}

