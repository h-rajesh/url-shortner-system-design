import prisma from "@/lib/prisma";
import { generateShortCode } from "@/lib/short-code";
import { NextResponse } from "next/server";


export async function POST(req: Request){
    const body = await req.json();

    const { originalUrl } = body;

    if(!originalUrl){
        return NextResponse.json(
            {error : "Original Url is required"},
            { status : 400 }
        );
    }

    const url = await prisma.url.create({
        data : {
            originalUrl,
            shortCode : generateShortCode(),
        }
    });

    return NextResponse.json(
        url,
        { status : 201 }
    )
}