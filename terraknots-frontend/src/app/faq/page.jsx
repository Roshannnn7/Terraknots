'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { Plus, Minus, Search } from 'lucide-react';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            q: "Are all products really 100% handmade?",
            a: "Yes! Every single item at TerraKnots is crafted by hand, knot by knot, or mold by mold. Because they are handmade, each piece is unique and may have slight variations from the pictures—that's the beauty of artisan-crafted goods!"
        },
        {
            q: "How long does it take for my order to ship?",
            a: "Since we are a small slow-made brand, standard orders usually ship within 2-4 business days. Custom orders take 7-10 days depending on the complexity of the design."
        },
        {
            q: "Do you take custom orders?",
            a: "Absolutely! We love bringing your visions to life. You can visit our 'Custom Orders' page to submit a request for specific colors, themes, or designs in crochet, resin, or clay."
        },
        {
            q: "What is your return policy?",
            a: "Due to the intimate, handmade nature of our products and the time invested in each piece, we generally do not accept returns unless the item is damaged during transit. Please check our Return Policy for more details."
        },
        {
            q: "How should I care for my crochet items?",
            a: "We recommend gentle hand wash with cold water and mild detergent. Lay them flat on a towel to dry. Avoid machine washing or wringing to maintain the shape and tension of the knots."
        },
        {
            q: "Are the resin items safe?",
            a: "Yes, we use high-quality, non-toxic, UV-resistant resin. However, we recommend kept them away from direct high heat and prolonged direct sunlight to prevent yellowing or softening over time."
        }
    ];

    return (
        <>
            <AnnouncementBar />
            <Navbar />
            <main className="min-h-screen bg-background py-20 px-6">
                <div className="max-w-3xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-heading font-bold text-dark">Curiosity Cabinet</h1>
                        <p className="text-light italic font-accent text-2xl">Answers to your most frequent questions.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={`group border transition-all duration-500 rounded-[2.5rem] overflow-hidden ${openIndex === idx ? 'bg-white border-primary/20 shadow-xl shadow-primary/5' : 'bg-transparent border-gray-100'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                    className="w-full px-10 py-8 flex items-center justify-between text-left"
                                >
                                    <span className={`text-lg font-bold transition-colors ${openIndex === idx ? 'text-primary' : 'text-dark'}`}>
                                        {faq.q}
                                    </span>
                                    <div className={`p-2 rounded-full transition-all ${openIndex === idx ? 'bg-primary text-white rotate-180' : 'bg-background text-light group-hover:text-primary'}`}>
                                        {openIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                                    </div>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-10 pb-10 border-t border-gray-50 pt-6">
                                        <p className="text-light font-medium leading-relaxed italic">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-10 bg-primary/5 rounded-[3rem] border border-primary/10 text-center space-y-4">
                        <h3 className="text-xl font-heading font-bold text-dark">Still have questions?</h3>
                        <p className="text-sm text-light italic">We're always here for a chat over tea and knots.</p>
                        <a href="/contact" className="inline-block btn-primary px-8 py-3 text-sm">Contact Us</a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
