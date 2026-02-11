'use client';

import { Bell, Search, Globe, User, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const AdminTopbar = () => {
    const [notifications] = useState(3);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
            {/* SearchBar */}
            <div className="flex-1 max-w-md relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Quick search commands..."
                    className="w-full bg-background border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 placeholder:text-light/50 outline-none"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-6">
                {/* Visit Site */}
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-100 text-sm font-bold text-light hover:bg-primary/5 hover:text-primary transition-all"
                >
                    <Globe size={16} />
                    <span>View Site</span>
                </Link>

                {/* Notifications */}
                <button className="relative w-10 h-10 rounded-xl bg-background flex items-center justify-center text-light hover:text-primary hover:scale-105 transition-all">
                    <Bell size={20} />
                    {notifications > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {notifications}
                        </span>
                    )}
                </button>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-100" />

                {/* User Card */}
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-dark">Admin Control</p>
                        <p className="text-[10px] text-primary uppercase font-bold tracking-widest">Active</p>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-white hover:rotate-6 transition-transform">
                        <User size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
