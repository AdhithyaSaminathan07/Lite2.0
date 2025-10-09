// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// // This runs when you want to GET all products
// export async function GET() {
//   try {
//     const products = await prisma.product.findMany();
//     return NextResponse.json(products);
//   } catch (error) {
//     // It's crucial to log the error for debugging purposes
//     console.error("Failed to fetch products:", error);

//     // Return a proper error response to the client
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

// // You likely also have a POST function here to create products.
// // It's good practice to add try...catch to it as well.
// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     const newProduct = await prisma.product.create({
//       data: data,
//     });
//     return NextResponse.json(newProduct, { status: 201 });
//   } catch (error) {
//     console.error("Failed to create product:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

// src/app/api/products/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This is your existing GET function - no changes needed here
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// This is the updated POST function with the fix
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // --- THIS IS THE FIX ---
    // We check if a SKU was provided. If not, we create a unique one.
    // Using the current time in milliseconds guarantees uniqueness.
    if (!data.sku) {
      data.sku = `SKU-${Date.now()}`;
    }
    // --- END OF FIX ---

    const newProduct = await prisma.product.create({
      data: data, // Now `data` is guaranteed to have a unique SKU
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}