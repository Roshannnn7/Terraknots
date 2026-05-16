'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import { loadRazorpay } from '@/lib/loadRazorpay';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ChevronRight, ShieldCheck, CheckCircle2 } from 'lucide-react';


const CheckoutPage = () => {
    const router = useRouter();
    const { cart, cartTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();

    const [loading, setLoading] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [settings, setSettings] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponData, setCouponData] = useState(null);
    const [guestEmail, setGuestEmail] = useState('');
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                setSettings(data.settings);
            } catch (error) { }
        };
        fetchSettings();

        if (user && user.address) {
            setShippingInfo({
                street: user.address.street || '',
                city: user.address.city || '',
                state: user.address.state || '',
                pincode: user.address.pincode || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const validateCoupon = async () => {
        if (!couponCode) return;
        try {
            const { data } = await api.post('/coupons/validate', { code: couponCode, cartTotal });
            setCouponData(data.coupon);
            toast.success('Coupon applied successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid coupon code');
            setCouponData(null);
        }
    };

    const calculateFinalTotal = () => {
        let total = cartTotal;
        let shipping = settings ? (cartTotal >= settings.freeShippingThreshold ? 0 : settings.shippingCharge) : 0;
        let cod = (paymentMethod === 'COD' && settings) ? settings.codCharge : 0;

        let discount = 0;
        if (couponData) {
            if (couponData.discountType === 'percentage') {
                discount = (total * couponData.discountValue) / 100;
            } else {
                discount = couponData.discountValue;
            }
        }

        return total + shipping + cod - discount;
    };

    const handlePlaceOrder = async () => {
        // Validation
        const { street, city, state, pincode, phone } = shippingInfo;
        if (!street || !city || !state || !pincode || !phone) {
            return toast.error('Please fill all shipping details');
        }

        if (!isAuthenticated && !guestEmail) {
            return toast.error('Please provide an email for order updates');
        }

        if (paymentMethod === 'UPI' && !transactionId) {
            return toast.error('Please provide the UPI Transaction ID after payment');
        }

        if (!cart.length) {
            return toast.error('Your cart is empty');
        }

        setLoading(true);

        try {
            const backendPaymentMethod = paymentMethod === 'Online' ? 'razorpay' : paymentMethod === 'UPI' ? 'upi_manual' : 'cod';

            // Build payload expected by backend API
            const items = cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            }));

            const shippingAddress = {
                fullName: user?.name || 'Customer',
                phone,
                addressLine1: shippingInfo.street,
                addressLine2: '',
                city: shippingInfo.city,
                state: shippingInfo.state,
                pincode: shippingInfo.pincode,
                landmark: '',
            };

            const orderPayload = {
                items,
                shippingAddress,
                paymentMethod: backendPaymentMethod,
                couponCode: couponData?.code || couponCode || undefined,
                guestEmail: isAuthenticated ? undefined : guestEmail,
                transactionId: backendPaymentMethod === 'upi_manual' ? transactionId : undefined,
            };

            // Create order first
            const { data: created } = await api.post('/orders', orderPayload);
            const createdOrder = created.order;

            if (backendPaymentMethod === 'cod' || backendPaymentMethod === 'upi_manual') {
                toast.success('Order placed successfully! 🎨');
                clearCart();
                router.push(`/order/success/${createdOrder._id}`);
                return;
            }

            // Online payment via Razorpay
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load');
                setLoading(false);
                return;
            }

            // Use amount calculated on backend to avoid mismatches
            const { data: orderRes } = await api.post('/payment/razorpay/create-order', {
                amount: createdOrder.totalAmount,
            });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderRes.order.amount,
                currency: orderRes.order.currency,
                name: 'TerraKnots',
                description: 'Handmade Jewelry & Decor',
                order_id: orderRes.order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/payment/razorpay/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: createdOrder._id,
                        });

                        if (verifyRes.data.success) {
                            // Refetch order so frontend sees updated payment status
                            const { data: finalOrderRes } = await api.get(`/orders/${createdOrder._id}`);
                            const finalOrder = finalOrderRes.order;

                            const confetti = (await import('canvas-confetti')).default;
                            confetti({
                                particleCount: 150,
                                spread: 70,
                                origin: { y: 0.6 },
                                colors: ['#C4A882', '#8B7355', '#A8B5A2'],
                            });

                            toast.success('Order placed successfully! 🎨');
                            clearCart();
                            router.push(`/order/success/${finalOrder._id}`);
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (error) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email || guestEmail,
                    contact: phone,
                },
                theme: {
                    color: '#C4A882',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error placing order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main className="pt-32 pb-24 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Left Column: Form Details */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="space-y-2">
                                <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark">Check Out</h1>
                                <p className="text-light text-sm italic">Almost there! Your unique treasures are waiting.</p>
                            </div>

                            {/* Shipping Information */}
                            <section className="bg-white p-8 rounded-[2rem] shadow-sm space-y-6">
                                <div className="flex items-center space-x-3 text-primary border-b border-gray-100 pb-4">
                                    <Truck size={22} />
                                    <h3 className="text-xl font-heading font-bold text-dark">Shipping Address</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {!isAuthenticated && (
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-light">Email Address (For order tracking)</label>
                                            <input
                                                type="email"
                                                value={guestEmail}
                                                onChange={(e) => setGuestEmail(e.target.value)}
                                                className="input-field"
                                                placeholder="hello@example.com"
                                            />
                                        </div>
                                    )}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-light">Street Address</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.street}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                                            className="input-field"
                                            placeholder="Flat, House no., Building, Company, Apartment"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-light">City</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.city}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                            className="input-field"
                                            placeholder="Your City"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-light">State</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.state}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                                            className="input-field"
                                            placeholder="Your State"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-light">Pincode</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.pincode}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                                            className="input-field"
                                            placeholder="6 digit PIN"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-light">Phone Number</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.phone}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                            className="input-field"
                                            placeholder="10 digit mobile number"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="bg-white p-8 rounded-[2rem] shadow-sm space-y-6">
                                <div className="flex items-center space-x-3 text-primary border-b border-gray-100 pb-4">
                                    <CreditCard size={22} />
                                    <h3 className="text-xl font-heading font-bold text-dark">Payment Method</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <button
                                        onClick={() => setPaymentMethod('UPI')}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'UPI' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <CreditCard size={24} className={paymentMethod === 'UPI' ? 'text-primary' : 'text-gray-400'} />
                                            {paymentMethod === 'UPI' && <CheckCircle2 size={20} className="text-primary" />}
                                        </div>
                                        <h4 className="font-bold text-dark text-sm">Manual UPI</h4>
                                        <p className="text-[10px] text-light mt-1">Zero Fee (QR/ID)</p>
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod('COD')}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <Truck size={24} className={paymentMethod === 'COD' ? 'text-primary' : 'text-gray-400'} />
                                            {paymentMethod === 'COD' && <CheckCircle2 size={20} className="text-primary" />}
                                        </div>
                                        <h4 className="font-bold text-dark text-sm">COD</h4>
                                        <p className="text-[10px] text-light mt-1">₹{settings?.codCharge || 30} fee</p>
                                    </button>
                                </div>

                                {paymentMethod === 'UPI' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 p-6 bg-background rounded-2xl border border-primary/20 space-y-4"
                                    >
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            <div className="bg-white p-2 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
                                                <img 
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=9035999354@axl&pn=TerraKnots&am=${calculateFinalTotal()}&cu=INR`)}`}
                                                    alt="UPI QR Code" 
                                                    className="w-32 h-32 object-contain"
                                                />
                                                <p className="text-[10px] font-bold text-primary leading-tight mt-2 text-center uppercase">SCAN TO PAY<br />9035999354@axl</p>
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <h4 className="text-sm font-bold text-dark">How to pay:</h4>
                                                <ol className="text-xs text-light space-y-1 list-decimal ml-4">
                                                    <li>Scan the QR or pay to <span className="text-primary font-bold">9035999354@axl</span></li>
                                                    <li>Transfer <span className="text-primary font-bold">{formatPrice(calculateFinalTotal())}</span></li>
                                                    <li>Note the Transaction ID from your UPI app</li>
                                                    <li>Enter the ID below and click Place Order</li>
                                                </ol>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light">UPI Transaction ID / Ref No.</label>
                                            <input
                                                type="text"
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                                className="input-field"
                                                placeholder="e.g. 450912345678"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </section>
                        </div>

                        {/* Right Column: Summary */}
                        <aside className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg sticky top-32 space-y-8">
                                <h3 className="text-2xl font-heading font-bold text-dark">Order Items</h3>

                                <div className="max-h-60 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
                                    {cart.map((item) => (
                                        <div key={item.product._id} className="flex items-center space-x-4">
                                            <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-background flex-shrink-0">
                                                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-dark truncate">{item.product.name}</h4>
                                                <p className="text-xs text-light font-medium italic">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-bold text-dark whitespace-nowrap">
                                                {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            className="flex-1 bg-background border-0 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <button
                                            onClick={validateCoupon}
                                            className="px-6 py-2 bg-dark text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {couponData && (
                                        <p className="text-xs text-green-600 mt-2 font-bold flex items-center italic">
                                            <CheckCircle2 size={12} className="mr-1" /> Code '{couponData.code}' Active!
                                        </p>
                                    )}
                                </div>

                                {/* Totals */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex justify-between text-sm text-light">
                                        <span>Subtotal</span>
                                        <span className="text-dark font-medium">{formatPrice(cartTotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-light">
                                        <span>Shipping</span>
                                        <span className="text-dark font-medium">
                                            {cartTotal >= (settings?.freeShippingThreshold || 499) ? 'FREE' : formatPrice(settings?.shippingCharge || 49)}
                                        </span>
                                    </div>
                                    {paymentMethod === 'COD' && (
                                        <div className="flex justify-between text-sm text-light">
                                            <span>COD Surcharge</span>
                                            <span className="text-dark font-medium">{formatPrice(settings?.codCharge || 30)}</span>
                                        </div>
                                    )}
                                    {couponData && (
                                        <div className="flex justify-between text-sm text-green-600 font-bold italic">
                                            <span>Discount</span>
                                            <span>-{formatPrice(
                                                couponData.discountType === 'percentage' 
                                                ? (cartTotal * couponData.discountValue) / 100 
                                                : couponData.discountValue
                                            )}</span>
                                        </div>
                                    )}
                                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-xl font-heading font-bold">Total Amount</span>
                                        <span className="text-3xl font-heading font-bold text-primary">{formatPrice(calculateFinalTotal())}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full btn-primary h-14 flex items-center justify-center space-x-3 text-lg"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Place Order Now</span>
                                            <ChevronRight size={20} />
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center space-x-2 text-[10px] text-light uppercase font-bold tracking-widest opacity-60">
                                    <ShieldCheck size={14} className="text-green-500" />
                                    <span>Payments encrypted for your safety</span>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
            <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #C4A882;
          border-radius: 10px;
        }
      `}</style>
        </>
    );
};

export default CheckoutPage;
