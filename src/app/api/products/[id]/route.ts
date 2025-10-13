

// src/app/api/products/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// --- UPDATE a single product by its ID ---
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Type updated to Promise
) {
  try {
    const { id } = await params; // <-- Await params to get the id
    const body = await request.json();

    const { id: _, ...updateData } = body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: `Product with ID ${id} not found.` },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Failed to update product", error: errorMessage },
      { status: 500 }
    );
  }
}

// --- DELETE a single product by its ID ---
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Type updated to Promise
) {
  try {
    const { id } = await params; // <-- Await params to get the id

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: `Product with ID ${id} not found.` },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Failed to delete product", error: errorMessage },
      { status: 500 }
    );
  }
}