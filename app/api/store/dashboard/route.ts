// app/api/store/dashboard/route.ts
import "@/lib/db";
import { NextResponse } from "next/server";
import { productModel } from "@/models/product";
import { orderModel } from "@/models/order";
import { ratingModel } from "@/models/rating";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const vendorProducts = await productModel.find({ vendor: decoded.id }).select("_id");
    const vendorProductIds = vendorProducts.map((p) => p._id);

    const totalProducts = vendorProducts.length;

    const orders = await orderModel.find({ "items.product": { $in: vendorProductIds } });
    const totalOrders = orders.length;
    const totalEarnings = orders.reduce((sum: number, o: any) => {
      const vendorItems = o.items.filter((item: any) => vendorProductIds.some((id) => id.equals(item.product)));
      return sum + vendorItems.reduce((s: number, item: any) => s + item.price * item.quantity, 0);
    }, 0);

    const ratings = await ratingModel
      .find({ product: { $in: vendorProductIds } })
      .populate("product", "name category")
      .populate("user", "name");

    return NextResponse.json({
      success: true,
      totalProducts,
      totalOrders,
      totalEarnings: totalEarnings.toFixed(2),
      ratings
    }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};