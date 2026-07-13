// app/api/store/product/toggleStock/route.ts
import "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { productModel } from "@/models/product";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const { productId } = await req.json();

    const product = await productModel.findOne({ _id: productId, vendor: decoded.id });
    if (!product) {
      return NextResponse.json({ msg: "Product not found", success: false }, { status: 404 });
    }

    product.inStock = !product.inStock;
    await product.save();

    return NextResponse.json({ msg: "Stock updated", success: true, product }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};