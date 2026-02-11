'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <>
            <AnnouncementBar />
            <Navbar />
            <main className="min-h-screen bg-background py-20 px-6">
                <div className="max-w-4xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-heading font-bold text-dark">Your Privacy</h1>
                        <p className="text-light italic font-accent text-2xl">How we protect your trust and data.</p>
                    </div>

                    <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-gray-100 shadow-sm space-y-12 text-light text-sm leading-[1.8] font-medium">
                        <section className="space-y-4">
                            <div className="flex items-center space-x-3 text-dark">
                                <Eye size={20} />
                                <h2 className="text-xl font-heading font-bold">What we collect</h2>
                            </div>
                            <p>When you purchase something from our store, we collect the personal information you give us such as your name, address and email address. When you browse our store, we also automatically receive your computer’s internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.</p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center space-x-3 text-dark">
                                <Lock size={20} />
                                <h2 className="text-xl font-heading font-bold">Consent</h2>
                            </div>
                            <p>How do you get my consent? When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.</p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center space-x-3 text-dark">
                                <Shield size={20} />
                                <h2 className="text-xl font-heading font-bold">Disclosure</h2>
                            </div>
                            <p>We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.</p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center space-x-3 text-dark">
                                <FileText size={20} />
                                <h2 className="text-xl font-heading font-bold">Third-Party Services</h2>
                            </div>
                            <p>In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us (e.g. Razorpay for payments, Courier partners for shipping).</p>
                        </section>

                        <div className="p-8 bg-background rounded-3xl border-2 border-dashed border-gray-100 text-center italic text-xs">
                            Last updated: October 2024. For questions, contact hello@terraknots.com
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
