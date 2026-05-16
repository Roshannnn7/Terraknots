'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import { toast } from 'react-toastify';
import api from '@/lib/api';

function AdminLoader() {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-background">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    // Skip auth check for the login page itself
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) {
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/admin/login');
                    return;
                }

                const { data } = await api.get('/auth/me');
                if (data.user.role !== 'admin') {
                    toast.error('Access Denied: Admin Privileges Required');
                    router.push('/');
                    return;
                }

                setAuthorized(true);
            } catch (error) {
                localStorage.removeItem('token');
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router, isLoginPage]);

    if (loading) {
        return <AdminLoader />;
    }

    // For the login page, render without sidebar/topbar
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (!authorized) return null;

    return (
        <ErrorBoundary>
            <div className="flex min-h-screen bg-[#F9F9F9]">
                <AdminSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <AdminTopbar />
                    <main className="p-10">
                        {children}
                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
}
