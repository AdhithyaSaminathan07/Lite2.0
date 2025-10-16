// // src/app/api/sales/route.ts

// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import Sale from "@/models/Sales"; // Make sure this path points to your Sale model


// export async function GET() {
//   try {
//     await dbConnect();

//     // Get today's date range
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     // Fetch today's sales from the database
//     const todaySales = await Sale.find({
//       createdAt: { $gte: startOfDay, $lte: endOfDay },
//     });

//     // Calculate totals from the fetched data
//     const cashSales = todaySales
//       .filter((sale) => sale.paymentMethod === "cash")
//       .reduce((sum, sale) => sum + sale.amount, 0);

//     const qrSales = todaySales
//       .filter((sale) => sale.paymentMethod === "qr")
//       .reduce((sum, sale) => sum + sale.amount, 0);

//     const totalSales = cashSales + qrSales;
//     const billsCount = todaySales.length;

//     // Prepare the final result
//     const result = {
//       total: totalSales,
//       cash: cashSales,
//       qr: qrSales,
//       bills: billsCount,
//       lastUpdated: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     return NextResponse.json(result);

//   } catch (error) {
//     console.error("Failed to fetch sales data:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * POST: Creates a new sale record in the database.
//  */
// export async function POST(request: Request) {
//   try {
//     await dbConnect();

//     const { amount, paymentMethod } = await request.json();

//     // Basic validation
//     if (amount === undefined || !paymentMethod) {
//       return NextResponse.json(
//         { message: "Missing required fields: amount and paymentMethod" },
//         { status: 400 }
//       );
//     }

//     const newSale = new Sale({
//       amount,
//       paymentMethod,
//     });

//     await newSale.save();

//     return NextResponse.json(
//       { message: "Sale created successfully", sale: newSale },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Failed to create sale:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Sale from "@/models/Sales";

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Read the 'period' query parameter from the URL (e.g., ?period=weekly)
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today'; // Default to 'today'

    // Determine the date range based on the period
    let startDate: Date;
    let endDate: Date = new Date();

    const now = new Date();

    switch (period) {
      case 'weekly':
        // Calculates the start of the week (Sunday)
        const firstDayOfWeek = now.getDate() - now.getDay();
        startDate = new Date(now.setDate(firstDayOfWeek));
        startDate.setHours(0, 0, 0, 0);
        
        // Sets the end of the week (Saturday)
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'monthly':
        // First day of the current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        
        // Last day of the current month
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
        
      default: // 'today'
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
    }

    // Fetch sales from the database within the calculated date range
    const periodSales = await Sale.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // --- The rest of the logic is the same, just using 'periodSales' ---

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
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST: This function remains unchanged.
 */
export async function POST(request: Request) {
  try {
    await dbConnect();

    const { amount, paymentMethod } = await request.json();

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