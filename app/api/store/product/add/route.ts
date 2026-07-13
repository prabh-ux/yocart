// app/api/store/product/add/route.ts
import "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { productModel } from "@/models/product";
import { userModel } from "@/models/user";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await userModel.findById(decoded.id);
    if (!user || user.role !== "vendor") {
      return NextResponse.json({ msg: "Not authorized", success: false }, { status: 403 });
    }

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;

    if (!name || !description || !category) {
      return NextResponse.json({ msg: "Missing required fields", success: false }, { status: 400 });
    }

    if (isNaN(mrp) || isNaN(price)) {
      return NextResponse.json({ msg: "Invalid price values", success: false }, { status: 400 });
    }

    // all files sent under the "images" field
    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json({ msg: "At least one image is required", success: false }, { status: 400 });
    }

    // upload every image to Cloudinary in parallel
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return uploadToCloudinary(buffer, "products");
      })
    );

    const product = await productModel.create({
      name,
      description,
      mrp,
      price,
      category,
      images: imageUrls,
      vendor: decoded.id,
      inStock: true,
      isActive: true
    });

    return NextResponse.json({ msg: "Product added", success: true, product }, { status: 200 });
  } catch (err: any) {
    console.error("=== ADD PRODUCT ERROR ===");
    console.error("Message:", err?.message);
    console.error("Name:", err?.name);
    console.error("HTTP code:", err?.http_code);
    console.error("Full error object:", JSON.stringify(err, null, 2));
    console.error("Error object (raw):", err);
    console.error("Stack:", err?.stack);
    console.error("=========================");

    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};