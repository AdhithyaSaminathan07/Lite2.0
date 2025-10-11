// 'use client';

// import { useState } from 'react';
// import BarcodeScannerComponent from 'react-qr-barcode-scanner';

// type Product = {
//   id: number;
//   name: string;
//   quantity: number;
//   price: number;
// };

// export default function BillingPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [productName, setProductName] = useState('');
//   const [productPrice, setProductPrice] = useState<number>(0);
//   const [whatsappNumber, setWhatsappNumber] = useState('');
//   const [scanning, setScanning] = useState(false);
//   const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment'); // back camera by default

//   // Add product
//   const addProduct = (name: string, price: number) => {
//     if (!name || price <= 0) return;
//     setProducts([
//       ...products,
//       { id: Date.now(), name, quantity: 1, price },
//     ]);
//   };

//   // Edit product
//   const editProduct = (id: number, field: 'name' | 'price' | 'quantity', value: string | number) => {
//     setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
//   };

//   // Delete product
//   const deleteProduct = (id: number) => {
//     setProducts(products.filter(p => p.id !== id));
//   };

//   // WhatsApp message
//   const sendWhatsApp = () => {
//     if (!whatsappNumber) return;
//     const message = products.map(p => `${p.name} x${p.quantity} = ₹${p.price * p.quantity}`).join('\n');
//     const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
//     const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
//       `Hello! Here is your bill:\n${message}\nTotal: ₹${total}`
//     )}`;
//     window.open(url, '_blank');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <h1 className="text-2xl font-bold mb-4" style={{ color: '#5a4fcf' }}>Billing Page</h1>

//       {/* WhatsApp */}
//       <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
//         <input
//           type="text"
//           placeholder="Enter WhatsApp number"
//           className="border p-2 rounded flex-1"
//           value={whatsappNumber}
//           onChange={(e) => setWhatsappNumber(e.target.value)}
//         />
//         <button
//           onClick={sendWhatsApp}
//           className="bg-[#5a4fcf] text-white px-4 py-2 rounded hover:bg-indigo-700"
//         >
//           Send Bill
//         </button>
//       </div>

//       {/* Barcode Scanner */}
//       <div className="mb-4">
//         <div className="flex gap-2 mb-2">
//           <button
//             onClick={() => setScanning(!scanning)}
//             className="bg-[#5a4fcf] text-white px-4 py-2 rounded hover:bg-indigo-700"
//           >
//             {scanning ? 'Stop Scanner' : 'Start Scanner'}
//           </button>
//           <button
//             onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
//             className="bg-[#5a4fcf] text-white px-4 py-2 rounded hover:bg-indigo-700"
//           >
//             {facingMode === 'user' ? 'Switch to Back Camera' : 'Switch to Front Camera'}
//           </button>
//         </div>
//         {scanning && (
//           <div className="w-full max-w-xs mx-auto">
//             <BarcodeScannerComponent
//               width={300}
//               height={200}
//               constraints={{ video: { facingMode } }}
//               onUpdate={(err, result) => {
//                 if (result) {
//                   const scannedValue = result.getText();
//                   addProduct(scannedValue, 100); // default price, you can map real prices later
//                   setScanning(false);
//                 }
//               }}
//             />
//           </div>
//         )}
//       </div>

//       {/* Manual Add Product */}
//       <div className="mb-4 flex flex-col sm:flex-row gap-2">
//         <input
//           type="text"
//           placeholder="Product Name"
//           className="border p-2 rounded flex-1"
//           value={productName}
//           onChange={(e) => setProductName(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Price"
//           className="border p-2 rounded w-24"
//           value={productPrice}
//           onChange={(e) => setProductPrice(parseFloat(e.target.value))}
//         />
//         <button
//           onClick={() => addProduct(productName, productPrice)}
//           className="bg-[#5a4fcf] text-white px-4 py-2 rounded hover:bg-indigo-700"
//         >
//           Add
//         </button>
//       </div>

//       {/* Products List */}
//       <div className="space-y-2">
//         {products.map((product) => (
//           <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between border p-2 rounded bg-white">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
//               <input
//                 type="text"
//                 value={product.name}
//                 onChange={(e) => editProduct(product.id, 'name', e.target.value)}
//                 className="border p-1 rounded flex-1"
//               />
//               <input
//                 type="number"
//                 value={product.quantity}
//                 onChange={(e) => editProduct(product.id, 'quantity', parseInt(e.target.value))}
//                 className="border p-1 rounded w-20"
//               />
//               <input
//                 type="number"
//                 value={product.price}
//                 onChange={(e) => editProduct(product.id, 'price', parseFloat(e.target.value))}
//                 className="border p-1 rounded w-24"
//               />
//             </div>
//             <div className="flex gap-2 mt-2 sm:mt-0">
//               <button
//                 onClick={() => deleteProduct(product.id)}
//                 className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Total */}
//       <div className="mt-4 font-bold text-lg" style={{ color: '#5a4fcf' }}>
//         Total: ₹{products.reduce((sum, p) => sum + p.price * p.quantity, 0)}
//       </div>
//     </div>
//   );
// }



// 'use client';

// import React, { useState } from 'react';
// import BarcodeScannerComponent from 'react-qr-barcode-scanner';
// import QRCode from 'react-qr-code'; // npm install react-qr-code

// type Product = {
//   id: number;
//   name: string;
//   quantity: number;
//   price: number;
// };

// export default function BillingPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [productName, setProductName] = useState('');
//   const [productPrice, setProductPrice] = useState<number>(0);
//   const [whatsappNumber, setWhatsappNumber] = useState('');
//   const [scanning, setScanning] = useState(false);
//   const [cameraAllowed, setCameraAllowed] = useState(false);
//   const [showPaymentOptions, setShowPaymentOptions] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState<string>('');

//   const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

//   const handleStartScanner = async () => {
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       alert('Camera API not supported on this browser 😢');
//       return;
//     }

//     try {
//       const constraints = { video: { facingMode: { exact: 'environment' } } };
//       let stream: MediaStream;

//       try {
//         stream = await navigator.mediaDevices.getUserMedia(constraints);
//       } catch {
//         stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       }

//       stream.getTracks().forEach((track) => track.stop());
//       setCameraAllowed(true);
//       setScanning(true);
//     } catch (err: any) {
//       console.error('Camera error:', err);
//       alert('Unable to access camera. Refresh and try again.');
//     }
//   };

//   const addProduct = (name: string, price: number) => {
//     if (!name || price <= 0) return;
//     setProducts([...products, { id: Date.now(), name, quantity: 1, price }]);
//     setProductName('');
//     setProductPrice(0);
//   };

//   const editProduct = (id: number, field: 'name' | 'price' | 'quantity', value: string | number) => {
//     setProducts(
//       products.map((p) => {
//         if (p.id === id) {
//           let newValue = value;
//           if (field === 'quantity') newValue = parseInt(value as string) || 1;
//           if (field === 'price') newValue = parseFloat(value as string) || p.price;
//           return { ...p, [field]: newValue };
//         }
//         return p;
//       })
//     );
//   };

//   const deleteProduct = (id: number) => {
//     setProducts(products.filter((p) => p.id !== id));
//   };

//   // Send WhatsApp including payment method
//   const sendWhatsApp = () => {
//     if (!whatsappNumber) {
//       alert('Please enter a WhatsApp number.');
//       return;
//     }
//     if (!selectedPayment) {
//       alert('Please select a payment method.');
//       return;
//     }

//     const message = products
//       .map((p) => `${p.name} x${p.quantity} = ₹${p.price * p.quantity}`)
//       .join('\n');

//     const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
//       `Hello! Here is your bill:\n${message}\nTotal: ₹${totalAmount}\nPayment Method: ${selectedPayment}`
//     )}`;
//     window.open(url, '_blank');
//   };

//   // Example QR code URL for UPI payment (replace with actual UPI link)
//   const upiQR = `upi://pay?pa=example@upi&pn=YourCompany&am=${totalAmount}&cu=INR`;

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <div className="p-4 sm:p-6 lg:p-8 flex-grow pb-24">
//         <h1 className="text-2xl font-bold mb-4" style={{ color: '#5a4fcf' }}>
//           Billing Page
//         </h1>

//         {/* Barcode Scanner */}
//         <div className="mb-6 border p-4 rounded-lg bg-white shadow-sm">
//           <h2 className="text-lg font-semibold mb-2">Barcode Scanner</h2>
//           <div className="flex gap-2 mb-4">
//             <button
//               onClick={() => (scanning ? setScanning(false) : handleStartScanner())}
//               className="flex-1 bg-[#5a4fcf] text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
//             >
//               {scanning ? 'Stop Scanner' : 'Start Scanner'}
//             </button>
//           </div>

//           {scanning && cameraAllowed && (
//             <div className="w-full max-w-sm mx-auto overflow-hidden rounded-lg border-2 border-[#5a4fcf]">
//               <BarcodeScannerComponent
//                 width={300}
//                 height={200}
//                 constraints={{ video: { facingMode: { exact: 'environment' } } }}
//                 onUpdate={(err, result) => {
//                   if (result) {
//                     const scannedValue = result.getText();
//                     addProduct(scannedValue, 100); // Replace with actual price from API
//                     setScanning(false);
//                   }
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Manual Add Product */}
//         <div className="mb-6 p-4 rounded-lg bg-white shadow-sm">
//           <h2 className="text-lg font-semibold mb-2">Add Item Manually</h2>
//           <div className="flex flex-col sm:flex-row gap-2">
//             <input
//               type="text"
//               placeholder="Product Name"
//               className="border p-2 rounded flex-1 focus:ring-[#5a4fcf] focus:border-[#5a4fcf]"
//               value={productName}
//               onChange={(e) => setProductName(e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="Price"
//               className="border p-2 rounded w-24 focus:ring-[#5a4fcf] focus:border-[#5a4fcf]"
//               value={productPrice || ''}
//               onChange={(e) => setProductPrice(parseFloat(e.target.value) || 0)}
//             />
//             <button
//               onClick={() => addProduct(productName, productPrice)}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
//             >
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Products List */}
//         <div className="space-y-3">
//           <h2 className="text-lg font-semibold mb-2">Cart Items</h2>
//           {products.length === 0 && <p className="text-gray-500">No items in the cart.</p>}
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="flex flex-wrap sm:flex-row sm:items-center justify-between border p-3 rounded-lg bg-white shadow-sm"
//             >
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 w-full sm:w-auto">
//                 <input
//                   type="text"
//                   value={product.name}
//                   onChange={(e) => editProduct(product.id, 'name', e.target.value)}
//                   className="border p-1 rounded flex-1 w-full sm:w-auto min-w-[100px]"
//                 />
//                 <span className="text-gray-600 hidden sm:inline-block">Qty:</span>
//                 <input
//                   type="number"
//                   value={product.quantity}
//                   onChange={(e) => editProduct(product.id, 'quantity', e.target.value)}
//                   className="border p-1 rounded w-16 text-center"
//                   min="1"
//                 />
//                 <span className="text-gray-600 hidden sm:inline-block">@ ₹</span>
//                 <input
//                   type="number"
//                   value={product.price}
//                   onChange={(e) => editProduct(product.id, 'price', e.target.value)}
//                   className="border p-1 rounded w-20 text-right"
//                 />
//               </div>

//               <div className="flex items-center gap-4 mt-2 sm:mt-0 w-full sm:w-auto justify-between">
//                 <div className="font-semibold text-gray-700">
//                   Total: ₹{(product.price * product.quantity).toFixed(2)}
//                 </div>
//                 <button
//                   onClick={() => deleteProduct(product.id)}
//                   className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Footer with WhatsApp and Payment Options */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#5a4fcf] p-4 shadow-2xl">
//         <div className="max-w-4xl mx-auto flex flex-col gap-2">
//           <div className="font-extrabold text-xl text-right text-[#5a4fcf]">
//             Total: ₹{totalAmount.toFixed(2)}
//           </div>
//           <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//             <input
//               type="tel"
//               placeholder="Enter WhatsApp number (e.g., 919876543210)"
//               className="border p-2 rounded flex-1 focus:ring-[#5a4fcf] focus:border-[#5a4fcf]"
//               value={whatsappNumber}
//               onChange={(e) => setWhatsappNumber(e.target.value)}
//             />
//             <button
//               onClick={sendWhatsApp}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors w-full sm:w-auto"
//             >
//               Send Bill via WhatsApp
//             </button>

//             {/* Modal-style Payment Options */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowPaymentOptions(!showPaymentOptions)}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full sm:w-auto"
//               >
//                 Payment Options
//               </button>

//               {showPaymentOptions && (
//                 <div className="absolute bottom-full mb-2 left-0 w-48 bg-white border shadow-lg rounded-lg p-3 z-50">
//                   <h3 className="text-gray-700 font-semibold mb-2 text-center">
//                     Select Payment
//                   </h3>
//                   {['Cash', 'UPI', 'QR Code'].map((method) => (
//                     <button
//                       key={method}
//                       onClick={() => {
//                         setSelectedPayment(method);
//                         setShowPaymentOptions(false);
//                       }}
//                       className={`block w-full text-center px-4 py-2 rounded mb-2 ${
//                         selectedPayment === method
//                           ? 'bg-green-500 text-white'
//                           : 'bg-gray-200'
//                       } hover:bg-green-400 transition-colors`}
//                     >
//                       {method}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {selectedPayment && (
//             <div className="mt-2 text-gray-700 font-semibold">
//               Selected Payment: <span className="text-[#5a4fcf]">{selectedPayment}</span>
//             </div>
//           )}

//           {/* QR Code Preview */}
//           {selectedPayment === 'QR Code' && (
//             <div className="mt-4 p-4 bg-white border rounded-lg w-64">
//               <h3 className="text-gray-700 mb-2 font-semibold">Scan to Pay</h3>
//               <QRCode value={upiQR} size={200} />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import React, { useState, useEffect, useRef } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import QRCode from 'react-qr-code';
import { Scan, Plus, Trash2, Send, CreditCard } from 'lucide-react';

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

export default function BillingPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState<number>(0);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [scanning, setScanning] = useState(false);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  const totalAmount = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const upiQR = `upi://pay?pa=example@upi&pn=YourCompany&am=${totalAmount.toFixed(
    2
  )}&cu=INR`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data: InventoryProduct[] = await res.json();
        setInventory(data);
      } catch (err) {
        console.error('Error fetching inventory:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!productName) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const q = productName.trim().toLowerCase();
    const filtered = inventory
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 8);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [productName, inventory]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!suggestionsRef.current) return;
      if (!suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleStartScanner = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera not supported 😢');
      return;
    }
    try {
      setCameraAllowed(true);
      setScanning(true);
    } catch (err) {
      console.error('Camera error:', err);
      alert('Unable to access camera. Refresh and try again.');
    }
  };

  const addToCart = (name: string, price: number, productId?: number) => {
    if (!name || price < 0) return;
    const item: CartItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      productId,
      name,
      quantity: 1,
      price,
    };
    setCart((prev) => [...prev, item]);
    setProductName('');
    setProductPrice(0);
    setShowSuggestions(false);
  };

  const onSelectSuggestion = (p: InventoryProduct) => {
    setProductName(p.name);
    setProductPrice(p.sellingPrice);
    addToCart(p.name, p.sellingPrice, p.id);
  };

  const handleManualAdd = () => {
    if (!productName || productPrice <= 0) {
      alert('Enter valid name and price');
      return;
    }
    const match = inventory.find(
      (inv) => inv.name.toLowerCase() === productName.trim().toLowerCase()
    );
    if (match) addToCart(match.name, match.sellingPrice, match.id);
    else addToCart(productName.trim(), productPrice, undefined);
  };

  const editCartItem = (
    id: number,
    field: 'name' | 'price' | 'quantity',
    value: string | number
  ) => {
    setCart(
      cart.map((c) => {
        if (c.id === id) {
          let newValue: any = value;
          if (field === 'quantity') newValue = parseInt(value as string) || 1;
          if (field === 'price') newValue = parseFloat(value as string) || c.price;
          return { ...c, [field]: newValue };
        }
        return c;
      })
    );
  };

  const deleteCartItem = (id: number) => setCart(cart.filter((c) => c.id !== id));

  const sendWhatsApp = () => {
    if (!whatsappNumber) return alert('Enter WhatsApp number');
    if (!selectedPayment) return alert('Select a payment method');

    const message = cart
      .map((p) => `${p.name} x${p.quantity} = ₹${(p.price * p.quantity).toFixed(2)}`)
      .join('\n');

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      `Hello! Here is your bill:\n${message}\nTotal: ₹${totalAmount.toFixed(
        2
      )}\nPayment Method: ${selectedPayment}`
    )}`;
    window.open(url, '_blank');
  };

  const handleScannerUpdate = (err: any, result: any) => {
    if (!result) return;
    const scannedValue = result.getText?.() ?? String(result);
    const asNum = parseInt(scannedValue, 10);
    let found: InventoryProduct | undefined;
    if (!isNaN(asNum)) found = inventory.find((p) => p.id === asNum);
    if (!found) {
      const lower = scannedValue.toLowerCase();
      found =
        inventory.find((p) => p.name.toLowerCase() === lower) ??
        inventory.find((p) => p.name.toLowerCase().includes(lower));
    }
    if (found) addToCart(found.name, found.sellingPrice, found.id);
    else addToCart(scannedValue, 0, undefined);
    setScanning(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Top Header Bar */}
      <div className="p-4 bg-white shadow-md flex justify-between items-center gap-3">
        <span className="font-bold text-[#5a4fcf] text-lg">Billing</span>
        <button
          onClick={() => (scanning ? setScanning(false) : handleStartScanner())}
          className="flex items-center gap-2 px-4 py-2 bg-[#5a4fcf] text-white rounded-xl font-semibold hover:bg-[#4a3faf]"
        >
          <Scan className="w-5 h-5" />
          {scanning ? 'Stop' : 'Scan'}
        </button>
      </div>

      {/* Main Content Area - Split Layout */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-4 p-4">
        
        {/* Left Side - Billing Section */}
        <div className="flex-1 overflow-y-auto">
          {/* Add Item */}
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm mb-5">
            <div className="flex flex-col gap-3">
              <div className="relative" ref={suggestionsRef}>
                <input
                  type="text"
                  placeholder="Search or enter product name"
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all"
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                    setShowSuggestions(true);
                  }}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 bg-white border-2 border-gray-200 mt-2 w-full rounded-xl shadow-lg max-h-64 overflow-auto">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => onSelectSuggestion(s)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">{s.name}</span>
                          <span className="text-[#5a4fcf] font-bold">₹{s.sellingPrice}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{s.quantity} in stock</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Price"
                  className="flex-1 border-2 border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all text-sm"
                  value={productPrice || ''}
                  onChange={(e) => setProductPrice(parseFloat(e.target.value) || 0)}
                />
                <button
                  onClick={handleManualAdd}
                  className="bg-green-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-600 transition-all shadow-md"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Cart */}
          <div className="space-y-3">
            {cart.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => editCartItem(product.id, 'name', e.target.value)}
                    className="border-2 border-gray-200 p-2 rounded-xl font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf]"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Qty:</span>
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => editCartItem(product.id, 'quantity', e.target.value)}
                          className="border-2 border-gray-200 p-2 rounded-xl w-14 text-center font-semibold outline-none focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] text-sm"
                          min="1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">₹</span>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => editCartItem(product.id, 'price', e.target.value)}
                          className="border-2 border-gray-200 p-2 rounded-xl w-20 text-right font-semibold outline-none focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] text-sm"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCartItem(product.id)}
                      className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Scanner Section */}
        <div className="lg:w-96 flex flex-col gap-4">
          {scanning && cameraAllowed && (
            <div className="bg-white p-4 rounded-xl border-2 border-[#5a4fcf] shadow-lg">
              <h3 className="font-bold text-[#5a4fcf] mb-3 text-center">Scanner Active</h3>
              <div className="overflow-hidden rounded-xl">
                <BarcodeScannerComponent
                  width="100%"
                  height={300}
                  onUpdate={handleScannerUpdate}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Send Bill + Payment Inline */}
      <div className="bg-white border-t-2 border-[#5a4fcf] shadow-2xl p-5">
        <div className="flex flex-col gap-3 max-w-5xl mx-auto">
          <div className="flex justify-between text-gray-700 text-lg font-semibold">
            <span>Grand Total</span>
            <span className="text-3xl font-bold text-[#5a4fcf]">₹{totalAmount.toFixed(2)}</span>
          </div>

          <input
            type="tel"
            placeholder="WhatsApp number (e.g., 919876543210)"
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
          />

          {/* Payment Options Inline */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <button
              onClick={sendWhatsApp}
              className="flex-1 bg-green-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg flex items-center justify-center gap-2 min-w-[140px]"
            >
              <Send className="w-5 h-5" />
              Send Bill in Whatsapp
            </button>

            <button
              onClick={() => setShowPaymentOptions(!showPaymentOptions)}
              className="bg-blue-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2 min-w-[120px]"
            >
              <CreditCard className="w-5 h-5" />
              Payment
            </button>

            {showPaymentOptions && (
              <div className="flex gap-2 flex-wrap mt-2">
                {['Cash', 'UPI', 'QR Code', 'Card'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedPayment(method)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      selectedPayment === method
                        ? 'bg-[#5a4fcf] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* QR Code display */}
          {selectedPayment === 'QR Code' && (
            <div className="p-4 bg-white border-2 border-[#5a4fcf] rounded-2xl mt-3">
              <h3 className="text-gray-900 font-bold mb-3 text-center">Scan to Pay</h3>
              <div className="flex justify-center">
                <QRCode value={upiQR} size={200} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}