// models/user.ts
import mongoose, { Model } from "mongoose";

const Schema = mongoose.Schema;

const addressSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const purchaseSchema = new Schema({
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
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "orders"
  }
}, { _id: false });

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "user", "vendor"],
    default: "user"
  },
  addresses: [addressSchema],
  purchaseHistory: [purchaseSchema]
});

export const userModel: Model<any> = mongoose.models.users || mongoose.model("users", userSchema);