// scripts/seedProducts.ts
import mongoose from "mongoose";
import { productModel } from "../models/product";

const MONGO_URI = process.env.MONGODB_URI as string;

const products = [
  {
    name: "Modern table lamp",
    description: "Modern table lamp with a sleek design...",
    mrp: 40,
    price: 29,
    images: ["/product_img1.png", "/product_img2.png"],
    category: "Decoration",
    inStock: true,
    rating: [{ rating: 4.2, review: "Great product", user: { name: "Kristin Watson" } }]
  },
  {
    name: "Smart speaker gray",
    description: "Smart speaker with a sleek design...",
    mrp: 50,
    price: 29,
    images: ["/product_img2.png"],
    category: "Speakers",
    inStock: true,
    rating: [{ rating: 5.0, review: "Love it", user: { name: "Jenny Wilson" } }]
  }
  // add the rest of your 12 products the same way
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  await productModel.deleteMany({});
  await productModel.insertMany(products);
  console.log("Seeded products");
  process.exit(0);
}

seed();