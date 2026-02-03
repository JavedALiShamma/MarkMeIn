// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   // NOTE: Update this to include the paths to all files that contain Nativewind classes.
//   content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
//   presets: [require("nativewind/preset")],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2C9EE8",
        secondary: "#93D4FE",
        background: "#F4F4F4",
        danger: "#DC2626",
        muted: "#6B7280",
      },
    },
  },
  plugins: [],
};
