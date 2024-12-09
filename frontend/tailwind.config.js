/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["media"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poetsen One", "sans-serif"],
      mono: ["Roboto", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        bgLogin: 'url("https://wallpapercave.com/wp/wp13129046.png")',
        bgRegister: 'url("https://images5.alphacoders.com/135/1351897.png")',
        bgHome: 'url("https://preview.redd.it/i-made-a-cool-pokemon-koi-pond-wallpaper-v0-zipswqk1ztva1.png?auto=webp&s=fdf174c9c6d009638b40f8ede42fc2bfe00f0800")',
        bgFriendScreen: 'url("https://wallpapercave.com/wp/wp9805173.png")',
        bgPokemonTeam: 'url("https://images.alphacoders.com/135/thumb-1920-1357289.png")',
        bgTradeScreen: 'url("https://images8.alphacoders.com/135/1351987.jpeg")',
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },

      keyframes: {
        gradient: {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
      },
      animation: {
        gradient: "gradient 5s ease infinite", // Animación de gradiente (5 segundos)
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
