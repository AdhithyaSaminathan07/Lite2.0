// 'use client';

// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { useSession } from 'next-auth/react';
// import { Scanner } from '@yudiel/react-qr-scanner';
// import QRCode from 'react-qr-code';
// import {
//   Scan, Trash2, Edit2, Check, X, Sun, AlertTriangle, Send,
//   CreditCard, CheckCircle, DollarSign, MessageSquare, RefreshCw
// } from 'lucide-react';

// // --- TYPE DEFINITIONS ---
// type CartItem = {
//   id: number;
//   productId?: string;
//   name: string;
//   quantity: number;
//   price: number;
//   isEditing?: boolean;
// };

// type InventoryProduct = {
//   id: string;
//   name: string;
//   quantity: number;
//   sellingPrice: number;
//   image?: string;
//   sku?: string;
// };

// // A minimal local type for the scanner result to avoid using 'any'
// type ScanResult = {
//     rawValue: string;
// };

// // --- MODAL COMPONENT ---
// type ModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
//   onConfirm?: () => void;
//   confirmText?: string;
//   showCancel?: boolean;
// };

// const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onConfirm, confirmText = 'OK', showCancel = false }) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="relative w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
//         <div className="flex items-start">
//           <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#5a4fcf]/10">
//             <AlertTriangle className="h-6 w-6 text-[#5a4fcf]" />
//           </div>
//           <div className="ml-4 text-left">
//             <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//             <div className="mt-2 text-gray-600 text-sm">{children}</div>
//           </div>
//         </div>
//         <div className="mt-6 flex justify-end gap-3">
//           {showCancel && <button onClick={onClose} className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-300">Cancel</button>}
//           <button onClick={() => { if (onConfirm) onConfirm(); onClose(); }} className="rounded-lg bg-[#5a4fcf] px-5 py-2 font-semibold text-white hover:bg-[#4c42b8]">{confirmText}</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- MAIN BILLING COMPONENT ---
// export default function BillingPage() {
//   const { data: session, status } = useSession();
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [productName, setProductName] = useState('');
//   const [productPrice, setProductPrice] = useState<number | ''>('');
//   const [scanning, setScanning] = useState(false);
//   const [flashOn, setFlashOn] = useState(false);
//   const [inventory, setInventory] = useState<InventoryProduct[]>([]);
//   const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showPaymentOptions, setShowPaymentOptions] = useState(false);
//   const [showFinalizeOptions, setShowFinalizeOptions] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState<string>('');
//   const [merchantUpi, setMerchantUpi] = useState('');
//   const [showWhatsAppInput, setShowWhatsAppInput] = useState(false);
//   const [whatsAppNumber, setWhatsAppNumber] = useState('');
//   const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: undefined as (() => void) | undefined, confirmText: 'OK', showCancel: false });
//   const suggestionsRef = useRef<HTMLDivElement | null>(null);
//   const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
//   const merchantName = session?.user?.name || "Billzzy Lite";
//   const upiQR = merchantUpi ? `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=Bill%20Payment` : '';

//   useEffect(() => {
//     if (status === 'authenticated' && session?.user?.email) {
//       const savedData = localStorage.getItem(`userSettings-${session.user.email}`);
//       if (savedData) setMerchantUpi(JSON.parse(savedData).merchantUpiId || '');
//     }
//   }, [status, session]);

//   useEffect(() => {
//     if (status !== 'authenticated') return;
//     (async () => {
//       try {
//         const res = await fetch('/api/products');
//         if (!res.ok) throw new Error('Failed to fetch inventory');
//         const data: InventoryProduct[] = await res.json();
//         setInventory(data);
//       } catch (err) { console.error(err); }
//     })();
//   }, [status]);

//   useEffect(() => {
//     if (!productName.trim()) {
//       setShowSuggestions(false);
//       return;
//     }
//     const query = productName.trim().toLowerCase();
//     const filtered = inventory.filter(p => p.name.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query)).slice(0, 5);
//     setSuggestions(filtered);
//     setShowSuggestions(filtered.length > 0);
//   }, [productName, inventory]);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   const addToCart = useCallback((name: string, price: number, productId?: string) => {
//     if (!name || price < 0) return;
//     setCart(prev => {
//       const existingItem = productId ? prev.find(item => item.productId === productId) : null;
//       if (existingItem) {
//         return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
//       }
//       return [{ id: Date.now(), productId, name, quantity: 1, price, isEditing: false }, ...prev];
//     });
//     setProductName('');
//     setProductPrice('');
//     setShowSuggestions(false);
//   }, []);

//   const handleScan = useCallback((results: ScanResult[]) => {
//     if (results && results[0]) {
//       const scannedValue = results[0].rawValue;
//       setScanning(false);
//       const foundProduct = inventory.find(p => p.id === scannedValue || p.sku?.toLowerCase() === scannedValue.toLowerCase() || p.name.toLowerCase() === scannedValue.toLowerCase());
//       if (foundProduct) {
//         addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.id);
//       } else {
//         addToCart(scannedValue, 0);
//       }
//     }
//   }, [inventory, addToCart]);

//   const handleManualAdd = useCallback(() => {
//     const price = Number(productPrice);
//     if (!productName.trim() || price <= 0) {
//       setModal({ isOpen: true, title: 'Invalid Input', message: 'Please enter a valid name and a price greater than zero.', showCancel: false, confirmText: 'OK', onConfirm: undefined });
//       return;
//     }
//     const matchedItem = inventory.find(p => p.name.toLowerCase() === productName.trim().toLowerCase());
//     addToCart(matchedItem?.name || productName.trim(), matchedItem?.sellingPrice || price, matchedItem?.id);
//   }, [productName, productPrice, inventory, addToCart]);

//   const deleteCartItem = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
//   const toggleEdit = (id: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, isEditing: !item.isEditing } : { ...item, isEditing: false }));
//   const updateCartItem = (id: number, updatedValues: Partial<CartItem>) => setCart(prev => prev.map(item => item.id === id ? { ...item, ...updatedValues } : item));

//   const handleTransactionDone = useCallback(() => {
//     setCart([]);
//     setSelectedPayment('');
//     setShowPaymentOptions(false);
//     setShowFinalizeOptions(false);
//     setShowWhatsAppInput(false);
//     setWhatsAppNumber('');
//   }, []);

//   const handlePaymentSuccess = useCallback(async () => {
//     const updatePromises = cart.filter(item => item.productId).map(item => fetch(`/api/products/${item.productId}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ quantityToDecrement: item.quantity }),
//     }));
//     Promise.all(updatePromises).catch(err => console.error("Inventory update failed:", err));
//     try {
//       await fetch('/api/sales', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount: totalAmount, paymentMethod: selectedPayment.toLowerCase() }),
//       });
//     } catch (error) { console.error("Failed to save sale:", error); }
//     setModal({ isOpen: true, title: 'Success!', message: 'Transaction completed and inventory updated.', showCancel: false, confirmText: 'New Bill', onConfirm: handleTransactionDone });
//   }, [selectedPayment, totalAmount, cart, handleTransactionDone]);

//   const handleStartNewBill = useCallback(() => {
//     if (cart.length === 0) return;
//     setModal({ isOpen: true, title: 'Clear Bill?', message: 'This will clear all items from the current bill. Are you sure?', showCancel: true, confirmText: 'Yes, Clear', onConfirm: () => setCart([]) });
//   }, [cart.length]);

//   const handleWhatsAppShare = useCallback(() => {
//     if (!/^\d{10,15}$/.test(whatsAppNumber.trim())) {
//       setModal({ isOpen: true, title: 'Invalid Number', message: 'Please enter a valid 10-15 digit WhatsApp number.', confirmText: 'OK', onConfirm: undefined, showCancel: false });
//       return;
//     }
//     const message = cart.map(p => `${p.name} (x${p.quantity}) - ₹${(p.price * p.quantity).toFixed(2)}`).join('\n');
//     const fullMessage = `Your bill from ${merchantName}:\n\n${message}\n\n*Total: ₹${totalAmount.toFixed(2)}*`;
//     window.open(`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(fullMessage)}`, '_blank');
//     setShowWhatsAppInput(false);
//   }, [whatsAppNumber, cart, merchantName, totalAmount]);

//   // --- RENDER ---
//   return (
//     <>
//       <div className="flex flex-col h-screen bg-[#f9f9fb] font-sans">
//         <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm sticky top-0 z-20">
//           <h1 className="text-xl font-bold text-[#5a4fcf]">Billzzy Billing</h1>
//           <div className="flex items-center gap-4">
//             <button onClick={handleStartNewBill} disabled={cart.length === 0} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 disabled:text-gray-300" title="Start New Bill"><RefreshCw size={20} /></button>
//             <button onClick={() => setScanning(true)} className="flex items-center gap-2 bg-[#5a4fcf] px-4 py-2 rounded-lg text-white font-semibold shadow hover:bg-[#4c42b8]"><Scan size={18} /><span>Scan</span></button>
//           </div>
//         </header>
//         <main className="flex-1 overflow-y-auto p-4 space-y-3">
//           <div ref={suggestionsRef} className="relative">
//             <input type="text" placeholder="Search by name or ID..." className="w-full rounded-xl border p-3 shadow-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none" value={productName} onChange={(e) => setProductName(e.target.value)} />
//             {showSuggestions && (
//               <div className="absolute z-10 mt-1 w-full rounded-xl border bg-white shadow-lg">
//                 {suggestions.map((s) => (
//                   <div key={s.id} onClick={() => addToCart(s.name, s.sellingPrice, s.id)} className="cursor-pointer border-b p-3 hover:bg-[#f1f0ff]">
//                     <div className="flex justify-between font-semibold text-gray-800"><span>{s.name}</span><span>₹{s.sellingPrice.toFixed(2)}</span></div>
//                     {s.sku && <p className="text-xs text-gray-500">ID: {s.sku}</p>}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <input type="number" placeholder="Price" className="w-1/3 rounded-lg border p-3 focus:ring-2 focus:ring-[#5a4fcf]" value={productPrice} onChange={(e) => setProductPrice(e.target.value === '' ? '' : parseFloat(e.target.value))} />
//             <button onClick={handleManualAdd} className="flex-1 rounded-lg bg-[#5a4fcf] text-white font-semibold hover:bg-[#4c42b8]">Add Custom Item</button>
//           </div>
//           <div className="space-y-2">
//             {cart.length === 0 ? <p className="text-center text-gray-500 mt-8">🛒 Your cart is empty.</p> : cart.map((item) => (
//               <div key={item.id} className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm">
//                 <div className="flex flex-1 items-center gap-2">
//                   {item.isEditing ? (
//                     <>
//                       <input type="text" value={item.name} onChange={(e) => updateCartItem(item.id, { name: e.target.value })} className="border rounded-lg p-1 w-2/4 text-sm" />
//                       <input type="number" value={item.quantity} onChange={(e) => updateCartItem(item.id, { quantity: parseInt(e.target.value) || 1 })} className="border rounded-lg p-1 w-1/4 text-sm" />
//                       <input type="number" value={item.price} onChange={(e) => updateCartItem(item.id, { price: parseFloat(e.target.value) || 0 })} className="border rounded-lg p-1 w-1/4 text-sm" />
//                     </>
//                   ) : (
//                     <>
//                       <p className="font-semibold w-2/4 truncate">{item.name}</p>
//                       <p className="text-sm text-gray-600 w-1/4">Qty: {item.quantity}</p>
//                       <p className="text-sm font-semibold text-gray-800 w-1/4">₹{(item.price * item.quantity).toFixed(2)}</p>
//                     </>
//                   )}
//                 </div>
//                 <div className="flex gap-2 items-center ml-2">
//                   <button onClick={() => toggleEdit(item.id)} className={`${item.isEditing ? 'text-green-600' : 'text-[#5a4fcf]'}`}>
//                     {item.isEditing ? <Check size={18} /> : <Edit2 size={18} />}
//                   </button>
//                   <button onClick={() => deleteCartItem(item.id)} className="text-red-500"><Trash2 size={18} /></button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </main>
//         <footer className="bg-white p-4 shadow-[0_-2px_5px_rgba(0,0,0,0.05)] border-t space-y-4">
//           <div className="flex justify-between items-center"><span className="text-lg font-medium">Grand Total</span><span className="text-2xl font-bold text-[#5a4fcf]">₹{totalAmount.toFixed(2)}</span></div>
//           <div className="space-y-3 border-t pt-4">
//             <div className="flex gap-3">
//               <button onClick={() => { setShowFinalizeOptions(p => !p); setShowPaymentOptions(false); }} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gray-700 py-3 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400" disabled={cart.length === 0}><MessageSquare size={16} /><span>Share</span></button>
//               <button onClick={() => { setShowPaymentOptions(p => !p); setShowFinalizeOptions(false); }} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#5a4fcf] py-3 font-semibold text-white hover:bg-[#4c42b8] disabled:bg-gray-400" disabled={cart.length === 0}><CreditCard size={16} /><span>Finalize & Pay</span></button>
//             </div>
//             {showFinalizeOptions && cart.length > 0 && (
//                 <div className="space-y-3 rounded-lg bg-gray-50 p-3 pt-2">
//                     {showWhatsAppInput ? (
//                         <div className="flex gap-2">
//                             <input type="tel" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} placeholder="WhatsApp Number" className="flex-grow rounded-lg border-2 border-gray-300 p-2 outline-none focus:border-green-500" />
//                             <button onClick={handleWhatsAppShare} className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"><Send size={20} /></button>
//                         </div>
//                     ) : (
//                         <button onClick={() => setShowWhatsAppInput(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 py-2 px-3 font-semibold text-white transition-all hover:bg-green-600">
//                             <MessageSquare size={16} />
//                             <span>Share on WhatsApp</span>
//                         </button>
//                     )}
//                 </div>
//             )}
//             {showPaymentOptions && cart.length > 0 && (
//               <div className="space-y-3 border-t pt-4">
//                 <div className="flex flex-wrap gap-2">{['Cash', 'QR Code', 'Card'].map(m => <button key={m} onClick={() => setSelectedPayment(m)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${selectedPayment === m ? 'bg-[#5a4fcf] text-white' : 'bg-gray-200 text-gray-700'}`}>{m}</button>)}</div>
//                 {selectedPayment === 'Cash' && <div className="rounded-lg bg-gray-50 p-4 text-center"><p className="text-sm">Confirm receipt of <b>₹{totalAmount.toFixed(2)}</b> cash.</p><button onClick={handlePaymentSuccess} className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-[#5a4fcf] p-3 font-bold text-white"><DollarSign size={20} />Confirm Cash Payment</button></div>}
//                 {selectedPayment === 'QR Code' && <div className="rounded-lg bg-gray-50 p-4 text-center">{upiQR ? (<><div className="mx-auto max-w-[180px]"><QRCode value={upiQR} style={{ height: 'auto', width: '100%' }} /></div><p className="text-sm">Scan to pay <b>{merchantUpi}</b></p><button onClick={handlePaymentSuccess} className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 p-3 font-bold text-white"><CheckCircle size={20} />Confirm Payment Received</button></>) : <p className="font-semibold text-red-600">UPI ID not configured.</p>}</div>}
//                 {selectedPayment === 'Card' && <div className="rounded-lg bg-gray-50 p-4 text-center"><p className="text-sm">Confirm card transaction was successful.</p><button onClick={handlePaymentSuccess} className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 p-3 font-bold text-white"><CreditCard size={20} />Confirm Card Payment</button></div>}
//               </div>
//             )}
//           </div>
//         </footer>
//       </div>
//       {scanning && (
//         <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
//           <div className="w-72 rounded-xl bg-white p-3 relative shadow-lg">
//             <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-[#5a4fcf] text-sm">Scan Barcode / QR</h3><button onClick={() => setScanning(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button></div>
//             {/* eslint-disable @typescript-eslint/no-explicit-any */}
//             <Scanner
//                 constraints={{ facingMode: 'environment' }}
//                 onScan={handleScan as any}
//                 scanDelay={200}
//                 {...({ torch: flashOn } as any)}
//                 styles={{ container: { width: '100%', height: 220, position: 'relative', borderRadius: '8px', overflow: 'hidden' } }}
//             />
//             {/* eslint-enable @typescript-eslint/no-explicit-any */}
//             <button onClick={() => setFlashOn(f => !f)} className="mt-2 flex items-center justify-center gap-2 w-full rounded-md bg-[#5a4fcf] py-2 text-white font-medium hover:bg-[#4c42b8]"><Sun size={16} /><span>{flashOn ? 'Flash On' : 'Flash Off'}</span></button>
//           </div>
//         </div>
//       )}
//       <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.title} onConfirm={modal.onConfirm} confirmText={modal.confirmText} showCancel={modal.showCancel}><p>{modal.message}</p></Modal>
//     </>
//   );
// }


'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import QRCode from 'react-qr-code';
import {
  Scan, Trash2, Edit2, Check, X, Sun, AlertTriangle, Send,
  CreditCard, CheckCircle, DollarSign, RefreshCw
} from 'lucide-react'; // Restored Send icon

// --- TYPE DEFINITIONS ---
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

// A minimal local type for the scanner result to avoid using 'any'
type ScanResult = {
    rawValue: string;
};

// --- MODAL COMPONENT ---
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  showCancel?: boolean;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onConfirm, confirmText = 'OK', showCancel = false }) => {
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
          {showCancel && <button onClick={onClose} className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-300">Cancel</button>}
          <button onClick={() => { if (onConfirm) onConfirm(); onClose(); }} className="rounded-lg bg-[#5a4fcf] px-5 py-2 font-semibold text-white hover:bg-[#4c42b8]">{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN BILLING COMPONENT ---
export default function BillingPage() {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState<number | ''>('');
  const [scanning, setScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // State to control visibility of WhatsApp input
  const [showWhatsAppSharePanel, setShowWhatsAppSharePanel] = useState(false);
  // State to control visibility of payment options
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [merchantUpi, setMerchantUpi] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');

  // Cash payment states
  const [amountGiven, setAmountGiven] = useState<number | ''>('');

  const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string | React.ReactNode; onConfirm?: (() => void); confirmText: string; showCancel: boolean; }>({ isOpen: false, title: '', message: '', confirmText: 'OK', showCancel: false });

  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const balance = useMemo(() => {
    const total = totalAmount;
    const given = Number(amountGiven);
    return given > 0 ? given - total : 0;
  }, [totalAmount, amountGiven]);

  const merchantName = session?.user?.name || "Billzzy Lite";
  const upiQR = merchantUpi ? `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=Bill%20Payment` : '';

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const savedData = localStorage.getItem(`userSettings-${session.user.email}`);
      if (savedData) setMerchantUpi(JSON.parse(savedData).merchantUpiId || '');
    }
  }, [status, session]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    (async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch inventory');
        const data: InventoryProduct[] = await res.json();
        setInventory(data);
      } catch (err) { console.error(err); }
    })();
  }, [status]);

  useEffect(() => {
    if (!productName.trim()) {
      setShowSuggestions(false);
      return;
    }
    const query = productName.trim().toLowerCase();
    const filtered = inventory.filter(p => p.name.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query)).slice(0, 5);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [productName, inventory]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addToCart = useCallback((name: string, price: number, productId?: string) => {
    if (!name || price < 0) return;
    setCart(prev => {
      const existingItem = productId ? prev.find(item => item.productId === productId) : null;
      if (existingItem) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [{ id: Date.now(), productId, name, quantity: 1, price, isEditing: false }, ...prev];
    });
    setProductName('');
    setProductPrice('');
    setShowSuggestions(false);
  }, []);

  const handleScan = useCallback((results: ScanResult[]) => {
    if (results && results[0]) {
      const scannedValue = results[0].rawValue;
      setScanning(false);
      const foundProduct = inventory.find(p => p.id === scannedValue || p.sku?.toLowerCase() === scannedValue.toLowerCase() || p.name.toLowerCase() === scannedValue.toLowerCase());
      if (foundProduct) {
        addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.id);
      } else {
        addToCart(scannedValue, 0);
      }
    }
  }, [inventory, addToCart]);

  const handleManualAdd = useCallback(() => {
    const price = Number(productPrice);
    if (!productName.trim() || price <= 0) {
      setModal({ isOpen: true, title: 'Invalid Input', message: 'Please enter a valid name and a price greater than zero.', showCancel: false, confirmText: 'OK', onConfirm: undefined });
      return;
    }
    const matchedItem = inventory.find(p => p.name.toLowerCase() === productName.trim().toLowerCase());
    addToCart(matchedItem?.name || productName.trim(), matchedItem?.sellingPrice || price, matchedItem?.id);
  }, [productName, productPrice, inventory, addToCart]);

  const deleteCartItem = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  const toggleEdit = (id: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, isEditing: !item.isEditing } : { ...item, isEditing: false }));
  const updateCartItem = (id: number, updatedValues: Partial<CartItem>) => setCart(prev => prev.map(item => item.id === id ? { ...item, ...updatedValues } : item));

  const handleTransactionDone = useCallback(() => {
    setCart([]);
    setSelectedPayment('');
    setShowWhatsAppSharePanel(false); // Reset WhatsApp panel
    setShowPaymentOptions(false); // Reset payment panel
    setWhatsAppNumber(''); // Clear WhatsApp number
    setAmountGiven(''); // Clear amount given
    setModal({ ...modal, isOpen: false }); // Close any open modal
  }, [modal]);

  // --- MODIFIED FUNCTION ---
  // The "Send" button now just proceeds to the payment section.
  const handleProceedToPayment = useCallback(() => {
    // We can add a validation check here if the number is entered but not valid
    if (whatsAppNumber && !/^\d{10,15}$/.test(whatsAppNumber.trim())) {
      setModal({ isOpen: true, title: 'Invalid Number', message: 'The number you entered is not valid. Please correct it or leave it blank.', confirmText: 'OK', onConfirm: undefined, showCancel: false });
      return;
    }
    
    // The core change: Hide the WhatsApp panel and show the payment options.
    setShowWhatsAppSharePanel(false);
    setShowPaymentOptions(true);
  }, [whatsAppNumber]);


  const handlePaymentSuccess = useCallback(async () => {
    // 1. Update inventory
    const updatePromises = cart.filter(item => item.productId).map(item => fetch(`/api/products/${item.productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantityToDecrement: item.quantity }),
    }));
    await Promise.all(updatePromises).catch(err => console.error("Inventory update failed:", err));

    // 2. Save sale
    try {
      await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, paymentMethod: selectedPayment.toLowerCase() }),
      });
    } catch (error) { console.error("Failed to save sale:", error); }

    // 3. Show simple success modal and clear bill
    setModal({
      isOpen: true,
      title: 'Success!',
      message: 'Transaction completed and inventory updated. Ready for a new bill.',
      confirmText: 'New Bill',
      onConfirm: handleTransactionDone,
      showCancel: false,
    });
  }, [selectedPayment, totalAmount, cart, handleTransactionDone]);


  const handleStartNewBill = useCallback(() => {
    if (cart.length === 0) return;
    setModal({ isOpen: true, title: 'Clear Bill?', message: 'This will clear all items from the current bill. Are you sure?', showCancel: true, confirmText: 'Yes, Clear', onConfirm: () => setCart([]) });
  }, [cart.length]);


  // --- RENDER ---
  return (
    <>
      <div className="flex flex-col h-screen bg-[#f9f9fb] font-sans">
        <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm sticky top-0 z-20">
          <h1 className="text-xl font-bold text-[#5a4fcf]">Billzzy Billing</h1>
          <div className="flex items-center gap-4">
            <button onClick={handleStartNewBill} disabled={cart.length === 0} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 disabled:text-gray-300" title="Start New Bill"><RefreshCw size={20} /></button>
            <button onClick={() => setScanning(true)} className="flex items-center gap-2 bg-[#5a4fcf] px-4 py-2 rounded-lg text-white font-semibold shadow hover:bg-[#4c42b8]"><Scan size={18} /><span>Scan</span></button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-3">
          <div ref={suggestionsRef} className="relative">
            <input type="text" placeholder="Search by name or ID..." className="w-full rounded-xl border p-3 shadow-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none" value={productName} onChange={(e) => setProductName(e.target.value)} />
            {showSuggestions && (
              <div className="absolute z-10 mt-1 w-full rounded-xl border bg-white shadow-lg">
                {suggestions.map((s) => (
                  <div key={s.id} onClick={() => addToCart(s.name, s.sellingPrice, s.id)} className="cursor-pointer border-b p-3 hover:bg-[#f1f0ff]">
                    <div className="flex justify-between font-semibold text-gray-800"><span>{s.name}</span><span>₹{s.sellingPrice.toFixed(2)}</span></div>
                    {s.sku && <p className="text-xs text-gray-500">ID: {s.sku}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input type="number" placeholder="Price" className="w-1/3 rounded-lg border p-3 focus:ring-2 focus:ring-[#5a4fcf]" value={productPrice} onChange={(e) => setProductPrice(e.target.value === '' ? '' : parseFloat(e.target.value))} />
            <button onClick={handleManualAdd} className="flex-1 rounded-lg bg-[#5a4fcf] text-white font-semibold hover:bg-[#4c42b8]">Add Custom Item</button>
          </div>
          <div className="space-y-2">
            {cart.length === 0 ? <p className="text-center text-gray-500 mt-8">🛒 Your cart is empty.</p> : cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm">
                <div className="flex flex-1 items-center gap-2">
                  {item.isEditing ? (
                    <>
                      <input type="text" value={item.name} onChange={(e) => updateCartItem(item.id, { name: e.target.value })} className="border rounded-lg p-1 w-2/4 text-sm" />
                      <input type="number" value={item.quantity} onChange={(e) => updateCartItem(item.id, { quantity: parseInt(e.target.value) || 1 })} className="border rounded-lg p-1 w-1/4 text-sm" />
                      <input type="number" value={item.price} onChange={(e) => updateCartItem(item.id, { price: parseFloat(e.target.value) || 0 })} className="border rounded-lg p-1 w-1/4 text-sm" />
                    </>
                  ) : (
                    <>
                      <p className="font-semibold w-2/4 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600 w-1/4">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-800 w-1/4">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </>
                  )}
                </div>
                <div className="flex gap-2 items-center ml-2">
                  <button onClick={() => toggleEdit(item.id)} className={`${item.isEditing ? 'text-green-600' : 'text-[#5a4fcf]'}`}>
                    {item.isEditing ? <Check size={18} /> : <Edit2 size={18} />}
                  </button>
                  <button onClick={() => deleteCartItem(item.id)} className="text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </main>
        <footer className="bg-white p-4 shadow-[0_-2px_5px_rgba(0,0,0,0.05)] border-t space-y-4">
          <div className="flex justify-between items-center"><span className="text-lg font-medium">Grand Total</span><span className="text-2xl font-bold text-[#5a4fcf]">₹{totalAmount.toFixed(2)}</span></div>

          <div className="space-y-3 border-t pt-4">
            {/* Single Finalize & Pay Button appears initially */}
            {!showWhatsAppSharePanel && !showPaymentOptions && (
              <button
                onClick={() => {
                  if (cart.length === 0) {
                    setModal({ isOpen: true, title: 'Cart Empty', message: 'Please add items to the cart before finalizing.', confirmText: 'OK', showCancel: false });
                    return;
                  }
                  setShowWhatsAppSharePanel(true); // First show WhatsApp panel
                  setShowPaymentOptions(false); // Ensure payment options are hidden
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5a4fcf] py-3 font-semibold text-white hover:bg-[#4c42b8] disabled:bg-gray-400"
                disabled={cart.length === 0}
              >
                <CreditCard size={16} /><span>Finalize & Pay</span>
              </button>
            )}

            {/* WhatsApp Share UI - The API is removed but the UI is here */}
            {showWhatsAppSharePanel && cart.length > 0 && (
                <div className="space-y-3 rounded-lg bg-gray-50 p-3 pt-2">
                    <div className="flex gap-2 items-center">
                        <input
                            type="tel"
                            value={whatsAppNumber}
                            onChange={(e) => setWhatsAppNumber(e.target.value)}
                            placeholder="WhatsApp Number (Optional)"
                            className="flex-grow rounded-lg border-2 border-gray-300 p-2 outline-none focus:border-green-500"
                        />
                        <button
                            onClick={handleProceedToPayment} // This button now just proceeds to payment
                            className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"
                            title="Proceed to Payment"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                     <button
                        onClick={handleProceedToPayment} // This button also just proceeds to payment
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-600 py-2 px-3 font-semibold text-white transition-all hover:bg-gray-700"
                    >
                        Skip & Proceed to Payment
                    </button>
                </div>
            )}

            {/* Payment Options - appears after WhatsApp panel */}
            {showPaymentOptions && cart.length > 0 && (
              <div className="space-y-3 border-t pt-4">
                <div className="flex flex-wrap gap-2">{['Cash', 'QR Code', 'Card'].map(m => <button key={m} onClick={() => setSelectedPayment(m)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${selectedPayment === m ? 'bg-[#5a4fcf] text-white' : 'bg-gray-200 text-gray-700'}`}>{m}</button>)}</div>
                {selectedPayment === 'Cash' && (
                  <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <p className="text-sm">Confirm receipt of <b>₹{totalAmount.toFixed(2)}</b> cash.</p>
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label htmlFor="amountGiven" className="text-sm font-medium w-1/3 text-right">Given:</label>
                        <input
                          id="amountGiven"
                          type="number"
                          placeholder="Amount given by customer"
                          value={amountGiven}
                          onChange={(e) => setAmountGiven(e.target.value === '' ? '' : parseFloat(e.target.value))}
                          className="flex-grow rounded-lg border p-2 focus:ring-2 focus:ring-[#5a4fcf] outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium w-1/3 text-right">Balance:</span>
                        <span className={`flex-grow p-2 rounded-lg bg-white border text-left font-semibold ${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{balance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button onClick={handlePaymentSuccess} className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-[#5a4fcf] p-3 font-bold text-white"><DollarSign size={20} />Confirm Cash Payment</button>
                  </div>
                )}
                {selectedPayment === 'QR Code' && <div className="rounded-lg bg-gray-50 p-4 text-center">{upiQR ? (<><div className="mx-auto max-w-[180px]"><QRCode value={upiQR} style={{ height: 'auto', width: '100%' }} /></div><p className="text-sm">Scan to pay <b>{merchantUpi}</b></p><button onClick={handlePaymentSuccess} className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 p-3 font-bold text-white"><CheckCircle size={20} />Confirm Payment Received</button></>) : <p className="font-semibold text-red-600">UPI ID not configured.</p>}</div>}
                {selectedPayment === 'Card' && <div className="rounded-lg bg-gray-50 p-4 text-center"><p className="text-sm">Confirm card transaction was successful.</p><button onClick={handlePaymentSuccess} className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 p-3 font-bold text-white"><CreditCard size={20} />Confirm Card Payment</button></div>}
              </div>
            )}
          </div>
        </footer>
      </div>
      {scanning && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
          <div className="w-72 rounded-xl bg-white p-3 relative shadow-lg">
            <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-[#5a4fcf] text-sm">Scan Barcode / QR</h3><button onClick={() => setScanning(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button></div>
            {/* eslint-disable @typescript-eslint/no-explicit-any */}
            <Scanner
                constraints={{ facingMode: 'environment' }}
                onScan={handleScan as any}
                scanDelay={200}
                {...({ torch: flashOn } as any)}
                styles={{ container: { width: '100%', height: 220, position: 'relative', borderRadius: '8px', overflow: 'hidden' } }}
            />
            {/* eslint-enable @typescript-eslint/no-explicit-any */}
            <button onClick={() => setFlashOn(f => !f)} className="mt-2 flex items-center justify-center gap-2 w-full rounded-md bg-[#5a4fcf] py-2 text-white font-medium hover:bg-[#4c42b8]"><Sun size={16} /><span>{flashOn ? 'Flash On' : 'Flash Off'}</span></button>
          </div>
        </div>
      )}
      <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false, message: '' })} title={modal.title} onConfirm={modal.onConfirm} confirmText={modal.confirmText} showCancel={modal.showCancel}>{modal.message}</Modal>
    </>
  );
}