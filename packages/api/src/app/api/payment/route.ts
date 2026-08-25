import { NextRequest,NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

/*
  {
    "merchantAPI":"blew_883145bd9bb9a6ff41426a46a0f40ae4441afdcb2b00de3d924d905ec6d1af86",
    "userWalletAddress":"3HcFa4NofPAb3oReuj2PVxqYpzKKt9yVpg3KDkTHCkdENGEzZXpfXKtuyf5yoaP3efJeKiJB4QzuF1jc6jmhRtuv",
    "amount":0.5,
    "token":"SOL",
    "metadata":
    {"orderId":"order_456",
    "productName":"Example Product"
    }
}  

*/
export async function POST(request:NextRequest) {
  try {
    const body = await request.json();
    const merchantXAPI = request.headers.get('x-api-key');
    const { userWalletAddress, amount, token, metadata: { orderId, productName } } = body;
    



    return NextResponse.json({
      msg: "success",
      body: body,
      "x-api-key":merchantXAPI,
      status: 200,
    }
      ) 
  } catch(error) {
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

