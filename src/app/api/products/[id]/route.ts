// FILE: src/app/api/products/[id]/route.ts

import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

/**
 * Defines the shape of the context object for this route.
 * In Next.js 15+, `params` is a Promise that resolves to the route parameters.
 */
interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * Handles PUT requests to update a product by its ID.
 * This endpoint is public and does not require authentication.
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // ✅ CORRECTED: Await the promise to get the actual params object for Next.js 15.
    const { id } = await context.params;

    await dbConnect();
    const body = await request.json();

    // The query now only uses the product ID, making it public.
    const query = { _id: id };

    // This logic correctly handles both full updates and quantity decrements.
    const updateOperation =
      "quantityToDecrement" in body && typeof body.quantityToDecrement === "number"
        ? { $inc: { quantity: -body.quantityToDecrement } }
        : { $set: body };

    const updatedProduct = await Product.findOneAndUpdate(query, updateOperation, {
      new: true, // Return the modified document
      runValidators: true, // Ensure schema validation is run on update
    }).lean();

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    // Log the error for debugging purposes on the server
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { message: "Failed to update product", error: message },
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests to remove a product by its ID.
 * This endpoint is public and does not require authentication.
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // ✅ CORRECTED: Await the promise to get the actual params object for Next.js 15.
    const { id } = await context.params;

    await dbConnect();
    
    // The query now only uses the product ID, making it public.
    const result = await Product.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    // Return a 204 No Content response, which is standard for successful deletions.
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    // Log the error for debugging purposes on the server
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { message: "Failed to delete product", error: message },
      { status: 500 }
    );
  }
}