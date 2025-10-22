import { NextResponse, NextRequest } from "next/server";
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
  // The '__v' warning in the build log for this line is harmless.
  const { _id, __v, ...rest } = product;
  return {
    ...rest,
    id: _id.toString(),
  };
};


// --- UPDATE a single product by its ID ---
// FINAL FIX: Adding an explicit return type to the function signature.
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> { // <-- THIS IS THE FIX
  const { id } = params;
  const tenantId = request.headers.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ message: 'Tenant ID is missing' }, { status: 400 });
  }

  try {
    await dbConnect();
    const body: UpdateBody = await request.json();
    let updatedProduct: IProductDocument | null;

    if ('quantityToDecrement' in body && typeof body.quantityToDecrement === 'number') {
      updatedProduct = await Product.findOneAndUpdate(
        { _id: id, tenantId: tenantId },
        { $inc: { quantity: -body.quantityToDecrement } },
        { new: true }
      );
    } else {
      updatedProduct = await Product.findOneAndUpdate(
        { _id: id, tenantId: tenantId },
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
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`[API PUT /api/products/${id}] Failed to update product:`, errorMessage);
    return NextResponse.json(
      { message: "Failed to update product", error: errorMessage },
      { status: 500 }
    );
  }
}

// --- DELETE a single product by its ID ---
// FINAL FIX: Adding the explicit return type here as well.
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> { // <-- THIS IS THE FIX
  const { id } = params;
  const tenantId = request.headers.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ message: 'Tenant ID is missing' }, { status: 400 });
  }

  try {
    await dbConnect();
    const deletedProduct = await Product.findOneAndDelete({ _id: id, tenantId: tenantId });

    if (!deletedProduct) {
      return NextResponse.json(
        { message: `Product with ID ${id} not found for this tenant.` },
        { status: 404 }
      );
    }
    
    // A NextResponse object must be returned from the function.
    return new NextResponse(null, { status: 204 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`[API DELETE /api/products/${id}] Failed to delete product:`, errorMessage);
    return NextResponse.json(
      { message: "Failed to delete product", error: errorMessage },
      { status: 500 }
    );
  }
}