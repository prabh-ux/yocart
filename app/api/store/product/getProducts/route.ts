// app/api/store/product/getProducts/route.ts
import "@/lib/db";
import { NextResponse } from "next/server";
import { productModel } from "@/models/product";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const products = await productModel.find({ vendor: decoded.id }).sort({ createdAt: -1 });

    return NextResponse.json({ msg: "Products fetched", success: true, products }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};