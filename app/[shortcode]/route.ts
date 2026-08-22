import prisma from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    shortcode: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { shortcode: shortCode } = await context.params;

  let redis;

  // 1. Try Redis
  try {
    redis = await getRedis();

    const cachedUrl = await redis.get(shortCode);

    if (cachedUrl) {
      console.log("CACHE HIT");

      return NextResponse.redirect(cachedUrl, 302);
    }

    console.log("CACHE MISS");
  } catch (error) {
    console.error("Redis unavailable:", error);
  }

  // 2. Redis miss/unavailable → PostgreSQL
  const url = await prisma.url.findUnique({
    where: {
      shortCode,
    },
  });

  if (!url) {
    return NextResponse.json(
      { error: "Short URL not found" },
      { status: 404 }
    );
  }

  // 3. Try to populate Redis
  try {
    if (redis) {
      await redis.set(shortCode, url.originalUrl, {
        EX: 60 * 60,
      });

      console.log("SAVED TO CACHE");
    }
  } catch (error) {
    console.error("Failed to save to Redis:", error);
  }

  // 4. Redirect regardless of Redis status
  return NextResponse.redirect(url.originalUrl, 302);
}