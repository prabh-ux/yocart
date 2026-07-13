// models/order.ts
import mongoose, { Model } from "mongoose";

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: false });

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  items: [orderItemSchema],
  address: {
    name: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING"
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "CARD"],
    default: "COD"
  },
  isPaid: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const orderModel: Model<any> =
  mongoose.models.orders || mongoose.model("orders", orderSchema);