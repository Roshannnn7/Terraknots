export default function sitemap() {
    const baseUrl = 'https://terraknots.com';
    const now = new Date();

    const staticPages = [
        { url: baseUrl, priority: 1.0, changeFrequency: 'daily' },
        { url: `${baseUrl}/shop`, priority: 0.9, changeFrequency: 'daily' },
        { url: `${baseUrl}/about`, priority: 0.8, changeFrequency: 'monthly' },
        { url: `${baseUrl}/contact`, priority: 0.7, changeFrequency: 'monthly' },
        { url: `${baseUrl}/custom-orders`, priority: 0.8, changeFrequency: 'monthly' },
        { url: `${baseUrl}/track-order`, priority: 0.6, changeFrequency: 'monthly' },
        { url: `${baseUrl}/faq`, priority: 0.6, changeFrequency: 'monthly' },
        { url: `${baseUrl}/shipping-policy`, priority: 0.4, changeFrequency: 'monthly' },
        { url: `${baseUrl}/return-policy`, priority: 0.4, changeFrequency: 'monthly' },
        { url: `${baseUrl}/privacy-policy`, priority: 0.3, changeFrequency: 'yearly' },
        { url: `${baseUrl}/terms`, priority: 0.3, changeFrequency: 'yearly' },
    ];

    return staticPages.map((page) => ({
        url: page.url,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    }));
}
