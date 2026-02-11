'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Star,
    MessageSquare,
    PenTool,
    Ticket,
    Mail,
    Settings,
    Image as ImageIcon,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Customers', href: '/admin/customers', icon: Users },
        { name: 'Reviews', href: '/admin/reviews', icon: Star },
        { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
        { name: 'Custom Orders', href: '/admin/custom-orders', icon: PenTool },
        { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
        { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 overflow-y-auto no-scrollbar">
            {/* Brand */}
            <div className="p-8">
                <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                        <Package size={20} />
                    </div>
                    <span className="text-xl font-heading font-bold text-dark">TK Admin</span>
                </Link>
            </div>

            {/* Profile Summary */}
            <div className="px-8 pb-8">
                <div className="p-4 bg-background rounded-2xl flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        A
                    </div>
                    <div>
                        <p className="text-xs font-bold text-dark">Admin User</p>
                        <p className="text-[10px] text-light uppercase tracking-wider">Super Control</p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-light hover:bg-primary/5 hover:text-primary'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon size={20} className={isActive ? 'text-white' : 'text-primary'} />
                                <span className="text-sm font-bold">{item.name}</span>
                            </div>
                            {isActive && (
                                <motion.div layoutId="active" transition={{ type: 'spring', duration: 0.6 }}>
                                    <ChevronRight size={14} />
                                </motion.div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-6">
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/admin/login';
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-500 bg-red-50 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
                >
                    <LogOut size={18} />
                    <span>Exit Panel</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
