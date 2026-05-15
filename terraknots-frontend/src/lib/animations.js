// Centralized Framer Motion animation variants for TerraKnots
// Import and use these throughout the app for consistency

// ============================================
// PAGE TRANSITIONS
// ============================================
export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// ============================================
// STAGGERED CHILDREN
// ============================================
export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

export const staggerContainerSlow = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

export const staggerItem = {
    initial: { opacity: 0, y: 30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

export const staggerItemLeft = {
    initial: { opacity: 0, x: -30 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

// ============================================
// FADE-IN VARIANTS
// ============================================
export const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const fadeInDown = {
    initial: { opacity: 0, y: -40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: "easeOut" },
};

export const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.7, ease: "easeOut" },
};

export const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.7, ease: "easeOut" },
};

export const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" },
};

// ============================================
// SCALE VARIANTS
// ============================================
export const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
};

export const scaleInFast = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: "easeOut" },
};

export const scaleOnHover = {
    whileHover: {
        scale: 1.03,
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" },
    },
    whileTap: { scale: 0.97 },
};

export const liftOnHover = {
    whileHover: {
        y: -8,
        boxShadow: "0 12px 40px rgba(139, 115, 85, 0.15)",
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

// ============================================
// IMAGE REVEAL
// ============================================
export const imageReveal = {
    initial: { clipPath: "inset(100% 0 0 0)" },
    whileInView: {
        clipPath: "inset(0% 0 0 0)",
        transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    viewport: { once: true },
};

export const imageRevealLeft = {
    initial: { clipPath: "inset(0 100% 0 0)" },
    whileInView: {
        clipPath: "inset(0 0% 0 0)",
        transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    viewport: { once: true },
};

// ============================================
// TEXT ANIMATIONS
// ============================================
export const textReveal = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { staggerChildren: 0.03 },
    },
};

export const charReveal = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

export const wordReveal = {
    initial: { opacity: 0, y: 15 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

// ============================================
// DECORATIVE / AMBIENT ANIMATIONS
// ============================================
export const float = {
    animate: {
        y: [0, -15, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

export const floatSlow = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

export const floatRotate = {
    animate: {
        y: [0, -12, 0],
        rotate: [0, 10, 0],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

export const slowRotate = {
    animate: {
        rotate: 360,
        transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
        },
    },
};

export const pulse = {
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

// ============================================
// BUTTON ANIMATIONS
// ============================================
export const magneticButton = {
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.96 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
};

export const bounceButton = {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 15 },
};

// ============================================
// DRAWER / MODAL ANIMATIONS
// ============================================
export const drawerRight = {
    initial: { x: "100%", opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", damping: 28, stiffness: 300 },
    },
    exit: {
        x: "100%",
        opacity: 0,
        transition: { duration: 0.25, ease: "easeIn" },
    },
};

export const drawerLeft = {
    initial: { x: "-100%", opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", damping: 28, stiffness: 300 },
    },
    exit: {
        x: "-100%",
        opacity: 0,
        transition: { duration: 0.25, ease: "easeIn" },
    },
};

export const drawerBottom = {
    initial: { y: "100%", opacity: 0 },
    animate: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", damping: 28, stiffness: 300 },
    },
    exit: {
        y: "100%",
        opacity: 0,
        transition: { duration: 0.25, ease: "easeIn" },
    },
};

export const modalScale = {
    initial: { opacity: 0, scale: 0.92, y: 10 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
        opacity: 0,
        scale: 0.92,
        y: 10,
        transition: { duration: 0.2, ease: "easeIn" },
    },
};

export const backdropFade = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ============================================
// LIST ITEM ANIMATIONS
// ============================================
export const listItem = {
    initial: { opacity: 0, x: -20 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        x: 20,
        height: 0,
        transition: { duration: 0.25, ease: "easeIn" },
    },
};

export const slideInFromRight = {
    initial: { opacity: 0, x: 30 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 200, damping: 20 },
    },
};

// ============================================
// ACCORDION
// ============================================
export const accordion = {
    open: {
        height: "auto",
        opacity: 1,
        transition: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
    },
    closed: {
        height: 0,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" },
    },
};

// ============================================
// HERO TEXT REVEAL (word by word)
// ============================================
export const heroContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.3,
        },
    },
};

export const heroWord = {
    initial: { opacity: 0, y: 50, rotateX: 40 },
    animate: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

// ============================================
// COUNTER ANIMATION (for stats)
// ============================================
// Usage: Use useSpring from framer-motion with these config options
export const counterConfig = {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
};

// ============================================
// TIMELINE (craftsmanship section)
// ============================================
export const timelineItem = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    whileInView: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
    viewport: { once: true, margin: "-60px" },
};

// ============================================
// CARD VARIANTS FOR GRIDS
// ============================================
export const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.07,
            duration: 0.5,
            ease: "easeOut",
        },
    }),
};

// ============================================
// SUCCESS ANIMATIONS
// ============================================
export const checkmarkDraw = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
    },
};

export const successCircle = {
    initial: { scale: 0, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 200, damping: 20, delay: 0.1 },
    },
};
