// app/api/rating/getRatings/route.ts
import "@/lib/db";
import { NextResponse } from "next/server";
import { ratingModel } from "@/models/rating";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const ratings = await ratingModel.find({ user: decoded.id });

    return NextResponse.json({ msg: "Ratings fetched", success: true, ratings }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};