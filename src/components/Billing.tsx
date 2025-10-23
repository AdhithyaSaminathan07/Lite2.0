// 'use client';

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useSession } from 'next-auth/react';
// import BarcodeScannerComponent from 'react-qr-barcode-scanner';
// import { Scan, Trash2, Edit2, Check, X, Sun, AlertTriangle } from 'lucide-react';

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

// type ScannerResult = {
//   getText: () => string;
// };

// type ModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
//   onConfirm?: () => void;
//   confirmText?: string;
//   showCancel?: boolean;
// };

// const Modal: React.FC<ModalProps> = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   onConfirm,
//   confirmText = 'OK',
//   showCancel = false,
// }) => {
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
//           {showCancel && (
//             <button
//               onClick={onClose}
//               className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//           )}
//           <button
//             onClick={() => {
//               if (onConfirm) onConfirm();
//               onClose();
//             }}
//             className="rounded-lg bg-[#5a4fcf] px-5 py-2 font-semibold text-white hover:bg-[#4c42b8]"
//           >
//             {confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// Modal.displayName = 'Modal';

// export default function BillingPage() {
//   const { data: session, status } = useSession();
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [productName, setProductName] = useState('');
//   const [productPrice, setProductPrice] = useState<number>(0);
//   const [scanning, setScanning] = useState(false);
//   const [flashOn, setFlashOn] = useState(false);
//   const [inventory, setInventory] = useState<InventoryProduct[]>([]);
//   const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const suggestionsRef = useRef<HTMLDivElement | null>(null);

//   const [modal, setModal] = useState({
//     isOpen: false,
//     title: '',
//     message: '',
//     onConfirm: undefined as (() => void) | undefined,
//     confirmText: 'OK',
//     showCancel: false,
//   });

//   const totalAmount = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   useEffect(() => {
//     if (status === 'authenticated') {
//       (async () => {
//         try {
//           const res = await fetch('/api/products');
//           if (!res.ok) throw new Error('Failed to fetch');
//           const data: InventoryProduct[] = await res.json();
//           setInventory(data);
//         } catch (err) {
//           console.error(err);
//         }
//       })();
//     }
//   }, [status]);

//   useEffect(() => {
//     if (!productName.trim()) return setShowSuggestions(false);
//     const query = productName.trim().toLowerCase();
//     const filtered = inventory
//       .filter(
//         (p) =>
//           p.name.toLowerCase().includes(query) ||
//           (p.sku && p.sku.toLowerCase().includes(query))
//       )
//       .slice(0, 5);
//     setSuggestions(filtered);
//     setShowSuggestions(filtered.length > 0);
//   }, [productName, inventory]);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (
//         suggestionsRef.current &&
//         !suggestionsRef.current.contains(e.target as Node)
//       )
//         setShowSuggestions(false);
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   const addToCart = useCallback(
//     (name: string, price: number, productId?: string) => {
//       if (!name || price < 0) return;
//       setCart((prev) => {
//         const existing = productId
//           ? prev.find((item) => item.productId === productId)
//           : null;
//         if (existing) {
//           return prev.map((item) =>
//             item.productId === productId
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           );
//         }
//         const newItem: CartItem = {
//           id: Date.now(),
//           productId,
//           name,
//           quantity: 1,
//           price,
//         };
//         return [newItem, ...prev];
//       });
//       setProductName('');
//       setProductPrice(0);
//       setShowSuggestions(false);
//     },
//     []
//   );

//   const handleScanResult = useCallback(
//     (scannedValue: string) => {
//       const lowercasedScannedValue = scannedValue.toLowerCase();
//       const foundProduct = inventory.find(
//         (p) =>
//           p.id.toString() === scannedValue ||
//           (p.sku && p.sku.toLowerCase() === lowercasedScannedValue) ||
//           p.name.toLowerCase() === lowercasedScannedValue
//       );

//       if (foundProduct) {
//         addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.id);
//       } else {
//         addToCart(scannedValue, 0);
//       }
//       setScanning(false);
//     },
//     [inventory, addToCart]
//   );

//   const handleManualAdd = useCallback(() => {
//     if (!productName.trim() || !productPrice || productPrice <= 0) {
//       setModal({
//         isOpen: true,
//         title: 'Invalid Input',
//         message: 'Enter valid product name and price.',
//         showCancel: false,
//         confirmText: 'OK',
//         onConfirm: undefined,
//       });
//       return;
//     }
//     const matched = inventory.find(
//       (p) => p.name.toLowerCase() === productName.trim().toLowerCase()
//     );
//     if (matched) addToCart(matched.name, matched.sellingPrice, matched.id);
//     else addToCart(productName.trim(), Number(productPrice));
//   }, [productName, productPrice, inventory, addToCart]);

//   const deleteCartItem = (id: number) =>
//     setCart((prev) => prev.filter((item) => item.id !== id));

//   const toggleEdit = (id: number) =>
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, isEditing: !item.isEditing } : item
//       )
//     );

//   const handleScannerUpdate = (
//     error: unknown,
//     result: ScannerResult | undefined
//   ) => {
//     if (result?.getText()) {
//       const value = result.getText().toLowerCase();
//       const found = inventory.find(
//         (p) =>
//           p.id === value ||
//           (p.sku && p.sku.toLowerCase() === value) ||
//           p.name.toLowerCase() === value
//       );
//       if (found) addToCart(found.name, found.sellingPrice, found.id);
//       else addToCart(value, 0);
//       setScanning(false);
//     }
//     if (error) console.info('Scanner error:', (error as Error).message);
//   };

//   return (
//     <>
//       <div className="flex flex-col h-screen bg-[#f9f9fb] font-sans">
//         <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm sticky top-0 z-20">
//           <h1 className="text-xl font-bold text-[#5a4fcf]">Billzzy Billing</h1>
//           <button
//             onClick={() => setScanning(true)}
//             className="flex items-center gap-2 bg-[#5a4fcf] px-4 py-2 rounded-lg text-white font-semibold shadow hover:bg-[#4c42b8] transition"
//           >
//             <Scan size={18} />
//             <span>Scan</span>
//           </button>
//         </header>

//         <main className="flex-1 overflow-y-auto p-4 space-y-3">
//           <div ref={suggestionsRef} className="relative">
//             <input
//               type="text"
//               placeholder="Search by name or ID..."
//               className="w-full rounded-xl border border-gray-200 p-3 shadow-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none"
//               value={productName}
//               onChange={(e) => setProductName(e.target.value)}
//             />
//             {showSuggestions && (
//               <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
//                 {suggestions.map((s) => (
//                   <div
//                     key={s.id}
//                     onClick={() => addToCart(s.name, s.sellingPrice, s.id)}
//                     className="cursor-pointer border-b p-3 hover:bg-[#f1f0ff]"
//                   >
//                     <div className="flex justify-between font-semibold text-gray-800">
//                       <span>{s.name}</span>
//                       <span>₹{s.sellingPrice.toFixed(2)}</span>
//                     </div>
//                     {s.sku && <p className="text-xs text-gray-500">ID: {s.sku}</p>}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex gap-2">
//             <input
//               type="number"
//               placeholder="Price"
//               className="w-1/3 rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-[#5a4fcf]"
//               value={productPrice}
//               onChange={(e) =>
//                 setProductPrice(
//                   e.target.value === '' ? 0 : parseFloat(e.target.value)
//                 )
//               }
//             />
//             <button
//               onClick={handleManualAdd}
//               className="flex-1 rounded-lg bg-[#5a4fcf] text-white font-semibold hover:bg-[#4c42b8] transition"
//             >
//               Add Item
//             </button>
//           </div>

//           <div className="space-y-2">
//             {cart.length === 0 ? (
//               <p className="text-center text-gray-500 mt-8">🛒 Your cart is empty.</p>
//             ) : (
//               cart.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm"
//                 >
//                   <div className="flex flex-1 items-center gap-2">
//                     {item.isEditing ? (
//                       <>
//                         <input
//                           type="text"
//                           value={item.name}
//                           onChange={(e) =>
//                             setCart((prev) =>
//                               prev.map((i) =>
//                                 i.id === item.id ? { ...i, name: e.target.value } : i
//                               )
//                             )
//                           }
//                           className="border rounded-lg p-1 w-1/3 text-sm"
//                         />
//                         <input
//                           type="number"
//                           value={item.quantity}
//                           onChange={(e) =>
//                             setCart((prev) =>
//                               prev.map((i) =>
//                                 i.id === item.id
//                                   ? { ...i, quantity: parseInt(e.target.value) || 0 }
//                                   : i
//                               )
//                             )
//                           }
//                           className="border rounded-lg p-1 w-1/6 text-sm"
//                         />
//                         <input
//                           type="number"
//                           value={item.price}
//                           onChange={(e) =>
//                             setCart((prev) =>
//                               prev.map((i) =>
//                                 i.id === item.id
//                                   ? { ...i, price: parseFloat(e.target.value) || 0 }
//                                   : i
//                               )
//                             )
//                           }
//                           className="border rounded-lg p-1 w-1/6 text-sm"
//                         />
//                       </>
//                     ) : (
//                       <>
//                         <p className="font-semibold w-1/3">{item.name}</p>
//                         <p className="text-xs text-gray-500 w-1/6">Qty: {item.quantity}</p>
//                         <p className="text-xs text-gray-500 w-1/6">₹{item.price}</p>
//                       </>
//                     )}
//                   </div>
//                   <div className="flex gap-2 items-center">
//                     <button
//                       onClick={() => toggleEdit(item.id)}
//                       className={`${
//                         item.isEditing ? 'text-green-600' : 'text-[#5a4fcf]'
//                       } hover:text-[#4c42b8]`}
//                     >
//                       {item.isEditing ? <Check size={18} /> : <Edit2 size={18} />}
//                     </button>
//                     <button
//                       onClick={() => deleteCartItem(item.id)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </main>

//         <footer className="bg-white p-4 shadow-lg border-t">
//           <div className="flex justify-between items-center">
//             <span className="text-lg font-medium">Total</span>
//             <span className="text-2xl font-bold text-[#5a4fcf]">
//               ₹{totalAmount.toFixed(2)}
//             </span>
//           </div>
//         </footer>
//       </div>

//       {scanning && (
//         <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
//           <div className="w-72 rounded-xl bg-white p-3 relative shadow-lg">
//             <div className="flex justify-between items-center mb-2">
//               <h3 className="font-semibold text-[#5a4fcf] text-sm">
//                 Scan Barcode / QR
//               </h3>
//               <button
//                 onClick={() => setScanning(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="overflow-hidden rounded-md">
//               <BarcodeScannerComponent
//                 width="100%"
//                 height={200}
//                 delay={100}
//                 onUpdate={handleScannerUpdate}
//               />
//             </div>
//             <button
//               onClick={() => setFlashOn((f) => !f)}
//               className="mt-2 flex items-center justify-center gap-2 w-full rounded-md bg-[#5a4fcf] py-2 text-white font-medium hover:bg-[#4c42b8] transition"
//             >
//               <Sun size={16} />
//               {flashOn ? 'Flash On' : 'Flash Off'}
//             </button>
//           </div>
//         </div>
//       )}

//       <Modal
//         isOpen={modal.isOpen}
//         onClose={() => setModal({ ...modal, isOpen: false })}
//         title={modal.title}
//         onConfirm={modal.onConfirm}
//         confirmText={modal.confirmText}
//         showCancel={modal.showCancel}
//       >
//         <p>{modal.message}</p>
//       </Modal>
//     </>
//   );
// }


'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import QRCode from 'react-qr-code';
import { Scan, Trash2, Edit2, Check, X, Sun, AlertTriangle, Send, CreditCard, CheckCircle, DollarSign, MessageSquare, RefreshCw } from 'lucide-react';


// --- TYPE DEFINITIONS ---
type CartItem = {
  id: number;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  isEditing?: boolean; // Added from friend's code for inline editing
};

type InventoryProduct = {
  id: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  image?: string;
  sku?: string;
};

// Type for the scanner result from the new component
type ScannerResult = {
  getText: () => string;
};


// --- UI COMPONENTS (FROM FRIEND'S CODE) ---
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


// --- MAIN BILLING COMPONENT ---
export default function BillingPage() {
    // --- STATE MANAGEMENT (YOUR LOGIC) ---
    const { data: session, status } = useSession();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState<number | ''>(''); // Can be empty string
    const [scanning, setScanning] = useState(false);
    const [flashOn, setFlashOn] = useState(false); // From friend's code for scanner
    const [inventory, setInventory] = useState<InventoryProduct[]>([]);
    const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [showFinalizeOptions, setShowFinalizeOptions] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [merchantUpi, setMerchantUpi] = useState('');
    const [showWhatsAppInput, setShowWhatsAppInput] = useState(false);
    const [whatsAppNumber, setWhatsAppNumber] = useState('');

    // --- REFS ---
    const suggestionsRef = useRef<HTMLDivElement | null>(null);

    // --- MODAL STATE (YOUR LOGIC, CONNECTED TO NEW MODAL COMPONENT) ---
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: undefined as (() => void) | undefined,
        confirmText: 'OK',
        showCancel: false,
    });

    // --- DERIVED STATE & CONSTANTS (YOUR LOGIC) ---
    const totalAmount = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart]);
    const merchantName = session?.user?.name || "Billzzy Lite";
    const upiQR = merchantUpi ? `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=Bill%20Payment` : '';

    // --- DATA FETCHING & SIDE EFFECTS (YOUR LOGIC) ---
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.email) {
            const savedData = localStorage.getItem(`userSettings-${session.user.email}`);
            if (savedData) {
                setMerchantUpi(JSON.parse(savedData).merchantUpiId || '');
            }
        }
    }, [status, session]);

    useEffect(() => {
        if (status === 'authenticated') {
            (async () => {
                try {
                    const res = await fetch('/api/products');
                    if (!res.ok) throw new Error('Failed to fetch');
                    const data: InventoryProduct[] = await res.json();
                    setInventory(data);
                } catch (err) {
                    console.error('Error fetching inventory:', err);
                }
            })();
        }
    }, [status]);

    useEffect(() => {
        if (!productName.trim()) return setShowSuggestions(false);
        const query = productName.trim().toLowerCase();
        const filtered = inventory.filter(p =>
            p.name.toLowerCase().includes(query) || (p.sku && p.sku.toLowerCase().includes(query))
        ).slice(0, 5);
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


    // --- CORE FUNCTIONS (YOUR LOGIC + INTEGRATED LOGIC) ---
    const addToCart = useCallback((name: string, price: number, productId?: string) => {
        if (!name || price < 0) return;
        setCart((prevCart) => {
            const existingItem = productId ? prevCart.find((item) => item.productId === productId) : null;
            if (existingItem) {
                return prevCart.map((item) =>
                    item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            const newItem: CartItem = { id: Date.now(), productId, name, quantity: 1, price, isEditing: false };
            return [newItem, ...prevCart];
        });
        setProductName('');
        setProductPrice('');
        setShowSuggestions(false);
    }, []);

    const handleManualAdd = useCallback(() => {
        const priceAsNumber = Number(productPrice);
        if (!productName.trim() || !priceAsNumber || priceAsNumber <= 0) {
            setModal({ isOpen: true, title: 'Invalid Input', message: 'Enter a valid product name and a price greater than zero.', showCancel: false, confirmText: 'OK', onConfirm: undefined });
            return;
        }
        const matchedItem = inventory.find(p => p.name.toLowerCase() === productName.trim().toLowerCase());
        if (matchedItem) {
            addToCart(matchedItem.name, matchedItem.sellingPrice, matchedItem.id);
        } else {
            addToCart(productName.trim(), priceAsNumber);
        }
    }, [productName, productPrice, inventory, addToCart]);

    const deleteCartItem = (id: number) => setCart((prev) => prev.filter((item) => item.id !== id));

    // New function for inline editing from friend's code
    const toggleEdit = (id: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, isEditing: !item.isEditing } : { ...item, isEditing: false } // Only one item can be edited at a time
            )
        );
    };
    
    // New function to handle updates from inline editing fields
    const updateCartItem = (id: number, updatedValues: Partial<CartItem>) => {
      setCart(prev => prev.map(item => item.id === id ? { ...item, ...updatedValues } : item));
    };

    // This function acts as a bridge between the new scanner component and your existing logic
    const handleScannerUpdate = (error: unknown, result: ScannerResult | undefined) => {
        if (result?.getText()) {
            const scannedValue = result.getText();
            const lowercasedScannedValue = scannedValue.toLowerCase();
            const foundProduct = inventory.find(p =>
                p.id.toString() === scannedValue ||
                (p.sku && p.sku.toLowerCase() === lowercasedScannedValue) ||
                p.name.toLowerCase() === lowercasedScannedValue
            );

            if (foundProduct) {
                addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.id);
            } else {
                addToCart(scannedValue, 0); // Add as a custom item if not found
            }
            setScanning(false);
        }
        if (error) {
            console.info('Scanner error:', (error as Error).message);
        }
    };
    
    // --- YOUR PAYMENT AND FINALIZATION LOGIC (UNCHANGED) ---
    const handleTransactionDone = useCallback(() => {
        setCart([]);
        setSelectedPayment('');
        setShowPaymentOptions(false);
        setShowFinalizeOptions(false);
        setShowWhatsAppInput(false);
        setWhatsAppNumber('');
    }, []);

    const updateInventory = useCallback(async () => {
         const itemsToUpdate = cart.filter(item => item.productId);
        const updatePromises = itemsToUpdate.map(item => fetch(`/api/products/${item.productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantityToDecrement: item.quantity }),
        }));
        try {
            await Promise.all(updatePromises);
        } catch (error) {
            console.error("A critical network error occurred during inventory update:", error);
        }
    }, [cart]);
    
    const handlePaymentSuccess = useCallback(async () => {
         try {
            const paymentMethodForDB = selectedPayment === 'QR Code' ? 'qr' : selectedPayment.toLowerCase();
            await fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalAmount, paymentMethod: paymentMethodForDB }),
            });
        } catch (error) {
            console.error("An error occurred while attempting to save the sale:", error);
        }
        await updateInventory();
        setModal({ isOpen: true, title: 'Transaction Complete!', message: 'The bill has been finalized and inventory has been updated.', showCancel: false, confirmText: 'Start New Bill', onConfirm: handleTransactionDone });
    }, [selectedPayment, totalAmount, updateInventory, handleTransactionDone]);

    const handleStartNewBill = useCallback(() => {
        if (cart.length === 0) return;
        setModal({ isOpen: true, title: 'Confirm Action', message: 'Are you sure you want to clear the current bill?', showCancel: true, confirmText: 'Yes, Clear Bill', onConfirm: handleTransactionDone });
    }, [cart.length, handleTransactionDone]);

    const handleWhatsAppShare = useCallback(() => {
        if (!whatsAppNumber.trim() || !/^\d{10,15}$/.test(whatsAppNumber)) {
            setModal({ isOpen: true, title: 'Invalid Number', message: 'Please enter a valid WhatsApp number including the country code (e.g., 919876543210).', showCancel: false, confirmText: 'Got it', onConfirm: undefined });
            return;
        }
        const message = [...cart].reverse().map(p => `${p.name} (x${p.quantity}) - ₹${(p.price * p.quantity).toFixed(2)}`).join('\n');
        const fullMessage = `Hello! Here is your bill from ${merchantName}:\n\n${message}\n\n*Grand Total: ₹${totalAmount.toFixed(2)}*`;
        window.open(`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(fullMessage)}`, '_blank');
        setShowWhatsAppInput(false);
        setWhatsAppNumber('');
    }, [whatsAppNumber, cart, merchantName, totalAmount]);


    // --- RENDER (NEW UI + YOUR FUNCTIONALITY) ---
    return (
        <>
            <div className="flex flex-col h-screen bg-[#f9f9fb] font-sans">
                <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm sticky top-0 z-20">
                    <h1 className="text-xl font-bold text-[#5a4fcf]">Billzzy Billing</h1>
                    <div className="flex items-center gap-4">
                      <button onClick={handleStartNewBill} disabled={cart.length === 0} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-700 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed" title="Start New Bill" ><RefreshCw size={20} /></button>
                      <button onClick={() => setScanning(true)} className="flex items-center gap-2 bg-[#5a4fcf] px-4 py-2 rounded-lg text-white font-semibold shadow hover:bg-[#4c42b8] transition">
                          <Scan size={18} /><span>Scan</span>
                      </button>
                    </div>
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
                                    <div key={s.id} onClick={() => addToCart(s.name, s.sellingPrice, s.id)} className="cursor-pointer border-b p-3 hover:bg-[#f1f0ff]">
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
                            onChange={(e) => setProductPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        />
                        <button onClick={handleManualAdd} className="flex-1 rounded-lg bg-[#5a4fcf] text-white font-semibold hover:bg-[#4c42b8] transition">Add Item</button>
                    </div>

                    <div className="space-y-2">
                        {cart.length === 0 ? (
                            <p className="text-center text-gray-500 mt-8">🛒 Your cart is empty.</p>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm">
                                    <div className="flex flex-1 items-center gap-2">
                                        {item.isEditing ? (
                                            <>
                                                <input type="text" value={item.name} onChange={(e) => updateCartItem(item.id, { name: e.target.value })} className="border rounded-lg p-1 w-2/4 text-sm"/>
                                                <input type="number" value={item.quantity} onChange={(e) => updateCartItem(item.id, { quantity: parseInt(e.target.value) || 0 })} className="border rounded-lg p-1 w-1/4 text-sm"/>
                                                <input type="number" value={item.price} onChange={(e) => updateCartItem(item.id, { price: parseFloat(e.target.value) || 0 })} className="border rounded-lg p-1 w-1/4 text-sm"/>
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
                                        <button onClick={() => toggleEdit(item.id)} className={`${item.isEditing ? 'text-green-600' : 'text-[#5a4fcf]'} hover:opacity-70`}>
                                            {item.isEditing ? <Check size={18} /> : <Edit2 size={18} />}
                                        </button>
                                        <button onClick={() => deleteCartItem(item.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>

                <footer className="bg-white p-4 shadow-[0_-2px_5px_rgba(0,0,0,0.05)] border-t space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">Grand Total</span>
                        <span className="text-2xl font-bold text-[#5a4fcf]">₹{totalAmount.toFixed(2)}</span>
                    </div>

                    {/* --- YOUR PAYMENT/FINALIZE LOGIC INTEGRATED INTO NEW FOOTER --- */}
                    <div className="space-y-3 border-t pt-4">
                        <div className="flex gap-3">
                            <button onClick={() => { setShowFinalizeOptions(p => !p); setShowPaymentOptions(false); }} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-700 py-3 font-semibold text-white transition-all hover:bg-gray-800 disabled:bg-gray-400" disabled={cart.length === 0}><CheckCircle size={16} /><span>Finalize</span></button>
                            <button onClick={() => { setShowPaymentOptions(p => !p); setShowFinalizeOptions(false); }} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#5a4fcf] py-3 font-semibold text-white transition-all hover:bg-[#4c42b8] disabled:bg-gray-400" disabled={cart.length === 0}><CreditCard size={16} /><span>Pay</span></button>
                        </div>
                        {showFinalizeOptions && cart.length > 0 && (
                             <div className="space-y-3 rounded-lg bg-gray-50 p-3 pt-2">
                                {showWhatsAppInput ? (<div className="flex gap-2"><input type="tel" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} placeholder="WhatsApp Number" className="flex-grow rounded-lg border-2 border-gray-300 p-2 outline-none focus:border-green-500" /><button onClick={handleWhatsAppShare} className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"><Send size={20} /></button></div>) : (<button onClick={() => setShowWhatsAppInput(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 py-2 px-3 font-semibold text-white transition-all hover:bg-green-600"><MessageSquare size={16} /><span>Share on WhatsApp</span></button>)}
                             </div>
                        )}
                         {showPaymentOptions && cart.length > 0 && (
                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex flex-wrap gap-2">{['Cash', 'QR Code', 'Card'].map((method) => (<button key={method} onClick={() => setSelectedPayment(method)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${selectedPayment === method ? 'bg-[#5a4fcf] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{method}</button>))}</div>
                                    {selectedPayment === 'Cash' && (<div className="space-y-3 rounded-lg bg-gray-50 p-4 text-center"><h3 className="font-bold text-gray-800">Confirm Cash Payment</h3><p className="text-sm text-gray-600">Confirm receipt of ₹{totalAmount.toFixed(2)} cash.</p><button onClick={handlePaymentSuccess} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5a4fcf] p-3 font-bold text-white hover:bg-[#4c42b8]"><DollarSign size={20} /><span>Cash Received</span></button></div>)}
                                    {selectedPayment === 'QR Code' && (<div className="space-y-3 rounded-lg bg-gray-50 p-4 text-center">{upiQR ? (<><h3 className="font-bold text-gray-800">Scan to Pay</h3><div style={{ height: "auto", margin: "1rem auto", maxWidth: 180, width: "100%" }}><QRCode size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={upiQR} viewBox={`0 0 256 256`} /></div><p className="text-sm text-gray-600">Pay to <b>{merchantUpi}</b></p><button onClick={handlePaymentSuccess} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 p-3 font-bold text-white hover:bg-green-700"><CheckCircle size={20} /><span>Payment Received</span></button></>) : (<p className="p-2 font-semibold text-red-600">UPI ID not configured.</p>)}</div>)}
                                    {selectedPayment === 'Card' && (<div className="space-y-3 rounded-lg bg-gray-50 p-4 text-center"><h3 className="font-bold text-gray-800">Confirm Card Payment</h3><p className="text-sm text-gray-600">Confirm transaction was successful.</p><button onClick={handlePaymentSuccess} className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 p-3 font-bold text-white hover:bg-purple-700"><CreditCard size={20} /><span>Payment Successful</span></button></div>)}
                                </div>
                            )}
                    </div>
                </footer>
            </div>

            {/* --- SCANNER MODAL (FROM FRIEND'S CODE) --- */}
            {scanning && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
                    <div className="w-72 rounded-xl bg-white p-3 relative shadow-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-[#5a4fcf] text-sm">Scan Barcode / QR</h3>
                            <button onClick={() => setScanning(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                        </div>
                        <div className="overflow-hidden rounded-md">
                            <BarcodeScannerComponent
                                width="100%"
                                height={200}
                                onUpdate={handleScannerUpdate}
                                // The `torch` property might not be directly supported.
                                // It's often handled by the browser's MediaStream API.
                                // The button toggles the state, but direct control can be complex.
                            />
                        </div>
                        <button onClick={() => setFlashOn((f) => !f)} className="mt-2 flex items-center justify-center gap-2 w-full rounded-md bg-[#5a4fcf] py-2 text-white font-medium hover:bg-[#4c42b8] transition">
                            <Sun size={16} /><span>{flashOn ? 'Flash On' : 'Flash Off'}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Your logic is connected to the new modal UI */}
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