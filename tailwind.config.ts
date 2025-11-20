import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./styles/**/*.{css,scss}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff3355",
          accent: "#7839ff",
          dark: "#161320"
        }
      }
    }
  },
  plugins: []
};

export default config;
