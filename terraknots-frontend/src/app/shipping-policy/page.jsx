'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { Truck, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function ShippingPolicy() {
    return (
        <>
            <AnnouncementBar />
            <Navbar />
            <main className="min-h-screen bg-background py-20 px-6">
                <div className="max-w-4xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-heading font-bold text-dark">Journey to You</h1>
                        <p className="text-light italic font-accent text-2xl">How we ship our handmade treasures.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-dark">Processing Time</h3>
                            <p className="text-light text-sm leading-relaxed">
                                Every piece is checked and packed with care by the maker themselves.
                                Standard items ship within <strong>2-4 business days</strong>.
                                Custom orders require <strong>7-12 business days</strong> as they are made from scratch just for you.
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                            <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
                                <Truck size={24} />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-dark">Delivery Rates</h3>
                            <p className="text-light text-sm leading-relaxed">
                                Standard delivery within India: <strong>₹49</strong> per order.<br />
                                Enjoy <strong>FREE SHIPPING</strong> on all treasures above <strong>₹499</strong>.<br />
                                Cash on Delivery (COD) is available with an additional <strong>₹30</strong> collection fee.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-10 md:p-14 rounded-[4rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-terracotta/10 text-terracotta rounded-2xl">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-3xl font-heading font-bold text-dark">Coverage & Tracking</h3>
                        </div>

                        <div className="space-y-6 text-light text-sm leading-relaxed italic">
                            <p>We ship across India using reliable courier partners like Delhivery, BlueDart, and DTDC. Once your order leaves the workshop, you will receive an email with a tracking ID.</p>
                            <ul className="space-y-4 list-disc pl-6 marker:text-primary">
                                <li>Delivery usually takes 3-7 business days after shipping, depending on your location.</li>
                                <li>Please ensure the delivery address is correct. We cannot redirect shipments once they are in transit.</li>
                                <li>In case of a non-delivery due to an incorrect address or refusal, a re-shipping fee may apply.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center italic text-light text-xs font-medium uppercase tracking-[0.2em]">
                        Handmade with love • Delivered with care
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
