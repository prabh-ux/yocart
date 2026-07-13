import { NextResponse } from "next/server";

export const POST = async () => {
  return NextResponse.json({ msg: "Logged out successfully", success: true }, { status: 200 });
};