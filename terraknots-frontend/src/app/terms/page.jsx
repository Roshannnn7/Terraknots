'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { Gavel, AlertCircle, ShoppingBag, Globe } from 'lucide-react';

export default function TermsPage() {
    return (
        <>
            <AnnouncementBar />
            <Navbar />
            <main className="min-h-screen bg-background py-20 px-6">
                <div className="max-w-4xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-heading font-bold text-dark">Terms of the Loom</h1>
                        <p className="text-light italic font-accent text-2xl">The agreement between you and our workshop.</p>
                    </div>

                    <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-gray-100 shadow-sm space-y-12 text-light text-sm leading-[1.8] font-medium">

                        <section className="space-y-4">
                            <div className="flex items-center space-x-3 text-dark">
                                <Globe size={20} />
                                <h2 className="text-xl font-heading font-bold">General Conditions</h2>
                            </div>
                            <p>By visiting our site and/or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions. We reserve the right to refuse service to anyone for any reason at any time.</p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center space-x-3 text-dark">
                                <ShoppingBag size={20} />
                                <h2 className="text-xl font-heading font-bold">Accuracy of Craft</h2>
                            </div>
                            <p>We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor’s display of any color will be accurate. All descriptions of products or product pricing are subject to change at any time without notice.</p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center space-x-3 text-dark">
                                <AlertCircle size={20} />
                                <h2 className="text-xl font-heading font-bold">User Comments & Feedback</h2>
                            </div>
                            <p>If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.</p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center space-x-3 text-dark">
                                <Gavel size={20} />
                                <h2 className="text-xl font-heading font-bold">Governing Law</h2>
                            </div>
                            <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India, specifically within the jurisdiction of Mumbai, Maharashtra.</p>
                        </section>

                        <div className="p-8 bg-background rounded-3xl border-2 border-dashed border-gray-100 text-center italic text-xs">
                            By using TerraKnots, you weave your trust into our stories. Thank you.
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
