// app/api/store/orders/updateStatus/route.ts
import "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { orderModel } from "@/models/order";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });

    jwt.verify(token, process.env.JWT_SECRET as string); // just confirming valid vendor session

    const { orderId, status } = await req.json();

    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return NextResponse.json({ msg: "Order not found", success: false }, { status: 404 });
    }

    return NextResponse.json({ msg: "Status updated", success: true, order }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};