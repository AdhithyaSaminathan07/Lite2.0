// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import Product from "@/models/Product";

// // A helper function to transform the MongoDB document.
// const transformProduct = (product: any) => {
//   const transformed = {
//     // Ensure you call .toObject() or use .lean() before this function
//     ...product,
//     id: product._id.toString(),
//   };
//   delete transformed._id;
//   delete transformed.__v;
//   return transformed;
// };

// // --- UPDATE a single product by its ID ---
// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;

//   try {
//     await dbConnect();
//     const body = await request.json();

//     let updatedProduct;

//     // SCENARIO 1: Inventory reduction from the billing page.
//     // We check for a specific key, 'quantityToDecrement', to trigger this logic.
//     if (body.quantityToDecrement && typeof body.quantityToDecrement === 'number') {
      
//       // Use MongoDB's atomic '$inc' operator. This is the safest way to handle
//       // concurrent sales, as it directly modifies the number in the database.
//       updatedProduct = await Product.findByIdAndUpdate(
//         id,
//         { $inc: { quantity: -body.quantityToDecrement } }, // Subtract the value
//         { new: true } // Option to return the document after the update
//       );

//     } else {
//       // SCENARIO 2: A general-purpose update (e.g., editing product name/price from an inventory form).
//       updatedProduct = await Product.findByIdAndUpdate(id, body, {
//         new: true,
//         runValidators: true,
//       });
//     }

//     if (!updatedProduct) {
//       return NextResponse.json(
//         { message: `Product with ID ${id} not found.` },
//         { status: 404 }
//       );
//     }

//     // After a successful update, it's more efficient to return only the single
//     // product that was changed, rather than the entire product list.
//     return NextResponse.json(transformProduct(updatedProduct.toObject()));

//   } catch (error) {
//     console.error(`[API PUT /api/products/${id}] Failed to update product:`, error);
//     return NextResponse.json(
//       { message: "Failed to update product", error: `${error}` },
//       { status: 500 }
//     );
//   }
// }

// // --- DELETE a single product by its ID ---
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   await dbConnect();
//   const { id } = params;

//   try {
//     const deletedProduct = await Product.findByIdAndDelete(id);
//     if (!deletedProduct) {
//       return NextResponse.json(
//         { message: `Product with ID ${id} not found.` },
//         { status: 404 }
//       );
//     }
    
//     // A 204 No Content response is standard and correct for a successful DELETE.
//     return new NextResponse(null, { status: 204 });
//   } catch (error) {
//     console.error("Failed to delete product:", error);
//     return NextResponse.json(
//       { message: "Failed to delete product", error: `${error}` },
//       { status: 500 }
//     );
//   }
// }


// FILE: src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// --- Interfaces for Type Safety ---
interface IProduct {
  sku?: string;
  name?: string;
  price?: number;
  quantity?: number;
}

interface IProductObject extends IProduct {
  _id: { toString: () => string };
  __v?: number;
  tenantId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface IProductDocument extends IProductObject {
  toObject: () => IProductObject;
}

type UpdateBody = { quantityToDecrement: number } | IProduct;

// --- Helper Function ---
const transformProduct = (product: IProductObject) => {
  const { _id, __v, ...rest } = product;
  return { ...rest, id: _id.toString() };
};

// --- Context Type for Next.js 15 Route Handlers ---
interface RouteContext {
  params: Promise<{ id: string }>;
}

// --- PUT Handler ---
export async function PUT(request: Request, context: RouteContext) {
  const params = await context.params;
  const id = params.id;
  const tenantId = request.headers.get("x-tenant-id");

  if (!tenantId) {
    return NextResponse.json({ message: "Tenant ID is missing" }, { status: 400 });
  }

  try {
    await dbConnect();
    const body: UpdateBody = await request.json();
    let updatedProduct: IProductDocument | null;

    if ("quantityToDecrement" in body && typeof body.quantityToDecrement === "number") {
      updatedProduct = await Product.findOneAndUpdate(
        { _id: id, tenantId },
        { $inc: { quantity: -body.quantityToDecrement } },
        { new: true }
      );
    } else {
      updatedProduct = await Product.findOneAndUpdate(
        { _id: id, tenantId },
        body,
        { new: true, runValidators: true }
      );
    }

    if (!updatedProduct) {
      return NextResponse.json(
        { message: `Product with ID ${id} not found for this tenant.` },
        { status: 404 }
      );
    }

    return NextResponse.json(transformProduct(updatedProduct.toObject()));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[PUT /api/products/${id}]`, message);
    return NextResponse.json({ message: "Failed to update product", error: message }, { status: 500 });
  }
}

// --- DELETE Handler ---
export async function DELETE(request: Request, context: RouteContext) {
  const params = await context.params;
  const id = params.id;
  const tenantId = request.headers.get("x-tenant-id");

  if (!tenantId) {
    return NextResponse.json({ message: "Tenant ID is missing" }, { status: 400 });
  }

  try {
    await dbConnect();
    const deletedProduct = await Product.findOneAndDelete({ _id: id, tenantId });

    if (!deletedProduct) {
      return NextResponse.json(
        { message: `Product with ID ${id} not found for this tenant.` },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[DELETE /api/products/${id}]`, message);
    return NextResponse.json({ message: "Failed to delete product", error: message }, { status: 500 });
  }
}
