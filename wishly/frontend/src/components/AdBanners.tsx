"use client"

import { usePathname } from "next/navigation"

const ADS_LEFT = [
  {
    id: 1,
    label: "SPONSORISÉ",
    title: "🛍️ Amazon",
    body: "Jusqu'à -50% sur les cadeaux tendance",
    cta: "Voir les offres",
    bg: "from-orange-400 to-yellow-300",
    text: "text-orange-900",
  },
  {
    id: 2,
    label: "PUB",
    title: "🎮 Fnac",
    body: "Jeux vidéo, high-tech & plus encore",
    cta: "Découvrir",
    bg: "from-yellow-500 to-amber-400",
    text: "text-yellow-900",
  },
  {
    id: 3,
    label: "ANNONCE",
    title: "🎁 Priceminister",
    body: "Achetez & vendez facilement",
    cta: "En savoir plus",
    bg: "from-purple-500 to-pink-400",
    text: "text-white",
  },
]

const ADS_RIGHT = [
  {
    id: 4,
    label: "SPONSORISÉ",
    title: "👟 Nike",
    body: "Nouvelle collection printemps 2026",
    cta: "Shop now",
    bg: "from-gray-800 to-gray-600",
    text: "text-white",
  },
  {
    id: 5,
    label: "PUB",
    title: "✈️ Booking",
    body: "Offres de dernière minute sur vos voyages",
    cta: "Réserver",
    bg: "from-blue-500 to-cyan-400",
    text: "text-black",
  },
  {
    id: 6,
    label: "ANNONCE",
    title: "🍕 Uber Eats",
    body: "Livraison offerte sur votre 1ère commande",
    cta: "Commander",
    text: "text-white",
    bg: "from-green-500 to-emerald-400",
  },
]

function AdCard({
  ad,
}: {
  ad: (typeof ADS_LEFT)[number]
}) {
  return (
    <div
      className={`bg-gradient-to-br ${ad.bg} rounded-2xl p-4 shadow-lg cursor-pointer hover:scale-[1.02] transition-transform duration-200 select-none min-h-[180px] flex flex-col justify-between`}
    >
      <div>
        <span className="text-[9px] font-bold tracking-widest opacity-60 uppercase block mb-2">
          {ad.label}
        </span>
        <p className={`font-bold text-sm ${ad.text} leading-tight`}>{ad.title}</p>
        <p className={`text-xs ${ad.text} opacity-80 mt-2 leading-relaxed`}>{ad.body}</p>
      </div>
      <button
        className={`mt-4 text-[11px] font-semibold border border-current rounded-full px-3 py-1 ${ad.text} opacity-90 hover:opacity-100 self-start`}
        onClick={(e) => e.preventDefault()}
      >
        {ad.cta} →
      </button>
    </div>
  )
}

// Largeur dynamique : espace disponible de chaque côté du contenu central (1100px)
// min(260px, ...) évite des colonnes trop larges sur grands écrans
// La colonne n'est rendue visible que si la largeur calculée >= 120px (via @supports + clamp)
const AD_COL_STYLE = {
  width: "min(260px, calc((100vw - 1100px) / 2 - 1rem))",
  minWidth: "120px",
}

export default function AdBanners() {
  const pathname = usePathname()

  if (pathname === "/login" || pathname === "/register") return null

  return (
    <>
      {/* Bande gauche — visible à partir de xl (1280px) si l'espace est suffisant */}
      <aside
        className="fixed left-0 top-0 h-full hidden xl:flex flex-col justify-center gap-4 px-3 pointer-events-none z-30 overflow-hidden"
        style={AD_COL_STYLE}
      >
        <div className="flex flex-col gap-4 pointer-events-auto">
          {ADS_LEFT.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
          <div className="text-center text-[9px] text-gray-300 tracking-widest mt-1">
            PUBLICITÉ
          </div>
        </div>
      </aside>

      {/* Bande droite */}
      <aside
        className="fixed right-0 top-0 h-full hidden xl:flex flex-col justify-center gap-4 px-3 pointer-events-none z-30 overflow-hidden"
        style={AD_COL_STYLE}
      >
        <div className="flex flex-col gap-4 pointer-events-auto">
          {ADS_RIGHT.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
          <div className="text-center text-[9px] text-gray-300 tracking-widest mt-1">
            PUBLICITÉ
          </div>
        </div>
      </aside>
    </>
  )
}
