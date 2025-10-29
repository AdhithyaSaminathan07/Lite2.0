// src/app/api/sales/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Sale from "@/models/Sales";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';

    let startDate: Date;
    let endDate: Date = new Date();
    const now = new Date();

    switch (period) {
      case 'weekly':
        const firstDayOfWeek = now.getDate() - now.getDay();
        startDate = new Date(now.setDate(firstDayOfWeek));
        startDate.setHours(0, 0, 0, 0);
        
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
        
      default:
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
    }

    const periodSales = await Sale.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const cashSales = periodSales
      .filter((sale) => sale.paymentMethod === "cash")
      .reduce((sum, sale) => sum + sale.amount, 0);

    const qrSales = periodSales
      .filter((sale) => sale.paymentMethod === "qr")
      .reduce((sum, sale) => sum + sale.amount, 0);

    const totalSales = cashSales + qrSales;
    const billsCount = periodSales.length;

    const result = {
      total: totalSales,
      cash: cashSales,
      qr: qrSales,
      bills: billsCount,
      lastUpdated: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error("Failed to fetch sales data:", error);
    return NextResponse.json(
      { 
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { amount, paymentMethod } = body;

    // Validate input
    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { message: "Amount is required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { message: "Payment method is required" },
        { status: 400 }
      );
    }

    // Validate payment method
    const validMethods = ['cash', 'qr', 'card'];
    if (!validMethods.includes(paymentMethod.toLowerCase())) {
      return NextResponse.json(
        { message: "Invalid payment method. Must be 'cash', 'qr', or 'card'" },
        { status: 400 }
      );
    }

    const newSale = new Sale({
      amount: Number(amount),
      paymentMethod: paymentMethod.toLowerCase(),
    });

    await newSale.save();

    return NextResponse.json(
      { message: "Sale created successfully", sale: newSale },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create sale:", error);
    return NextResponse.json(
      { 
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
