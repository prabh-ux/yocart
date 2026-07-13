import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { orderModel } from "@/models/order";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const orders = await orderModel
      .find({ user: decoded.id })
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    return NextResponse.json({ msg: "Orders fetched", success: true, orders }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};