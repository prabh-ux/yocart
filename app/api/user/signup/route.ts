import "@/lib/db";
import { signUpSchema } from "@/middleware/jwtVerify";
import { NextRequest, NextResponse } from "next/server";
import { userModel } from "@/models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface signUpBody {
  name: string;
  email: string;
  password: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const body: signUpBody = await req.json();
    const { error } = signUpSchema.validate(body);

    if (error) {
      return NextResponse.json(
        { msg: error.details[0].message, success: false },
        { status: 400 },
      );
    }

    const { name, email, password } = body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { msg: "User already exists", success: false },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json(
      { msg: "Signup successful", success: true, name: newUser.name },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};