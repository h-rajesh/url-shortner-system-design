import { getRedis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
    const redis = await getRedis();

    await redis.set("nextjs-test","Redis is working");

    const value = await redis.get("nextjs-test");

    return NextResponse.json({
        value,
    });
}