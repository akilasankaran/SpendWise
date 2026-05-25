import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/database/user.model";
import { handleApiError, apiError } from "@/lib/api-response";
import { registerSchema } from "@/lib/validations/user";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const data = registerSchema.parse(body);

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return apiError("An account with this email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: { id: user._id.toString(), name: user.name, email: user.email },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
