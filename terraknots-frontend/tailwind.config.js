/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "#C4A882", // warm tan
                secondary: "#8B7355", // earthy brown
                accent: "#A8B5A2", // sage green
                terracotta: "#D4A574",
                background: "#F5F0EB", // warm cream
                dark: "#2C2C2C",
                light: "#6B6B6B",
                success: "#4CAF50",
                error: "#E57373",
            },
            fontFamily: {
                heading: ["var(--font-playfair)"],
                body: ["var(--font-poppins)"],
                accent: ["var(--font-dancing)"],
            },
            backgroundImage: {
                'organic-pattern': "url('/images/organic-pattern.png')",
            },
        },
    },
    plugins: [],
};
