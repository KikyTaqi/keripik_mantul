/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js, jsx, ts, tsx}", 
    "./src/components/*.jsx", 
    "./src/pages/*.jsx", 
    "./src/pages/dashboard/*.jsx", 
    "./src/pages/passwordChange/*.jsx", 
    "./src/pages/About.jsx",
    "./src/pages/user_profile/*.jsx",
    "./src/pages/dashboard/ProfileAdmin/*.jsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar-hide')],
}

