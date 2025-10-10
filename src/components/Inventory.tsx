// 'use client';

// import React, { useState, useEffect, FC, ChangeEvent } from "react";
// import * as XLSX from "xlsx";
// import { Upload, Edit2, Plus, X, Trash2, Search } from "lucide-react";
// import { motion, useAnimationControls, PanInfo } from "framer-motion";

// // --- INTERFACES AND UTILITIES ---
// export interface Product {
//   id: string; // Can be a custom SKU or a MongoDB ID
//   name: string;
//   quantity: number;
//   buyingPrice: number;
//   sellingPrice: number;
//   gstRate: number;
//   image?: string;
// }

// const formatCurrency = (amount: number): string => {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//   }).format(amount);
// };

// // --- MobileProductCard Component ---
// interface MobileProductCardProps {
//   product: Product;
//   isSwiped: boolean;
//   onSwipe: (id: string | null) => void;
//   onEdit: (product: Product) => void;
//   onDelete: (id: string) => void;
// }

// const MobileProductCard: FC<MobileProductCardProps> = ({ product, isSwiped, onSwipe, onEdit, onDelete }) => {
//   const controls = useAnimationControls();
//   const ACTION_WIDTH = 160;

//   useEffect(() => {
//     if (!isSwiped) {
//       controls.start({ x: 0 });
//     }
//   }, [isSwiped, controls]);

//   const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
//     if (info.offset.x < -ACTION_WIDTH / 2) {
//       controls.start({ x: -ACTION_WIDTH });
//       onSwipe(product.id);
//     } else {
//       controls.start({ x: 0 });
//     }
//   };

//   const calculateTotal = (quantity: number, sellingPrice: number, gstRate: number): number => {
//     return quantity * sellingPrice * (1 + gstRate / 100);
//   };

//   return (
//     <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden shadow-sm">
//       <div className="absolute inset-y-0 right-0 flex" style={{ width: ACTION_WIDTH }}>
//         <button onClick={() => onEdit(product)} className="w-1/2 h-full flex flex-col items-center justify-center bg-indigo-500 text-white transition-colors hover:bg-indigo-600">
//           <Edit2 className="w-5 h-5" /><span className="text-xs mt-1">Edit</span>
//         </button>
//         <button onClick={() => onDelete(product.id)} className="w-1/2 h-full flex flex-col items-center justify-center bg-red-500 text-white transition-colors hover:bg-red-600">
//           <Trash2 className="w-5 h-5" /><span className="text-xs mt-1">Delete</span>
//         </button>
//       </div>
//       <motion.div
//         className="relative bg-white p-3 flex items-center gap-3 w-full cursor-grab"
//         drag="x" dragConstraints={{ right: 0, left: -ACTION_WIDTH }} onDragEnd={handleDragEnd}
//         animate={controls} transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         onClick={() => { if (isSwiped) { controls.start({ x: 0 }); onSwipe(null); } }}
//       >
//         <img src={product.image || `https://via.placeholder.com/64x64.png?text=${product.name.charAt(0)}`} alt={product.name} className="w-16 h-16 object-cover rounded-md bg-gray-100 flex-shrink-0" />
//         <div className="flex-1 overflow-hidden">
//           <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
//           <p className="text-sm text-gray-500 truncate">ID: {product.id}</p>
//           <p className="text-sm text-gray-700 font-medium mt-1">Revenue: {formatCurrency(calculateTotal(product.quantity, product.sellingPrice, product.gstRate))}</p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // --- MAIN INVENTORY COMPONENT ---
// const Inventory: FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [showEditModal, setShowEditModal] = useState<boolean>(false);
//   const [showAddModal, setShowAddModal] = useState<boolean>(false);
//   const [swipedProductId, setSwipedProductId] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   // UPDATED: NewProduct now includes 'id'

//   // type NewProduct = Omit<Product, 'image'>;
//   // const [newProduct, setNewProduct] = useState<NewProduct>({ id: "", name: "", quantity: 0, buyingPrice: 0, sellingPrice: 0, gstRate: 0 });
   
//   type NewProduct = Omit<Product, 'id' | 'image'> & { sku?: string };
//   const [newProduct, setNewProduct] = useState<NewProduct>({ name: "", sku: "", quantity: 0, buyingPrice: 0, sellingPrice: 0, gstRate: 0 });

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch('/api/products');
//         if (!response.ok) throw new Error('Failed to fetch products');
//         const data: Product[] = await response.json();
//         setProducts(data);
//       } catch (error) { console.error("Error fetching products:", error); }
//     };
//     fetchProducts();
//   }, []);

//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     product.id.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleExcelUpload = (e: ChangeEvent<HTMLInputElement>): void => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = async (event: ProgressEvent<FileReader>) => {
//       if (!event.target?.result) return;
//       const data = new Uint8Array(event.target.result as ArrayBuffer);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const rows: any[] = XLSX.utils.sheet_to_json(sheet);

//       const uploadedProducts = rows.map((row) => ({
//         id: String(row["Product ID"] || ""), // Read Product ID from Excel
//         name: String(row["Product Name"] || ""),
//         quantity: Number(row["Quantity"]) || 0,
//         buyingPrice: Number(row["Buying Price"]) || 0,
//         sellingPrice: Number(row["Selling Price"]) || 0,
//         gstRate: Number(row["GST Rate"]) || 0,
//       }));

//       try {
//         const response = await fetch('/api/products', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(uploadedProducts),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to upload products');
//         }

//         const allProducts: Product[] = await response.json();
//         setProducts(allProducts);
//         alert('Products uploaded successfully!');
//       } catch (error) {
//         console.error("Error uploading products:", error);
//         alert(`An error occurred during the upload: ${(error as Error).message}`);
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const openEditModal = (product: Product): void => {
//     setEditingProduct(product);
//     setShowEditModal(true);
//     setSwipedProductId(null);
//   };

//   const openAddModal = (): void => {
//     // UPDATED: Reset all fields for a new product, including the id
//     setNewProduct({ id: "", name: "", quantity: 0, buyingPrice: 0, sellingPrice: 0, gstRate: 0 });
//     setShowAddModal(true);
//   };

//   const handleSaveEdit = async (): Promise<void> => {
//     if (!editingProduct) return;
//     try {
//       const response = await fetch(`/api/products/${editingProduct.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(editingProduct),
//       });
//       if (!response.ok) throw new Error('Failed to update product');
//       const updatedProduct: Product = await response.json();
//       setProducts((prev) =>
//         prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
//       );
//       setShowEditModal(false);
//     } catch (error) {
//       console.error("Error updating product:", error);
//     }
//   };

//   const handleSaveNewProduct = async (): Promise<void> => {
//     try {
//       const response = await fetch('/api/products', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newProduct), // newProduct now includes the user-provided ID
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to create product');
//       }

//       const allProducts: Product[] = await response.json();
//       setProducts(allProducts);
//       setShowAddModal(false);
//     } catch (error) {
//       console.error("Error creating product:", error);
//       alert(`Failed to create product: ${(error as Error).message}`);
//     }
//   };

//   const handleDeleteProduct = async (id: string): Promise<void> => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         setProducts((prev) => prev.filter((p) => p.id !== id));
//       } catch (error) {
//         console.error("Error deleting product:", error);
//       }
//     }
//     setSwipedProductId(null);
//   };

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
//       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory</h1>
//           <p className="hidden md:block text-sm text-gray-600">Search, upload, or manage products manually.</p>
//         </div>
//         <div className="relative w-full md:w-auto order-first md:order-none">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input type="text" placeholder="Search by name or ID..." value={searchQuery} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
//         </div>
//         <div className="hidden sm:flex items-center gap-3">
//           <label className="flex items-center cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
//             <Upload className="w-4 h-4 mr-2" /> Upload Excel
//             <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
//           </label>
//           <button onClick={openAddModal} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
//             <Plus className="w-4 h-4" /> Add Product
//           </button>
//         </div>
//       </div>

//       <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
//         <table className="min-w-full divide-y divide-gray-300">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Product ID</th>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Selling Price</th>
//               <th className="px-3 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredProducts.map((p) => (
//               <tr key={p.id}>
//                 <td className="px-3 py-2"><img src={p.image || `https://via.placeholder.com/64x64.png?text=${p.name.charAt(0)}`} alt={p.name} className="w-14 h-14 object-cover rounded-md" /></td>
//                 <td className="px-3 py-2 text-sm font-medium text-gray-900">{p.name}</td>
//                 <td className="px-3 py-2 text-sm text-gray-500 truncate max-w-xs">{p.id}</td>
//                 <td className="px-3 py-2 text-sm text-gray-500">{p.quantity}</td>
//                 <td className="px-3 py-2 text-sm text-gray-500">{formatCurrency(p.sellingPrice)}</td>
//                 <td className="px-3 py-2 text-right">
//                   <div className="flex justify-end gap-4">
//                     <button onClick={() => openEditModal(p)} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"><Edit2 className="w-4 h-4" /> Edit</button>
//                     <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1"><Trash2 className="w-4 h-4" /> Delete</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="md:hidden space-y-3 pb-20">
//         {filteredProducts.map((p) => (
//           <MobileProductCard key={p.id} product={p} isSwiped={swipedProductId === p.id} onSwipe={setSwipedProductId} onEdit={openEditModal} onDelete={handleDeleteProduct} />
//         ))}
//       </div>

//       <div className="sm:hidden fixed bottom-4 right-4 flex flex-col items-center gap-3 z-20">
//         <label className="w-14 h-14 flex items-center justify-center cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg">
//           <Upload className="w-6 h-6" /><input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
//         </label>
//         <button onClick={openAddModal} className="w-14 h-14 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg">
//           <Plus className="w-6 h-6" />
//         </button>
//       </div>

//       {/* --- MODAL --- */}
//       {(showAddModal || (showEditModal && editingProduct)) && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
//           <motion.div 
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ type: "spring", duration: 0.3 }}
//             className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
//           >
//             {/* Header with gradient */}
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-bold text-white">{showEditModal ? 'Edit Product' : 'Add New Product'}</h2>
//                 <p className="text-indigo-100 text-sm mt-0.5">{showEditModal ? 'Update product information' : 'Fill in the details below'}</p>
//               </div>
//               <button 
//                 onClick={() => { setShowAddModal(false); setShowEditModal(false); }} 
//                 className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Form Content */}
//             <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
//               {/* Product Name */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
//                   Product Name
//                 </label>
//                 <input 
//                   type="text" 
//                   placeholder="Enter product name" 
//                   className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none" 
//                   value={showEditModal ? editingProduct?.name : newProduct.name} 
//                   onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })} 
//                 />
//               </div>

//               {/* Product ID */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
//                   Product ID
//                 </label>
//                 <input 
//                   type="text" 
//                   placeholder="SKU, Barcode, or custom ID" 
//                   className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none font-mono text-sm" 
//                   value={showEditModal ? editingProduct?.id : newProduct.id} 
//                   onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, id: e.target.value }) : setNewProduct({ ...newProduct, id: e.target.value })} 
//                 />
//               </div>

//               {/* Grid for Quantity and Prices */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {/* Quantity */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                     <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                     Quantity
//                   </label>
//                   <input 
//                     type="number" 
//                     placeholder="0" 
//                     className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none" 
//                     value={showEditModal ? editingProduct?.quantity : newProduct.quantity} 
//                     onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, quantity: Number(e.target.value) || 0 }) : setNewProduct({ ...newProduct, quantity: Number(e.target.value) || 0 })} 
//                   />
//                 </div>

//                 {/* Selling Price */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                     <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                     Selling Price
//                   </label>
//                   <div className="relative">
//                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
//                     <input 
//                       type="number" 
//                       placeholder="0.00" 
//                       className="w-full border-2 border-gray-200 pl-8 pr-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
//                       value={showEditModal ? editingProduct?.sellingPrice : newProduct.sellingPrice} 
//                       onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, sellingPrice: Number(e.target.value) || 0 }) : setNewProduct({ ...newProduct, sellingPrice: Number(e.target.value) || 0 })} 
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* GST Rate */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
//                   GST Rate
//                 </label>
//                 <div className="relative">
//                   <input 
//                     type="number" 
//                     placeholder="0" 
//                     className="w-full border-2 border-gray-200 px-4 py-3 pr-12 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none" 
//                     value={showEditModal ? editingProduct?.gstRate : newProduct.gstRate} 
//                     onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, gstRate: Number(e.target.value) || 0 }) : setNewProduct({ ...newProduct, gstRate: Number(e.target.value) || 0 })} 
//                   />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
//                 </div>
//               </div>
//             </div>

//             {/* Footer with Actions */}
//             <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
//               <button 
//                 onClick={() => { setShowAddModal(false); setShowEditModal(false); }} 
//                 className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={showEditModal ? handleSaveEdit : handleSaveNewProduct} 
//                 className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg shadow-indigo-500/30 transition-all"
//               >
//                 {showEditModal ? 'Save Changes' : 'Add Product'}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Inventory;


// Inventory.tsx

'use client';

import React, { useState, useEffect, FC, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { Upload, Edit2, Plus, X, Trash2, Search } from "lucide-react";
import { motion, useAnimationControls, PanInfo } from "framer-motion";

// --- INTERFACES AND UTILITIES ---
export interface Product {
  id: string; // This will always be the MongoDB ObjectID from the database
  name: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  gstRate: number;
  image?: string;
  sku?: string; // Add sku to the interface
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// --- MobileProductCard Component ---
interface MobileProductCardProps {
  product: Product;
  isSwiped: boolean;
  onSwipe: (id: string | null) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const MobileProductCard: FC<MobileProductCardProps> = ({ product, isSwiped, onSwipe, onEdit, onDelete }) => {
  const controls = useAnimationControls();
  const ACTION_WIDTH = 160;

  useEffect(() => {
    if (!isSwiped) {
      controls.start({ x: 0 });
    }
  }, [isSwiped, controls]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    if (info.offset.x < -ACTION_WIDTH / 2) {
      controls.start({ x: -ACTION_WIDTH });
      onSwipe(product.id);
    } else {
      controls.start({ x: 0 });
    }
  };

  const calculateTotal = (quantity: number, sellingPrice: number, gstRate: number): number => {
    return quantity * sellingPrice * (1 + gstRate / 100);
  };

  return (
    <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="absolute inset-y-0 right-0 flex" style={{ width: ACTION_WIDTH }}>
        <button onClick={() => onEdit(product)} className="w-1/2 h-full flex flex-col items-center justify-center bg-indigo-500 text-white transition-colors hover:bg-indigo-600">
          <Edit2 className="w-5 h-5" /><span className="text-xs mt-1">Edit</span>
        </button>
        <button onClick={() => onDelete(product.id)} className="w-1/2 h-full flex flex-col items-center justify-center bg-red-500 text-white transition-colors hover:bg-red-600">
          <Trash2 className="w-5 h-5" /><span className="text-xs mt-1">Delete</span>
        </button>
      </div>
      <motion.div
        className="relative bg-white p-3 flex items-center gap-3 w-full cursor-grab"
        drag="x" dragConstraints={{ right: 0, left: -ACTION_WIDTH }} onDragEnd={handleDragEnd}
        animate={controls} transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => { if (isSwiped) { controls.start({ x: 0 }); onSwipe(null); } }}
      >
        <img src={product.image || `https://via.placeholder.com/64x64.png?text=${product.name.charAt(0)}`} alt={product.name} className="w-16 h-16 object-cover rounded-md bg-gray-100 flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
          <p className="text-sm text-gray-500 truncate">SKU: {product.sku || 'N/A'}</p>
          <p className="text-sm text-gray-700 font-medium mt-1">Revenue: {formatCurrency(calculateTotal(product.quantity, product.sellingPrice, product.gstRate))}</p>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN INVENTORY COMPONENT ---
const Inventory: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [swipedProductId, setSwipedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // FIX #1: The state for a new product uses 'sku' for the user-provided ID and has no 'id' field.
  type NewProduct = Omit<Product, 'id' | 'image'> & { sku?: string };
  const [newProduct, setNewProduct] = useState<NewProduct>({ name: "", sku: "", quantity: 0, buyingPrice: 0, sellingPrice: 0, gstRate: 0 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) { console.error("Error fetching products:", error); }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
    product.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExcelUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      if (!event.target?.result) return;
      const data = new Uint8Array(event.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      // FIX #2: Map "Product ID" from Excel to 'sku', not 'id'.
      const uploadedProducts = rows.map((row) => ({
        sku: String(row["Product ID"] || ""),
        name: String(row["Product Name"] || ""),
        quantity: Number(row["Quantity"]) || 0,
        buyingPrice: Number(row["Buying Price"]) || 0,
        sellingPrice: Number(row["Selling Price"]) || 0,
        gstRate: Number(row["GST Rate"]) || 0,
      }));

      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadedProducts),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload products');
        }

        const allProducts: Product[] = await response.json();
        setProducts(allProducts);
        alert('Products uploaded successfully!');
      } catch (error) {
        console.error("Error uploading products:", error);
        alert(`An error occurred during the upload: ${(error as Error).message}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const openEditModal = (product: Product): void => {
    setEditingProduct(product);
    setShowEditModal(true);
    setSwipedProductId(null);
  };

  const openAddModal = (): void => {
    // FIX #3: Reset the new product state correctly (using sku, not id).
    setNewProduct({ name: "", sku: "", quantity: 0, buyingPrice: 0, sellingPrice: 0, gstRate: 0 });
    setShowAddModal(true);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingProduct) return;
    // Note: You will need to create a PUT endpoint in your API: /api/products/[id]/route.ts
    // This frontend code assumes that endpoint exists.
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      if (!response.ok) throw new Error('Failed to update product');
      const updatedProduct: Product = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleSaveNewProduct = async (): Promise<void> => {
    try {
      // The `newProduct` object now correctly contains `sku` and no `id`.
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const allProducts: Product[] = await response.json();
      setProducts(allProducts);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating product:", error);
      alert(`Failed to create product: ${(error as Error).message}`);
    }
  };

  const handleDeleteProduct = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Note: You will need to create a DELETE endpoint in your API: /api/products/[id]/route.ts
      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    setSwipedProductId(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="hidden md:block text-sm text-gray-600">Search, upload, or manage products manually.</p>
        </div>
        <div className="relative w-full md:w-auto order-first md:order-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search by name or SKU..." value={searchQuery} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <label className="flex items-center cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
            <Upload className="w-4 h-4 mr-2" /> Upload Excel
            <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
          </label>
          <button onClick={openAddModal} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Selling Price</th>
              <th className="px-3 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td className="px-3 py-2"><img src={p.image || `https://via.placeholder.com/64x64.png?text=${p.name.charAt(0)}`} alt={p.name} className="w-14 h-14 object-cover rounded-md" /></td>
                <td className="px-3 py-2 text-sm font-medium text-gray-900">{p.name}</td>
                <td className="px-3 py-2 text-sm text-gray-500 truncate max-w-xs">{p.sku || 'N/A'}</td>
                <td className="px-3 py-2 text-sm text-gray-500">{p.quantity}</td>
                <td className="px-3 py-2 text-sm text-gray-500">{formatCurrency(p.sellingPrice)}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-4">
                    <button onClick={() => openEditModal(p)} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"><Edit2 className="w-4 h-4" /> Edit</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1"><Trash2 className="w-4 h-4" /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3 pb-20">
        {filteredProducts.map((p) => (
          <MobileProductCard key={p.id} product={p} isSwiped={swipedProductId === p.id} onSwipe={setSwipedProductId} onEdit={openEditModal} onDelete={handleDeleteProduct} />
        ))}
      </div>

      <div className="sm:hidden fixed bottom-4 right-4 flex flex-col items-center gap-3 z-20">
        <label className="w-14 h-14 flex items-center justify-center cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg">
          <Upload className="w-6 h-6" /><input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
        </label>
        <button onClick={openAddModal} className="w-14 h-14 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {(showAddModal || (showEditModal && editingProduct)) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">{showEditModal ? 'Edit Product' : 'Add New Product'}</h2>
                <p className="text-indigo-100 text-sm mt-0.5">{showEditModal ? 'Update product information' : 'Fill in the details below'}</p>
              </div>
              <button
                onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  value={showEditModal ? editingProduct?.name : newProduct.name}
                  onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              {/* FIX #4: This input is now correctly bound to `sku` for new products and is read-only for existing ones. */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  {showEditModal ? 'Product SKU (Read-only)' : 'Product ID (SKU)'}
                </label>
                <input
                  type="text"
                  placeholder="SKU, Barcode, or custom ID"
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none font-mono text-sm"
                  value={showEditModal ? (editingProduct?.sku || 'N/A') : (newProduct.sku || '')}
                  onChange={(e) => {
                    if (!showEditModal) {
                      setNewProduct({ ...newProduct, sku: e.target.value });
                    }
                  }}
                  readOnly={showEditModal}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                    value={showEditModal ? editingProduct?.quantity : newProduct.quantity}
                    onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, quantity: Number(e.target.value) || 0 }) : setNewProduct({ ...newProduct, quantity: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Selling Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full border-2 border-gray-200 pl-8 pr-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      value={showEditModal ? editingProduct?.sellingPrice : newProduct.sellingPrice}
                      onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, sellingPrice: Number(e.target.value) || 0 }) : setNewProduct({ ...newProduct, sellingPrice: Number(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  GST Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full border-2 border-gray-200 px-4 py-3 pr-12 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                    value={showEditModal ? editingProduct?.gstRate : newProduct.gstRate}
                    onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, gstRate: Number(e.target.value) || 0 }) : setNewProduct({ ...newProduct, gstRate: Number(e.target.value) || 0 })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <button
                onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showEditModal ? handleSaveEdit : handleSaveNewProduct}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg shadow-indigo-500/30 transition-all"
              >
                {showEditModal ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Inventory;