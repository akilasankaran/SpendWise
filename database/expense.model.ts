import { Document, Schema, model, models } from 'mongoose';

export interface IExpense extends Document {
  title: string;
  description: string;
  amount: number;
  paymentMethod: "cash" | "upi" | "credit-card" | "debit-card" | "bank-transfer";
  date: Date;
  category: "travel" | "food" | "accommodation" | "other";
  subCategory: string;
  notes: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}


const ExpenseSchema = new Schema<IExpense>({
  title:{type: String, required: [true, 'Title is required']},
  description:{type: String, default: ''},
  amount: {
    type: Number, required: [true, 'Amount is required'],
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: "Amount must be a number and greater than 0",
    }
  },
  paymentMethod:{type: String, required: [true, 'Payment method is required'], enum: ["cash", "upi", "credit-card", "debit-card", "bank-transfer"]},
  date:{type: Date, required: true,  validate: {
    validator: function (value) {
      return value <= new Date();
    },
    message: "Date cannot be in the future",
  }},
  category:{type: String, required: [true, 'Category is required'], enum: ["travel", "food", "accommodation", "other"]},
  subCategory:{type: String, default: ''},
  notes: { type: String },
  tags:{type: [String], default: []},
}, {
  timestamps: true, // Auto-generate createdAt and updatedAt
})

ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ paymentMethod: 1 });


export default models.Expense || model<IExpense>('Expense', ExpenseSchema);
