import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { userModel } from "@/models/user";
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

    const user = await userModel.findById(decoded.id).select("addresses");
    if (!user) {
      return NextResponse.json({ msg: "User not found", success: false }, { status: 404 });
    }

    return NextResponse.json({ msg: "Addresses fetched", success: true, addresses: user.addresses }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};