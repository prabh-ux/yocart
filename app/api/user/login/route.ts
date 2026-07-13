import "@/lib/db";
import { loginSchema } from "@/middleware/jwtVerify";
import { userModel } from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface loginBody {
  email: string;
  password: string;
}

export const POST = async (req: Request) => {
  try {
    const body: loginBody = await req.json();

    const { error } = loginSchema.validate(body);

    if (error) {
      return NextResponse.json(
        { msg: error.details[0].message, success: false },
        { status: 400 },
      );
    }

    const user = await userModel.findOne({ email: body.email });
    if (!user) {
      return NextResponse.json({ msg: "User not found", success: false }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ msg: "Invalid Password", success: false }, { status: 400 });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

    const response = NextResponse.json(
      { msg: "Login successful", name: user.name, success: true },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 // 1 day, matches JWT expiry
    });

    return response;
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};