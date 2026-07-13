import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { couponModel } from "@/models/coupon";
import { userModel } from "@/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await userModel.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ msg: "Not authorized", success: false }, { status: 403 });
    }

    const body = await req.json();
    const coupon = await couponModel.create(body);

    return NextResponse.json({ msg: "Coupon added", success: true, coupon }, { status: 200 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ msg: "Coupon code already exists", success: false }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};