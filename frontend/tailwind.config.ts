/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/content/**/*.{md,mdx}"],
  darkMode: ["class"],
  future: {
    hoverOnlyWhenSupported: true,
  },
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
        inter: ["var(--font-inter)"],
        urbanist: ["var(--font-urbanist)"],
        heading: ["var(--font-heading)"],
        mono: ["Monaco", "Menlo", "Ubuntu Mono", "Courier New", "monospace"],
        terminal: ["Monaco", "Menlo", "Ubuntu Mono", "Courier New", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        terminal: {
          "bg-primary": "hsl(var(--terminal-bg-primary))",
          "bg-secondary": "hsl(var(--terminal-bg-secondary))",
          "bg-tertiary": "hsl(var(--terminal-bg-tertiary))",
          "border-primary": "hsl(var(--terminal-border-primary))",
          "border-secondary": "hsl(var(--terminal-border-secondary))",
          "text-primary": "hsl(var(--terminal-text-primary))",
          "text-secondary": "hsl(var(--terminal-text-secondary))",
          "text-accent": "hsl(var(--terminal-text-accent))",
          "text-success": "hsl(var(--terminal-text-success))",
          "text-warning": "hsl(var(--terminal-text-warning))",
          "text-error": "hsl(var(--terminal-text-error))",
          "text-info": "hsl(var(--terminal-text-info))",
          "accent": "hsl(var(--terminal-accent))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-up": {
          "0%": {
            opacity: 0,
            transform: "translateY(10px)",
          },
          "80%": {
            opacity: 0.7,
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: 0,
            transform: "translateY(-10px)",
          },
          "80%": {
            opacity: 0.6,
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: 0,
          },
          "50%": {
            opacity: 0.6,
          },
          "100%": {
            opacity: 1,
          },
        },
        "fade-out": {
          "0%": {
            opacity: 0,
          },
          "50%": {
            opacity: 0.6,
          },
          "100%": {
            opacity: 1,
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s",
        "fade-down": "fade-down 0.5s",
        "fade-in": "fade-in 0.4s",
        "fade-out": "fade-out 0.4s",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
