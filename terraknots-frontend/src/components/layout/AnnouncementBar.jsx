'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

const AnnouncementBar = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                setSettings(data.settings);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    if (!settings || !settings.announcementEnabled) return null;

    return (
        <div className="bg-secondary text-white py-2 px-4 text-center text-sm font-medium tracking-wide">
            <div className="container mx-auto">
                {settings.announcementText}
            </div>
        </div>
    );
};

export default AnnouncementBar;
