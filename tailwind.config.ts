import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Metro de Santiago Corporate Colors
        "metro": {
          red: "var(--color-metro-red)",
          black: "var(--color-metro-black)",
          orange: "var(--color-metro-orange)",
          burgundy: "var(--color-metro-burgundy)",
          gray: "var(--color-metro-gray)",
          turquoise: "var(--color-metro-turquoise)",
        },
        // Metro Lines Colors
        "metro-line": {
          1: "var(--color-metro-line-1)",      // Línea 1 - Roja
          2: "var(--color-metro-line-2)",      // Línea 2 - Amarilla
          3: "var(--color-metro-line-3)",      // Línea 3 - Café
          4: "var(--color-metro-line-4)",      // Línea 4 - Azul
          "4a": "var(--color-metro-line-4a)",  // Línea 4A - Celeste
          5: "var(--color-metro-line-5)",      // Línea 5 - Verde Claro
          6: "var(--color-metro-line-6)",      // Línea 6 - Morada
        },
        // Shadcn/ui Theme Colors
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        // Chart Colors
        chart: {
          1: "var(--color-chart-1)",
          2: "var(--color-chart-2)",
          3: "var(--color-chart-3)",
          4: "var(--color-chart-4)",
          5: "var(--color-chart-5)",
        },
        // Sidebar Colors
        sidebar: {
          DEFAULT: "var(--color-sidebar)",
          foreground: "var(--color-sidebar-foreground)",
          primary: "var(--color-sidebar-primary)",
          "primary-foreground": "var(--color-sidebar-primary-foreground)",
          accent: "var(--color-sidebar-accent)",
          "accent-foreground": "var(--color-sidebar-accent-foreground)",
          border: "var(--color-sidebar-border)",
          ring: "var(--color-sidebar-ring)",
        },
      },
      borderRadius: {
        'sm': "var(--radius-sm)",
        'md': "var(--radius-md)",
        'lg': "var(--radius-lg)",
        'xl': "var(--radius-xl)",
        DEFAULT: "var(--radius-lg)",
      },
      spacing: {
        // Metro-specific spacing
        "metro-xs": "0.25rem",     // 4px
        "metro-sm": "0.5rem",      // 8px
        "metro-md": "0.75rem",     // 12px
        "metro-lg": "1rem",        // 16px
        "metro-xl": "1.5rem",      // 24px
        "metro-2xl": "2rem",       // 32px
        "metro-3xl": "2.5rem",     // 40px
        "metro-4xl": "3rem",       // 48px
        "metro-5xl": "4rem",       // 64px
        "metro-6xl": "5rem",       // 80px
      },
      fontSize: {
        // Mobile-optimized typography scale
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        // Metro-specific text sizes for mobile
        'metro-xs': ['0.6875rem', { lineHeight: '1rem' }],    // 11px
        'metro-sm': ['0.8125rem', { lineHeight: '1.125rem' }], // 13px
        'metro-base': ['0.9375rem', { lineHeight: '1.375rem' }], // 15px
        'metro-lg': ['1.0625rem', { lineHeight: '1.5rem' }],   // 17px
        'metro-xl': ['1.1875rem', { lineHeight: '1.625rem' }], // 19px
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Metro-specific animations
        "metro-fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "metro-slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "metro-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        // Marquee animation for Metro announcements
        "marquee-up": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(calc(-1 * var(--marquee-distance)))" },
        },
        // Animations from tailwindcss-animate
        "in": {
          "from": { opacity: "0", transform: "translateY(0.75rem)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        "out": {
          "from": { opacity: "1" },
          "to": { opacity: "0" },
        },
        "fade-in": {
          "from": { opacity: "0" },
          "to": { opacity: "1" },
        },
        "fade-out": {
          "from": { opacity: "1" },
          "to": { opacity: "0" },
        },
        "zoom-in": {
          "from": { opacity: "0", transform: "scale(0.95)" },
          "to": { opacity: "1", transform: "scale(1)" },
        },
        "zoom-out": {
          "from": { opacity: "1", transform: "scale(1)" },
          "to": { opacity: "0", transform: "scale(0.95)" },
        },
        "slide-in-from-top": {
          "from": { transform: "translateY(-0.5rem)" },
          "to": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "from": { transform: "translateY(0.5rem)" },
          "to": { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          "from": { transform: "translateX(-0.5rem)" },
          "to": { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          "from": { transform: "translateX(0.5rem)" },
          "to": { transform: "translateX(0)" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "metro-fade-in": "metro-fade-in 0.3s ease-out",
        "metro-slide-in": "metro-slide-in 0.4s ease-out",
        "metro-pulse": "metro-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee-up": "marquee-up var(--marquee-duration, 20s) linear infinite",
        // From tailwindcss-animate
        "in": "in 150ms ease-out",
        "out": "out 150ms ease-in",
        "fade-in-0": "fade-in 150ms ease-out",
        "fade-out-0": "fade-out 150ms ease-in",
        "zoom-in-95": "zoom-in 150ms ease-out",
        "zoom-out-95": "zoom-out 150ms ease-in",
        "slide-in-from-top-2": "slide-in-from-top 150ms ease-out",
        "slide-in-from-bottom-2": "slide-in-from-bottom 150ms ease-out",
        "slide-in-from-left-2": "slide-in-from-left 150ms ease-out",
        "slide-in-from-right-2": "slide-in-from-right 150ms ease-out",
        "caret-blink": "caret-blink 1s ease-out infinite",
      },
      transitionDuration: {
        "metro": "250ms",
      },
      transitionTimingFunction: {
        "metro": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      boxShadow: {
        "metro-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "metro-md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "metro-lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "metro-xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
      backdropBlur: {
        "metro": "8px",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;