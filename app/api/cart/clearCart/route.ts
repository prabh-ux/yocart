import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { cartModel } from "@/models/cart";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async () => {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const cart = await cartModel.findOne({ user: decoded.id });
    if (!cart) {
      return NextResponse.json({ msg: "Cart not found", success: false }, { status: 404 });
    }

    cart.items = [] as any;
    await cart.save();

    return NextResponse.json({ msg: "Cart cleared", success: true, cart: [] }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};