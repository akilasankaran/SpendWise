import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const message = error.issues.map((i) => i.message).join(", ");
    return apiError(message, 400);
  }

  if (error instanceof Error) {
    return apiError(error.message, 500);
  }

  return apiError("An unexpected error occurred", 500);
}
