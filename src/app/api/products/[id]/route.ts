  // // src/app/api/products/[id]/route.ts
  // import { NextResponse } from "next/server";
  // import dbConnect from "@/lib/mongodb";
  // import Product from "@/models/Product"; 

  // // A helper function to transform the MongoDB document.
  // const transformProduct = (product: any) => {
  //   const transformed = {
  //     // Use .toObject() or .lean() before this function is called
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
  //   await dbConnect();
  //   const { id } = params;

  //   try {
  //     const body = await request.json();

  //     // Find and update the product
  //     const updatedProduct = await Product.findByIdAndUpdate(id, body, {
  //       new: true,
  //       runValidators: true,
  //     });

  //     if (!updatedProduct) {
  //       return NextResponse.json(
  //         { message: `Product with ID ${id} not found.` },
  //         { status: 404 }
  //       );
  //     }

  //     // CORRECTED: After updating, fetch the entire updated list of products.
  //     // This makes the PUT response consistent with the POST response.
  //     const allProductsFromDb = await Product.find({}).sort({ createdAt: -1 }).lean();
  //     const allProducts = allProductsFromDb.map(transformProduct);
      
  //     return NextResponse.json(allProducts);

  //   } catch (error) {
  //     console.error("Failed to update product:", error);
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
      
  //     // Return a success response with no body, which is standard for DELETE
  //     return new NextResponse(null, { status: 204 });
  //   } catch (error) {
  //     console.error("Failed to delete product:", error);
  //     return NextResponse.json(
  //       { message: "Failed to delete product", error: `${error}` },
  //       { status: 500 }
  //     );
  //   }
  // }


  import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// A helper function to transform the MongoDB document.
const transformProduct = (product: any) => {
  const transformed = {
    // Ensure you call .toObject() or use .lean() before this function
    ...product,
    id: product._id.toString(),
  };
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

// --- UPDATE a single product by its ID ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await dbConnect();
    const body = await request.json();

    let updatedProduct;

    // SCENARIO 1: Inventory reduction from the billing page.
    // We check for a specific key, 'quantityToDecrement', to trigger this logic.
    if (body.quantityToDecrement && typeof body.quantityToDecrement === 'number') {
      
      // Use MongoDB's atomic '$inc' operator. This is the safest way to handle
      // concurrent sales, as it directly modifies the number in the database.
      updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $inc: { quantity: -body.quantityToDecrement } }, // Subtract the value
        { new: true } // Option to return the document after the update
      );

    } else {
      // SCENARIO 2: A general-purpose update (e.g., editing product name/price from an inventory form).
      updatedProduct = await Product.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
    }

    if (!updatedProduct) {
      return NextResponse.json(
        { message: `Product with ID ${id} not found.` },
        { status: 404 }
      );
    }

    // After a successful update, it's more efficient to return only the single
    // product that was changed, rather than the entire product list.
    return NextResponse.json(transformProduct(updatedProduct.toObject()));

  } catch (error) {
    console.error(`[API PUT /api/products/${id}] Failed to update product:`, error);
    return NextResponse.json(
      { message: "Failed to update product", error: `${error}` },
      { status: 500 }
    );
  }
}

// --- DELETE a single product by its ID ---
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json(
        { message: `Product with ID ${id} not found.` },
        { status: 404 }
      );
    }
    
    // A 204 No Content response is standard and correct for a successful DELETE.
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { message: "Failed to delete product", error: `${error}` },
      { status: 500 }
    );
  }
}
