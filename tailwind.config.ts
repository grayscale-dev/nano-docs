import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2663EB",
      },
      fontFamily: {
        sans: ["\"Fira Sans\"", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
