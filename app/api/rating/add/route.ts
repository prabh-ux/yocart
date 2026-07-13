// app/api/rating/add/route.ts
import "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ratingModel } from "@/models/rating";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const { productId, orderId, rating, review } = await req.json();

    const newRating = await ratingModel.create({
      user: decoded.id,
      product: productId,
      order: orderId,
      rating,
      review
    });

    return NextResponse.json({ msg: "Rating submitted", success: true, rating: newRating }, { status: 200 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ msg: "You already rated this product for this order", success: false }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};