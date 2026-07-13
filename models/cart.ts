// models/cart.ts
import mongoose, { Model } from "mongoose";

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: false });

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, { timestamps: true });

export const cartModel: Model<any> =
  mongoose.models.carts || mongoose.model("carts", cartSchema);