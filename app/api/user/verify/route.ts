// app/api/user/verify/route.ts
import "@/lib/db";
import { userModel } from "@/models/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ msg: "No token provided", success: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const user = await userModel.findById(decoded.id).select("name email role");
    if (!user) {
      return NextResponse.json({ msg: "User not found", success: false }, { status: 404 });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Invalid or expired token", success: false }, { status: 401 });
  }
};