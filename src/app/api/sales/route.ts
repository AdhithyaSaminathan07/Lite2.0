// src/app/api/sales/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Sale from "@/models/Sales"; // Make sure this path points to your Sale model

/**
 * GET: Fetches and calculates sales for the current day.
 */
export async function GET() {
  try {
    await dbConnect();

    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch today's sales from the database
    const todaySales = await Sale.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Calculate totals from the fetched data
    const cashSales = todaySales
      .filter((sale) => sale.paymentMethod === "cash")
      .reduce((sum, sale) => sum + sale.amount, 0);

    const qrSales = todaySales
      .filter((sale) => sale.paymentMethod === "qr")
      .reduce((sum, sale) => sum + sale.amount, 0);

    const totalSales = cashSales + qrSales;
    const billsCount = todaySales.length;

    // Prepare the final result
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
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST: Creates a new sale record in the database.
 */
export async function POST(request: Request) {
  try {
    await dbConnect();

    const { amount, paymentMethod } = await request.json();

    // Basic validation
    if (amount === undefined || !paymentMethod) {
      return NextResponse.json(
        { message: "Missing required fields: amount and paymentMethod" },
        { status: 400 }
      );
    }

    const newSale = new Sale({
      amount,
      paymentMethod,
    });

    await newSale.save();

    return NextResponse.json(
      { message: "Sale created successfully", sale: newSale },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create sale:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}