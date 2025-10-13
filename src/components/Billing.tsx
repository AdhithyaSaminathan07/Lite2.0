
// // --- You can copy and paste this entire file to replace your existing one ---

// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { useSession } from 'next-auth/react';
// import BarcodeScannerComponent from 'react-qr-barcode-scanner';
// import QRCode from 'react-qr-code';
// import { Scan, Trash2, Send, CreditCard, CheckCircle, X, Printer, DollarSign, MessageSquare } from 'lucide-react'; // Added MessageSquare

// // --- TYPE DEFINITIONS ---
// type CartItem = {
//   id: number;
//   productId?: number;
//   name: string;
//   quantity: number;
//   price: number;
// };

// type InventoryProduct = {
//   id: number;
//   name: string;
//   quantity: number;
//   sellingPrice: number;
//   image?: string;
// };

// // Printable Receipt Component (No changes here)
// const PrintableReceipt = ({ cart, totalAmount, shopName }: { cart: CartItem[], totalAmount: number, shopName: string }) => (
//     <div className="hidden print:block p-8 font-mono">
//     <h1 className="text-2xl font-bold text-center mb-2">{shopName}</h1>
//     <p className="text-center text-sm mb-6">Sale Invoice</p>
//     <div className="flex justify-between text-xs mb-4">
//       <span>Date: {new Date().toLocaleDateString()}</span>
//       <span>Time: {new Date().toLocaleTimeString()}</span>
//     </div>
//     <table className="w-full text-sm">
//       <thead>
//         <tr className="border-t border-b border-black">
//           <th className="text-left py-2">ITEM</th>
//           <th className="text-center py-2">QTY</th>
//           <th className="text-right py-2">PRICE</th>
//           <th className="text-right py-2">TOTAL</th>
//         </tr>
//       </thead>
//       <tbody>
//         {[...cart].reverse().map(item => (
//           <tr key={item.id} className="border-b">
//             <td className="py-2">{item.name}</td>
//             <td className="text-center py-2">{item.quantity}</td>
//             <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
//             <td className="text-right py-2">₹{(item.price * item.quantity).toFixed(2)}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     <div className="mt-6 flex justify-end">
//       <div className="w-2/5">
//         <div className="flex justify-between font-bold text-lg">
//           <span>Grand Total:</span>
//           <span>₹{totalAmount.toFixed(2)}</span>
//         </div>
//       </div>
//     </div>
//     <p className="text-center text-xs mt-10">--- Thank You! ---</p>
//   </div>
// );


// // --- MAIN COMPONENT ---
// export default function BillingPage() {
//   // --- STATE MANAGEMENT ---
//   const { data: session, status } = useSession();
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [productName, setProductName] = useState('');
//   const [productPrice, setProductPrice] = useState<number | ''>('');
//   const [scanning, setScanning] = useState(false);
//   const [showPaymentOptions, setShowPaymentOptions] = useState(false);
//   const [showFinalizeOptions, setShowFinalizeOptions] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState<string>('');
//   const [inventory, setInventory] = useState<InventoryProduct[]>([]);
//   const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [merchantUpi, setMerchantUpi] = useState('');
//   const suggestionsRef = useRef<HTMLDivElement | null>(null);

//   // ✅ NEW STATE for a better WhatsApp input
//   const [showWhatsAppInput, setShowWhatsAppInput] = useState(false);
//   const [whatsAppNumber, setWhatsAppNumber] = useState('');


//   // --- DERIVED STATE & CONSTANTS ---
//   const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const merchantName = session?.user?.name || "Billzzy Lite";
//   const upiQR = merchantUpi ? `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=Bill%20Payment` : '';

//   // --- DATA FETCHING & SIDE EFFECTS (No changes here) ---
//   useEffect(() => {
//     if (status === 'authenticated' && session?.user?.email) {
//       const savedData = localStorage.getItem(`userSettings-${session.user.email}`);
//       if (savedData) {
//         setMerchantUpi(JSON.parse(savedData).merchantUpiId || '');
//       }
//     }
//   }, [status, session]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch('/api/products');
//         if (!res.ok) throw new Error('Failed to fetch');
//         setInventory(await res.json());
//       } catch (err) {
//         console.error('Error fetching inventory:', err);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (!productName.trim()) {
//       setShowSuggestions(false);
//       return;
//     }
//     const query = productName.trim().toLowerCase();
//     const filtered = inventory.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 5);
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
  
//   // --- CORE FUNCTIONS (Only handleWhatsAppShare is changed) ---
//   const addToCart = (name: string, price: number, productId?: number) => {
//     if (!name || price < 0) return;
//     setCart((prevCart) => {
//       const existingItem = productId ? prevCart.find((item) => item.productId === productId) : null;
//       if (existingItem) {
//         return prevCart.map((item) =>
//           item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
//         );
//       }
//       const newItem: CartItem = { id: Date.now(), productId, name, quantity: 1, price };
//       return [newItem, ...prevCart];
//     });
//     setProductName('');
//     setProductPrice('');
//     setShowSuggestions(false);
//   };

//   const handleManualAdd = () => {
//     if (!productName.trim() || !productPrice || productPrice <= 0) {
//       alert('Please enter a valid product name and price.');
//       return;
//     }
//     const matchedItem = inventory.find(p => p.name.toLowerCase() === productName.trim().toLowerCase());
//     if (matchedItem) {
//       addToCart(matchedItem.name, matchedItem.sellingPrice, matchedItem.id);
//     } else {
//       addToCart(productName.trim(), productPrice);
//     }
//   };

//   const editCartItem = (id: number, field: 'quantity' | 'price', value: string) => {
//     const numericValue = parseFloat(value);
//     setCart(cart.map(item => 
//       item.id === id ? { ...item, [field]: Math.max(0, numericValue) || 0 } : item
//     ));
//   };
  
//   const deleteCartItem = (id: number) => setCart(cart.filter((item) => item.id !== id));

//   const handleTransactionDone = () => {
//     setCart([]);
//     setSelectedPayment('');
//     setShowPaymentOptions(false);
//     setShowFinalizeOptions(false);
//   };

//   // ✅ UPDATED WHATSAPP FUNCTION - No more prompt!
//   const handleWhatsAppShare = () => {
//     if (!whatsAppNumber.trim() || !/^\d{10,15}$/.test(whatsAppNumber)) {
//         alert("Please enter a valid WhatsApp number (e.g., 919876543210).");
//         return;
//     }
//     const message = [...cart].reverse().map(p => `${p.name} (x${p.quantity}) - ₹${(p.price * p.quantity).toFixed(2)}`).join('\n');
//     const fullMessage = `Hello! Here is your bill from ${merchantName}:\n\n${message}\n\n*Grand Total: ₹${totalAmount.toFixed(2)}*`;
//     window.open(`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(fullMessage)}`, '_blank');
//     setShowWhatsAppInput(false); // Hide input after sending
//     setWhatsAppNumber(''); // Clear the number
//   };


//   const handlePrint = () => window.print();
  
//   const handleScannerUpdate = (error: any, result: any) => {
//     if (result?.getText()) {
//       const scannedValue = result.getText();
//       const foundProduct = inventory.find(p => p.id.toString() === scannedValue || p.name.toLowerCase() === scannedValue.toLowerCase());
//       if (foundProduct) {
//         addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.id);
//       } else {
//         addToCart(scannedValue, 0);
//       }
//       setScanning(false);
//     }
//   };
  
//   // --- RENDER ---
//   return (
//     <>
//       <div className="flex h-screen w-full bg-gray-100 font-sans print:hidden">
        
//         <div className="flex h-full w-full flex-col md:flex-row overflow-hidden">
          
//           <div className="flex flex-col p-4 md:w-2/3 md:p-6 flex-1 overflow-y-auto">
//             <header className="flex flex-shrink-0 items-center justify-between mb-4">
//               <h1 className="text-2xl font-bold text-gray-800">Billing</h1>
//               <button onClick={() => setScanning(true)} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
//                 <Scan size={18} />
//                 <span>Scan</span>
//               </button>
//             </header>
            
//             <div className="flex-shrink-0 rounded-xl bg-white p-4 mb-4 shadow-sm">
//               <div ref={suggestionsRef} className="relative">
//                 <input type="text" placeholder="Search or enter product name..." className="w-full rounded-lg border-2 border-gray-200 p-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" value={productName} onChange={(e) => setProductName(e.target.value)} />
//                 {showSuggestions && (
//                   <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
//                     {suggestions.map((s) => (
//                       <div key={s.id} onClick={() => addToCart(s.name, s.sellingPrice, s.id)} className="cursor-pointer border-b p-3 last:border-b-0 hover:bg-indigo-50">
//                         <div className="flex justify-between font-semibold"><span>{s.name}</span><span>₹{s.sellingPrice.toFixed(2)}</span></div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div className="mt-3 flex gap-3">
//                 <input type="number" placeholder="Price" className="w-1/3 rounded-lg border-2 border-gray-200 p-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" value={productPrice} onChange={(e) => setProductPrice(e.target.value === '' ? '' : parseFloat(e.target.value))} />
//                 <button onClick={handleManualAdd} className="w-2/3 rounded-lg bg-green-500 p-3 font-semibold text-white transition-all hover:bg-green-600">Add Manually</button>
//               </div>
//             </div>
            
//             <div className="space-y-3 pr-2">
//               {cart.length === 0 ? (
//                 <div className="pt-16 text-center text-gray-500"><p>Your cart is empty.</p><p className="text-sm">Scan an item or add it manually.</p></div>
//               ) : (
//                 cart.map((item) => (
//                   <div key={item.id} className="grid grid-cols-12 items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
//                     <div className="col-span-12 md:col-span-5">
//                       <p className="font-semibold text-gray-800">{item.name}</p>
//                       <p className="text-sm text-gray-500 md:hidden">Total: ₹{(item.quantity * item.price).toFixed(2)}</p>
//                     </div>
//                     <div className="col-span-5 md:col-span-2 flex items-center">
//                        <label htmlFor={`quantity-${item.id}`} className="text-sm font-medium text-gray-500 mr-2">Qty:</label>
//                        <input id={`quantity-${item.id}`} type="number" value={item.quantity} onChange={(e) => editCartItem(item.id, 'quantity', e.target.value)} className="w-full rounded-md border-2 p-1.5 text-center font-semibold outline-none focus:ring-1 focus:ring-indigo-500" min="1" />
//                     </div>
//                      <div className="col-span-5 md:col-span-3 flex items-center">
//                        <label htmlFor={`price-${item.id}`} className="text-sm font-medium text-gray-500 mr-2">Price:</label>
//                        <input id={`price-${item.id}`} type="number" value={item.price} onChange={(e) => editCartItem(item.id, 'price', e.target.value)} className="w-full rounded-md border-2 p-1.5 text-right font-semibold outline-none focus:ring-1 focus:ring-indigo-500" />
//                     </div>
//                     <div className="col-span-2 md:col-span-1 text-right">
//                        <button onClick={() => deleteCartItem(item.id)} className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700"><Trash2 size={20} /></button>
//                     </div>
//                      <div className="hidden md:block col-span-1 text-right font-semibold text-gray-700">
//                       ₹{(item.quantity * item.price).toFixed(2)}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
          
//           <div className="flex flex-shrink-0 flex-col border-t bg-white p-4 md:w-1/3 md:border-l md:border-t-0 md:p-6 md:shadow-lg md:overflow-y-auto">
//             <div className="flex-grow space-y-4">
//               <h2 className="border-b pb-2 text-xl font-bold text-gray-800">Order Summary</h2>
              
//               <div className="flex items-center justify-between"><span className="text-lg font-medium text-gray-600">Grand Total</span><span className="text-3xl font-bold text-indigo-600">₹{totalAmount.toFixed(2)}</span></div>
              
//               <div className="space-y-3 border-t pt-4">
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => { setShowFinalizeOptions(!showFinalizeOptions); setShowPaymentOptions(false); }}
//                     className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-700 py-2 px-3 font-semibold text-white transition-all hover:bg-gray-800 disabled:bg-gray-400"
//                     disabled={cart.length === 0}
//                   >
//                     <CheckCircle size={16} />
//                     <span>Finalize Bill</span>
//                   </button>
//                   <button
//                     onClick={() => { setShowPaymentOptions(!showPaymentOptions); setShowFinalizeOptions(false); }}
//                     className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 px-3 font-semibold text-white transition-all hover:bg-blue-600 disabled:bg-gray-400"
//                     disabled={cart.length === 0}
//                   >
//                     <CreditCard size={16} />
//                     <span>Accept Payment</span>
//                   </button>
//                 </div>

//                 {/* ✅ UPDATED Finalize options */}
//                 {showFinalizeOptions && cart.length > 0 && (
//                   <div className="space-y-3 rounded-lg bg-gray-50 p-3 pt-2">
//                     {/* New Input Field */}
//                     {showWhatsAppInput ? (
//                          <div className="flex gap-2">
//                             <input 
//                                 type="tel" 
//                                 value={whatsAppNumber}
//                                 onChange={(e) => setWhatsAppNumber(e.target.value)}
//                                 placeholder="WhatsApp Number" 
//                                 className="flex-grow rounded-lg border-2 border-gray-300 p-2 outline-none focus:border-green-500"
//                             />
//                             <button onClick={handleWhatsAppShare} className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"><Send size={20}/></button>
//                          </div>
//                     ) : (
//                         <button
//                             onClick={() => setShowWhatsAppInput(true)}
//                             className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 py-2 px-3 font-semibold text-white transition-all hover:bg-green-600"
//                             >
//                             <MessageSquare size={16} />
//                             <span>Share on WhatsApp</span>
//                         </button>
//                     )}

//                     <button
//                       onClick={handlePrint}
//                       className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-500 py-2 px-3 font-semibold text-white transition-all hover:bg-slate-600"
//                     >
//                       <Printer size={16} />
//                       <span>Print Receipt</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
              
//               {showPaymentOptions && cart.length > 0 && (
//                 <div className="space-y-3 border-t pt-4">
//                   <div className="flex flex-wrap gap-2">
//                     {['Cash', 'QR Code', 'Card'].map((method) => (
//                       <button key={method} onClick={() => setSelectedPayment(method)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${selectedPayment === method ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{method}</button>
//                     ))}
//                   </div>
                  
//                   {selectedPayment === 'Cash' && (
//                     <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-center">
//                         <h3 className="font-bold text-gray-800">Confirm Cash Payment</h3>
//                         <p className="text-sm text-gray-600">Confirm receipt of ₹{totalAmount.toFixed(2)} cash.</p>
//                         <button onClick={handleTransactionDone} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 font-bold text-white hover:bg-blue-700"><DollarSign size={20} /><span>Cash Received</span></button>
//                     </div>
//                   )}

//                   {selectedPayment === 'QR Code' && (
//                     <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-center">
//                       {upiQR ? (
//                         <>
//                           <h3 className="font-bold text-gray-800">Scan to Pay</h3>
//                           <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
//                             <QRCode size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={upiQR} viewBox={`0 0 256 256`} />
//                           </div>
//                           <p className="text-sm text-gray-600">Pay to <b>{merchantUpi}</b></p>
//                           <button onClick={handleTransactionDone} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 p-3 font-bold text-white hover:bg-green-700"><CheckCircle size={20} /><span>Payment Received</span></button>
//                         </>
//                       ) : (
//                         <p className="p-2 font-semibold text-red-600">UPI ID not configured in Settings.</p>
//                       )}
//                     </div>
//                   )}

//                   {selectedPayment === 'Card' && (
//                     <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-center">
//                         <h3 className="font-bold text-gray-800">Confirm Card Payment</h3>
//                         <p className="text-sm text-gray-600">Confirm transaction was successful on the card machine.</p>
//                         <button onClick={handleTransactionDone} className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 p-3 font-bold text-white hover:bg-purple-700"><CreditCard size={20} /><span>Payment Successful</span></button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        
//         {scanning && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
//             <div className="w-full max-w-sm rounded-xl bg-white p-4">
//               <div className="mb-2 flex items-center justify-between"><h3 className="font-bold text-indigo-600">Scan Barcode/QR</h3><button onClick={() => setScanning(false)} className="rounded-full p-1 hover:bg-gray-200"><X size={24} /></button></div>
//               <div className="overflow-hidden rounded-lg"><BarcodeScannerComponent width="100%" height="100%" onUpdate={handleScannerUpdate} /></div>
//             </div>
//           </div>
//         )}
//       </div>
      
//       <PrintableReceipt cart={cart} totalAmount={totalAmount} shopName={merchantName} />
//     </>
//   );
// }


'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import QRCode from 'react-qr-code';
// ✅ I have added the "RefreshCw" icon for your new button
import { Scan, Trash2, Send, CreditCard, CheckCircle, X, Printer, DollarSign, MessageSquare, RefreshCw } from 'lucide-react'; 

// --- TYPE DEFINITIONS ---
type CartItem = {
  id: number;
  productId?: number;
  name: string;
  quantity: number;
  price: number;
};

type InventoryProduct = {
  id: number;
  name: string;
  quantity: number;
  sellingPrice: number;
  image?: string;
};

// Printable Receipt Component (No changes here)
const PrintableReceipt = ({ cart, totalAmount, shopName }: { cart: CartItem[], totalAmount: number, shopName: string }) => (
    <div className="hidden print:block p-8 font-mono">
    <h1 className="text-2xl font-bold text-center mb-2">{shopName}</h1>
    <p className="text-center text-sm mb-6">Sale Invoice</p>
    <div className="flex justify-between text-xs mb-4">
      <span>Date: {new Date().toLocaleDateString()}</span>
      <span>Time: {new Date().toLocaleTimeString()}</span>
    </div>
    <table className="w-full text-sm">
      <thead>
        <tr className="border-t border-b border-black">
          <th className="text-left py-2">ITEM</th>
          <th className="text-center py-2">QTY</th>
          <th className="text-right py-2">PRICE</th>
          <th className="text-right py-2">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        {[...cart].reverse().map(item => (
          <tr key={item.id} className="border-b">
            <td className="py-2">{item.name}</td>
            <td className="text-center py-2">{item.quantity}</td>
            <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
            <td className="text-right py-2">₹{(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-6 flex justify-end">
      <div className="w-2/5">
        <div className="flex justify-between font-bold text-lg">
          <span>Grand Total:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
    <p className="text-center text-xs mt-10">--- Thank You! ---</p>
  </div>
);


// --- MAIN COMPONENT ---
export default function BillingPage() {
  // --- STATE MANAGEMENT ---
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState<number | ''>('');
  const [scanning, setScanning] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showFinalizeOptions, setShowFinalizeOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [merchantUpi, setMerchantUpi] = useState('');
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const [showWhatsAppInput, setShowWhatsAppInput] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState('');


  // --- DERIVED STATE & CONSTANTS ---
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const merchantName = session?.user?.name || "Billzzy Lite";
  const upiQR = merchantUpi ? `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=Bill%20Payment` : '';

  // --- DATA FETCHING & SIDE EFFECTS (No changes here) ---
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const savedData = localStorage.getItem(`userSettings-${session.user.email}`);
      if (savedData) {
        setMerchantUpi(JSON.parse(savedData).merchantUpiId || '');
      }
    }
  }, [status, session]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        setInventory(await res.json());
      } catch (err) {
        console.error('Error fetching inventory:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!productName.trim()) {
      setShowSuggestions(false);
      return;
    }
    const query = productName.trim().toLowerCase();
    const filtered = inventory.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 5);
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
  
  // --- CORE FUNCTIONS (Only handleWhatsAppShare is changed) ---
  const addToCart = (name: string, price: number, productId?: number) => {
    if (!name || price < 0) return;
    setCart((prevCart) => {
      const existingItem = productId ? prevCart.find((item) => item.productId === productId) : null;
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const newItem: CartItem = { id: Date.now(), productId, name, quantity: 1, price };
      return [newItem, ...prevCart];
    });
    setProductName('');
    setProductPrice('');
    setShowSuggestions(false);
  };

  const handleManualAdd = () => {
    if (!productName.trim() || !productPrice || productPrice <= 0) {
      alert('Please enter a valid product name and price.');
      return;
    }
    const matchedItem = inventory.find(p => p.name.toLowerCase() === productName.trim().toLowerCase());
    if (matchedItem) {
      addToCart(matchedItem.name, matchedItem.sellingPrice, matchedItem.id);
    } else {
      addToCart(productName.trim(), productPrice);
    }
  };

  const editCartItem = (id: number, field: 'quantity' | 'price', value: string) => {
    const numericValue = parseFloat(value);
    setCart(cart.map(item => 
      item.id === id ? { ...item, [field]: Math.max(0, numericValue) || 0 } : item
    ));
  };
  
  const deleteCartItem = (id: number) => setCart(cart.filter((item) => item.id !== id));

  // ✅ Your original function, now used for auto-reset after payment
  const handleTransactionDone = () => {
    setCart([]);
    setSelectedPayment('');
    setShowPaymentOptions(false);
    setShowFinalizeOptions(false);
  };

  // ✅ NEW function for the manual reset button, which includes confirmation
  const handleStartNewBill = () => {
    if (window.confirm('Are you sure you want to clear the current bill and start over?')) {
        handleTransactionDone(); // Resets everything
    }
  };

  const handleWhatsAppShare = () => {
    if (!whatsAppNumber.trim() || !/^\d{10,15}$/.test(whatsAppNumber)) {
        alert("Please enter a valid WhatsApp number (e.g., 919876543210).");
        return;
    }
    const message = [...cart].reverse().map(p => `${p.name} (x${p.quantity}) - ₹${(p.price * p.quantity).toFixed(2)}`).join('\n');
    const fullMessage = `Hello! Here is your bill from ${merchantName}:\n\n${message}\n\n*Grand Total: ₹${totalAmount.toFixed(2)}*`;
    window.open(`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(fullMessage)}`, '_blank');
    setShowWhatsAppInput(false);
    setWhatsAppNumber('');
  };


  const handlePrint = () => window.print();
  
  const handleScannerUpdate = (error: any, result: any) => {
    if (result?.getText()) {
      const scannedValue = result.getText();
      const foundProduct = inventory.find(p => p.id.toString() === scannedValue || p.name.toLowerCase() === scannedValue.toLowerCase());
      if (foundProduct) {
        addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.id);
      } else {
        addToCart(scannedValue, 0);
      }
      setScanning(false);
    }
  };
  
  // --- RENDER ---
  return (
    <>
      <div className="flex h-screen w-full bg-gray-100 font-sans print:hidden">
        
        <div className="flex h-full w-full flex-col md:flex-row overflow-hidden">
          
          <div className="flex flex-col p-4 md:w-2/3 md:p-6 flex-1 overflow-y-auto">
            <header className="flex flex-shrink-0 items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Billing</h1>
              <button onClick={() => setScanning(true)} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
                <Scan size={18} />
                <span>Scan</span>
              </button>
            </header>
            
            <div className="flex-shrink-0 rounded-xl bg-white p-4 mb-4 shadow-sm">
              <div ref={suggestionsRef} className="relative">
                <input type="text" placeholder="Search or enter product name..." className="w-full rounded-lg border-2 border-gray-200 p-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" value={productName} onChange={(e) => setProductName(e.target.value)} />
                {showSuggestions && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    {suggestions.map((s) => (
                      <div key={s.id} onClick={() => addToCart(s.name, s.sellingPrice, s.id)} className="cursor-pointer border-b p-3 last:border-b-0 hover:bg-indigo-50">
                        <div className="flex justify-between font-semibold"><span>{s.name}</span><span>₹{s.sellingPrice.toFixed(2)}</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-3">
                <input type="number" placeholder="Price" className="w-1/3 rounded-lg border-2 border-gray-200 p-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" value={productPrice} onChange={(e) => setProductPrice(e.target.value === '' ? '' : parseFloat(e.target.value))} />
                <button onClick={handleManualAdd} className="w-2/3 rounded-lg bg-green-500 p-3 font-semibold text-white transition-all hover:bg-green-600">Add Manually</button>
              </div>
            </div>
            
            <div className="space-y-3 pr-2">
              {cart.length === 0 ? (
                <div className="pt-16 text-center text-gray-500"><p>Your cart is empty.</p><p className="text-sm">Scan an item or add it manually.</p></div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
                    <div className="col-span-12 md:col-span-5">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500 md:hidden">Total: ₹{(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                    <div className="col-span-5 md:col-span-2 flex items-center">
                       <label htmlFor={`quantity-${item.id}`} className="text-sm font-medium text-gray-500 mr-2">Qty:</label>
                       <input id={`quantity-${item.id}`} type="number" value={item.quantity} onChange={(e) => editCartItem(item.id, 'quantity', e.target.value)} className="w-full rounded-md border-2 p-1.5 text-center font-semibold outline-none focus:ring-1 focus:ring-indigo-500" min="1" />
                    </div>
                     <div className="col-span-5 md:col-span-3 flex items-center">
                       <label htmlFor={`price-${item.id}`} className="text-sm font-medium text-gray-500 mr-2">Price:</label>
                       <input id={`price-${item.id}`} type="number" value={item.price} onChange={(e) => editCartItem(item.id, 'price', e.target.value)} className="w-full rounded-md border-2 p-1.5 text-right font-semibold outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="col-span-2 md:col-span-1 text-right">
                       <button onClick={() => deleteCartItem(item.id)} className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700"><Trash2 size={20} /></button>
                    </div>
                     <div className="hidden md:block col-span-1 text-right font-semibold text-gray-700">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="flex flex-shrink-0 flex-col border-t bg-white p-4 md:w-1/3 md:border-l md:border-t-0 md:p-6 md:shadow-lg md:overflow-y-auto">
            <div className="flex-grow space-y-4">
              
              {/* ✅ UPDATED HEADER with the small button */}
              <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
                  <button
                      onClick={handleStartNewBill}
                      className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-700 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed"
                      title="Start New Bill"
                      disabled={cart.length === 0}
                  >
                      <RefreshCw size={20} />
                  </button>
              </div>
              
              <div className="flex items-center justify-between"><span className="text-lg font-medium text-gray-600">Grand Total</span><span className="text-3xl font-bold text-indigo-600">₹{totalAmount.toFixed(2)}</span></div>
              
              <div className="space-y-3 border-t pt-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowFinalizeOptions(!showFinalizeOptions); setShowPaymentOptions(false); }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-700 py-2 px-3 font-semibold text-white transition-all hover:bg-gray-800 disabled:bg-gray-400"
                    disabled={cart.length === 0}
                  >
                    <CheckCircle size={16} />
                    <span>Finalize Bill</span>
                  </button>
                  <button
                    onClick={() => { setShowPaymentOptions(!showPaymentOptions); setShowFinalizeOptions(false); }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 px-3 font-semibold text-white transition-all hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={cart.length === 0}
                  >
                    <CreditCard size={16} />
                    <span>Accept Payment</span>
                  </button>
                </div>

                {showFinalizeOptions && cart.length > 0 && (
                  <div className="space-y-3 rounded-lg bg-gray-50 p-3 pt-2">
                    {showWhatsAppInput ? (
                         <div className="flex gap-2">
                            <input 
                                type="tel" 
                                value={whatsAppNumber}
                                onChange={(e) => setWhatsAppNumber(e.target.value)}
                                placeholder="WhatsApp Number" 
                                className="flex-grow rounded-lg border-2 border-gray-300 p-2 outline-none focus:border-green-500"
                            />
                            <button onClick={handleWhatsAppShare} className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"><Send size={20}/></button>
                         </div>
                    ) : (
                        <button
                            onClick={() => setShowWhatsAppInput(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 py-2 px-3 font-semibold text-white transition-all hover:bg-green-600"
                            >
                            <MessageSquare size={16} />
                            <span>Share on WhatsApp</span>
                        </button>
                    )}

                    <button
                      onClick={handlePrint}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-500 py-2 px-3 font-semibold text-white transition-all hover:bg-slate-600"
                    >
                      <Printer size={16} />
                      <span>Print Receipt</span>
                    </button>
                  </div>
                )}
              </div>
              
              {showPaymentOptions && cart.length > 0 && (
                <div className="space-y-3 border-t pt-4">
                  <div className="flex flex-wrap gap-2">
                    {['Cash', 'QR Code', 'Card'].map((method) => (
                      <button key={method} onClick={() => setSelectedPayment(method)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${selectedPayment === method ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{method}</button>
                    ))}
                  </div>
                  
                  {selectedPayment === 'Cash' && (
                    <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-center">
                        <h3 className="font-bold text-gray-800">Confirm Cash Payment</h3>
                        <p className="text-sm text-gray-600">Confirm receipt of ₹{totalAmount.toFixed(2)} cash.</p>
                        <button onClick={handleTransactionDone} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 font-bold text-white hover:bg-blue-700"><DollarSign size={20} /><span>Cash Received</span></button>
                    </div>
                  )}

                  {selectedPayment === 'QR Code' && (
                    <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-center">
                      {upiQR ? (
                        <>
                          <h3 className="font-bold text-gray-800">Scan to Pay</h3>
                          <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                            <QRCode size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={upiQR} viewBox={`0 0 256 256`} />
                          </div>
                          <p className="text-sm text-gray-600">Pay to <b>{merchantUpi}</b></p>
                          <button onClick={handleTransactionDone} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 p-3 font-bold text-white hover:bg-green-700"><CheckCircle size={20} /><span>Payment Received</span></button>
                        </>
                      ) : (
                        <p className="p-2 font-semibold text-red-600">UPI ID not configured in Settings.</p>
                      )}
                    </div>
                  )}

                  {selectedPayment === 'Card' && (
                    <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-center">
                        <h3 className="font-bold text-gray-800">Confirm Card Payment</h3>
                        <p className="text-sm text-gray-600">Confirm transaction was successful on the card machine.</p>
                        <button onClick={handleTransactionDone} className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 p-3 font-bold text-white hover:bg-purple-700"><CreditCard size={20} /><span>Payment Successful</span></button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {scanning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="w-full max-w-sm rounded-xl bg-white p-4">
              <div className="mb-2 flex items-center justify-between"><h3 className="font-bold text-indigo-600">Scan Barcode/QR</h3><button onClick={() => setScanning(false)} className="rounded-full p-1 hover:bg-gray-200"><X size={24} /></button></div>
              <div className="overflow-hidden rounded-lg"><BarcodeScannerComponent width="100%" height="100%" onUpdate={handleScannerUpdate} /></div>
            </div>
          </div>
        )}
      </div>
      
      <PrintableReceipt cart={cart} totalAmount={totalAmount} shopName={merchantName} />
    </>
  );
}