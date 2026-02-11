'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import Loader from '@/components/ui/Loader';
import { toast } from 'react-toastify';
import api from '@/lib/api';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/admin/login');
                    return;
                }

                const { data } = await api.get('/auth/profile');
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
    }, [router]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader />
            </div>
        );
    }

    if (!authorized) return null;

    return (
        <div className="flex min-h-screen bg-[#F9F9F9]">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar />
                <main className="p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
