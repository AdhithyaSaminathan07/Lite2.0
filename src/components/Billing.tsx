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



'use client';

import { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

type Product = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

export default function BillingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState<number>(0);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [scanning, setScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraAllowed, setCameraAllowed] = useState(false);

  const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  // ✅ Fixed camera permission for mobile
  const handleStartScanner = async () => {
    try {
      const constraints = {
        video: {
          facingMode:
            facingMode === 'environment' ? { exact: 'environment' } : 'user',
        },
      };

      let stream: MediaStream;

      try {
        // Try with preferred camera mode
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        console.warn('Retrying with fallback constraints...');
        // Retry without facingMode if device doesn’t support it
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      // Stop the temporary stream after permission check
      stream.getTracks().forEach((track) => track.stop());

      setCameraAllowed(true);
      setScanning(true);
      console.log('✅ Camera permission granted successfully!');
    } catch (err: any) {
      console.error('Camera permission error ❌', err);
      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError'
      ) {
        alert('Please allow camera access in your browser settings 📱');
      } else if (err.name === 'NotFoundError') {
        alert('No camera found on this device 😢');
      } else {
        alert('Unable to access camera. Please refresh and try again.');
      }
    }
  };

  // Add product
  const addProduct = (name: string, price: number) => {
    if (!name || price <= 0) return;
    setProducts([...products, { id: Date.now(), name, quantity: 1, price }]);
    setProductName('');
    setProductPrice(0);
  };

  // Edit product
  const editProduct = (
    id: number,
    field: 'name' | 'price' | 'quantity',
    value: string | number
  ) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const newValue =
            field === 'quantity'
              ? typeof value === 'string'
                ? parseInt(value)
                : value
              : value;
          return { ...p, [field]: isNaN(Number(newValue)) ? p[field] : newValue };
        }
        return p;
      })
    );
  };

  // Delete product
  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // WhatsApp message
  const sendWhatsApp = () => {
    if (!whatsappNumber) {
      alert('Please enter a WhatsApp number.');
      return;
    }
    const message = products
      .map((p) => `${p.name} x${p.quantity} = ₹${p.price * p.quantity}`)
      .join('\n');
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      `Hello! Here is your bill:\n${message}\nTotal: ₹${totalAmount}`
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="p-4 sm:p-6 lg:p-8 flex-grow pb-24">
        <h1 className="text-2xl font-bold mb-4" style={{ color: '#5a4fcf' }}>
          Billing Page
        </h1>

        {/* Barcode Scanner */}
        <div className="mb-6 border p-4 rounded-lg bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Barcode Scanner</h2>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => (scanning ? setScanning(false) : handleStartScanner())}
              className="flex-1 bg-[#5a4fcf] text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              {scanning ? 'Stop Scanner' : 'Start Scanner'}
            </button>
            <button
              onClick={() =>
                setFacingMode(facingMode === 'user' ? 'environment' : 'user')
              }
              className="bg-[#5a4fcf] text-white p-2 rounded hover:bg-indigo-700 transition-colors"
              title="Switch Camera"
            >
              {facingMode === 'user' ? 'Back' : 'Front'}
            </button>
          </div>

          {scanning && cameraAllowed && (
            <div className="w-full max-w-sm mx-auto overflow-hidden rounded-lg border-2 border-[#5a4fcf]">
              <BarcodeScannerComponent
                width={300}
                height={200}
                constraints={{ video: { facingMode } }}
                onUpdate={(err, result) => {
                  if (result) {
                    const scannedValue = result.getText();
                    addProduct(scannedValue, 100);
                    setScanning(false);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Manual Add Product */}
        <div className="mb-6 p-4 rounded-lg bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Add Item Manually</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Product Name"
              className="border p-2 rounded flex-1 focus:ring-[#5a4fcf] focus:border-[#5a4fcf]"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className="border p-2 rounded w-24 focus:ring-[#5a4fcf] focus:border-[#5a4fcf]"
              value={productPrice || ''}
              onChange={(e) =>
                setProductPrice(parseFloat(e.target.value) || 0)
              }
            />
            <button
              onClick={() => addProduct(productName, productPrice)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold mb-2">Cart Items</h2>
          {products.length === 0 && (
            <p className="text-gray-500">No items in the cart.</p>
          )}
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap sm:flex-row sm:items-center justify-between border p-3 rounded-lg bg-white shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) =>
                    editProduct(product.id, 'name', e.target.value)
                  }
                  className="border p-1 rounded flex-1 w-full sm:w-auto min-w-[100px]"
                />
                <span className="text-gray-600 hidden sm:inline-block">Qty:</span>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    editProduct(product.id, 'quantity', e.target.value)
                  }
                  className="border p-1 rounded w-16 text-center"
                  min="1"
                />
                <span className="text-gray-600 hidden sm:inline-block">@ ₹</span>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) =>
                    editProduct(product.id, 'price', e.target.value)
                  }
                  className="border p-1 rounded w-20 text-right"
                />
              </div>

              <div className="flex items-center gap-4 mt-2 sm:mt-0 w-full sm:w-auto justify-between">
                <div className="font-semibold text-gray-700">
                  Total: ₹{(product.price * product.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#5a4fcf] p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          <div
            className="font-extrabold text-xl text-right"
            style={{ color: '#5a4fcf' }}
          >
            Total: ₹{totalAmount.toFixed(2)}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="tel"
              placeholder="Enter WhatsApp number (e.g., 919876543210)"
              className="border p-2 rounded flex-1 focus:ring-[#5a4fcf] focus:border-[#5a4fcf]"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
            />
            <button
              onClick={sendWhatsApp}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors w-full sm:w-auto"
            >
              Send Bill via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
