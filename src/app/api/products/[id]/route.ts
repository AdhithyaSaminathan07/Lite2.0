// // FILE: src/app/api/products/[id]/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

// ✅ No custom type; directly match Next.js RouteHandlerContext shape
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await context.params;
  const { id } = params;

  const session = await getServerSession(authOptions);
  const tenantId = session?.user?.email;

  if (!tenantId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    const query = { _id: id, tenantId };
    const updateOperation =
      "quantityToDecrement" in body && typeof body.quantityToDecrement === "number"
        ? { $inc: { quantity: -body.quantityToDecrement } }
        : { $set: body };

    const updatedProduct = await Product.findOneAndUpdate(query, updateOperation, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found or unauthorized." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to update product", error: message },
      { status: 500 }
    );
  }
}

// --- DELETE Handler ---
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await context.params;
  const { id } = params;

  const session = await getServerSession(authOptions);
  const tenantId = session?.user?.email;

  if (!tenantId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const result = await Product.deleteOne({ _id: id, tenantId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Product not found or unauthorized." },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to delete product", error: message },
      { status: 500 }
    );
  }
}
