import Joi from 'joi';
import jwt from "jsonwebtoken";

const passwordSchema = Joi.string().min(4).max(100).required().custom((value, helper) => {
  if (value[0] !== value[0].toUpperCase()) {
    return helper.message({ custom: "First Letter of Password Should Be Uppercase" });
  }
  return value;
});

export const signUpSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: passwordSchema,
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordSchema,
});

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as { id: string };
  } catch {
    return null;
  }
};