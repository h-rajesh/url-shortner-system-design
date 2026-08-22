import prisma from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    shortCode: string;
  }>;
};

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  const { shortCode } = await context.params;

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

  await prisma.url.delete({
    where: {
      shortCode,
    },
  });

  const redis = await getRedis();

  await redis.del(shortCode);

  return NextResponse.json({
    message: "Short URL deleted successfully",
  });
}