

// src/app/api/products/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This runs when you want to UPDATE a product
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id; // The ID is a string, which is correct for MongoDB.
    const data = await request.json();
    
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: data,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// This runs when you want to DELETE a product
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id; // The ID is a string. Do NOT parse it as a number.

    await prisma.product.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content is correct for a successful delete.
  } catch (error) {
    console.error("Failed to delete product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}