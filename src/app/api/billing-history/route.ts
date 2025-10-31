// // //src/app/api/billing-history/route.
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import connectMongoDB from "@/lib/mongodb";
// import Sales from "@/models/Sales";
// import { authOptions } from "@/lib/auth";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectMongoDB();

//     const tenantId = session.user.email;
//     const bills = await Sales.find({ tenantId }).sort({ createdAt: -1 });

//     // 👇 Only send what you need to frontend
//     const formatted = bills.map((b) => ({
//       id: b._id,
//       amount: b.amount,
//       paymentMethod: b.paymentMethod,
//       createdAt: b.createdAt,
//     }));

//     return NextResponse.json(formatted);
//   } catch (error) {
//     console.error("Error fetching billing history:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch billing history" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongoDB from "@/lib/mongodb";
import Sales from "@/models/Sales";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const startDate = from ? new Date(from) : new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = to ? new Date(to) : new Date();
    endDate.setHours(23, 59, 59, 999);

    const tenantId = session.user.email;
    const bills = await Sales.find({
      tenantId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 });

    return NextResponse.json(bills);
  } catch (error) {
    console.error("Error fetching billing history:", error);
    return NextResponse.json({ error: "Failed to fetch billing history" }, { status: 500 });
  }
}
