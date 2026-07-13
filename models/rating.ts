// models/rating.ts
import mongoose, { Model } from "mongoose";

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "orders",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String
  }
}, { timestamps: true });

// prevent duplicate ratings for the same product within the same order
ratingSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

export const ratingModel: Model<any> =
  mongoose.models.ratings || mongoose.model("ratings", ratingSchema);