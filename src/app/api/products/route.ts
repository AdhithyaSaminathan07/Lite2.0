

// src/app/api/products/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto'; // Import the UUID generator

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to fetch products", error: (error as Error).message }),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // --- LOGIC FOR BATCH UPLOAD (FROM EXCEL) ---
    if (Array.isArray(body)) {
      // Map the incoming products and add a unique SKU to each one
      const productsToCreate = body.map(product => ({
        name: String(product.name || ""),
        quantity: Number(product.quantity) || 0,
        buyingPrice: Number(product.buyingPrice) || 0,
        sellingPrice: Number(product.sellingPrice) || 0,
        gstRate: Number(product.gstRate) || 0,
        sku: randomUUID(), // Generate a unique SKU automatically
      }));

      // Since we generate a unique SKU for every item, we no longer need to check for duplicates.
      if (productsToCreate.length > 0) {
        await prisma.product.createMany({
          data: productsToCreate,
        });
      }

    } else {
      // --- LOGIC FOR SINGLE PRODUCT CREATION (FROM MODAL) ---
      // Add the automatically generated SKU to the product data
      const newProductData = {
        ...body,
        sku: randomUUID(), // Generate a unique SKU automatically
      };
      await prisma.product.create({
        data: newProductData,
      });
    }

    // After creating, fetch and return the entire updated list of products
    const allProducts = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });
    return NextResponse.json(allProducts, { status: 201 });

  } catch (error) {
    console.error("Failed to create product(s):", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to create product(s)", error: (error as Error).message }),
      { status: 500 }
    );
  }
}