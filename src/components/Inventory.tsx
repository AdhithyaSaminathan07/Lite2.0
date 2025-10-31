// 'use client';

// import React, { useState, useEffect, FC, ChangeEvent, useRef, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import * as XLSX from "xlsx";
// import { Upload, Edit2, Plus, X, Trash2, Search, Image as ImageIcon, Camera, Loader2, Info, AlertTriangle } from "lucide-react";
// import { motion, useAnimationControls, PanInfo } from "framer-motion";
// import Image from "next/image";
// import { useVirtualizer } from "@tanstack/react-virtual";
// import { Scanner } from "@yudiel/react-qr-scanner";

// // --- CONFIGURATION ---
// const LOW_STOCK_THRESHOLD = 10;

// // --- INTERFACES AND UTILITIES ---
// export interface Product {
//   id: string;
//   name: string;
//   quantity: number;
//   buyingPrice: number;
//   sellingPrice: number; // This should always be the price EXCLUSIVE of GST
//   gstRate: number;
//   image?: string;
//   sku?: string;
//   lowStockThreshold?: number;
// }

// // Interface for the raw data from Excel (flexible keys)
// interface ExcelRow {
//   [key: string]: string | number;
// }

// // Type for the data returned by the barcode scanner
// type DetectedBarcode = {
//     rawValue: string;
// };

// const formatCurrency = (amount: number): string => {
//   return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
// };

// // --- MOBILE PRODUCT CARD ---
// interface MobileProductCardProps {
//   product: Product;
//   isSwiped: boolean;
//   onSwipe: (id: string | null) => void;
//   onEdit: (product: Product) => void;
//   onDelete: (id: string) => void;
// }

// const MobileProductCard: FC<MobileProductCardProps> = React.memo(({ product, isSwiped, onSwipe, onEdit, onDelete }) => {
//   const controls = useAnimationControls();
//   const ACTION_WIDTH = 160;
//   const alertThreshold = product.lowStockThreshold ?? LOW_STOCK_THRESHOLD;
//   const isLowStock = product.quantity <= alertThreshold;

//   useEffect(() => {
//     if (!isSwiped) {
//       controls.start({ x: 0 });
//     }
//   }, [isSwiped, controls]);

//   const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
//     if (info.offset.x < -ACTION_WIDTH / 2) {
//       controls.start({ x: -ACTION_WIDTH });
//       onSwipe(product.id);
//     } else {
//       controls.start({ x: 0 });
//     }
//   };

//   return (
//     <div className={`relative w-full bg-gray-200 rounded-lg overflow-hidden shadow-sm ${isLowStock ? 'ring-2 ring-red-500' : ''}`}>
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
//         {product.image ? (
//            <Image src={product.image} alt={product.name} width={64} height={64} className="w-16 h-16 object-cover rounded-md bg-gray-100 flex-shrink-0" />
//          ) : (
//            <button onClick={() => onEdit(product)} className="w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
//              <Upload className="w-5 h-5 text-gray-500" />
//              <span className="text-xs mt-1 text-gray-600">Upload</span>
//            </button>
//          )}
//         <div className="flex-1 overflow-hidden">
//             <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
//             <div className="flex items-center justify-between flex-wrap gap-2 mt-1.5">
//                 <p className="text-sm text-gray-500 truncate">ID: {product.sku || 'N/A'}</p>
//                 <div className="flex items-center gap-3">
//                     {isLowStock && (
//                         <div className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
//                             <AlertTriangle className="w-3 h-3" />
//                             <span className="text-xs font-medium">Low Stock</span>
//                         </div>
//                     )}
//                     <p className="text-sm text-gray-700 font-medium">Qty: {product.quantity}</p>
//                 </div>
//             </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// });
// MobileProductCard.displayName = 'MobileProductCard';

// // --- DESKTOP PRODUCT TABLE ---
// const DesktopProductTable: FC<{ products: Product[]; onEdit: (p: Product) => void; onDelete: (id: string) => void; }> = ({ products, onEdit, onDelete }) => (
//     <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
//             {products.map((p) => {
//                 const alertThreshold = p.lowStockThreshold ?? LOW_STOCK_THRESHOLD;
//                 const isLowStock = p.quantity <= alertThreshold;
//                 return (
//                 <tr key={p.id} className={isLowStock ? 'bg-red-50' : ''}>
//                   <td className="px-3 py-2">
//                   {p.image ? (
//                       <Image src={p.image} alt={p.name} width={56} height={56} className="w-14 h-14 object-cover rounded-md" />
//                     ) : (
//                       <button onClick={() => onEdit(p)} className="w-14 h-14 flex flex-col items-center justify-center bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border">
//                         <Upload className="w-5 h-5 text-gray-400" />
//                       </button>
//                     )}
//                   </td>
//                   <td className="px-3 py-2 text-sm font-medium text-gray-900">{p.name}</td>
//                   <td className="px-3 py-2 text-sm text-gray-500 truncate max-w-xs">{p.sku || 'N/A'}</td>
//                   <td className="px-3 py-2 text-sm">
//                     <div className="flex items-center gap-2">
//                         {isLowStock && (
//                           <span title={`Alert set for ${alertThreshold}`}>
//                             <AlertTriangle className="w-4 h-4 text-red-500" />
//                           </span>
//                         )}
//                         <span className={isLowStock ? 'text-red-600 font-semibold' : 'text-gray-500'}>{p.quantity}</span>
//                     </div>
//                   </td>
//                   <td className="px-3 py-2 text-sm text-gray-500">{formatCurrency(p.sellingPrice)}</td>
//                   <td className="px-3 py-2 text-right">
//                     <div className="flex justify-end gap-4">
//                       <button onClick={() => onEdit(p)} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"><Edit2 className="w-4 h-4" /> Edit</button>
//                       <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1"><Trash2 className="w-4 h-4" /> Delete</button>
//                     </div>
//                   </td>
//                 </tr>
//                 );
//             })}
//           </tbody>
//         </table>
//       </div>
// );

// // --- PRODUCT FORM MODAL ---
// type ProductFormData = Omit<Product, 'id'> & { id?: string };
// type ProductFormState = Omit<ProductFormData, 'quantity' | 'buyingPrice' | 'sellingPrice' | 'gstRate' | 'lowStockThreshold'> & {
//     quantity?: number | '';
//     buyingPrice?: number | '';
//     sellingPrice?: number | '';
//     gstRate?: number | '';
//     lowStockThreshold?: number | '';
// };
// interface ProductFormModalProps {
//     product: ProductFormData | null;
//     onSave: (productData: ProductFormData, imageFile: File | null) => Promise<void>;
//     onClose: () => void;
// }

// const ProductFormModal: FC<ProductFormModalProps> = ({ product, onSave, onClose }) => {
//     const getInitialState = useCallback((): ProductFormState => {
//         if (product) {
//             return {
//                 ...product,
//                 quantity: product.quantity ?? '', buyingPrice: product.buyingPrice ?? '',
//                 sellingPrice: product.sellingPrice ?? '', gstRate: product.gstRate ?? '',
//                 lowStockThreshold: product.lowStockThreshold ?? ''
//             };
//         }
//         return {
//             name: "", sku: "", quantity: '', buyingPrice: '', sellingPrice: '',
//             gstRate: '', image: '', lowStockThreshold: ''
//         };
//     }, [product]);

//     const [formData, setFormData] = useState<ProductFormState>(getInitialState);
//     const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
//     const [imageFile, setImageFile] = useState<File | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const [isScannerOpen, setIsScannerOpen] = useState(false);
//     const [isGstInclusive, setIsGstInclusive] = useState(false);

//     // --- GST Calculation ---
//     const priceCalculations = useMemo(() => {
//         const priceInput = Number(formData.sellingPrice) || 0;
//         const rate = Number(formData.gstRate) || 0;

//         if (priceInput <= 0 || rate < 0) {
//             return { basePrice: priceInput, gstAmount: 0, totalPrice: priceInput };
//         }

//         if (isGstInclusive) {
//             const totalPrice = priceInput;
//             const basePrice = totalPrice / (1 + rate / 100);
//             const gstAmount = totalPrice - basePrice;
//             return { basePrice, gstAmount, totalPrice };
//         } else {
//             const basePrice = priceInput;
//             const gstAmount = basePrice * (rate / 100);
//             const totalPrice = basePrice + gstAmount;
//             return { basePrice, gstAmount, totalPrice };
//         }
//     }, [formData.sellingPrice, formData.gstRate, isGstInclusive]);

//     const handleModalScan = useCallback((result: DetectedBarcode[]) => {
//         if (result && result[0]) {
//             setFormData(prev => ({ ...prev, sku: result[0].rawValue }));
//             setIsScannerOpen(false);
//         }
//     }, []);

//     const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, value, type } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
//         }));
//     };

//     const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setImageFile(file);
//             setImagePreview(URL.createObjectURL(file));
//         }
//     };

//     const handleFormSubmit = () => {
//         const dataToSave: ProductFormData = {
//             ...formData,
//             quantity: Number(formData.quantity) || 0,
//             sellingPrice: priceCalculations.basePrice, // Always save the base price
//             gstRate: Number(formData.gstRate) || 0,
//             buyingPrice: Number(formData.buyingPrice) || 0,
//             lowStockThreshold: Number(formData.lowStockThreshold) || undefined,
//         };
//         onSave(dataToSave, imageFile);
//     };
    
//     const showCalculation = Number(formData.sellingPrice) > 0 && Number(formData.gstRate) >= 0;

//     return (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
//             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.3 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
//                 <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex justify-between items-center">
//                     <div>
//                         <h2 className="text-xl font-bold text-white">{product?.id ? 'Edit Product' : 'Add New Product'}</h2>
//                         <p className="text-indigo-100 text-sm mt-0.5">{product?.id ? 'Update product information' : 'Fill in the details below'}</p>
//                     </div>
//                     <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"><X className="w-5 h-5" /></button>
//                 </div>

//                 <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
//                     {isScannerOpen ? (
//                         <div className="space-y-4">
//                             <div className="w-full rounded-xl overflow-hidden border-2 border-gray-200 aspect-square">
//                                 <Scanner
//                                     onScan={handleModalScan}
//                                     constraints={{ facingMode: "environment" }}
//                                     scanDelay={300}
//                                     styles={{ container: { width: '100%', height: '100%' } }}
//                                 />
//                             </div>
//                             <button onClick={() => setIsScannerOpen(false)} className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium transition-colors">Cancel Scan</button>
//                         </div>
//                     ) : (
//                         <>
//                             <div className="space-y-2">
//                                 <label className="text-sm font-medium text-gray-700">Product Image</label>
//                                 <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors" onClick={() => fileInputRef.current?.click()}>
//                                     <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
//                                     {imagePreview ? (
//                                         <div className="relative w-full h-full"><Image src={imagePreview} alt="Product Preview" layout="fill" objectFit="contain" className="p-2" /></div>
//                                     ) : (
//                                         <div className="text-center text-gray-500"><ImageIcon className="w-10 h-10 mx-auto mb-2" /><p>Click to upload an image</p></div>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-sm font-medium text-gray-700">Product Name</label>
//                                 <input type="text" name="name" placeholder="Enter product name" className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none" value={formData.name} onChange={handleInputChange} />
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-sm font-medium text-gray-700">Product ID (SKU)</label>
//                                 <div className="relative">
//                                     <input type="text" name="sku" placeholder="SKU, Barcode, or custom ID" className="w-full border-2 border-gray-200 px-4 py-3 pr-14 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none font-mono text-sm" value={formData.sku || ''} onChange={handleInputChange} />
//                                     <button type="button" onClick={() => setIsScannerOpen(true)} className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/20 transition-all active:scale-95" aria-label="Scan barcode"><Camera className="w-5 h-5" /></button>
//                                 </div>
//                             </div>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <label className="text-sm font-medium text-gray-700">Quantity</label>
//                                     <input type="number" name="quantity" placeholder="e.g., 50" className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none" value={formData.quantity} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5" title="Set a custom alert when quantity falls to this level. Leave blank to use the global setting.">
//                                         Low Stock Alert
//                                         <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
//                                     </label>
//                                     <input
//                                         type="number"
//                                         name="lowStockThreshold"
//                                         placeholder={`Default: ${LOW_STOCK_THRESHOLD}`}
//                                         className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none"
//                                         value={formData.lowStockThreshold}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>
//                             </div>
                            
//                             {/* --- Start: Price and GST Inputs --- */}
//                             <div className={`grid grid-cols-1 ${!isGstInclusive ? 'sm:grid-cols-2' : ''} gap-4`}>
//                                <div className="space-y-2">
//                                     <label className="text-sm font-medium text-gray-700">{isGstInclusive ? 'Total Price (incl. GST)' : 'Selling Price (excl. GST)'}</label>
//                                     <div className="relative">
//                                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
//                                         <input type="number" name="sellingPrice" placeholder="e.g., 199.99" className="w-full border-2 border-gray-200 pl-8 pr-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" value={formData.sellingPrice} onChange={handleInputChange} />
//                                     </div>
//                                 </div>
//                                 {/* --- Conditionally render GST Rate input --- */}
//                                 {!isGstInclusive && (
//                                     <div className="space-y-2">
//                                         <label className="text-sm font-medium text-gray-700">GST Rate</label>
//                                         <div className="relative">
//                                             <input type="number" name="gstRate" placeholder="e.g., 18" className="w-full border-2 border-gray-200 px-4 py-3 pr-12 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none" value={formData.gstRate} onChange={handleInputChange} />
//                                             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                             {/* --- End: Price and GST Inputs --- */}

//                             {/* --- Start: GST Toggle --- */}
//                             <div className="flex items-center justify-center p-1 rounded-lg bg-gray-200">
//                                 <button
//                                     type="button"
//                                     onClick={() => setIsGstInclusive(false)}
//                                     className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${!isGstInclusive ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'}`}
//                                 >
//                                     Exclusive GST
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => setIsGstInclusive(true)}
//                                     className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${isGstInclusive ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'}`}
//                                 >
//                                     Inclusive GST
//                                 </button>
//                             </div>
//                             {/* --- End: GST Toggle --- */}

//                             {/* --- Start: GST Calculation Display (Only for Exclusive mode) --- */}
//                             {showCalculation && !isGstInclusive && (
//                                 <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border animate-in fade-in duration-300">
//                                     <div className="text-center">
//                                         <label className="text-xs font-medium text-gray-500 block">Base Price</label>
//                                         <div className="text-gray-800 font-semibold mt-1">
//                                             {formatCurrency(priceCalculations.basePrice)}
//                                         </div>
//                                     </div>
//                                     <div className="text-center">
//                                         <label className="text-xs font-medium text-gray-500 block">GST Amount</label>
//                                         <div className="text-gray-800 font-semibold mt-1">
//                                             {formatCurrency(priceCalculations.gstAmount)}
//                                         </div>
//                                     </div>
//                                     <div className="text-center">
//                                         <label className="text-xs font-medium text-gray-500 block">Total Price</label>
//                                         <div className="text-gray-900 font-bold text-lg mt-1">
//                                             {formatCurrency(priceCalculations.totalPrice)}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                             {/* --- End: GST Calculation Display --- */}
//                         </>
//                     )}
//                 </div>

//                 <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
//                     <button onClick={onClose} className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">Cancel</button>
//                     <button onClick={handleFormSubmit} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg shadow-indigo-500/30 transition-all">{product?.id ? 'Save Changes' : 'Add Product'}</button>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };


// // --- MAIN INVENTORY COMPONENT ---
// const Inventory: FC = () => {
//     const { status: sessionStatus } = useSession();
//     const [products, setProducts] = useState<Product[]>([]);
//     const [fetchStatus, setFetchStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');
//     const [error, setError] = useState<string | null>(null);
//     const [modalState, setModalState] = useState<{ isOpen: boolean; product: ProductFormData | null }>({ isOpen: false, product: null });
//     const [swipedProductId, setSwipedProductId] = useState<string | null>(null);
//     const [searchQuery, setSearchQuery] = useState<string>("");

//     const filteredProducts = useMemo(() => {
//         if (!searchQuery) return products;
//         const lowercasedQuery = searchQuery.toLowerCase();
//         return products.filter(product =>
//             product.name.toLowerCase().includes(lowercasedQuery) ||
//             (product.sku && product.sku.toLowerCase().includes(lowercasedQuery))
//         );
//     }, [products, searchQuery]);
    
//     const parentRef = useRef<HTMLDivElement>(null);
//     const rowVirtualizer = useVirtualizer({
//         count: filteredProducts.length,
//         getScrollElement: () => parentRef.current,
//         estimateSize: () => 104,
//         overscan: 5,
//     });

//     useEffect(() => {
//         if (sessionStatus === 'authenticated') {
//             const fetchProducts = async () => {
//                 setFetchStatus('loading');
//                 try {
//                     const response = await fetch('/api/products');
//                     if (!response.ok) throw new Error('Failed to fetch products');
//                     const data = await response.json();
//                     setProducts(Array.isArray(data) ? data : []);
//                     setFetchStatus('succeeded');
//                 } catch (err: unknown) {
//                     setError(err instanceof Error ? err.message : 'An unknown error occurred');
//                     setFetchStatus('failed');
//                 }
//             };
//             fetchProducts();
//         } else if (sessionStatus === 'unauthenticated') {
//             setProducts([]);
//             setFetchStatus('succeeded');
//         }
//     }, [sessionStatus]);

//     const handleExcelUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         const reader = new FileReader();
//         reader.onload = async (event: ProgressEvent<FileReader>) => {
//             if (!event.target?.result) return;
//             try {
//                 const data = new Uint8Array(event.target.result as ArrayBuffer);
//                 const workbook = XLSX.read(data, { type: "array" });
//                 const sheetName = workbook.SheetNames[0];
//                 const sheet = workbook.Sheets[sheetName];
//                 const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);

//                 const getColumn = (row: ExcelRow, expectedHeaders: string[]): unknown => {
//                     for (const header of expectedHeaders) {
//                         const lowerHeader = header.toLowerCase();
//                         for (const key in row) {
//                             if (key.trim().toLowerCase() === lowerHeader) {
//                                 return row[key];
//                             }
//                         }
//                     }
//                     return undefined;
//                 };

//                 const uploadedProducts = rows.map((row) => ({
//                     sku: String(getColumn(row, ["Product ID", "SKU"]) || ""),
//                     name: String(getColumn(row, ["Product Name", "Name"]) || ""),
//                     quantity: Number(getColumn(row, ["Quantity", "Qty"])) || 0,
//                     buyingPrice: Number(getColumn(row, ["Buying Price"])) || 0,
//                     sellingPrice: Number(getColumn(row, ["Selling Price"])) || 0,
//                     gstRate: Number(getColumn(row, ["GST Rate", "GST"])) || 0,
//                 }));
                
//                 const response = await fetch('/api/products/batch', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(uploadedProducts),
//                 });

//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || 'Failed to upload products');
//                 }
                
//                 const allProducts: Product[] = await response.json();
                
//                 if (Array.isArray(allProducts)) {
//                     setProducts(allProducts);
//                     alert(`${uploadedProducts.length} products uploaded successfully!`);
//                 }
//             } catch (err: unknown) {
//                 const errorMessage = err instanceof Error ? err.message : 'Unknown error during upload';
//                 console.error("Excel Upload Error:", err);
//                 alert(`Error: ${errorMessage}`);
//             } finally {
//                 e.target.value = '';
//             }
//         };
//         reader.readAsArrayBuffer(file);
//     }, []);


//     const handleSaveProduct = useCallback(async (productData: ProductFormData, imageFile: File | null) => {
//         const isEditing = !!productData.id;
//         const optimisticProduct: Product = {
//             id: isEditing ? productData.id! : `optimistic-${Date.now()}`,
//             image: imageFile ? URL.createObjectURL(imageFile) : productData.image,
//             ...productData,
//             quantity: Number(productData.quantity) || 0,
//             sellingPrice: Number(productData.sellingPrice) || 0,
//             gstRate: Number(productData.gstRate) || 0,
//             buyingPrice: Number(productData.buyingPrice) || 0,
//         };

//         const previousProducts = products;
        
//         if (isEditing) {
//             setProducts(prev => prev.map(p => p.id === optimisticProduct.id ? optimisticProduct : p));
//         } else {
//             setProducts(prev => [optimisticProduct, ...prev]);
//         }
//         setModalState({ isOpen: false, product: null });
        
//         try {
//             let imageUrl = productData.image || '';
//             if (imageFile) {
//                 const formData = new FormData();
//                 formData.append('file', imageFile);
//                 const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
//                 const uploadData = await uploadResponse.json();
//                 if (!uploadResponse.ok) throw new Error(uploadData.message || 'Image upload failed');
//                 imageUrl = uploadData.path;
//             }

//             const productToSave = { ...productData, image: imageUrl };
//             const url = isEditing ? `/api/products/${productData.id}` : '/api/products';
//             const method = isEditing ? 'PUT' : 'POST';

//             const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productToSave) });
//             if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} product`);
            
//             const savedProduct = await response.json();
//             setProducts(prev => prev.map(p => p.id === optimisticProduct.id ? savedProduct : p));

//         } catch (err: unknown) {
//             alert(`Error: ${err instanceof Error ? err.message : 'Could not save product'}`);
//             setProducts(previousProducts);
//         }
//     }, [products]);

//     const handleDeleteProduct = useCallback(async (id: string) => {
//         if (!window.confirm('Are you sure you want to delete this product?')) return;
//         const previousProducts = products;
//         setProducts(prev => prev.filter(p => p.id !== id));
//         setSwipedProductId(null);
        
//         try {
//             const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
//             if (response.status !== 204) throw new Error('Failed to delete product on the server.');
//         } catch (err: unknown) {
//             alert(`Error: ${err instanceof Error ? err.message : 'Could not delete product'}`);
//             setProducts(previousProducts);
//         }
//     }, [products]);
    
//     const renderContent = () => {
//         if (sessionStatus === 'loading' || fetchStatus === 'loading') {
//             return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /> <span className="ml-2">Loading Products...</span></div>;
//         }
//         if (sessionStatus === 'unauthenticated') {
//             return <div className="text-center h-64 flex flex-col justify-center items-center bg-gray-50 rounded-lg"><Info className="w-8 h-8 mb-2 text-gray-400" /> <h3 className="font-semibold">Please Log In</h3><p className="text-gray-500">Log in to manage your inventory.</p></div>
//         }
//         if (fetchStatus === 'failed') {
//             return <div className="flex flex-col items-center justify-center h-64 bg-red-50 text-red-700 rounded-lg p-4"><Info className="w-8 h-8 mb-2" /><strong>Error:</strong> {error}</div>;
//         }
//         if (products.length === 0) {
//             return <div className="text-center h-64 flex flex-col justify-center items-center bg-gray-50 rounded-lg"><Info className="w-8 h-8 mb-2 text-gray-400" /> <h3 className="font-semibold">No Products Found</h3><p className="text-gray-500">Click &quot;Add Product&quot; to get started.</p></div>
//         }
//         if (filteredProducts.length === 0) {
//             return <div className="text-center h-64 flex flex-col justify-center items-center bg-gray-50 rounded-lg"><Search className="w-8 h-8 mb-2 text-gray-400" /> <h3 className="font-semibold">No Matching Products</h3><p className="text-gray-500">Try a different search query.</p></div>
//         }

//         return (
//             <>
//                 <DesktopProductTable products={filteredProducts} onEdit={(p) => setModalState({ isOpen: true, product: p })} onDelete={handleDeleteProduct} />
//                 <div ref={parentRef} className="md:hidden pb-20 h-[calc(100vh-200px)] overflow-y-auto">
//                     <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
//                         {rowVirtualizer.getVirtualItems().map(virtualItem => {
//                             const product = filteredProducts[virtualItem.index];
//                             return (
//                                 <div
//                                     key={virtualItem.key}
//                                     style={{
//                                         position: 'absolute', top: 0, left: 0, width: '100%',
//                                         height: `${virtualItem.size}px`, transform: `translateY(${virtualItem.start}px)`,
//                                         padding: '6px 0',
//                                     }}
//                                 >
//                                     <MobileProductCard
//                                         product={product}
//                                         isSwiped={swipedProductId === product.id}
//                                         onSwipe={setSwipedProductId}
//                                         onEdit={(p) => setModalState({ isOpen: true, product: p })}
//                                         onDelete={handleDeleteProduct}
//                                     />
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </>
//         );
//     };

//     return (
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
//             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
//                 <div>
//                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory</h1>
//                     <p className="hidden md:block text-sm text-gray-600">Search, upload, or manage products manually.</p>
//                 </div>
//                 <div className="relative w-full md:w-auto order-first md:order-none">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input type="text" placeholder="Search by name or Product ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
//                 </div>
//                 <div className="hidden sm:flex items-center gap-3">
//                     <label className="flex items-center cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
//                         <Upload className="w-4 h-4 mr-2" /> Upload Excel
//                         <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
//                     </label>
//                     <button onClick={() => setModalState({ isOpen: true, product: null })} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
//                         <Plus className="w-4 h-4" /> Add Product
//                     </button>
//                 </div>
//             </div>

//             {renderContent()}

//             <div className="sm:hidden fixed bottom-20 right-4 flex flex-col items-center gap-3 z-40">
//                 <label className="w-14 h-14 flex items-center justify-center cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg">
//                     <Upload className="w-6 h-6" /><input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
//                 </label>
//                 <button onClick={() => setModalState({ isOpen: true, product: null })} className="w-14 h-14 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg">
//                     <Plus className="w-6 h-6" />
//                 </button>
//             </div>

//             {modalState.isOpen && (
//                 <ProductFormModal
//                     product={modalState.product}
//                     onSave={handleSaveProduct}
//                     onClose={() => setModalState({ isOpen: false, product: null })}
//                 />
//             )}
//         </div>
//     );
// };

// export default Inventory;



'use client';

import React, { useState, useEffect, FC, ChangeEvent, useRef, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import * as XLSX from "xlsx";
import { Upload, Edit2, Plus, X, Trash2, Search, Image as ImageIcon, Camera, Loader2, Info, AlertTriangle } from "lucide-react";
import { motion, useAnimationControls, PanInfo } from "framer-motion";
import Image from "next/image";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Scanner } from "@yudiel/react-qr-scanner";

// --- CONFIGURATION ---
const LOW_STOCK_THRESHOLD = 10;

// --- INTERFACES AND UTILITIES ---
export interface Product {
  id: string;
  name: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  gstRate: number;
  image?: string;
  sku?: string;
  lowStockThreshold?: number;
}

interface ExcelRow {
  [key: string]: string | number;
}

type DetectedBarcode = {
    rawValue: string;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
};

// --- MOBILE PRODUCT CARD ---
interface MobileProductCardProps {
  product: Product;
  isSwiped: boolean;
  onSwipe: (id: string | null) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const MobileProductCard: FC<MobileProductCardProps> = React.memo(({ product, isSwiped, onSwipe, onEdit, onDelete }) => {
  const controls = useAnimationControls();
  const ACTION_WIDTH = 160;
  const alertThreshold = product.lowStockThreshold ?? LOW_STOCK_THRESHOLD;
  const isLowStock = product.quantity <= alertThreshold;

  useEffect(() => {
    if (!isSwiped) {
      controls.start({ x: 0 });
    }
  }, [isSwiped, controls]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    if (info.offset.x < -ACTION_WIDTH / 2) {
      controls.start({ x: -ACTION_WIDTH });
      onSwipe(product.id);
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <div className={`relative w-full bg-gray-200 rounded-lg overflow-hidden shadow-sm ${isLowStock ? 'ring-2 ring-red-500' : ''}`}>
      <div className="absolute inset-y-0 right-0 flex" style={{ width: ACTION_WIDTH }}>
        <button onClick={() => onEdit(product)} className="w-1/2 h-full flex flex-col items-center justify-center bg-[#5a4fcf] text-white transition-colors hover:bg-[#4a3fb5]">
          <Edit2 className="w-5 h-5" /><span className="text-xs mt-1">Edit</span>
        </button>
        <button onClick={() => onDelete(product.id)} className="w-1/2 h-full flex flex-col items-center justify-center bg-red-500 text-white transition-colors hover:bg-red-600">
          <Trash2 className="w-5 h-5" /><span className="text-xs mt-1">Delete</span>
        </button>
      </div>
      <motion.div
        className="relative bg-white p-2.5 flex items-center gap-2.5 w-full cursor-grab"
        drag="x" dragConstraints={{ right: 0, left: -ACTION_WIDTH }} onDragEnd={handleDragEnd}
        animate={controls} transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => { if (isSwiped) { controls.start({ x: 0 }); onSwipe(null); } }}
      >
        {product.image ? (
           <Image src={product.image} alt={product.name} width={56} height={56} className="w-14 h-14 object-cover rounded-md bg-gray-100 flex-shrink-0" />
         ) : (
           <button onClick={() => onEdit(product)} className="w-14 h-14 flex-shrink-0 flex flex-col items-center justify-center bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
             <Upload className="w-4 h-4 text-gray-500" />
             <span className="text-[10px] mt-0.5 text-gray-600">Upload</span>
           </button>
         )}
        <div className="flex-1 overflow-hidden min-w-0">
            <h3 className="font-semibold text-sm text-gray-800 truncate">{product.name}</h3>
            <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xs text-gray-500 truncate">ID: {product.sku || 'N/A'}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {isLowStock && (
                        <div className="flex items-center gap-0.5 text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            <span className="text-[10px] font-medium">Low</span>
                        </div>
                    )}
                    <p className="text-xs text-gray-700 font-medium">Qty: {product.quantity}</p>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
});
MobileProductCard.displayName = 'MobileProductCard';

// --- DESKTOP PRODUCT TABLE ---
const DesktopProductTable: FC<{ products: Product[]; onEdit: (p: Product) => void; onDelete: (id: string) => void; }> = ({ products, onEdit, onDelete }) => (
    <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Product ID</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Selling Price</th>
              <th className="px-3 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => {
                const alertThreshold = p.lowStockThreshold ?? LOW_STOCK_THRESHOLD;
                const isLowStock = p.quantity <= alertThreshold;
                return (
                <tr key={p.id} className={isLowStock ? 'bg-red-50' : ''}>
                  <td className="px-3 py-2">
                  {p.image ? (
                      <Image src={p.image} alt={p.name} width={56} height={56} className="w-14 h-14 object-cover rounded-md" />
                    ) : (
                      <button onClick={() => onEdit(p)} className="w-14 h-14 flex flex-col items-center justify-center bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border">
                        <Upload className="w-5 h-5 text-gray-400" />
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 truncate max-w-xs">{p.sku || 'N/A'}</td>
                  <td className="px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                        {isLowStock && (
                          <span title={`Alert set for ${alertThreshold}`}>
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          </span>
                        )}
                        <span className={isLowStock ? 'text-red-600 font-semibold' : 'text-gray-500'}>{p.quantity}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500">{formatCurrency(p.sellingPrice)}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-4">
                      <button onClick={() => onEdit(p)} className="text-[#5a4fcf] hover:text-[#4a3fb5] flex items-center gap-1"><Edit2 className="w-4 h-4" /> Edit</button>
                      <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1"><Trash2 className="w-4 h-4" /> Delete</button>
                    </div>
                  </td>
                </tr>
                );
            })}
          </tbody>
        </table>
      </div>
);

// --- PRODUCT FORM MODAL ---
type ProductFormData = Omit<Product, 'id'> & { id?: string };
type ProductFormState = Omit<ProductFormData, 'quantity' | 'buyingPrice' | 'sellingPrice' | 'gstRate' | 'lowStockThreshold'> & {
    quantity?: number | '';
    buyingPrice?: number | '';
    sellingPrice?: number | '';
    gstRate?: number | '';
    lowStockThreshold?: number | '';
};
interface ProductFormModalProps {
    product: ProductFormData | null;
    onSave: (productData: ProductFormData, imageFile: File | null) => Promise<void>;
    onClose: () => void;
}

const ProductFormModal: FC<ProductFormModalProps> = ({ product, onSave, onClose }) => {
    const getInitialState = useCallback((): ProductFormState => {
        if (product) {
            return {
                ...product,
                quantity: product.quantity ?? '', buyingPrice: product.buyingPrice ?? '',
                sellingPrice: product.sellingPrice ?? '', gstRate: product.gstRate ?? '',
                lowStockThreshold: product.lowStockThreshold ?? ''
            };
        }
        return {
            name: "", sku: "", quantity: '', buyingPrice: '', sellingPrice: '',
            gstRate: '', image: '', lowStockThreshold: ''
        };
    }, [product]);

    const [formData, setFormData] = useState<ProductFormState>(getInitialState);
    const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isGstInclusive, setIsGstInclusive] = useState(false);

    const priceCalculations = useMemo(() => {
        const priceInput = Number(formData.sellingPrice) || 0;
        const rate = Number(formData.gstRate) || 0;

        if (priceInput <= 0 || rate < 0) {
            return { basePrice: priceInput, gstAmount: 0, totalPrice: priceInput };
        }

        if (isGstInclusive) {
            const totalPrice = priceInput;
            const basePrice = totalPrice / (1 + rate / 100);
            const gstAmount = totalPrice - basePrice;
            return { basePrice, gstAmount, totalPrice };
        } else {
            const basePrice = priceInput;
            const gstAmount = basePrice * (rate / 100);
            const totalPrice = basePrice + gstAmount;
            return { basePrice, gstAmount, totalPrice };
        }
    }, [formData.sellingPrice, formData.gstRate, isGstInclusive]);

    const handleModalScan = useCallback((result: DetectedBarcode[]) => {
        if (result && result[0]) {
            setFormData(prev => ({ ...prev, sku: result[0].rawValue }));
            setIsScannerOpen(false);
        }
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = () => {
        const dataToSave: ProductFormData = {
            ...formData,
            quantity: Number(formData.quantity) || 0,
            sellingPrice: priceCalculations.basePrice,
            gstRate: Number(formData.gstRate) || 0,
            buyingPrice: Number(formData.buyingPrice) || 0,
            lowStockThreshold: Number(formData.lowStockThreshold) || undefined,
        };
        onSave(dataToSave, imageFile);
    };
    
    const showCalculation = Number(formData.sellingPrice) > 0 && Number(formData.gstRate) >= 0;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-3 animate-in fade-in duration-200">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.3 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#5a4fcf] to-[#7b68ee] px-4 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-white">{product?.id ? 'Edit Product' : 'Add New Product'}</h2>
                        <p className="text-indigo-100 text-xs mt-0.5">{product?.id ? 'Update product information' : 'Fill in the details below'}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-4 space-y-3.5 max-h-[70vh] overflow-y-auto">
                    {isScannerOpen ? (
                        <div className="space-y-3">
                            <div className="w-full rounded-xl overflow-hidden border-2 border-gray-200 aspect-square">
                                <Scanner
                                    onScan={handleModalScan}
                                    constraints={{ facingMode: "environment" }}
                                    scanDelay={300}
                                    styles={{ container: { width: '100%', height: '100%' } }}
                                />
                            </div>
                            <button onClick={() => setIsScannerOpen(false)} className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium transition-colors text-sm">Cancel Scan</button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-700">Product Image</label>
                                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-[#5a4fcf] transition-colors" onClick={() => fileInputRef.current?.click()}>
                                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                                    {imagePreview ? (
                                        <div className="relative w-full h-full"><Image src={imagePreview} alt="Product Preview" fill sizes="(max-width: 768px) 100vw, 512px" style={{ objectFit: 'contain' }} className="p-2" /></div>
                                    ) : (
                                        <div className="text-center text-gray-500"><ImageIcon className="w-8 h-8 mx-auto mb-1.5" /><p className="text-xs">Click to upload</p></div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-700">Product Name</label>
                                <input type="text" name="name" placeholder="Enter product name" className="w-full border-2 border-gray-200 px-3 py-2 rounded-xl focus:border-[#5a4fcf] focus:ring-2 focus:ring-[#5a4fcf]/20 transition-all outline-none text-sm" value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-700">Product ID (SKU)</label>
                                <div className="relative">
                                    <input type="text" name="sku" placeholder="SKU, Barcode, or custom ID" className="w-full border-2 border-gray-200 px-3 py-2 pr-12 rounded-xl focus:border-[#5a4fcf] focus:ring-2 focus:ring-[#5a4fcf]/20 transition-all outline-none font-mono text-xs" value={formData.sku || ''} onChange={handleInputChange} />
                                    <button type="button" onClick={() => setIsScannerOpen(true)} className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 bg-gradient-to-r from-[#5a4fcf] to-[#7b68ee] text-white rounded-xl hover:from-[#4a3fb5] hover:to-[#6b58de] shadow-md shadow-[#5a4fcf]/20 transition-all active:scale-95" aria-label="Scan barcode"><Camera className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-700">Quantity</label>
                                    <input type="number" name="quantity" placeholder="e.g., 50" className="w-full border-2 border-gray-200 px-3 py-2 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-sm" value={formData.quantity} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-700 flex items-center gap-1" title="Set a custom alert when quantity falls to this level. Leave blank to use the global setting.">
                                        Low Stock Alert
                                        <Info className="w-3 h-3 text-gray-400 cursor-help" />
                                    </label>
                                    <input
                                        type="number"
                                        name="lowStockThreshold"
                                        placeholder={`Default: ${LOW_STOCK_THRESHOLD}`}
                                        className="w-full border-2 border-gray-200 px-3 py-2 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none text-sm"
                                        value={formData.lowStockThreshold}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            
                            <div className={`grid grid-cols-1 ${!isGstInclusive ? 'sm:grid-cols-2' : ''} gap-3`}>
                               <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-700">{isGstInclusive ? 'Total Price (incl. GST)' : 'Selling Price (excl. GST)'}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">₹</span>
                                        <input type="number" name="sellingPrice" placeholder="e.g., 199.99" className="w-full border-2 border-gray-200 pl-7 pr-3 py-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm" value={formData.sellingPrice} onChange={handleInputChange} />
                                    </div>
                                </div>
                                {!isGstInclusive && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-700">GST Rate</label>
                                        <div className="relative">
                                            <input type="number" name="gstRate" placeholder="e.g., 18" className="w-full border-2 border-gray-200 px-3 py-2 pr-10 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none text-sm" value={formData.gstRate} onChange={handleInputChange} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">%</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-center p-0.5 rounded-lg bg-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setIsGstInclusive(false)}
                                    className={`w-1/2 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${!isGstInclusive ? 'bg-white text-[#5a4fcf] shadow-sm' : 'text-gray-600'}`}
                                >
                                    Exclusive GST
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsGstInclusive(true)}
                                    className={`w-1/2 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${isGstInclusive ? 'bg-white text-[#5a4fcf] shadow-sm' : 'text-gray-600'}`}
                                >
                                    Inclusive GST
                                </button>
                            </div>

                            {showCalculation && !isGstInclusive && (
                                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border animate-in fade-in duration-300">
                                    <div className="text-center">
                                        <label className="text-[10px] font-medium text-gray-500 block">Base Price</label>
                                        <div className="text-gray-800 font-semibold text-xs mt-0.5">
                                            {formatCurrency(priceCalculations.basePrice)}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <label className="text-[10px] font-medium text-gray-500 block">GST Amount</label>
                                        <div className="text-gray-800 font-semibold text-xs mt-0.5">
                                            {formatCurrency(priceCalculations.gstAmount)}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <label className="text-[10px] font-medium text-gray-500 block">Total Price</label>
                                        <div className="text-gray-900 font-bold text-sm mt-0.5">
                                            {formatCurrency(priceCalculations.totalPrice)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2.5 border-t">
                    <button onClick={onClose} className="px-5 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors text-sm">Cancel</button>
                    <button onClick={handleFormSubmit} className="px-5 py-2 bg-gradient-to-r from-[#5a4fcf] to-[#7b68ee] text-white rounded-xl hover:from-[#4a3fb5] hover:to-[#6b58de] font-medium shadow-lg shadow-[#5a4fcf]/30 transition-all text-sm">{product?.id ? 'Save Changes' : 'Add Product'}</button>
                </div>
            </motion.div>
        </div>
    );
};


// --- MAIN INVENTORY COMPONENT ---
const Inventory: FC = () => {
    const { status: sessionStatus } = useSession();
    const [products, setProducts] = useState<Product[]>([]);
    const [fetchStatus, setFetchStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [modalState, setModalState] = useState<{ isOpen: boolean; product: ProductFormData | null }>({ isOpen: false, product: null });
    const [swipedProductId, setSwipedProductId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);

    // Fix hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;
        const lowercasedQuery = searchQuery.toLowerCase();
        return products.filter(product =>
            product.name.toLowerCase().includes(lowercasedQuery) ||
            (product.sku && product.sku.toLowerCase().includes(lowercasedQuery))
        );
    }, [products, searchQuery]);
    
    const parentRef = useRef<HTMLDivElement>(null);
    const rowVirtualizer = useVirtualizer({
        count: filteredProducts.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 90,
        overscan: 5,
    });

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            const fetchProducts = async () => {
                setFetchStatus('loading');
                try {
                    const response = await fetch('/api/products');
                    if (!response.ok) throw new Error('Failed to fetch products');
                    const data = await response.json();
                    setProducts(Array.isArray(data) ? data : []);
                    setFetchStatus('succeeded');
                } catch (err: unknown) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                    setFetchStatus('failed');
                }
            };
            fetchProducts();
        } else if (sessionStatus === 'unauthenticated') {
            setProducts([]);
            setFetchStatus('succeeded');
        }
    }, [sessionStatus]);

    const handleExcelUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event: ProgressEvent<FileReader>) => {
            if (!event.target?.result) return;
            try {
                const data = new Uint8Array(event.target.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);

                const getColumn = (row: ExcelRow, expectedHeaders: string[]): unknown => {
                    for (const header of expectedHeaders) {
                        const lowerHeader = header.toLowerCase();
                        for (const key in row) {
                            if (key.trim().toLowerCase() === lowerHeader) {
                                return row[key];
                            }
                        }
                    }
                    return undefined;
                };

                const uploadedProducts = rows.map((row) => ({
                    sku: String(getColumn(row, ["Product ID", "SKU"]) || ""),
                    name: String(getColumn(row, ["Product Name", "Name"]) || ""),
                    quantity: Number(getColumn(row, ["Quantity", "Qty"])) || 0,
                    buyingPrice: Number(getColumn(row, ["Buying Price"])) || 0,
                    sellingPrice: Number(getColumn(row, ["Selling Price"])) || 0,
                    gstRate: Number(getColumn(row, ["GST Rate", "GST"])) || 0,
                }));
                
                const response = await fetch('/api/products/batch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(uploadedProducts),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to upload products');
                }
                
                const allProducts: Product[] = await response.json();
                
                if (Array.isArray(allProducts)) {
                    setProducts(allProducts);
                    alert(`${uploadedProducts.length} products uploaded successfully!`);
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error during upload';
                console.error("Excel Upload Error:", err);
                alert(`Error: ${errorMessage}`);
            } finally {
                e.target.value = '';
            }
        };
        reader.readAsArrayBuffer(file);
    }, []);


    const handleSaveProduct = useCallback(async (productData: ProductFormData, imageFile: File | null) => {
        const isEditing = !!productData.id;
        
        try {
            let imageUrl = productData.image || '';
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
                const uploadData = await uploadResponse.json();
                if (!uploadResponse.ok) throw new Error(uploadData.message || 'Image upload failed');
                imageUrl = uploadData.path;
            }

            const productToSave = { ...productData, image: imageUrl };
            const url = isEditing ? `/api/products/${productData.id}` : '/api/products';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productToSave) });
            if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} product`);
            
            const savedProduct = await response.json();
            
            // Update the products list immediately
            if (isEditing) {
                setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
            } else {
                setProducts(prev => [savedProduct, ...prev]);
            }
            
            // Close modal after successful save
            setModalState({ isOpen: false, product: null });

        } catch (err: unknown) {
            alert(`Error: ${err instanceof Error ? err.message : 'Could not save product'}`);
        }
    }, []);

    const handleDeleteProduct = useCallback(async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        const previousProducts = products;
        setProducts(prev => prev.filter(p => p.id !== id));
        setSwipedProductId(null);
        
        try {
            const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (response.status !== 204) throw new Error('Failed to delete product on the server.');
        } catch (err: unknown) {
            alert(`Error: ${err instanceof Error ? err.message : 'Could not delete product'}`);
            setProducts(previousProducts);
        }
    }, [products]);
    
    const renderContent = () => {
        if (sessionStatus === 'loading' || fetchStatus === 'loading') {
            return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#5a4fcf]" /> <span className="ml-2">Loading Products...</span></div>;
        }
        if (sessionStatus === 'unauthenticated') {
            return <div className="text-center h-64 flex flex-col justify-center items-center bg-gray-50 rounded-lg"><Info className="w-8 h-8 mb-2 text-gray-400" /> <h3 className="font-semibold">Please Log In</h3><p className="text-gray-500">Log in to manage your inventory.</p></div>
        }
        if (fetchStatus === 'failed') {
            return <div className="flex flex-col items-center justify-center h-64 bg-red-50 text-red-700 rounded-lg p-4"><Info className="w-8 h-8 mb-2" /><strong>Error:</strong> {error}</div>;
        }
        if (products.length === 0) {
            return <div className="text-center h-64 flex flex-col justify-center items-center bg-gray-50 rounded-lg"><Info className="w-8 h-8 mb-2 text-gray-400" /> <h3 className="font-semibold">No Products Found</h3><p className="text-gray-500">Click &quot;Add Product&quot; to get started.</p></div>
        }
        if (filteredProducts.length === 0) {
            return <div className="text-center h-64 flex flex-col justify-center items-center bg-gray-50 rounded-lg"><Search className="w-8 h-8 mb-2 text-gray-400" /> <h3 className="font-semibold">No Matching Products</h3><p className="text-gray-500">Try a different search query.</p></div>
        }

        return (
            <>
                <DesktopProductTable products={filteredProducts} onEdit={(p) => setModalState({ isOpen: true, product: p })} onDelete={handleDeleteProduct} />
                <div ref={parentRef} className="md:hidden pb-20 h-[calc(100vh-200px)] overflow-y-auto">
                    <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                        {rowVirtualizer.getVirtualItems().map(virtualItem => {
                            const product = filteredProducts[virtualItem.index];
                            return (
                                <div
                                    key={virtualItem.key}
                                    style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%',
                                        height: `${virtualItem.size}px`, transform: `translateY(${virtualItem.start}px)`,
                                        padding: '4px 0',
                                    }}
                                >
                                    <MobileProductCard
                                        product={product}
                                        isSwiped={swipedProductId === product.id}
                                        onSwipe={setSwipedProductId}
                                        onEdit={(p) => setModalState({ isOpen: true, product: p })}
                                        onDelete={handleDeleteProduct}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    };

    // Prevent hydration mismatch
    if (!isMounted) {
        return (
            <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 font-sans">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#5a4fcf]" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 font-sans">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
                <div>
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900">Inventory</h1>
                    <p className="hidden md:block text-sm text-gray-600">Search, upload, or manage products manually.</p>
                </div>
                <div className="relative w-full md:w-auto order-first md:order-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search by name or Product ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-[#5a4fcf] focus:border-[#5a4fcf]" />
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <label className="flex items-center cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                        <Upload className="w-4 h-4 mr-2" /> Upload Excel
                        <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
                    </label>
                    <button onClick={() => setModalState({ isOpen: true, product: null })} className="flex items-center gap-1 bg-[#5a4fcf] hover:bg-[#4a3fb5] text-white px-4 py-2 rounded-md text-sm">
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>
            </div>

            {renderContent()}

            <div className="sm:hidden fixed bottom-20 right-3 flex flex-col items-center gap-2.5 z-40">
                <label className="w-12 h-12 flex items-center justify-center cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg">
                    <Upload className="w-5 h-5" /><input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
                </label>
                <button onClick={() => setModalState({ isOpen: true, product: null })} className="w-12 h-12 flex items-center justify-center bg-[#5a4fcf] hover:bg-[#4a3fb5] text-white rounded-full shadow-lg">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {modalState.isOpen && (
                <ProductFormModal
                    product={modalState.product}
                    onSave={handleSaveProduct}
                    onClose={() => setModalState({ isOpen: false, product: null })}
                />
            )}
        </div>
    );
};

export default Inventory;