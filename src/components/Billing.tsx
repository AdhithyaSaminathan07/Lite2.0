// 'use client';

// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { useSession } from 'next-auth/react';
// import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
// import QRCode from 'react-qr-code';
// import {
//   Scan, Trash2, Edit2, Check, X, Sun, AlertTriangle, Send,
//   CreditCard, CheckCircle, DollarSign, RefreshCw
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

// // --- MODAL COMPONENT (No changes needed) ---
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
//   const [scanning, setScanning] = useState(false);
//   const [inventory, setInventory] = useState<InventoryProduct[]>([]);
//   const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showWhatsAppSharePanel, setShowWhatsAppSharePanel] = useState(false);
//   const [showPaymentOptions, setShowPaymentOptions] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState<string>('');
//   const [merchantUpi, setMerchantUpi] = useState('');
//   const [whatsAppNumber, setWhatsAppNumber] = useState('');
//   const [amountGiven, setAmountGiven] = useState<number | ''>('');
//   const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string | React.ReactNode; onConfirm?: (() => void); confirmText: string; showCancel: boolean; }>({ isOpen: false, title: '', message: '', confirmText: 'OK', showCancel: false });
//   const suggestionsRef = useRef<HTMLDivElement | null>(null);
//   const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
//   const balance = useMemo(() => {
//     const total = totalAmount;
//     const given = Number(amountGiven);
//     return given > 0 ? given - total : 0;
//   }, [totalAmount, amountGiven]);
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

//   // FIX: Added 'isEditing' parameter to allow forcing edit mode on add
//   const addToCart = useCallback((name: string, price: number, productId?: string, isEditing = false) => {
//     if (!name || price < 0) return;
//     setCart(prev => {
//       const existingItem = productId ? prev.find(item => item.productId === productId) : null;
//       if (existingItem) {
//         return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
//       }
//       return [{ id: Date.now(), productId, name, quantity: 1, price, isEditing }, ...prev];
//     });
//     setProductName('');
//     setShowSuggestions(false);
//   }, []);

//   const handleScan = useCallback((results: IDetectedBarcode[]) => {
//     if (results && results[0]) {
//       const scannedValue = results[0].rawValue;
//       const foundProduct = inventory.find(p => p.id === scannedValue || p.sku?.toLowerCase() === scannedValue.toLowerCase() || p.name.toLowerCase() === scannedValue.toLowerCase());
//       if (foundProduct) {
//         addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.id);
//       } else {
//         // When scanning an unknown item, add it and put it in edit mode to set the price
//         addToCart(scannedValue, 0, undefined, true);
//       }
//     }
//   }, [inventory, addToCart]);
  
//   // FIX: Simplified manual add logic
//   const handleManualAdd = useCallback(() => {
//     const name = productName.trim();
//     if (!name) {
//       setModal({ isOpen: true, title: 'Item Name Required', message: 'Please enter a name for the custom item.', showCancel: false, confirmText: 'OK' });
//       return;
//     }
//     // Add as a new item with price 0 and automatically enable editing
//     addToCart(name, 0, undefined, true);
//   }, [productName, addToCart]);

//   const deleteCartItem = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
//   const toggleEdit = (id: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, isEditing: !item.isEditing } : { ...item, isEditing: false }));
//   const updateCartItem = (id: number, updatedValues: Partial<CartItem>) => setCart(prev => prev.map(item => item.id === id ? { ...item, ...updatedValues } : item));

//   const handleTransactionDone = useCallback(() => {
//     setCart([]);
//     setSelectedPayment('');
//     setShowWhatsAppSharePanel(false);
//     setShowPaymentOptions(false);
//     setWhatsAppNumber('');
//     setAmountGiven('');
//     setModal({ ...modal, isOpen: false });
//   }, [modal]);

//   const handleProceedToPayment = useCallback(() => {
//     if (whatsAppNumber && !/^\d{10,15}$/.test(whatsAppNumber.trim())) {
//       setModal({ isOpen: true, title: 'Invalid Number', message: 'The number you entered is not valid. Please correct it or leave it blank.', confirmText: 'OK', onConfirm: undefined, showCancel: false });
//       return;
//     }
//     setShowWhatsAppSharePanel(false);
//     setShowPaymentOptions(true);
//   }, [whatsAppNumber]);

//   const handlePaymentSuccess = useCallback(async () => {
//     const updatePromises = cart.filter(item => item.productId).map(item => fetch(`/api/products/${item.productId}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ quantityToDecrement: item.quantity }),
//     }));
//     await Promise.all(updatePromises).catch(err => console.error("Inventory update failed:", err));

//     try {
//       const response = await fetch('/api/sales', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount: totalAmount, paymentMethod: selectedPayment }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Failed to create sale:", errorData);
//         setModal({ isOpen: true, title: 'Error', message: `Could not save the sale. Server responded: ${errorData.message}`, confirmText: 'OK', showCancel: false });
//         return;
//       }

//     } catch (error) {
//       console.error("Network error when saving sale:", error);
//       setModal({ isOpen: true, title: 'Network Error', message: 'Could not connect to the server to save the sale.', confirmText: 'OK', showCancel: false });
//       return;
//     }

//     setModal({
//       isOpen: true,
//       title: 'Success!',
//       message: 'Transaction completed and inventory updated. Ready for a new bill.',
//       confirmText: 'New Bill',
//       onConfirm: handleTransactionDone,
//       showCancel: false,
//     });
//   }, [selectedPayment, totalAmount, cart, handleTransactionDone]);

//   const handleStartNewBill = useCallback(() => {
//     if (cart.length === 0) return;
//     setModal({ isOpen: true, title: 'Clear Bill?', message: 'This will clear all items from the current bill. Are you sure?', showCancel: true, confirmText: 'Yes, Clear', onConfirm: () => setCart([]) });
//   }, [cart.length]);

//   return (
//     <>
//       <div className="flex flex-col h-screen bg-[#f9f9fb] font-sans">
//         <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm sticky top-0 z-20">
//           <h1 className="text-xl font-bold text-[#5a4fcf]">Billzzy Billing</h1>
//           <div className="flex items-center gap-4">
//             <button onClick={handleStartNewBill} disabled={cart.length === 0} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 disabled:text-gray-300" title="Start New Bill"><RefreshCw size={20} /></button>
//             <button
//               onClick={() => setScanning(s => !s)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow transition-colors ${scanning ? 'bg-red-500 hover:bg-red-600' : 'bg-[#5a4fcf] hover:bg-[#4c42b8]'}`}
//             >
//               {scanning ? <X size={18} /> : <Scan size={18} />}
//               <span>{scanning ? 'Close' : 'Scan'}</span>
//             </button>
//           </div>
//         </header>
//         <main className="flex-1 overflow-y-auto p-4 space-y-3">
//           {scanning && (
//             <div className="bg-white rounded-xl p-3 shadow-sm mb-4">
//               <div className="max-w-xs mx-auto"> 
//                 <Scanner
//                   constraints={{ facingMode: 'environment' }}
//                   onScan={handleScan}
//                   scanDelay={300}
//                   styles={{ container: { width: '100%', height: 160, borderRadius: '8px', overflow: 'hidden' } }}
//                 />
//               </div>
//             </div>
//           )}

//           {/* FIX: New combined layout for search and add button */}
//           <div className="flex gap-2">
//             <div ref={suggestionsRef} className="relative flex-grow">
//               <input 
//                 type="text" 
//                 placeholder="Search by name or add custom item..." 
//                 className="w-full rounded-xl border p-3 shadow-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none" 
//                 value={productName} 
//                 onChange={(e) => setProductName(e.target.value)} 
//               />
//               {showSuggestions && (
//                 <div className="absolute z-10 mt-1 w-full rounded-xl border bg-white shadow-lg">
//                   {suggestions.map((s) => (
//                     <div key={s.id} onClick={() => addToCart(s.name, s.sellingPrice, s.id)} className="cursor-pointer border-b p-3 hover:bg-[#f1f0ff]">
//                       <div className="flex justify-between font-semibold text-gray-800"><span>{s.name}</span><span>₹{s.sellingPrice.toFixed(2)}</span></div>
//                       {s.sku && <p className="text-xs text-gray-500">ID: {s.sku}</p>}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <button onClick={handleManualAdd} className="flex-shrink-0 rounded-lg bg-[#5a4fcf] text-white font-semibold px-5 py-3 hover:bg-[#4c42b8]">Add</button>
//           </div>
          
//           <div className="space-y-2">
//             {cart.length === 0 ? <p className="text-center text-gray-500 mt-8">🛒 Your cart is empty.</p> : cart.map((item) => (
//               <div key={item.id} className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm">
//                 <div className="flex flex-1 items-center gap-2">
//                   {item.isEditing ? (
//                     <>
//                       <input type="text" value={item.name} onChange={(e) => updateCartItem(item.id, { name: e.target.value })} className="border rounded-lg p-1 w-2/4 text-sm" />
//                       <input type="number" value={item.quantity} onChange={(e) => updateCartItem(item.id, { quantity: parseInt(e.target.value, 10) || 1 })} className="border rounded-lg p-1 w-1/4 text-sm" />
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
//             {!showWhatsAppSharePanel && !showPaymentOptions && (
//               <button
//                 onClick={() => {
//                   if (cart.length === 0) {
//                     setModal({ isOpen: true, title: 'Cart Empty', message: 'Please add items to the cart before finalizing.', confirmText: 'OK', showCancel: false });
//                     return;
//                   }
//                   setShowWhatsAppSharePanel(true);
//                   setShowPaymentOptions(false);
//                 }}
//                 className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5a4fcf] py-3 font-semibold text-white hover:bg-[#4c42b8] disabled:bg-gray-400"
//                 disabled={cart.length === 0}
//               >
//                 <CreditCard size={16} /><span>Finalize & Pay</span>
//               </button>
//             )}
//             {showWhatsAppSharePanel && cart.length > 0 && (
//                 <div className="space-y-3 rounded-lg bg-gray-50 p-3 pt-2">
//                     <div className="flex gap-2 items-center">
//                         <input
//                             type="tel"
//                             value={whatsAppNumber}
//                             onChange={(e) => setWhatsAppNumber(e.target.value)}
//                             placeholder="WhatsApp Number (Optional)"
//                             className="flex-grow rounded-lg border-2 border-gray-300 p-2 outline-none focus:border-green-500"
//                         />
//                         <button
//                             onClick={handleProceedToPayment}
//                             className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"
//                             title="Proceed to Payment"
//                         >
//                             <Send size={20} />
//                         </button>
//                     </div>
//                      <button
//                         onClick={handleProceedToPayment}
//                         className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-600 py-2 px-3 font-semibold text-white transition-all hover:bg-gray-700"
//                     >
//                         Skip & Proceed to Payment
//                     </button>
//                 </div>
//             )}
//             {showPaymentOptions && cart.length > 0 && (
//               <div className="space-y-3 border-t pt-4">
//                 <div className="flex flex-wrap gap-2">
//                   {['cash', 'qr-code', 'card'].map(method => (
//                     <button 
//                       key={method} 
//                       onClick={() => setSelectedPayment(method)} 
//                       className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${selectedPayment === method ? 'bg-[#5a4fcf] text-white' : 'bg-gray-200 text-gray-700'}`}
//                     >
//                       {method.replace('-', ' ')}
//                     </button>
//                   ))}
//                 </div>
                
//                 {selectedPayment === 'cash' && (
//                   <div className="rounded-lg bg-gray-50 p-3 space-y-2">
//                     <p className="text-sm text-center">Confirm receipt of <b>₹{totalAmount.toFixed(2)}</b> cash.</p>
//                     <div className="flex items-center gap-2">
//                         <input
//                           id="amountGiven"
//                           type="number"
//                           placeholder="Amount Given"
//                           value={amountGiven}
//                           onChange={(e) => setAmountGiven(e.target.value === '' ? '' : parseFloat(e.target.value))}
//                           className="w-1/2 rounded-lg border p-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none"
//                         />
//                         <div className="w-1/2 p-2 rounded-lg bg-white border flex justify-between items-center">
//                           <span className="text-xs text-gray-500">Balance:</span>
//                           <span className={`font-semibold text-sm ${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
//                               ₹{balance.toFixed(2)}
//                           </span>
//                         </div>
//                     </div>
//                     <button onClick={handlePaymentSuccess} className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5a4fcf] p-2.5 font-bold text-white"><DollarSign size={18} />Confirm Cash Payment</button>
//                   </div>
//                 )}

//                 {selectedPayment === 'qr-code' && <div className="rounded-lg bg-gray-50 p-4 text-center">{upiQR ? (<><div className="mx-auto max-w-[180px]"><QRCode value={upiQR} style={{ height: 'auto', width: '100%' }} /></div><p className="mt-2 text-sm">Scan to pay <b>{merchantUpi}</b></p><button onClick={handlePaymentSuccess} className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 p-3 font-bold text-white"><CheckCircle size={20} />Confirm Payment Received</button></>) : <p className="font-semibold text-red-600">UPI ID not configured.</p>}</div>}
                
//                 {selectedPayment === 'card' && <div className="rounded-lg bg-gray-50 p-4 text-center"><p className="text-sm">Confirm card transaction was successful.</p><button onClick={handlePaymentSuccess} className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 p-3 font-bold text-white"><CreditCard size={20} />Confirm Card Payment</button></div>}
//               </div>
//             )}
//           </div>
//         </footer>
//       </div>
//       <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false, message: '' })} title={modal.title} onConfirm={modal.onConfirm} confirmText={modal.confirmText} showCancel={modal.showCancel}>{modal.message}</Modal>
//     </>
//   );
// }


'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import QRCode from 'react-qr-code';
import {
  Scan, Trash2, Edit2, Check, X, Sun, AlertTriangle, Send,
  CreditCard, CheckCircle, DollarSign, RefreshCw
} from 'lucide-react';

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

// --- MODAL COMPONENT (No changes) ---
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
  const [scanning, setScanning] = useState(false);
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showWhatsAppSharePanel, setShowWhatsAppSharePanel] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [merchantUpi, setMerchantUpi] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
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

  const addToCart = useCallback((name: string, price: number, productId?: string, isEditing = false) => {
    if (!name || price < 0) return;
    setCart(prev => {
      const existingItem = productId ? prev.find(item => item.productId === productId) : null;
      if (existingItem) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [{ id: Date.now(), productId, name, quantity: 1, price, isEditing }, ...prev];
    });
    setProductName('');
    setShowSuggestions(false);
  }, []);

  const handleScan = useCallback((results: IDetectedBarcode[]) => {
    if (results && results[0]) {
      const scannedValue = results[0].rawValue;
      const foundProduct = inventory.find(p => p.id === scannedValue || p.sku?.toLowerCase() === scannedValue.toLowerCase() || p.name.toLowerCase() === scannedValue.toLowerCase());
      if (foundProduct) {
        addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.id);
      } else {
        addToCart(scannedValue, 0, undefined, true);
      }
    }
  }, [inventory, addToCart]);
  
  const handleManualAdd = useCallback(() => {
    const name = productName.trim();
    if (!name) {
      setModal({ isOpen: true, title: 'Item Name Required', message: 'Please enter a name for the custom item.', showCancel: false, confirmText: 'OK' });
      return;
    }
    addToCart(name, 0, undefined, true);
  }, [productName, addToCart]);

  const deleteCartItem = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  const toggleEdit = (id: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, isEditing: !item.isEditing } : { ...item, isEditing: false }));
  const updateCartItem = (id: number, updatedValues: Partial<CartItem>) => setCart(prev => prev.map(item => item.id === id ? { ...item, ...updatedValues } : item));

  const handleTransactionDone = useCallback(() => {
    setCart([]);
    setSelectedPayment('');
    setShowWhatsAppSharePanel(false);
    setShowPaymentOptions(false);
    setWhatsAppNumber('');
    setAmountGiven('');
    setModal({ ...modal, isOpen: false });
  }, [modal]);

  const handleProceedToPayment = useCallback(() => {
    if (whatsAppNumber && !/^\d{10,15}$/.test(whatsAppNumber.trim())) {
      setModal({ isOpen: true, title: 'Invalid Number', message: 'The number you entered is not valid. Please correct it or leave it blank.', confirmText: 'OK', onConfirm: undefined, showCancel: false });
      return;
    }
    setShowWhatsAppSharePanel(false);
    setShowPaymentOptions(true);
  }, [whatsAppNumber]);

  const handlePaymentSuccess = useCallback(async () => {
    const updatePromises = cart.filter(item => item.productId).map(item => fetch(`/api/products/${item.productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantityToDecrement: item.quantity }),
    }));
    await Promise.all(updatePromises).catch(err => console.error("Inventory update failed:", err));

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, paymentMethod: selectedPayment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create sale:", errorData);
        setModal({ isOpen: true, title: 'Error', message: `Could not save the sale. Server responded: ${errorData.message}`, confirmText: 'OK', showCancel: false });
        return;
      }

    } catch (error) {
      console.error("Network error when saving sale:", error);
      setModal({ isOpen: true, title: 'Network Error', message: 'Could not connect to the server to save the sale.', confirmText: 'OK', showCancel: false });
      return;
    }

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

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f9f9fb] font-sans">
        <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm sticky top-0 z-20">
          <h1 className="text-xl font-bold text-[#5a4fcf]">Billing Page</h1>
          <div className="flex items-center gap-4">
            <button onClick={handleStartNewBill} disabled={cart.length === 0} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 disabled:text-gray-300" title="Start New Bill"><RefreshCw size={20} /></button>
            <button
              onClick={() => setScanning(s => !s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow transition-colors ${scanning ? 'bg-red-500 hover:bg-red-600' : 'bg-[#5a4fcf] hover:bg-[#4c42b8]'}`}
            >
              {scanning ? <X size={18} /> : <Scan size={18} />}
              <span>{scanning ? 'Close' : 'Scan'}</span>
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 space-y-3">
          {scanning && (
            <div className="bg-white rounded-xl p-3 shadow-sm mb-4">
              <div className="max-w-xs mx-auto"> 
                <Scanner
                  constraints={{ facingMode: 'environment' }}
                  onScan={handleScan}
                  scanDelay={300}
                  styles={{ container: { width: '100%', height: 160, borderRadius: '8px', overflow: 'hidden' } }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <div ref={suggestionsRef} className="relative flex-grow">
              <input 
                type="text" 
                placeholder="Search by name or add custom item..." 
                className="w-full rounded-xl border p-3 shadow-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none" 
                value={productName} 
                onChange={(e) => setProductName(e.target.value)} 
              />
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
            <button onClick={handleManualAdd} className="flex-shrink-0 rounded-lg bg-[#5a4fcf] text-white font-semibold px-5 py-3 hover:bg-[#4c42b8]">Add</button>
          </div>
          
          <div className="space-y-2">
            {cart.length === 0 ? <p className="text-center text-gray-500 mt-8">🛒 Your cart is empty.</p> : cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm">
                <div className="flex flex-1 items-center gap-2">
                  {item.isEditing ? (
                    <>
                      <input type="text" value={item.name} onChange={(e) => updateCartItem(item.id, { name: e.target.value })} className="border rounded-lg p-1 w-2/4 text-sm" />
                      <input type="number" value={item.quantity} onChange={(e) => updateCartItem(item.id, { quantity: parseInt(e.target.value, 10) || 1 })} className="border rounded-lg p-1 w-1/4 text-sm" />
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

        {/* --- MODIFICATION START --- */}
        {/* Added 'sticky bottom-0 z-20' to make the footer fixed at the bottom */}
        <footer className="sticky bottom-0 z-20 bg-white p-4 shadow-[0_-2px_5px_rgba(0,0,0,0.05)] border-t space-y-4">
        {/* --- MODIFICATION END --- */}
          <div className="flex justify-between items-center"><span className="text-lg font-medium">Grand Total</span><span className="text-2xl font-bold text-[#5a4fcf]">₹{totalAmount.toFixed(2)}</span></div>
          <div className="space-y-3 border-t pt-4">
            {!showWhatsAppSharePanel && !showPaymentOptions && (
              <button
                onClick={() => {
                  if (cart.length === 0) {
                    setModal({ isOpen: true, title: 'Cart Empty', message: 'Please add items to the cart before finalizing.', confirmText: 'OK', showCancel: false });
                    return;
                  }
                  setShowWhatsAppSharePanel(true);
                  setShowPaymentOptions(false);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5a4fcf] py-3 font-semibold text-white hover:bg-[#4c42b8] disabled:bg-gray-400"
                disabled={cart.length === 0}
              >
                <CreditCard size={16} /><span>Finalize & Pay</span>
              </button>
            )}
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
                            onClick={handleProceedToPayment}
                            className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"
                            title="Proceed to Payment"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                     <button
                        onClick={handleProceedToPayment}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-600 py-2 px-3 font-semibold text-white transition-all hover:bg-gray-700"
                    >
                        Skip & Proceed to Payment
                    </button>
                </div>
            )}
            {showPaymentOptions && cart.length > 0 && (
              <div className="space-y-3 border-t pt-4">
                <div className="flex flex-wrap gap-2">
                  {['cash', 'qr-code', 'card'].map(method => (
                    <button 
                      key={method} 
                      onClick={() => setSelectedPayment(method)} 
                      className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${selectedPayment === method ? 'bg-[#5a4fcf] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {method.replace('-', ' ')}
                    </button>
                  ))}
                </div>
                
                {selectedPayment === 'cash' && (
                  <div className="rounded-lg bg-gray-50 p-3 space-y-2">
                    <p className="text-sm text-center">Confirm receipt of <b>₹{totalAmount.toFixed(2)}</b> cash.</p>
                    <div className="flex items-center gap-2">
                        <input
                          id="amountGiven"
                          type="number"
                          placeholder="Amount Given"
                          value={amountGiven}
                          onChange={(e) => setAmountGiven(e.target.value === '' ? '' : parseFloat(e.target.value))}
                          className="w-1/2 rounded-lg border p-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none"
                        />
                        <div className="w-1/2 p-2 rounded-lg bg-white border flex justify-between items-center">
                          <span className="text-xs text-gray-500">Balance:</span>
                          <span className={`font-semibold text-sm ${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              ₹{balance.toFixed(2)}
                          </span>
                        </div>
                    </div>
                    <button onClick={handlePaymentSuccess} className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5a4fcf] p-2.5 font-bold text-white"><DollarSign size={18} />Confirm Cash Payment</button>
                  </div>
                )}

                {selectedPayment === 'qr-code' && <div className="rounded-lg bg-gray-50 p-4 text-center">{upiQR ? (<><div className="mx-auto max-w-[180px]"><QRCode value={upiQR} style={{ height: 'auto', width: '100%' }} /></div><p className="mt-2 text-sm">Scan to pay <b>{merchantUpi}</b></p><button onClick={handlePaymentSuccess} className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 p-3 font-bold text-white"><CheckCircle size={20} />Confirm Payment Received</button></>) : <p className="font-semibold text-red-600">UPI ID not configured.</p>}</div>}
                
                {selectedPayment === 'card' && <div className="rounded-lg bg-gray-50 p-4 text-center"><p className="text-sm">Confirm card transaction was successful.</p><button onClick={handlePaymentSuccess} className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 p-3 font-bold text-white"><CreditCard size={20} />Confirm Card Payment</button></div>}
              </div>
            )}
          </div>
        </footer>
      </div>
      <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false, message: '' })} title={modal.title} onConfirm={modal.onConfirm} confirmText={modal.confirmText} showCancel={modal.showCancel}>{modal.message}</Modal>
    </>
  );
}