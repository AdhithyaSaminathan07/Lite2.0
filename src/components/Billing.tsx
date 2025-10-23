'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Scan, Trash2, Edit2, Check, X, Sun, AlertTriangle } from 'lucide-react';

type CartItem = {
  id: number;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  isEditing?: boolean;
};

type InventoryProduct = {
  id: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  image?: string;
  sku?: string;
};

type ScannerResult = {
  getText: () => string;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  showCancel?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'OK',
  showCancel = false,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#5a4fcf]/10">
            <AlertTriangle className="h-6 w-6 text-[#5a4fcf]" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="mt-2 text-gray-600 text-sm">{children}</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          {showCancel && (
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className="rounded-lg bg-[#5a4fcf] px-5 py-2 font-semibold text-white hover:bg-[#4c42b8]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
Modal.displayName = 'Modal';

export default function BillingPage() {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState<number>(0);
  const [scanning, setScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: undefined as (() => void) | undefined,
    confirmText: 'OK',
    showCancel: false,
  });

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        try {
          const res = await fetch('/api/products');
          if (!res.ok) throw new Error('Failed to fetch');
          const data: InventoryProduct[] = await res.json();
          setInventory(data);
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [status]);

  useEffect(() => {
    if (!productName.trim()) return setShowSuggestions(false);
    const query = productName.trim().toLowerCase();
    const filtered = inventory
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.sku && p.sku.toLowerCase().includes(query))
      )
      .slice(0, 5);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [productName, inventory]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      )
        setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addToCart = useCallback(
    (name: string, price: number, productId?: string) => {
      if (!name || price < 0) return;
      setCart((prev) => {
        const existing = productId
          ? prev.find((item) => item.productId === productId)
          : null;
        if (existing) {
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        const newItem: CartItem = {
          id: Date.now(),
          productId,
          name,
          quantity: 1,
          price,
        };
        return [newItem, ...prev];
      });
      setProductName('');
      setProductPrice(0);
      setShowSuggestions(false);
    },
    []
  );

  const handleScanResult = useCallback(
    (scannedValue: string) => {
      const lowercasedScannedValue = scannedValue.toLowerCase();
      const foundProduct = inventory.find(
        (p) =>
          p.id.toString() === scannedValue ||
          (p.sku && p.sku.toLowerCase() === lowercasedScannedValue) ||
          p.name.toLowerCase() === lowercasedScannedValue
      );

      if (foundProduct) {
        addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.id);
      } else {
        addToCart(scannedValue, 0);
      }
      setScanning(false);
    },
    [inventory, addToCart]
  );

  const handleManualAdd = useCallback(() => {
    if (!productName.trim() || !productPrice || productPrice <= 0) {
      setModal({
        isOpen: true,
        title: 'Invalid Input',
        message: 'Enter valid product name and price.',
        showCancel: false,
        confirmText: 'OK',
        onConfirm: undefined,
      });
      return;
    }
    const matched = inventory.find(
      (p) => p.name.toLowerCase() === productName.trim().toLowerCase()
    );
    if (matched) addToCart(matched.name, matched.sellingPrice, matched.id);
    else addToCart(productName.trim(), Number(productPrice));
  }, [productName, productPrice, inventory, addToCart]);

  const deleteCartItem = (id: number) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const toggleEdit = (id: number) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );

  const handleScannerUpdate = (
    error: unknown,
    result: ScannerResult | undefined
  ) => {
    if (result?.getText()) {
      const value = result.getText().toLowerCase();
      const found = inventory.find(
        (p) =>
          p.id === value ||
          (p.sku && p.sku.toLowerCase() === value) ||
          p.name.toLowerCase() === value
      );
      if (found) addToCart(found.name, found.sellingPrice, found.id);
      else addToCart(value, 0);
      setScanning(false);
    }
    if (error) console.info('Scanner error:', (error as Error).message);
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f9f9fb] font-sans">
        <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm sticky top-0 z-20">
          <h1 className="text-xl font-bold text-[#5a4fcf]">Billzzy Billing</h1>
          <button
            onClick={() => setScanning(true)}
            className="flex items-center gap-2 bg-[#5a4fcf] px-4 py-2 rounded-lg text-white font-semibold shadow hover:bg-[#4c42b8] transition"
          >
            <Scan size={18} />
            <span>Scan</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-3">
          <div ref={suggestionsRef} className="relative">
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="w-full rounded-xl border border-gray-200 p-3 shadow-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            {showSuggestions && (
              <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => addToCart(s.name, s.sellingPrice, s.id)}
                    className="cursor-pointer border-b p-3 hover:bg-[#f1f0ff]"
                  >
                    <div className="flex justify-between font-semibold text-gray-800">
                      <span>{s.name}</span>
                      <span>₹{s.sellingPrice.toFixed(2)}</span>
                    </div>
                    {s.sku && <p className="text-xs text-gray-500">ID: {s.sku}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Price"
              className="w-1/3 rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-[#5a4fcf]"
              value={productPrice}
              onChange={(e) =>
                setProductPrice(
                  e.target.value === '' ? 0 : parseFloat(e.target.value)
                )
              }
            />
            <button
              onClick={handleManualAdd}
              className="flex-1 rounded-lg bg-[#5a4fcf] text-white font-semibold hover:bg-[#4c42b8] transition"
            >
              Add Item
            </button>
          </div>

          <div className="space-y-2">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">🛒 Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm"
                >
                  <div className="flex flex-1 items-center gap-2">
                    {item.isEditing ? (
                      <>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            setCart((prev) =>
                              prev.map((i) =>
                                i.id === item.id ? { ...i, name: e.target.value } : i
                              )
                            )
                          }
                          className="border rounded-lg p-1 w-1/3 text-sm"
                        />
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            setCart((prev) =>
                              prev.map((i) =>
                                i.id === item.id
                                  ? { ...i, quantity: parseInt(e.target.value) || 0 }
                                  : i
                              )
                            )
                          }
                          className="border rounded-lg p-1 w-1/6 text-sm"
                        />
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            setCart((prev) =>
                              prev.map((i) =>
                                i.id === item.id
                                  ? { ...i, price: parseFloat(e.target.value) || 0 }
                                  : i
                              )
                            )
                          }
                          className="border rounded-lg p-1 w-1/6 text-sm"
                        />
                      </>
                    ) : (
                      <>
                        <p className="font-semibold w-1/3">{item.name}</p>
                        <p className="text-xs text-gray-500 w-1/6">Qty: {item.quantity}</p>
                        <p className="text-xs text-gray-500 w-1/6">₹{item.price}</p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => toggleEdit(item.id)}
                      className={`${
                        item.isEditing ? 'text-green-600' : 'text-[#5a4fcf]'
                      } hover:text-[#4c42b8]`}
                    >
                      {item.isEditing ? <Check size={18} /> : <Edit2 size={18} />}
                    </button>
                    <button
                      onClick={() => deleteCartItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        <footer className="bg-white p-4 shadow-lg border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total</span>
            <span className="text-2xl font-bold text-[#5a4fcf]">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
        </footer>
      </div>

      {scanning && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
          <div className="w-72 rounded-xl bg-white p-3 relative shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-[#5a4fcf] text-sm">
                Scan Barcode / QR
              </h3>
              <button
                onClick={() => setScanning(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-hidden rounded-md">
              <BarcodeScannerComponent
                width="100%"
                height={200}
                delay={100}
                onUpdate={handleScannerUpdate}
              />
            </div>
            <button
              onClick={() => setFlashOn((f) => !f)}
              className="mt-2 flex items-center justify-center gap-2 w-full rounded-md bg-[#5a4fcf] py-2 text-white font-medium hover:bg-[#4c42b8] transition"
            >
              <Sun size={16} />
              {flashOn ? 'Flash On' : 'Flash Off'}
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
        showCancel={modal.showCancel}
      >
        <p>{modal.message}</p>
      </Modal>
    </>
  );
}
