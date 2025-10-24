
// //src/app/sales/route.ts
// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import Sale from "@/models/Sales";

// export async function GET(request: Request) {
//   try {
//     await dbConnect();

//     // Read the 'period' query parameter from the URL (e.g., ?period=weekly)
//     const { searchParams } = new URL(request.url);
//     const period = searchParams.get('period') || 'today'; // Default to 'today'

//     // Determine the date range based on the period
//     let startDate: Date;
//     let endDate: Date = new Date();

//     const now = new Date();

//     switch (period) {
//       case 'weekly':
//         // Calculates the start of the week (Sunday)
//         const firstDayOfWeek = now.getDate() - now.getDay();
//         startDate = new Date(now.setDate(firstDayOfWeek));
//         startDate.setHours(0, 0, 0, 0);
        
//         // Sets the end of the week (Saturday)
//         endDate = new Date(startDate);
//         endDate.setDate(endDate.getDate() + 6);
//         endDate.setHours(23, 59, 59, 999);
//         break;

//       case 'monthly':
//         // First day of the current month
//         startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//         startDate.setHours(0, 0, 0, 0);
        
//         // Last day of the current month
//         endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//         endDate.setHours(23, 59, 59, 999);
//         break;
        
//       default: // 'today'
//         startDate = new Date();
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//     }

//     // Fetch sales from the database within the calculated date range
//     const periodSales = await Sale.find({
//       createdAt: { $gte: startDate, $lte: endDate },
//     });

//     // --- The rest of the logic is the same, just using 'periodSales' ---

//     const cashSales = periodSales
//       .filter((sale) => sale.paymentMethod === "cash")
//       .reduce((sum, sale) => sum + sale.amount, 0);

//     const qrSales = periodSales
//       .filter((sale) => sale.paymentMethod === "qr")
//       .reduce((sum, sale) => sum + sale.amount, 0);

//     const totalSales = cashSales + qrSales;
//     const billsCount = periodSales.length;

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
//  * POST: This function remains unchanged.
//  */
// export async function POST(request: Request) {
//   try {
//     await dbConnect();

//     const { amount, paymentMethod } = await request.json();

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

// In: src/app/api/sales/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import Sale from "@/models/Sales";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  // ====================== START SERVER-SIDE DEBUGGING ======================
  console.log("\n--- [GET /api/sales] Attempting to get session ---");
  const session = await getServerSession(authOptions);
  console.log("[GET /api/sales] Session object received:", session);
  // ======================= END SERVER-SIDE DEBUGGING =======================

  const tenantId = session?.user?.tenantId as string;
  if (!tenantId) {
    console.error("[GET /api/sales] Authentication failed: No tenantId found in session.");
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';
    let startDate: Date;
    const now = new Date();
    switch (period) {
      case 'weekly':
        const firstDayOfWeek = now.getDate() - now.getDay();
        startDate = new Date(now.setDate(firstDayOfWeek));
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date();
        break;
    }
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const periodSales = await Sale.find({
      tenantId: tenantId,
      createdAt: { $gte: startDate, $lte: endDate },
    });
    const cashSales = periodSales.filter(s => s.paymentMethod === "cash").reduce((sum, s) => sum + s.amount, 0);
    const qrSales = periodSales.filter(s => s.paymentMethod === "qr").reduce((sum, s) => sum + s.amount, 0);
    return NextResponse.json({
      total: cashSales + qrSales,
      cash: cashSales,
      qr: qrSales,
      bills: periodSales.length,
      lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  } catch (error) {
    console.error("Failed to fetch sales data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Add the same logs to the POST function for consistency
export async function POST(request: Request) {
  console.log("\n--- [POST /api/sales] Attempting to get session ---");
  const session = await getServerSession(authOptions);
  console.log("[POST /api/sales] Session object received:", session);

  const tenantId = session?.user?.tenantId as string;
  if (!tenantId) {
    console.error("[POST /api/sales] Authentication failed: No tenantId found in session.");
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  try {
    await dbConnect();
    const { amount, paymentMethod } = await request.json();
    if (amount === undefined || !paymentMethod) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    const newSale = new Sale({
      tenantId,
      amount,
      paymentMethod,
    });
    await newSale.save();
    return NextResponse.json({ message: "Sale created", sale: newSale }, { status: 201 });
  } catch (error)
  {
    console.error("Failed to create sale:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}