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

    const { code } = await req.json();
    await couponModel.deleteOne({ code });

    return NextResponse.json({ msg: "Coupon deleted", success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};