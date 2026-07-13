// app/api/products/getProducts/route.ts
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { productModel } from "@/models/product";

export const GET = async () => {
  try {
    await connectDB();
    const products = await productModel.find({ isActive: true });
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, msg: "Server error" }, { status: 500 });
  }
};