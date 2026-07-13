// app/api/store/product/add/route.ts
import "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { productModel } from "@/models/product";
import { userModel } from "@/models/user";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export const POST = async (req: NextRequest) => {
  const logCtx = "[POST /api/store/product/add]";

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      console.warn(`${logCtx} No token cookie present`);
      return NextResponse.json({ msg: "Not authenticated", success: false }, { status: 401 });
    }

    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    } catch (jwtErr) {
      console.error(`${logCtx} JWT verification failed:`, {
        name: (jwtErr as Error).name,
        message: (jwtErr as Error).message,
      });
      return NextResponse.json({ msg: "Invalid or expired token", success: false }, { status: 401 });
    }

    const user = await userModel.findById(decoded.id).catch((dbErr) => {
      console.error(`${logCtx} DB error while fetching user ${decoded.id}:`, dbErr);
      throw new Error("USER_LOOKUP_FAILED");
    });

    if (!user || user.role !== "vendor") {
      console.warn(`${logCtx} Unauthorized access attempt by user ${decoded.id}`, {
        found: !!user,
        role: user?.role,
      });
      return NextResponse.json({ msg: "Not authorized", success: false }, { status: 403 });
    }

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;

    // basic validation with detailed feedback
    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!description) missing.push("description");
    if (isNaN(mrp)) missing.push("mrp");
    if (isNaN(price)) missing.push("price");
    if (!category) missing.push("category");

    if (missing.length) {
      console.warn(`${logCtx} Missing/invalid fields:`, missing);
      return NextResponse.json(
        { msg: `Missing or invalid fields: ${missing.join(", ")}`, success: false },
        { status: 400 }
      );
    }

    const files = formData.getAll("images") as File[];

    if (!files.length) {
      console.warn(`${logCtx} No images provided by vendor ${decoded.id}`);
      return NextResponse.json({ msg: "At least one image is required", success: false }, { status: 400 });
    }

    // upload every image to Cloudinary in parallel, with per-file error context
    let imageUrls: string[];
    try {
      imageUrls = await Promise.all(
        files.map(async (file, idx) => {
          try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return await uploadToCloudinary(buffer, "products");
          } catch (uploadErr) {
            console.error(`${logCtx} Cloudinary upload failed for file[${idx}] "${file.name}":`, {
              size: file.size,
              type: file.type,
              error: (uploadErr as Error).message,
              stack: (uploadErr as Error).stack,
            });
            throw new Error(`IMAGE_UPLOAD_FAILED:${file.name}`);
          }
        })
      );
    } catch (uploadAggregateErr) {
      console.error(`${logCtx} Image upload stage failed:`, (uploadAggregateErr as Error).message);
      return NextResponse.json(
        { msg: `Image upload failed: ${(uploadAggregateErr as Error).message}`, success: false },
        { status: 502 }
      );
    }

    let product;
    try {
      product = await productModel.create({
        name,
        description,
        mrp,
        price,
        category,
        images: imageUrls,
        vendor: decoded.id,
        inStock: true,
        isActive: true,
      });
    } catch (dbErr) {
      if (dbErr instanceof mongoose.Error.ValidationError) {
        console.error(`${logCtx} Mongoose validation error:`, {
          errors: Object.fromEntries(
            Object.entries(dbErr.errors).map(([k, v]) => [k, v.message])
          ),
        });
        return NextResponse.json(
          { msg: "Validation failed", success: false, errors: dbErr.errors },
          { status: 400 }
        );
      }

      console.error(`${logCtx} DB error while creating product:`, {
        name: (dbErr as Error).name,
        message: (dbErr as Error).message,
        stack: (dbErr as Error).stack,
      });
      return NextResponse.json({ msg: "Failed to save product", success: false }, { status: 500 });
    }

    console.info(`${logCtx} Product created successfully: ${product._id} by vendor ${decoded.id}`);
    return NextResponse.json({ msg: "Product added", success: true, product }, { status: 200 });
  } catch (err) {
    console.error(`${logCtx} Unhandled error:`, {
      name: (err as Error)?.name,
      message: (err as Error)?.message,
      stack: (err as Error)?.stack,
    });
    return NextResponse.json({ msg: "Internal Server Error", success: false }, { status: 500 });
  }
};