// app/api/store/orders/getOrders/route.ts
import "@/lib/db";
import { NextResponse } from "next/server";
import { orderModel } from "@/models/order";
import { productModel } from "@/models/product";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // find product IDs belonging to this vendor
    const vendorProducts = await productModel.find({ vendor: decoded.id }).select("_id");
    const vendorProductIds = vendorProducts.map((p) => p._id);

    const orders = await orderModel
      .find({ "items.product": { $in: vendorProductIds } })
      .populate("items.product", "name images")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ msg: "Orders fetched", success: true, orders }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};