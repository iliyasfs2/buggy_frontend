import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          750: "#293548"
        },
        buggy: {
          base: "#101826",
          surface: "#101826",
          border: "#24324a",
          inactive: "#94a3b8",
          blue: "#3b82f6",
          blueLight: "#60a5fa",
          primary: "#f8fafc"
        }
      }
    }
  },
  plugins: []
};

export default config;



