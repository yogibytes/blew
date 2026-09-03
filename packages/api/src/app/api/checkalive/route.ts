import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // This will print in your terminal she..
    // ll when Postman hits the URL
    console.log("chilll server is alive"); 

    return NextResponse.json({
        success: true,
        msg: "server is alive"
    }, {
        status: 200
    });
}
