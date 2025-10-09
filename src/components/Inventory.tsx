<<<<<<< HEAD
// src/components/Inventory.tsx
=======
>>>>>>> origin/main
'use client';

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Upload, Edit2, Plus, X, Trash2 } from "lucide-react";

// Updated Product interface with buying and selling prices
export interface Product {
  id: number;
  name: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  gstRate: number;
  image?: string;
}

const formatCurrency = (amount: number) => {
  // This is correct, the error comes from tsconfig.json
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Updated initial state for a new product
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    buyingPrice: 0,
    sellingPrice: 0,
    gstRate: 0,
  });

  // ✅ Fetch all products on initial render
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Excel Upload (Correctly Typed) - Note: This will add to local state, not directly to DB
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (!event.target?.result) return;
      const data = new Uint8Array(event.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      const newProducts: Omit<Product, 'id'>[] = rows.map((row) => ({
        name: row["Product Name"] || "",
        quantity: Number(row["Quantity"]) || 0,
        buyingPrice: Number(row["Buying Price"]) || 0,
        sellingPrice: Number(row["Selling Price"]) || 0,
        gstRate: Number(row["GST Rate"]) || 0,
      }));
      
    };
    reader.readAsArrayBuffer(file);
  };

  // ✅ Image Upload (Correctly Typed)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: number, isNew = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);

    if (isNew) {
      // Logic to handle image for a new product if needed
    } else {
      setProducts((prev) =>
        prev.map((p: Product) => (p.id === id ? { ...p, image: imageUrl } : p))
      );
    }
  };

  // ✅ Edit Product
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct: Product = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // ✅ Add Product
  const openAddModal = () => {
    setNewProduct({
      name: "",
      quantity: 0,
      buyingPrice: 0,
      sellingPrice: 0,
      gstRate: 0,
    });
    setShowAddModal(true);
  };

  const handleSaveNewProduct = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const createdProduct: Product = await response.json();
      setProducts((prev) => [...prev, createdProduct]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // ✅ Delete Product
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // ✅ Calculate total with GST
  const calculateTotal = (quantity: number, sellingPrice: number, gstRate: number) => {
    return quantity * sellingPrice + (quantity * sellingPrice * gstRate) / 100;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-600">
            Upload Excel or add/edit products manually.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <label className="flex items-center cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
            <Upload className="w-4 h-4 mr-2" /> Upload Excel
            <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
          </label>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Table for larger screens */}
      <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Buying Price</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Selling Price</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">GST %</th>
              <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Total Revenue</th>
              <th className="px-3 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => {
              const totalPrice = calculateTotal(p.quantity, p.sellingPrice, p.gstRate);
              return (
                <tr key={p.id}>
                  <td className="px-3 py-2">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-md" />
                    ) : (
                      <label className="text-blue-600 text-sm cursor-pointer">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, p.id)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{p.quantity}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{formatCurrency(p.buyingPrice)}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{formatCurrency(p.sellingPrice)}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{p.gstRate}%</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{formatCurrency(totalPrice)}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => openEditModal(p)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500 text-sm">
                  No products added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for smaller screens */}
      <div className="md:hidden space-y-4">
        {products.map((p) => {
          const totalPrice = calculateTotal(p.quantity, p.sellingPrice, p.gstRate);
          return (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-start gap-4">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-md" />
                ) : (
                  <label className="w-20 h-20 flex items-center justify-center text-blue-600 text-sm cursor-pointer border-2 border-dashed rounded-md">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, p.id)}
                      className="hidden"
                    />
                  </label>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {p.quantity}</p>
                  <p className="text-sm text-gray-500">BP: {formatCurrency(p.buyingPrice)}</p>
                  <p className="text-sm text-gray-500">SP: {formatCurrency(p.sellingPrice)}</p>
                  <p className="text-sm text-gray-500">GST: {p.gstRate}%</p>
                  <p className="text-md font-semibold text-gray-800 mt-1">
                    Revenue: {formatCurrency(totalPrice)}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4 border-t pt-3">
                <button
                  onClick={() => openEditModal(p)}
                  className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="text-red-600 hover:text-red-900 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          );
        })}
        {products.length === 0 && (
          <div className="p-6 text-center text-gray-500 text-sm">
            No products added yet.
          </div>
        )}
      </div>

       {/* Floating Action Button for mobile */}
       <div className="sm:hidden fixed bottom-4 right-4 flex flex-col gap-3">
          <label className="w-14 h-14 flex items-center justify-center cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg">
            <Upload className="w-6 h-6" />
            <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
          </label>
          <button
            onClick={openAddModal}
            className="w-14 h-14 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Product</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="editProductName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  id="editProductName" 
                  className="w-full border px-3 py-2 rounded-md" 
                  value={editingProduct.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="editQuantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input 
                  type="text"
                  id="editQuantity" 
                  className="w-full border px-3 py-2 rounded-md" 
                  value={editingProduct.quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, quantity: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label htmlFor="editBuyingPrice" className="block text-sm font-medium text-gray-700 mb-1">Buying Price</label>
                <input 
                  type="text"
                  id="editBuyingPrice" 
                  className="w-full border px-3 py-2 rounded-md" 
                  value={editingProduct.buyingPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, buyingPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label htmlFor="editSellingPrice" className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                <input 
                  type="text"
                  id="editSellingPrice" 
                  className="w-full border px-3 py-2 rounded-md" 
                  value={editingProduct.sellingPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, sellingPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label htmlFor="editGstRate" className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
                <input 
                  type="text"
                  id="editGstRate" 
                  className="w-full border px-3 py-2 rounded-md" 
                  value={editingProduct.gstRate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, gstRate: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="text-sm text-gray-700 pt-2">
                Total Revenue (incl. GST): {formatCurrency(calculateTotal(editingProduct.quantity, editingProduct.sellingPrice, editingProduct.gstRate))}
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Product</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  id="productName" 
                  className="w-full border px-3 py-2 rounded-md placeholder:text-gray-400" 
                  placeholder="Enter product name" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input 
                  type="text"
                  id="quantity" 
                  className="w-full border px-3 py-2 rounded-md placeholder:text-gray-400" 
                  placeholder="0" 
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label htmlFor="buyingPrice" className="block text-sm font-medium text-gray-700 mb-1">Buying Price</label>
                <input 
                  type="text"
                  id="buyingPrice" 
                  className="w-full border px-3 py-2 rounded-md placeholder:text-gray-400" 
                  placeholder="0.00" 
                  value={newProduct.buyingPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, buyingPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                <input 
                  type="text"
                  id="sellingPrice" 
                  className="w-full border px-3 py-2 rounded-md placeholder:text-gray-400" 
                  placeholder="0.00" 
                  value={newProduct.sellingPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label htmlFor="gstRate" className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
                <input 
                  type="text"
                  id="gstRate" 
                  className="w-full border px-3 py-2 rounded-md placeholder:text-gray-400" 
                  placeholder="0" 
                  value={newProduct.gstRate}
                  onChange={(e) => setNewProduct({ ...newProduct, gstRate: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="text-sm text-gray-700 pt-2">
                Total Revenue (incl. GST): {formatCurrency(calculateTotal(newProduct.quantity, newProduct.sellingPrice, newProduct.gstRate))}
              </div>
              {/* Image upload for new product can be added here */}
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={handleSaveNewProduct} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}