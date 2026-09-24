// Layout racine de l'application Next.js
// Ce fichier englobe TOUTES les pages — tout ce qu'on met ici est présent partout
import type { Metadata } from "next"
import { DM_Sans, Fraunces } from "next/font/google"
import "../styles/globals.css"
import Providers from "@/components/Providers"
import AdBanners from "@/components/AdBanners"

// On charge la police DM Sans (texte courant)
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
})

// On charge Fraunces (titres / accents visuels)
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
})

// Métadonnées affichées dans l'onglet du navigateur
export const metadata: Metadata = {
  title: "Wishly",
  description: "Votre liste de souhaits personnelle",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>♥</text></svg>",
  },
}

// Layout principal
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Script exécuté AVANT l'hydratation React pour éviter le flash blanc */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('theme')
                  || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (t === 'dark') document.documentElement.classList.add('dark');
              } catch(e){}
            })();`,
          }}
        />
      </head>

      {/* font-sans utilise la variable --font-dm-sans définie dans tailwind.config */}
      <body className="font-sans">
        <Providers>
          <AdBanners />
          {children}
        </Providers>
      </body>
    </html>
  )
}
