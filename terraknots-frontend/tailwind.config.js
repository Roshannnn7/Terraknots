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
                // Primary palette
                primary: "#C4A882",
                secondary: "#8B7355",
                accent: "#A8B5A2",
                terracotta: "#D4A574",
                background: "#F5F0EB",
                cream: "#FBF9F7",
                'off-white': "#FAFAF7",
                'light-gray': "#F0EDE8",
                dark: "#2C2C2C",
                light: "#6B6B6B",
                // Extended palette
                'warm-tan': "#C4A882",
                'earthy-brown': "#8B7355",
                'sage-green': "#A8B5A2",
                'warm-cream': "#F5F0EB",
                'deep-brown': "#5C4033",
                'soft-peach': "#F2D7C9",
                'dusty-rose': "#D4A5A5",
                olive: "#8A9A7B",
                clay: "#C9B09B",
                // Functional
                success: "#6B9B7D",
                error: "#C75C5C",
                warning: "#D4A574",
                info: "#7BA5B5",
            },
            fontFamily: {
                heading: ["var(--font-playfair)", "Georgia", "serif"],
                body: ["var(--font-poppins)", "sans-serif"],
                accent: ["var(--font-dancing)", "cursive"],
            },
            fontSize: {
                'display': ['72px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'hero': ['60px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'h1': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
                'h2': ['36px', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
                'h3': ['28px', { lineHeight: '1.4' }],
                'h4': ['22px', { lineHeight: '1.4' }],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '26': '6.5rem',
                '30': '7.5rem',
                '34': '8.5rem',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
                '6xl': '3rem',
            },
            boxShadow: {
                'card': '0 4px 20px rgba(139, 115, 85, 0.08)',
                'card-hover': '0 12px 40px rgba(139, 115, 85, 0.15)',
                'button': '0 4px 15px rgba(196, 168, 130, 0.3)',
                'button-hover': '0 8px 25px rgba(196, 168, 130, 0.4)',
                'navbar': '0 2px 20px rgba(0, 0, 0, 0.05)',
                'glass': '0 8px 32px rgba(139, 115, 85, 0.1)',
                'warm': '0 20px 60px rgba(196, 168, 130, 0.2)',
                'inner-warm': 'inset 0 2px 4px rgba(196, 168, 130, 0.15)',
            },
            backgroundImage: {
                'gradient-warm': 'linear-gradient(135deg, #F5F0EB 0%, #F2D7C9 50%, #D4A574 100%)',
                'gradient-hero': 'linear-gradient(135deg, #C4A882 0%, #D4A574 50%, #A8B5A2 100%)',
                'gradient-card': 'linear-gradient(180deg, rgba(196,168,130,0.05) 0%, rgba(196,168,130,0.15) 100%)',
                'gradient-dark': 'linear-gradient(135deg, #5C4033 0%, #3D2E22 100%)',
                'gradient-sage': 'linear-gradient(135deg, #A8B5A2 0%, #8A9A7B 100%)',
                'gradient-terracotta': 'linear-gradient(135deg, #D4A574 0%, #C4A882 100%)',
            },
            animation: {
                'float': 'float 4s ease-in-out infinite',
                'float-slow': 'float 6s ease-in-out infinite',
                'float-fast': 'float 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'marquee': 'marquee 25s linear infinite',
                'marquee-reverse': 'marquee-reverse 25s linear infinite',
                'slow-rotate': 'slow-rotate 20s linear infinite',
                'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
                'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
                'slide-up': 'slide-up 0.5s ease-out forwards',
                'slide-down': 'slide-down 0.5s ease-out forwards',
                'fade-in': 'fade-in 0.5s ease-out forwards',
                'scale-in': 'scale-in 0.3s ease-out forwards',
                'wiggle': 'wiggle 1s ease-in-out',
                'draw-line': 'draw-line 2s ease-out forwards',
                'wave': 'wave 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                'marquee-reverse': {
                    '0%': { transform: 'translateX(-50%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                'slow-rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.05)' },
                },
                'bounce-soft': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-down': {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                'draw-line': {
                    '0%': { strokeDashoffset: '1000' },
                    '100%': { strokeDashoffset: '0' },
                },
                wave: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '50%': { transform: 'translateX(-20px)' },
                },
            },
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'ease-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
