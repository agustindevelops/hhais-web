import type { Config } from "tailwindcss";
import colors from 'tailwindcss/colors'
import formPlugin from '@tailwindcss/forms'


const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "10rem",
      },
    },

    fontFamily: {
      jost: ["Quicksand", "Jost", "sans-serif"],
    },

    extend: {
      colors: {
        primary: colors.green["600"],
        "primary-hover": colors.green["700"],

        default: colors.slate,
      },
    },
  },
  plugins: [
    formPlugin,
  ],
};
export default config;
