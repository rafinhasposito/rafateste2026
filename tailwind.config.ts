import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "var(--layout-gutter)",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "var(--container-max-width)",
      },
    },
    extend: {
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
        "16": "64px",
      },
      fontFamily: {
        /* BRAND KIT V2 (Isolated Aliases) */
        "ps-display": ['"PS Marcellus"', 'serif'],
        "ps-ui": ['"PS DM Sans"', 'sans-serif'],

        /* DESIGN SYSTEM v2.0: apenas Cinzel + Inter */
        display: ['Cinzel', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        /* Aliases semânticos */
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        /* LEGADO (não usar em componentes novos) */
        sfpro: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'sans-serif'],
      },
      fontSize: {
        "display": "var(--text-display)",
        "h1": "var(--text-h1)",
        "h2": "var(--text-h2)",
        "h3": "var(--text-h3)",
        "h4": "var(--text-h4)",
        "body-lg": "var(--text-body-lg)",
        "body": "var(--text-body)",
        "body-sm": "var(--text-body-sm)",
        "caption": "var(--text-caption)",
        "label": "var(--text-label)",
      },
      colors: {
        /* BRAND KIT V2 (Isolated Aliases) */
        "ps-void": "var(--ps-void)",
        "ps-night": "var(--ps-night)",
        "ps-surface": "var(--ps-surface)",
        "ps-gold-deep": "var(--ps-gold-deep)",
        "ps-gold": "var(--ps-gold)",
        "ps-champagne": "var(--ps-champagne)",
        "ps-text": "var(--ps-text)",
        "ps-muted": "var(--ps-muted)",

        /* LEGACY TOKENS (To be migrated) */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        /* NEW FOUNDATION TOKENS (Phase 1) */
        foundation: {
          bg: "hsl(var(--foundation-bg))",
          fg: "hsl(var(--foundation-fg))",
          muted: "hsl(var(--foundation-muted))",
          "muted-fg": "hsl(var(--foundation-muted-fg))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          elevated: "hsl(var(--surface-elevated))",
          border: "hsl(var(--surface-border))",
        },
        brand: {
          primary: "hsl(var(--brand-primary))",
          "primary-fg": "hsl(var(--brand-primary-fg))",
          secondary: "hsl(var(--brand-secondary))",
          "secondary-fg": "hsl(var(--brand-secondary-fg))",
          accent: "hsl(var(--brand-accent))",
          "accent-fg": "hsl(var(--brand-accent-fg))",
        },
        status: {
          success: "hsl(var(--status-success))",
          warning: "hsl(var(--status-warning))",
          error: "hsl(var(--status-error))",
          info: "hsl(var(--status-info))",
        },
        state: {
          hover: "var(--state-hover)",
          pressed: "var(--state-pressed)",
          selected: "var(--state-selected)",
          focus: "hsl(var(--state-focus))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
          dark: "hsl(var(--gold-dark))",
        },
        quantum: {
          950: "hsl(var(--quantum-950))",
          900: "hsl(var(--quantum-900))",
          800: "hsl(var(--quantum-800))",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        /* LEGACY */
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        /* NEW FOUNDATION */
        "base-sm": "var(--radius-sm)",
        "base-md": "var(--radius-md)",
        "base-lg": "var(--radius-lg)",
        "base-full": "var(--radius-full)",
      },
      boxShadow: {
        "elevation-1": "var(--shadow-sm)",
        "elevation-2": "var(--shadow-md)",
        "elevation-3": "var(--shadow-lg)",
        "glow-gold-sm": "var(--shadow-gold-sm)",
        "glow-gold-md": "var(--shadow-gold-md)",
        "glow-gold-lg": "var(--shadow-gold-lg)",
        /* Legado */
        "glow-primary": "0 0 20px -5px hsl(var(--brand-primary) / 0.3)",
      },
      opacity: {
        "disabled": "var(--state-disabled-opacity)",
      },
      minHeight: {
        "touch": "var(--touch-target)",
      },
      minWidth: {
        "touch": "var(--touch-target)",
      },
      transitionDuration: {
        "fast": "var(--motion-fast)",
        "normal": "var(--motion-normal)",
        "slow": "var(--motion-slow)",
      },
      transitionTimingFunction: {
        "cushion": "var(--ease-out-cushion)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
