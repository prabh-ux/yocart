import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { productModel } from "@/models/product";
import { orderModel } from "@/models/order";
import { userModel } from "@/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await userModel.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ msg: "Not authorized", success: false }, { status: 403 });
    }

    const products = await productModel.countDocuments();
    const orders = await orderModel.countDocuments();
    const allOrders = await orderModel.find({}).select("createdAt total");
    const revenue = allOrders.reduce((sum, o: any) => sum + o.total, 0);

    return NextResponse.json({
      success: true,
      products,
      orders,
      revenue: revenue.toFixed(2),
      stores: 0,
      allOrders
    }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};