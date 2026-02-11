'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { RefreshCcw, ShieldCheck, Heart, AlertTriangle } from 'lucide-react';

export default function ReturnPolicy() {
    return (
        <>
            <AnnouncementBar />
            <Navbar />
            <main className="min-h-screen bg-background py-20 px-6">
                <div className="max-w-4xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-heading font-bold text-dark">Happiness Guarantee</h1>
                        <p className="text-light italic font-accent text-2xl">Returns and exchanges for slow-made treasures.</p>
                    </div>

                    <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-gray-100 shadow-sm space-y-12">
                        <div className="flex flex-col md:flex-row gap-10">
                            <div className="flex-1 space-y-8">
                                <div className="flex items-center space-x-3 text-terracotta">
                                    <Heart size={24} />
                                    <h2 className="text-2xl font-heading font-bold">The Handmade Clause</h2>
                                </div>
                                <p className="text-light text-sm leading-relaxed italic">
                                    TerraKnots products are 100% handmade. This means minor variations in color, texture, and shape are not defects, but the fingerprints of the artisan. We do not accept returns based on these unique characteristics.
                                </p>
                            </div>

                            <div className="flex-1 space-y-8">
                                <div className="flex items-center space-x-3 text-red-400">
                                    <AlertTriangle size={24} />
                                    <h2 className="text-2xl font-heading font-bold">Damage in Transit</h2>
                                </div>
                                <p className="text-light text-sm leading-relaxed">
                                    If your treasure arrives damaged, please record an <strong>unboxing video</strong> within 24 hours and email us at <i>hello@terraknots.com</i>. We will promptly arrange for a replacement or a store credit after verification.
                                </p>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-gray-50 space-y-8">
                            <h3 className="text-xl font-heading font-bold text-dark uppercase tracking-widest text-center">Process Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { step: "01", text: "Notify us via email with photos/video within 24h of receipt." },
                                    { step: "02", text: "Wait for our team to verify the handcrafted nature and damage." },
                                    { step: "03", text: "Upon approval, we ship a fresh treasure or issue store credit." }
                                ].map((s, idx) => (
                                    <div key={idx} className="p-8 bg-background rounded-3xl space-y-4 text-center">
                                        <span className="text-3xl font-heading font-bold text-primary opacity-30">{s.step}</span>
                                        <p className="text-xs font-bold text-dark leading-relaxed uppercase tracking-wider">{s.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10 text-center">
                            <div className="flex items-center justify-center space-x-3 mb-2 text-primary">
                                <ShieldCheck size={20} />
                                <span className="text-sm font-bold uppercase tracking-[0.2em]">Secure Craftsmanship</span>
                            </div>
                            <p className="text-xs text-light italic">We want you to love your TerraKnots piece as much as we loved making it.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
