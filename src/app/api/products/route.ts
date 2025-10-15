// // src/app/api/products/route.ts

// import dbConnect from '@/lib/mongodb';
// import Product from '@/models/Product'; // Assuming your model is in src/models/Product.ts
// import { NextResponse } from 'next/server';

// // The GET function, now using Mongoose.
// export async function GET() {
//   try {
//     await dbConnect(); // Connect to the database

//     const products = await Product.find({}).sort({ createdAt: -1 }); // Mongoose equivalent of findMany with orderBy

//     return NextResponse.json(products);
//   } catch (error) {
//     console.error('Failed to fetch products:', error);
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     return new NextResponse(
//       JSON.stringify({ message: 'Failed to fetch products', error: errorMessage }),
//       { status: 500 }
//     );
//   }
// }

// // The POST function, now using Mongoose for single and batch creation.
// export async function POST(request: Request) {
//   try {
//     await dbConnect(); // Connect to the database
//     const body = await request.json();

//     // --- LOGIC FOR BATCH UPLOAD (FROM EXCEL) ---
//     if (Array.isArray(body)) {
//       const incomingProducts = body.map((product, index) => ({
//         name: String(product.name || ''),
//         quantity: Number(product.quantity) || 0,
//         buyingPrice: Number(product.buyingPrice) || 0,
//         sellingPrice: Number(product.sellingPrice) || 0,
//         gstRate: Number(product.gstRate) || 0,
//         description: String(product.description || ''),
//         sku: product.sku ? String(product.sku) : `SKU-${Date.now()}-${index}`,
//         image: product.image || null,
//       }));

//       // Find existing SKUs using Mongoose
//       const incomingSkus = incomingProducts.map(p => p.sku);
//       const existingProducts = await Product.find({
//         sku: { $in: incomingSkus } // Mongoose's 'in' query
//       }).select('sku'); // Only select the 'sku' field

//       const existingSkus = new Set(existingProducts.map(p => p.sku));
//       const productsToCreate = incomingProducts.filter(p => !existingSkus.has(p.sku));

//       if (productsToCreate.length > 0) {
//         // Mongoose equivalent of createMany
//         await Product.insertMany(productsToCreate);
//       }
//     } else {
//       // --- LOGIC FOR SINGLE PRODUCT CREATION (FROM MODAL) ---
//       const { sku, ...restOfBody } = body;
//       const newProductData = {
//         ...restOfBody,
//         sku: sku || `SKU-${Date.now()}`,
//       };

//       // Mongoose equivalent of create
//       await Product.create(newProductData);
//     }

//     // After creating, fetch and return the entire updated list
//     const allProducts = await Product.find({}).sort({ createdAt: -1 });
//     return NextResponse.json(allProducts, { status: 201 });
//   } catch (error) {
//     console.error('Failed to create product(s):', error);
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     return new NextResponse(
//       JSON.stringify({ message: 'Failed to create product(s)', error: errorMessage }),
//       { status: 500 }
//     );
//   }
// }

// src/app/api/products/route.ts

import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

/**
 * A helper function to transform the MongoDB document.
 * It converts the `_id` ObjectId to a string `id` and removes `_id` and `__v`.
 */
const transformProduct = (product: any) => {
  const transformed = {
    ...product,
    id: product._id.toString(),
  };
  delete transformed._id;
  delete transformed.__v; // Also remove the version key
  return transformed;
};

// GET all products
export async function GET() {
  try {
    await dbConnect();

    // .lean() is a performance optimization that returns plain JavaScript objects
    const productsFromDb = await Product.find({}).sort({ createdAt: -1 }).lean();

    // ✅ Transform every product before sending the response
    const products = productsFromDb.map(transformProduct);

    return NextResponse.json(products);
  } catch (error) {
    console.error('API GET Error:', error); // This log is crucial!
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch products', error: errorMessage }, { status: 500 });
  }
}

// POST a new product (handles both single and batch)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (Array.isArray(body)) {
      // Logic for batch upload from Excel
      if (body.length > 0) {
        // Use { ordered: false } to continue inserting even if one document fails (e.g., duplicate SKU)
        await Product.insertMany(body, { ordered: false }).catch(err => {
            // We catch and log duplicate errors here but don't re-throw,
            // allowing the operation to be partially successful.
            if (err.code !== 11000) throw err;
            console.warn("Batch insert contained duplicate SKUs which were ignored.");
        });
      }
    } else {
      // Logic for a single product creation
      await Product.create(body);
    }
    
    // After creating, fetch and return the entire updated list, transformed
    const allProductsFromDb = await Product.find({}).sort({ createdAt: -1 }).lean();
    const allProducts = allProductsFromDb.map(transformProduct);
    
    return NextResponse.json(allProducts, { status: 201 });

  } catch (error: any) {
    console.error('API POST Error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'A product with a duplicate SKU already exists.', error: error.message },
        { status: 409 } // 409 Conflict
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to create product(s)', error: errorMessage }, { status: 500 });
  }
}