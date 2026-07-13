import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { userModel } from "@/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const body = await req.json();
    const { name, email, street, city, state, zipCode, country, phone } = body;

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ msg: "User not found", success: false }, { status: 404 });
    }

    user.addresses.push({ name, email, street, city, state, zipCode, country, phone });
    await user.save();

    return NextResponse.json({ msg: "Address saved", success: true, addresses: user.addresses }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};