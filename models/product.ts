// models/product.ts
import mongoose, { Model } from "mongoose";

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  rating: { type: Number, required: true },
  review: { type: String },
  user: {
    name: { type: String },
    image: { type: String }
  }
}, { _id: false });

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  mrp: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [
    {
      type: String,
      required: true
    }
  ],
  category: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  rating: [ratingSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const productModel: Model<any> =
  mongoose.models.products || mongoose.model("products", productSchema);