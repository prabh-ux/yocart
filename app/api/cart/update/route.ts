import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cartModel } from "@/models/cart";
import { productModel } from "@/models/product";
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
    const { productId, quantity } = await req.json(); // quantity = final desired amount, 0 removes item

    let cart = await cartModel.findOne({ user: decoded.id });
    if (!cart) cart = new cartModel({ user: decoded.id, items: [] });

    const existingItem = cart.items.find(
      (item: any) => item.product.toString() === productId
    );

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item: any) => item.product.toString() !== productId
      ) as any;
    } else if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      const product = await productModel.findById(productId);
      if (!product) {
        return NextResponse.json({ msg: "Product not found", success: false }, { status: 404 });
      }
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();

    const populatedCart = await cartModel
      .findOne({ user: decoded.id })
      .populate("items.product", "name price images");

    return NextResponse.json(
      { msg: "Cart updated", success: true, cart: populatedCart?.items ?? [] },
      { status: 200 }
    );
  } catch (err) {
    console.error("CART UPDATE ERROR:", err);
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};