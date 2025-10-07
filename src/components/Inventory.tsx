// // src/components/Inventory.tsx
// 'use client';

// import Image from 'next/image';
// import { Product, mockProducts } from '@/lib/product'; // Import types and data

// // A helper function to format currency
// const formatCurrency = (amount: number) => {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//   }).format(amount);
// };

// export default function Inventory() {
//   const products = mockProducts; // In a real app, you'd fetch this data

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="sm:flex sm:items-center">
//         <div className="sm:flex-auto">
//           <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
//           <p className="mt-2 text-sm text-gray-700">
//             A list of all the products in your account including their name, quantity, and price.
//           </p>
//         </div>
//         <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
//           <button
//             type="button"
//             className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
//           >
//             Add Product
//           </button>
//         </div>
//       </div>

//       {/* Inventory Table */}
//       <div className="mt-8 flex flex-col">
//         <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
//           <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
//             <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
//               <table className="min-w-full divide-y divide-gray-300">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
//                       Product Name
//                     </th>
//                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                       Quantity
//                     </th>
//                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                       Unit Price
//                     </th>
//                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                       GST
//                     </th>
//                     <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
//                       <span className="sr-only">Edit</span>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 bg-white">
//                   {products.map((product) => (
//                     <tr key={product.id}>
//                       <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
//                         <div className="flex items-center">
//                           <div className="h-10 w-10 flex-shrink-0">
//                             <Image
//                               className="h-10 w-10 rounded-full object-cover"
//                               src={product.imageUrl}
//                               alt={product.name}
//                               width={40}
//                               height={40}
//                             />
//                           </div>
//                           <div className="ml-4">
//                             <div className="font-medium text-gray-900">{product.name}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                         {product.quantity} units
//                       </td>
//                       <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                         {formatCurrency(product.unitPrice)}
//                       </td>
//                       <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                         {product.gstRate}%
//                       </td>
//                       <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
//                         <a href="#" className="text-indigo-600 hover:text-indigo-900">
//                           Edit<span className="sr-only">, {product.name}</span>
//                         </a>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // src/components/Inventory.tsx
// 'use client';

// import Image from 'next/image';
// import { Product, mockProducts } from '@/lib/product'; // Import types and data

// // A helper function to format currency
// const formatCurrency = (amount: number) => {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//   }).format(amount);
// };

// export default function Inventory() {
//   const products = mockProducts; // In a real app, you'd fetch this data

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="sm:flex sm:items-center">
//         <div className="sm:flex-auto">
//           <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
//           <p className="mt-2 text-sm text-gray-700">
//             A list of all the products in your account including their name, quantity, and price.
//           </p>
//         </div>
//         <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
//           <button
//             type="button"
//             className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
//           >
//             Add Product
//           </button>
//         </div>
//       </div>

//       {/* Inventory Table */}
//       <div className="mt-8 flex flex-col">
//         <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
//           <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
//             <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
//               <table className="min-w-full divide-y divide-gray-300">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
//                       Product Name
//                     </th>
//                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                       Quantity
//                     </th>
//                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                       Unit Price
//                     </th>
//                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                       GST
//                     </th>
//                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                       Total GST
//                     </th>
//                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                       Total Price (incl. GST)
//                     </th>
//                     <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
//                       <span className="sr-only">Edit</span>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 bg-white">
//                   {products.map((product) => {
//                     const totalGst = (product.unitPrice * product.quantity * product.gstRate) / 100;
//                     const totalPrice = product.unitPrice * product.quantity + totalGst;

//                     return (
//                       <tr key={product.id}>
//                         <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
//                           <div className="flex items-center">
//                             <div className="h-10 w-10 flex-shrink-0">
//                               {/* <Image
//                                 className="h-10 w-10 rounded-full object-cover"
//                                 src={product.imageUrl}
//                                 alt={product.name}
//                                 width={40}
//                                 height={40}
//                               /> */}
//                             </div>
//                             <div className="ml-4">
//                               <div className="font-medium text-gray-900">{product.name}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                           {product.quantity} units
//                         </td>
//                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                           {formatCurrency(product.unitPrice)}
//                         </td>
//                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                           {product.gstRate}%
//                         </td>
//                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                           {formatCurrency(totalGst)}
//                         </td>
//                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                           {formatCurrency(totalPrice)}
//                         </td>
//                         <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
//                           <a href="#" className="text-indigo-600 hover:text-indigo-900">
//                             Edit<span className="sr-only">, {product.name}</span>
//                           </a>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/components/Inventory.tsx
'use client';

// Define the structure (interface) for a single product object
export interface Product {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  gstRate: number; // Represents the GST percentage, e.g., 18 for 18%
}

// Create an array of mock product data directly in the component
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Ergonomic Mouse',
    quantity: 50,
    unitPrice: 1200,
    gstRate: 18,
  },
  {
    id: 2,
    name: 'Mechanical Gaming Keyboard',
    quantity: 30,
    unitPrice: 4500,
    gstRate: 18,
  },
  {
    id: 3,
    name: '7-in-1 USB-C Hub',
    quantity: 75,
    unitPrice: 2500,
    gstRate: 12,
  },
  {
    id: 4,
    name: '27-inch 4K UHD Monitor',
    quantity: 20,
    unitPrice: 25000,
    gstRate: 28,
  },
   {
    id: 5,
    name: 'Noise-Cancelling Headphones',
    quantity: 40,
    unitPrice: 8000,
    gstRate: 18,
  },
];


// A helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export default function Inventory() {
  const products = mockProducts; // Use the locally defined product data

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all products, including their name, quantity, and price.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Product Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Quantity
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Unit Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      GST
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total GST
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total Price (incl. GST)
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.map((product) => {
                    const totalGst = (product.unitPrice * product.quantity * product.gstRate) / 100;
                    const totalPrice = product.unitPrice * product.quantity + totalGst;

                    return (
                      <tr key={product.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {product.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {product.quantity} units
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatCurrency(product.unitPrice)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {product.gstRate}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatCurrency(totalGst)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatCurrency(totalPrice)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit<span className="sr-only">, {product.name}</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}