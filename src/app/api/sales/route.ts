// src/app/api/sales/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import Sale from "@/models/Sales";
import { authOptions } from "@/lib/auth";

/**
 * GET: Securely fetches sales data ONLY for the currently logged-in user.
 * This is a named export, which is correct.
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const tenantId = session.user.email;

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
      default: // 'today'
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
    }

    const periodSales = await Sale.find({
      tenantId: tenantId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const cashSales = periodSales
      .filter((sale) => sale.paymentMethod === "cash")
      .reduce((sum, sale) => sum + sale.amount, 0);

    const qrSales = periodSales
      .filter((sale) => sale.paymentMethod === "qr-code")
      .reduce((sum, sale) => sum + sale.amount, 0);

    const cardSales = periodSales
      .filter((sale) => sale.paymentMethod === "card")
      .reduce((sum, sale) => sum + sale.amount, 0);

    const totalSales = cashSales + qrSales + cardSales;
    const billsCount = periodSales.length;

    const result = {
      total: totalSales,
      cash: cashSales,
      qr: qrSales,
      card: cardSales,
      bills: billsCount,
      lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error("Failed to fetch sales data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST: Securely creates a sale and assigns it to the currently logged-in user.
 * This is a named export, which is correct.
 */

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.email;
    await dbConnect();

    const { amount, paymentMethod } = await request.json();
    if (!amount || !paymentMethod) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Generate simple bill ID
    const billId = `BILL-${Date.now()}`;

    const newSale = new Sale({
      tenantId,
      billId,
      amount,
      paymentMethod,
    });

    await newSale.save();
    return NextResponse.json({ message: "Sale created successfully", sale: newSale }, { status: 201 });
  } catch (error) {
    console.error("Failed to create sale:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


// CRITICAL FIX: Make sure there are NO other exports below this line.
// Especially, ensure there is NO 'export default ...' line in this file.