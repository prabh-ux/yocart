// models/coupon.ts
import mongoose, { Model } from "mongoose";

const Schema = mongoose.Schema;

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  forNewUser: {
    type: Boolean,
    default: false
  },
  forMember: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export const couponModel: Model<any> =
  mongoose.models.coupons || mongoose.model("coupons", couponSchema);