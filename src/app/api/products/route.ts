
// src/app/api/products/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// The GET function requires no changes.
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch products', error: errorMessage }),
      { status: 500 }
    );
  }
}

// REMOVED: All logic for 'barcode' is gone.
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // --- LOGIC FOR BATCH UPLOAD (FROM EXCEL) ---
    if (Array.isArray(body)) {
      const incomingProducts = body.map((product, index) => ({
        name: String(product.name || ''),
        quantity: Number(product.quantity) || 0,
        buyingPrice: Number(product.buyingPrice) || 0,
        sellingPrice: Number(product.sellingPrice) || 0,
        gstRate: Number(product.gstRate) || 0,
        description: String(product.description || ''),
        sku: product.sku ? String(product.sku) : `SKU-${Date.now()}-${index}`, // Keep SKU logic
        image: product.image || null,
      }));
      
      // Your existing logic for handling duplicate SKUs is still valid
      const incomingSkus = incomingProducts.map(p => p.sku);
      const existingProducts = await prisma.product.findMany({
        where: { sku: { in: incomingSkus } },
        select: { sku: true },
      });
      const existingSkus = new Set(existingProducts.map(p => p.sku));
      const productsToCreate = incomingProducts.filter(p => !existingSkus.has(p.sku));

      if (productsToCreate.length > 0) {
        await prisma.product.createMany({
          data: productsToCreate,
        });
      }
    } else {
      // --- LOGIC FOR SINGLE PRODUCT CREATION (FROM MODAL) ---
      const { sku, ...restOfBody } = body;
      const newProductData = {
        ...restOfBody,
        sku: sku || `SKU-${Date.now()}`,
      };
      
      await prisma.product.create({
        data: newProductData,
      });
    }

    // After creating, fetch and return the entire updated list
    const allProducts = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(allProducts, { status: 201 });
  } catch (error) {
    console.error('Failed to create product(s):', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to create product(s)', error: errorMessage }),
      { status: 500 }
    );
  }
}


