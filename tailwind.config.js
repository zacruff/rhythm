module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mytheme: {
          "primary": "#65a30d",
          
          "secondary": "#111827",
                   
          "accent": "#00a524",
                   
          "neutral": "#a8a29e",
                   
          "base-100": "#74151",
                   
          "info": "#fef08a",
                   
          "success": "#00af56",
                   
          "warning": "#ff9600",
                   
          "error": "#ff0040",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
};