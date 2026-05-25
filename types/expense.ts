export const PAYMENT_METHODS = [
  "cash",
  "upi",
  "credit-card",
  "debit-card",
  "bank-transfer",
] as const;

export const CATEGORIES = [
  "travel",
  "food",
  "accommodation",
  "other",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type Category = (typeof CATEGORIES)[number];

export type ExpenseDTO = {
  _id: string;
  title: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  category: Category;
  subCategory: string;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type ExpenseFormData = {
  title: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  category: Category;
  subCategory: string;
  notes: string;
  tags: string[];
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  upi: "UPI",
  "credit-card": "Credit Card",
  "debit-card": "Debit Card",
  "bank-transfer": "Bank Transfer",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  travel: "Travel",
  food: "Food",
  accommodation: "Accommodation",
  other: "Other",
};
