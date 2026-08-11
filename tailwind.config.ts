import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk Variable', 'Space Grotesk', 'Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // MINDMAKER 2.0 - INK + MINT PALETTE
        ink: {
          DEFAULT: "hsl(var(--ink))",
          900: "hsl(var(--ink-900))",
          800: "hsl(var(--ink-800))",
          700: "hsl(var(--ink-700))",
          50: "hsl(var(--ink-50))",
        },
        mint: {
          DEFAULT: "hsl(var(--mint))",
          900: "hsl(var(--mint-900))",
          500: "hsl(var(--mint-500))",
          300: "hsl(var(--mint-300))",
          50: "hsl(var(--mint-50))",
          dark: "hsl(var(--mint-dark))",
        },
        // PORTFOLIO SIGNATURE, emerald (CTRL #00D9B6). The `mint` keys above
        // are now aliases to these same primitives; prefer `emerald*` in new
        // code. Use `emerald-deep` for text/links on light (full AA).
        emerald: {
          DEFAULT: "hsl(var(--emerald))",
          deep: "hsl(var(--emerald-deep))",
          300: "hsl(var(--emerald-300))",
          50: "hsl(var(--emerald-50))",
        },
        "off-white": "hsl(var(--off-white))",
        "light-grey": "hsl(var(--light-grey))",
        "mid-grey": "hsl(var(--mid-grey))",
        graphite: "hsl(var(--graphite))",
        
        // ELEVATION SYSTEM
        surface: {
          1: "hsl(var(--surface-1))",
          2: "hsl(var(--surface-2))",
          3: "hsl(var(--surface-3))",
        },
        
        // SEMANTIC TOKENS
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        
        // DARK CARD TEXT - WCAG AA compliant text for dark backgrounds
        "dark-card": {
          heading: "hsl(var(--dark-card-heading))",
          body: "hsl(var(--dark-card-body))",
          muted: "hsl(var(--dark-card-muted))",
        },
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        "mint-sm": "var(--shadow-mint-sm)",
        "mint-md": "var(--shadow-mint-md)",
        "mint-lg": "var(--shadow-mint-lg)",
        // emerald shadows alias the same vars (mint shadows are now emerald-hued)
        "emerald-sm": "var(--shadow-mint-sm)",
        "emerald-md": "var(--shadow-mint-md)",
        "emerald-lg": "var(--shadow-mint-lg)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-in-up": {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in-smooth": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up-refined": {
          from: {
            opacity: "0",
            transform: "translateY(16px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          from: {
            opacity: "0",
            transform: "scale(0.96)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "var(--shadow-mint-sm)" },
          "50%": { boxShadow: "var(--shadow-mint-md)" },
        },
        "sonar-ping": {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "fab-bounce-in": {
          "0%": { transform: "scale(0) translateY(20px)", opacity: "0" },
          "50%": { transform: "scale(1.15) translateY(-4px)", opacity: "1" },
          "70%": { transform: "scale(0.95) translateY(2px)", opacity: "1" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        // Old-tube-light "flicker on": stutters, snaps to a bright mint glow, then settles
        // to its normal color. drop-shadow runs on the PNG alpha so the letters glow, not a box.
        "wordmark-flicker": {
          "0%": { opacity: "0", filter: "brightness(1)" },
          "4%": { opacity: "0.1" },
          "8%": { opacity: "0", filter: "brightness(1)" },
          "12%": { opacity: "0.7", filter: "brightness(1.8) drop-shadow(0 0 6px hsl(171 100% 43% / 0.8))" },
          "15%": { opacity: "0.1" },
          "19%": { opacity: "1", filter: "brightness(2.2) drop-shadow(0 0 14px hsl(171 100% 43% / 1))" },
          "22%": { opacity: "0.3" },
          // Last recovery snap, then the glow fades out in one smooth motion (ease-out on this
          // segment only) so there are no extra stepped flickers during the settle.
          "26%": { opacity: "1", filter: "brightness(2) drop-shadow(0 0 12px hsl(171 100% 43% / 0.85))", animationTimingFunction: "ease-out" },
          "100%": { opacity: "1", filter: "brightness(1) drop-shadow(0 0 0 hsl(171 100% 43% / 0))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in-smooth": "fade-in-smooth 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-up-refined": "slide-up-refined 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "scale-in": "scale-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "sonar-ping": "sonar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "wordmark-flicker": "wordmark-flicker 1.8s steps(1, end) 0.15s both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
