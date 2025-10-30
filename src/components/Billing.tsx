'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import QRCode from 'react-qr-code';
import {
  Scan, Trash2, Edit2, Check, X, AlertTriangle, Send,
  CreditCard, CheckCircle, DollarSign, RefreshCw, MessageSquare
} from 'lucide-react';

// --- GST UPDATE: Helper functions for currency and GST calculation ---
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
};

const calculateGstDetails = (sellingPrice: number, gstRate: number) => {
  const price = Number(sellingPrice) || 0;
  const rate = Number(gstRate) || 0;
  const gstAmount = (price * rate) / 100;
  const totalPrice = price + gstAmount;
  return { gstAmount, totalPrice };
};

// --- TYPE DEFINITIONS ---
type CartItem = {
  id: number;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
  isEditing?: boolean;
};

type InventoryProduct = {
  id: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  gstRate: number;
  image?: string;
  sku?: string;
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
  const [scanning, setScanning] = useState(false);
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showWhatsAppSharePanel, setShowWhatsAppSharePanel] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [merchantUpi, setMerchantUpi] = useState('');
  const [merchantName, setMerchantName] = useState('Billzzy Lite');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [amountGiven, setAmountGiven] = useState<number | ''>('');
  const [isMessaging, setIsMessaging] = useState(false);
  const [scannerError, setScannerError] = useState<string>('');
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string | React.ReactNode; onConfirm?: (() => void); confirmText: string; showCancel: boolean; }>({ isOpen: false, title: '', message: '', confirmText: 'OK', showCancel: false });
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  const totalAmount = useMemo(() =>
    cart.reduce((sum, item) => {
      const { totalPrice } = calculateGstDetails(item.price, item.gstRate);
      return sum + totalPrice * item.quantity;
    }, 0),
    [cart]
  );

  const balance = useMemo(() => {
    const total = totalAmount;
    const given = Number(amountGiven);
    return given > 0 ? given - total : 0;
  }, [totalAmount, amountGiven]);

  const upiQR = merchantUpi ? `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=Bill%20Payment` : '';

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const savedData = localStorage.getItem(`userSettings-${session.user.email}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setMerchantUpi(parsedData.merchantUpiId || '');
        setMerchantName(parsedData.shopName || 'Billzzy Lite');
      }
    }
  }, [status, session]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    (async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          console.warn('Inventory API not available, using empty inventory');
          setInventory([]); return;
        }
        const data: InventoryProduct[] = await res.json();
        const productsWithGst = data.map(p => ({ ...p, gstRate: p.gstRate || 0 }));
        setInventory(productsWithGst);
      } catch (err) {
        console.warn('Failed to fetch inventory, using empty array:', err);
        setInventory([]);
      }
    })();
  }, [status]);

  useEffect(() => {
    if (!productName.trim()) { setShowSuggestions(false); return; }
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

  const sendWhatsAppMessage = async (phoneNumber: string, messageType: string) => {
    if (!phoneNumber.trim() || !/^\d{10,15}$/.test(phoneNumber)) {
      setModal({ isOpen: true, title: 'Invalid Number', message: 'Please enter a valid WhatsApp number including the country code (e.g., 919876543210).', showCancel: false, confirmText: 'Got it', onConfirm: undefined });
      return false;
    }
    setIsMessaging(true);
    try {
      const formattedPhone = phoneNumber.startsWith('91') ? phoneNumber : `91${phoneNumber}`;
      const orderId = `INV-${Date.now().toString().slice(-6)}`;
      const itemsList = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
      let templateName = '';
      let bodyParameters: string[] = [];
      switch (messageType) {
        case 'finalizeBill': templateName = "invoice_with_payment"; bodyParameters = [merchantName, `₹${totalAmount.toFixed(2)}`, itemsList]; break;
        case 'cashPayment': templateName = "payment_receipt_cashh"; bodyParameters = [orderId, merchantName, `₹${totalAmount.toFixed(2)}`, itemsList]; break;
        case 'qrPayment': templateName = "payment_receipt_upii"; bodyParameters = [orderId, merchantName, `₹${totalAmount.toFixed(2)}`, itemsList]; break;
        case 'cardPayment': templateName = "payment_receipt_card"; bodyParameters = [orderId, merchantName, `₹${totalAmount.toFixed(2)}`, itemsList]; break;
        default: throw new Error(`Invalid message type: ${messageType}`);
      }
      const messageData = { messaging_product: "whatsapp", recipient_type: "individual", to: formattedPhone, type: "template", template: { name: templateName, language: { code: "en" }, components: [{ type: "body", parameters: bodyParameters.map(text => ({ type: "text", text })) }] } };
      const response = await fetch('/api/whatsapp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(messageData) });
      const result = await response.json();
      if (!response.ok) { throw new Error(result.message || `HTTP ${response.status}: Failed to send message`); }
      if (!result.success) { throw new Error(result.message || 'WhatsApp API returned success: false'); }
      console.log(`${messageType} message sent successfully using template: ${templateName}`);
      return true;
    } catch (error) {
      console.error("WhatsApp API error:", error);
      setModal({ isOpen: true, title: 'Messaging Error', message: `Failed to send WhatsApp message: ${error instanceof Error ? error.message : 'Unknown error'}.`, showCancel: false, confirmText: 'OK', onConfirm: undefined });
      return false;
    } finally { setIsMessaging(false); }
  };

  const handleProceedToPaymentWithWhatsApp = async () => {
    if (!whatsAppNumber || !whatsAppNumber.trim()) {
      setModal({
        isOpen: true,
        title: 'Enter Number',
        message: 'Please enter a WhatsApp number to send the bill.',
        showCancel: false,
        confirmText: 'OK',
      });
      return;
    }

    const success = await sendWhatsAppMessage(whatsAppNumber, 'finalizeBill');
    if (success) {
      setShowWhatsAppSharePanel(false);
      setShowPaymentOptions(true);
      setModal({
        isOpen: true,
        title: 'Bill Shared',
        message: 'The invoice has been sent to the customer via WhatsApp. Proceeding to payment...',
        showCancel: false,
        confirmText: 'OK',
      });
    }
  };

  const sendWhatsAppReceipt = async (paymentMethod: string) => {
    let templateType = '';
    switch (paymentMethod) { case 'cash': templateType = 'cashPayment'; break; case 'qr-code': templateType = 'qrPayment'; break; case 'card': templateType = 'cardPayment'; break; default: templateType = 'cashPayment'; }
    return await sendWhatsAppMessage(whatsAppNumber, templateType);
  };

  const addToCart = useCallback((name: string, price: number, gstRate: number, productId?: string, isEditing = false) => {
    if (!name || price < 0) return;
    setCart(prev => {
      const existingItem = productId ? prev.find(item => item.productId === productId) : null;
      if (existingItem) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [{ id: Date.now(), productId, name, quantity: 1, price, gstRate, isEditing }, ...prev];
    });
    setProductName('');
    setShowSuggestions(false);
  }, []);

  const handleScan = useCallback((results: IDetectedBarcode[]) => {
    if (results && results[0]) {
      const scannedValue = results[0].rawValue;
      const foundProduct = inventory.find(p => p.id === scannedValue || p.sku?.toLowerCase() === scannedValue.toLowerCase() || p.name.toLowerCase() === scannedValue.toLowerCase());
      if (foundProduct) {
        addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.gstRate, foundProduct.id);
        setScanning(false);
      } else {
        addToCart(scannedValue, 0, 0, undefined, true);
        setScanning(false);
      }
    }
  }, [inventory, addToCart]);

  const handleScanError = useCallback((error: unknown) => {
    console.log('Scanner error:', error);
    setScannerError(error instanceof Error ? error.message : 'Unknown scanner error');
    if (error instanceof Error) {
      if (error.name === 'NotFoundError') { setModal({ isOpen: true, title: 'Camera Not Found', message: 'No camera device found. Please check if your camera is connected and permissions are granted.', showCancel: false, confirmText: 'OK', onConfirm: undefined }); }
      else if (error.name === 'NotAllowedError') { setModal({ isOpen: true, title: 'Camera Permission Denied', message: 'Camera access was denied. Please allow camera permissions in your browser settings.', showCancel: false, confirmText: 'OK', onConfirm: undefined }); }
    }
  }, []);

  const handleManualAdd = useCallback(() => {
    const name = productName.trim();
    if (!name) { setModal({ isOpen: true, title: 'Item Name Required', message: 'Please enter a name for the custom item.', showCancel: false, confirmText: 'OK' }); return; }
    addToCart(name, 0, 0, undefined, true);
  }, [productName, addToCart]);

  const deleteCartItem = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  const toggleEdit = (id: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, isEditing: !item.isEditing } : { ...item, isEditing: false }));
  const updateCartItem = (id: number, updatedValues: Partial<CartItem>) => setCart(prev => prev.map(item => item.id === id ? { ...item, ...updatedValues } : item));

  const handleTransactionDone = useCallback(() => {
    setCart([]); setSelectedPayment(''); setShowWhatsAppSharePanel(false); setShowPaymentOptions(false); setWhatsAppNumber(''); setAmountGiven(''); setModal({ ...modal, isOpen: false });
  }, [modal]);

  const handleProceedToPayment = useCallback(() => {
    if (whatsAppNumber && !/^\d{10,15}$/.test(whatsAppNumber.trim())) { setModal({ isOpen: true, title: 'Invalid Number', message: 'The number you entered is not valid. Please correct it or leave it blank.', confirmText: 'OK', onConfirm: undefined, showCancel: false }); return; }
    setShowWhatsAppSharePanel(false); setShowPaymentOptions(true);
  }, [whatsAppNumber]);

  const handlePaymentSuccess = useCallback(async () => {
    const updatePromises = cart.filter(item => item.productId).map(item => fetch(`/api/products/${item.productId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantityToDecrement: item.quantity }) }));
    await Promise.all(updatePromises).catch(err => console.error("Inventory update failed:", err));
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          paymentMethod: selectedPayment
        })
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
    let receiptSent = false;
    if (whatsAppNumber && whatsAppNumber.trim()) {
      try {
        receiptSent = await sendWhatsAppReceipt(selectedPayment);
      } catch (error) {
        console.error('Failed to send WhatsApp receipt:', error);
        receiptSent = false;
      }
    }
    setModal({
      isOpen: true,
      title: 'Success!',
      message: receiptSent ? 'Transaction completed! Receipt sent to customer via WhatsApp and inventory updated.' : 'Transaction completed and inventory updated. Ready for a new bill.',
      confirmText: 'New Bill',
      onConfirm: handleTransactionDone,
      showCancel: false
    });
  }, [selectedPayment, totalAmount, cart, handleTransactionDone, whatsAppNumber]);

  const handleStartNewBill = useCallback(() => {
    if (cart.length === 0) return;
    setModal({ isOpen: true, title: 'Clear Bill?', message: 'This will clear all items from the current bill. Are you sure?', showCancel: true, confirmText: 'Yes, Clear', onConfirm: () => setCart([]) });
  }, [cart.length]);

  const toggleScanner = useCallback(() => {
    setScanning(prev => { if (!prev) { setScannerError(''); } return !prev; });
  }, []);

  return (
    <>
      {/* 
        --- LAYOUT MODIFICATION ---
        This main container uses a flex column layout to structure the page.
        - `h-full`: Makes the container fill the height of its parent (the main content area of your app).
        - `flex flex-col`: Arranges children vertically (header, main, footer).
        - `bg-[#f9f9fb]`: Sets the background color.
      */}
      <div className="flex flex-col h-full w-full bg-[#f9f9fb] font-sans">
        
        {/* 
          --- STATIC HEADER ---
          - `flex-shrink-0`: Prevents this header from shrinking when content grows.
        */}
        <header className="flex-shrink-0 flex items-center justify-between bg-white px-4 py-3 shadow-sm z-20">
          <h1 className="text-xl font-bold text-[#5a4fcf]">Billing Page</h1>
          <div className="flex items-center gap-4">
            <button onClick={handleStartNewBill} disabled={cart.length === 0} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 disabled:text-gray-300" title="Start New Bill"><RefreshCw size={20} /></button>
            <button onClick={toggleScanner} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow transition-colors ${scanning ? 'bg-red-500 hover:bg-red-600' : 'bg-[#5a4fcf] hover:bg-[#4c42b8]'}`}>
              {scanning ? <X size={18} /> : <Scan size={18} />} <span>{scanning ? 'Close' : 'Scan'}</span>
            </button>
          </div>
        </header>

        {/* 
          --- SCROLLABLE MAIN CONTENT ---
          - `flex-1`: Allows this main area to grow and fill all available space between the header and footer.
          - `overflow-y-auto`: Makes ONLY this section scrollable if the cart items exceed the available space.
        */}
        <main className="flex-1 overflow-y-auto p-4 space-y-3">
          {scanning && (
            <div className="bg-white rounded-xl p-3 shadow-sm mb-4">
              <div className="max-w-xs mx-auto">
                <Scanner
                  constraints={{ facingMode: 'environment' }}
                  onScan={handleScan}
                  onError={handleScanError}
                  scanDelay={300}
                  styles={{ container: { width: '100%', height: 160, borderRadius: '8px', overflow: 'hidden' } }}
                />
              </div>
              {scannerError && <p className="text-center text-sm text-red-500 mt-2">{scannerError}</p>}
            </div>
          )}

          <div className="flex gap-2">
            <div ref={suggestionsRef} className="relative flex-grow">
              <input type="text" placeholder="Search by name or add custom item..." className="w-full rounded-xl border p-3 shadow-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none" value={productName} onChange={(e) => setProductName(e.target.value)} />
              {showSuggestions && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border bg-white shadow-lg">
                  {suggestions.map((s) => (
                    <div key={s.id} onClick={() => addToCart(s.name, s.sellingPrice, s.gstRate, s.id)} className="cursor-pointer border-b p-3 hover:bg-[#f1f0ff]">
                      <div className="flex justify-between font-semibold text-gray-800"><span>{s.name}</span><span>{formatCurrency(s.sellingPrice)}</span></div>
                      {s.sku && <p className="text-xs text-gray-500">ID: {s.sku}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleManualAdd} className="flex-shrink-0 rounded-lg bg-[#5a4fcf] text-white font-semibold px-5 py-3 hover:bg-[#4c42b8]">Add</button>
          </div>
          <div className="space-y-2">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 mt-8 py-8"><div className="text-4xl mb-2">🛒</div><p>Your cart is empty</p><p className="text-sm mt-1">Scan an item or add it manually</p></div>
            ) : (
              cart.map((item) => {
                const { gstAmount, totalPrice } = calculateGstDetails(item.price, item.gstRate);
                const totalItemPrice = totalPrice * item.quantity;

                return (
                  <div key={item.id} className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {item.isEditing ? (
                          <div className="flex items-center gap-2">
                            <input type="text" value={item.name} onChange={(e) => updateCartItem(item.id, { name: e.target.value })} className="border rounded-lg p-1 w-2/4 text-sm" />
                            <input type="number" value={item.quantity} onChange={(e) => updateCartItem(item.id, { quantity: parseInt(e.target.value, 10) || 1 })} className="border rounded-lg p-1 w-1/4 text-sm" />
                            <input type="number" value={item.price} onChange={(e) => updateCartItem(item.id, { price: parseFloat(e.target.value) || 0 })} className="border rounded-lg p-1 w-1/4 text-sm" />
                          </div>
                        ) : (
                          <>
                            <p className="font-semibold text-gray-800 break-words">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} &times; {formatCurrency(totalPrice)}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="flex gap-3 items-center ml-2">
                        <span className="text-base font-bold text-right text-gray-800">{formatCurrency(totalItemPrice)}</span>
                        <button onClick={() => toggleEdit(item.id)} className={`${item.isEditing ? 'text-green-600' : 'text-[#5a4fcf]'}`}>
                          {item.isEditing ? <Check size={18} /> : <Edit2 size={18} />}
                        </button>
                        <button onClick={() => deleteCartItem(item.id)} className="text-red-500"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    {!item.isEditing && item.gstRate > 0 && (
                      <div className="text-xs text-gray-600 bg-gray-50 rounded-md p-2 mt-2 border">
                        Price: {formatCurrency(item.price)} + GST ({item.gstRate}%): {formatCurrency(gstAmount)}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
        
        {/* 
          --- STATIC FOOTER ---
          - `flex-shrink-0`: Prevents this footer from shrinking, keeping it visible at the bottom.
        */}
        <footer className="flex-shrink-0 bg-white p-4 shadow-[0_-2px_5px_rgba(0,0,0,0.05)] border-t space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Grand Total</span>
            <span className="text-2xl font-bold text-[#5a4fcf]">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="space-y-3 border-t pt-4">
            {!showWhatsAppSharePanel && !showPaymentOptions && (
              <button
                onClick={() => { if (cart.length === 0) { setModal({ isOpen: true, title: 'Cart Empty', message: 'Please add items to the cart before finalizing.', confirmText: 'OK', showCancel: false }); return; } setShowWhatsAppSharePanel(true); setShowPaymentOptions(false); }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5a4fcf] py-3 font-semibold text-white hover:bg-[#4c42b8] disabled:bg-gray-400"
                disabled={cart.length === 0}
              >
                <CreditCard size={16} /><span>Finalize & Pay</span>
              </button>
            )}
            {showWhatsAppSharePanel && cart.length > 0 && (
              <div className="space-y-3 rounded-lg bg-gray-50 p-3 pt-2">
                <div className="flex gap-2 items-center">
                  <input type="tel" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} placeholder="WhatsApp Number (Optional)" className="flex-grow rounded-lg border-2 border-gray-300 p-2 outline-none focus:border-green-500" />
                </div>
                {whatsAppNumber.trim() && (
                  <div className="text-xs text-gray-600 bg-white rounded-lg p-3 border">
                    <p className="font-medium mb-1">Customer will receive:</p>
                    <ul className="list-disc pl-4 space-y-1"><li>Itemized bill with quantities</li><li>Total amount due ({formatCurrency(totalAmount)})</li><li>Shop name: {merchantName}</li></ul>
                  </div>
                )}
                <button onClick={handleProceedToPaymentWithWhatsApp} disabled={isMessaging} className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-600 py-2 px-3 font-semibold text-white transition-all hover:bg-gray-700 disabled:bg-gray-400">
                  {isMessaging ? (<div className="flex items-center gap-2"><div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div><span>Sending...</span></div>) : (<><MessageSquare size={16} /><span>{whatsAppNumber.trim() ? 'Send & Proceed to Payment' : 'Proceed to Payment'}</span></>)}
                </button>
              </div>
            )}
            {showPaymentOptions && cart.length > 0 && (
              <div className="space-y-3 border-t pt-4">
                <div className="flex flex-wrap gap-2">{['cash', 'qr-code', 'card'].map(method => (<button key={method} onClick={() => setSelectedPayment(method)} className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${selectedPayment === method ? 'bg-[#5a4fcf] text-white' : 'bg-gray-200 text-gray-700'}`}>{method.replace('-', ' ')}</button>))}</div>
                {selectedPayment === 'cash' && (
                  <div className="rounded-lg bg-gray-50 p-3 space-y-2">
                    <p className="text-sm text-center">Confirm receipt of <b>{formatCurrency(totalAmount)}</b> cash.</p>
                    <div className="flex items-center gap-2">
                      <input id="amountGiven" type="number" placeholder="Amount Given" value={amountGiven} onChange={(e) => setAmountGiven(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-1/2 rounded-lg border p-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] outline-none" />
                      <div className="w-1/2 p-2 rounded-lg bg-white border flex justify-between items-center"><span className="text-xs text-gray-500">Balance:</span><span className={`font-semibold text-sm ${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(balance)}</span></div>
                    </div>
                    <button onClick={handlePaymentSuccess} disabled={isMessaging} className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5a4fcf] p-2.5 font-bold text-white disabled:bg-[#5a4fcf]/70">{isMessaging ? (<div className="flex items-center gap-2"><div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div><span>Processing...</span></div>) : (<><DollarSign size={18} /><span>Confirm Cash Payment</span></>)}</button>
                  </div>
                )}
                {selectedPayment === 'qr-code' && (
                  <div className="rounded-lg bg-gray-50 p-4 text-center">{upiQR ? (<><div className="mx-auto max-w-[180px]"><QRCode value={upiQR} style={{ height: 'auto', width: '100%' }} /></div><p className="mt-2 text-sm">Scan to pay <b>{merchantUpi}</b></p><button onClick={handlePaymentSuccess} disabled={isMessaging} className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 p-3 font-bold text-white disabled:bg-green-400">{isMessaging ? (<div className="flex items-center gap-2"><div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div><span>Processing...</span></div>) : (<><CheckCircle size={20} /><span>Confirm Payment Received</span></>)}</button></>) : (<p className="font-semibold text-red-600">UPI ID not configured.</p>)}</div>
                )}
                {selectedPayment === 'card' && (
                  <div className="rounded-lg bg-gray-50 p-4 text-center"><p className="text-sm">Confirm card transaction was successful.</p><button onClick={handlePaymentSuccess} disabled={isMessaging} className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 p-3 font-bold text-white disabled:bg-purple-400">{isMessaging ? (<div className="flex items-center gap-2"><div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div><span>Processing...</span></div>) : (<><CreditCard size={20} /><span>Confirm Card Payment</span></>)}</button></div>
                )}
              </div>
            )}
          </div>
        </footer>
      </div>
      <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false, message: '' })} title={modal.title} onConfirm={modal.onConfirm} confirmText={modal.confirmText} showCancel={modal.showCancel}>{modal.message}</Modal>
    </>
  );
}