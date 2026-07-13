import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cartModel } from "@/models/cart";
import { orderModel } from "@/models/order";
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
    const { addressId } = await req.json();

    const cart = await cartModel.findOne({ user: decoded.id });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ msg: "Cart is empty", success: false }, { status: 400 });
    }

    const user = await userModel.findById(decoded.id);
    const address = user?.addresses.id(addressId);
    if (!address) {
      return NextResponse.json({ msg: "Address not found", success: false }, { status: 404 });
    }

    const total = cart.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const order = new orderModel({
      user: decoded.id,
      items: cart.items,
      address: {
        name: address.name,
        email: address.email,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone
      },
      total
    });

    await order.save();

    cart.items = [] as any;
    await cart.save();

    return NextResponse.json({ msg: "Order placed", success: true, order }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};