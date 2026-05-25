import { z } from "zod";
import { CATEGORIES, PAYMENT_METHODS } from "@/types/expense";

export const expenseInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional().default(""),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentMethod: z.enum(PAYMENT_METHODS),
  date: z.coerce.date().refine((d) => d <= new Date(), {
    message: "Date cannot be in the future",
  }),
  category: z.enum(CATEGORIES),
  subCategory: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
});

export type ExpenseInput = z.infer<typeof expenseInputSchema>;

export const expenseListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().optional(),
  category: z.enum(CATEGORIES).optional(),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  sort: z
    .enum(["date-desc", "date-asc", "amount-desc", "amount-asc"])
    .default("date-desc"),
});

export type ExpenseListQuery = z.infer<typeof expenseListQuerySchema>;
