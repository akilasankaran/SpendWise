import { NextRequest, NextResponse } from 'next/server';
import { Expense } from '@/database';
import connectDB from '@/lib/mongodb';
import { IExpense } from '@/database/expense.model';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    const data: IExpense = await request.json();
    console.log('Data received in get request:', data);

    const expense = await Expense.create(data);
    console.log('Expenses created:', expense);
    return NextResponse.json({ message: 'Expense created successfully', expense: expense }, { status: 201 });


  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    const expenses = await Expense.find().sort({ date: -1 });
    console.log('Expenses found:', expenses);
    return NextResponse.json(expenses, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }
}