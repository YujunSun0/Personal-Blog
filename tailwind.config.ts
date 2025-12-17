import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
        },
        bg: {
          primary: "var(--color-bg-primary)",
          secondary: "var(--color-bg-secondary)",
          tertiary: "var(--color-bg-tertiary)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          hover: "var(--color-border-hover)",
        },
        type: {
          tech: "var(--color-type-tech)",
          "tech-bg": "var(--color-type-tech-bg)",
          trouble: "var(--color-type-trouble)",
          "trouble-bg": "var(--color-type-trouble-bg)",
          life: "var(--color-type-life)",
          "life-bg": "var(--color-type-life-bg)",
        },
      },
      maxWidth: {
        container: "var(--container-max-width)",
      },
      padding: {
        container: "var(--container-padding-x)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;

