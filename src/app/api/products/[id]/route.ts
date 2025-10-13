

// // src/app/api/products/[id]/route.ts

// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// // This runs when you want to UPDATE a product
// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id; // The ID is a string, which is correct for MongoDB.
//     const data = await request.json();
    
//     const { id: _, ...updateData } = body;

//     const updatedProduct = await prisma.product.update({
//       where: { id: id },
//       data: updateData,
//     });

//     return NextResponse.json(updatedProduct);
//   } catch (error) {
//     console.error("Failed to update product:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

// // This runs when you want to DELETE a product
// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id; // The ID is a string. Do NOT parse it as a number.

//     await prisma.product.delete({
//       where: { id },
//     });

//     return new NextResponse(null, { status: 204 }); // 204 No Content is correct for a successful delete.
//   } catch (error) {
//     console.error("Failed to delete product:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }


// // src/app/api/products/[id]/route.ts (Corrected)

// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// // This runs when you want to UPDATE a product
// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id;
//     const body = await request.json();

//     // --- FIX: DESTRUCTURE THE BODY ---
//     // This removes the 'id' property from the incoming 'body' object
//     // and puts all other properties into a new 'updateData' object.
//     // We do this because Prisma does not allow you to update the primary key ('id').
//     const { id: _, ...updateData } = body;

//     const updatedProduct = await prisma.product.update({
//       where: { id: id },
//       data: updateData, // Use the sanitized 'updateData' object here
//     });

//     return NextResponse.json(updatedProduct);
//   } catch (error) {
//     console.error("Failed to update product:", error);
//     // It's good practice to return a JSON response for errors too
//     return NextResponse.json({ message: "Failed to update product", error }, { status: 500 });
//   }
// }

// // This runs when you want to DELETE a product (This function is correct)
// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id;

//     await prisma.product.delete({
//       where: { id },
//     });

//     return new NextResponse(null, { status: 204 }); // 204 No Content is correct
//   } catch (error) {
//     console.error("Failed to delete product:", error);
//     return NextResponse.json({ message: "Failed to delete product", error }, { status: 500 });
//   }
// }

// src/app/api/products/[id]/route.ts (Corrected)

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This runs when you want to UPDATE a product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Type updated to Promise
) {
  try {
    const { id } = await params; // <-- Await params to get the id
    const body = await request.json();

    // It's good practice to not pass the id from the body to the update data
    const { id: _, ...updateData } = body;

    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { message: "Failed to update product", error },
      { status: 500 }
    );
  }
}

// This runs when you want to DELETE a product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Type updated to Promise
) {
  try {
    const { id } = await params; // <-- Await params to get the id

    await prisma.product.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { message: "Failed to delete product", error },
      { status: 500 }
    );
  }
}