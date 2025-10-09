'use client';

import React, { useState, useEffect, FC, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { Upload, Edit2, Plus, X, Trash2, Search } from "lucide-react";
import { motion, useAnimationControls, PanInfo } from "framer-motion";

// --- INTERFACES AND UTILITIES ---
// SKU has been removed from the interface
export interface Product {
  id: number;
  name: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  gstRate: number;
  image?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};


// --- MobileProductCard Component (No changes needed) ---
interface MobileProductCardProps {
  product: Product;
  isSwiped: boolean;
  onSwipe: (id: number | null) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
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
          <p className="text-sm text-gray-500">Qty: {product.quantity} &bull; SP: {formatCurrency(product.sellingPrice)}</p>
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
  const [swipedProductId, setSwipedProductId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Type for a new product, without SKU
  type NewProduct = Omit<Product, 'id' | 'image'>;
  const [newProduct, setNewProduct] = useState<NewProduct>({ name: "", quantity: 0, buyingPrice: 0, sellingPrice: 0, gstRate: 0 });

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
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
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

      // Map Excel rows to product data, without SKU
      const uploadedProducts: Omit<NewProduct, 'sku'>[] = rows.map((row) => ({
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
        alert(`An error occurred during the upload: ${error.message}`);
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
    setNewProduct({ name: "", quantity: 0, buyingPrice: 0, sellingPrice: 0, gstRate: 0 });
    setShowAddModal(true);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingProduct) return;
    try {
      // The body of the request will not contain an SKU
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
      alert(`Failed to create product: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    setSwipedProductId(null);
  };

  const calculateTotal = (quantity: number, sellingPrice: number, gstRate: number): number => {
    return quantity * sellingPrice * (1 + gstRate / 100);
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
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
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

      {/* --- DESKTOP TABLE VIEW (SKU column removed) --- */}
      <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Selling Price</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Total Revenue</th>
              <th className="px-3 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td className="px-3 py-2"><img src={p.image || `https://via.placeholder.com/64x64.png?text=${p.name.charAt(0)}`} alt={p.name} className="w-14 h-14 object-cover rounded-md" /></td>
                <td className="px-3 py-2 text-sm font-medium text-gray-900">{p.name}</td>
                <td className="px-3 py-2 text-sm text-gray-500">{p.quantity}</td>
                <td className="px-3 py-2 text-sm text-gray-500">{formatCurrency(p.sellingPrice)}</td>
                <td className="px-3 py-2 text-sm text-gray-500">{formatCurrency(calculateTotal(p.quantity, p.sellingPrice, p.gstRate))}</td>
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

      {/* --- MOBILE CARD VIEW --- */}
      <div className="md:hidden space-y-3 pb-20">
        {filteredProducts.map((p) => (
          <MobileProductCard key={p.id} product={p} isSwiped={swipedProductId === p.id} onSwipe={setSwipedProductId} onEdit={openEditModal} onDelete={handleDeleteProduct} />
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">{searchQuery ? 'No products match your search.' : 'No products in inventory.'}</p>
            {!searchQuery && <p className="text-gray-400 text-sm mt-1">Tap the '+' button to add your first product.</p>}
          </div>
        )}
      </div>

      {/* --- MOBILE FLOATING ACTION BUTTONS --- */}
      <div className="sm:hidden fixed bottom-4 right-4 flex flex-col items-center gap-3 z-20">
        <label className="w-14 h-14 flex items-center justify-center cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg">
          <Upload className="w-6 h-6" />
          <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
        </label>
        <button onClick={openAddModal} className="w-14 h-14 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* --- ADD/EDIT MODAL (SKU input removed) --- */}
      {(showAddModal || (showEditModal && editingProduct)) && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{showEditModal ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Product Name" className="w-full border px-3 py-2 rounded-md" value={showEditModal ? editingProduct?.name : newProduct.name} onChange={(e: ChangeEvent<HTMLInputElement>) => showEditModal ? setEditingProduct({ ...editingProduct!, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })} />
              <input type="number" placeholder="Quantity" className="w-full border px-3 py-2 rounded-md" value={showEditModal ? editingProduct?.quantity : newProduct.quantity} onChange={(e: ChangeEvent<HTMLInputElement>) => showEditModal ? setEditingProduct({ ...editingProduct!, quantity: parseFloat(e.target.value) || 0 }) : setNewProduct({ ...newProduct, quantity: parseFloat(e.target.value) || 0 })} />
              <input type="number" placeholder="Selling Price" className="w-full border px-3 py-2 rounded-md" value={showEditModal ? editingProduct?.sellingPrice : newProduct.sellingPrice} onChange={(e: ChangeEvent<HTMLInputElement>) => showEditModal ? setEditingProduct({ ...editingProduct!, sellingPrice: parseFloat(e.target.value) || 0 }) : setNewProduct({ ...newProduct, sellingPrice: parseFloat(e.target.value) || 0 })} />
              <input type="number" placeholder="GST Rate (%)" className="w-full border px-3 py-2 rounded-md" value={showEditModal ? editingProduct?.gstRate : newProduct.gstRate} onChange={(e: ChangeEvent<HTMLInputElement>) => showEditModal ? setEditingProduct({ ...editingProduct!, gstRate: parseFloat(e.target.value) || 0 }) : setNewProduct({ ...newProduct, gstRate: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={showEditModal ? handleSaveEdit : handleSaveNewProduct} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{showEditModal ? 'Save' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;