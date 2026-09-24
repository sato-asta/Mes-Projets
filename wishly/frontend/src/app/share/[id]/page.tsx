"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type Item = {
  _id: string;
  name: string;
  price: number;
  url: string;
  category: string;
  image?: string;
  checked: boolean;
  note?: string;
};

type Wishlist = {
  _id: string;
  name: string;
  is_public: boolean;
  emoji?: string;
  description?: string;
};

export default function SharedWishlistPage() {
  const params = useParams();
  const router = useRouter();
  const wishlistId = params.id as string;

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!wishlistId) return;
    Promise.all([
      fetch("/api/wishlists/" + wishlistId).then((r) => r.json()),
      fetch("/api/wishlists/" + wishlistId + "/items").then((r) => r.json()),
    ])
      .then(([wl, its]) => {
        if (!wl || wl.error) { setNotFound(true); return; }
        if (!wl.is_public) { setNotFound(true); return; }
        setWishlist(wl);
        if (Array.isArray(its)) setItems(its);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [wishlistId]);

  const totalEur = items.reduce((acc, it) => acc + it.price, 0);
  const checkedCount = items.filter((i) => i.checked).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center">
        <div className="text-[#a4a4ae] text-[14px]">Chargement...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[40px] mb-4">🔒</div>
          <div className="font-serif text-[20px] font-semibold text-[#141418] mb-2">
            Liste introuvable
          </div>
          <div className="text-[13px] text-[#a4a4ae] mb-6">
            Cette liste n&apos;existe pas ou n&apos;est pas publique.
          </div>
          <button
            onClick={() => router.push("/login")}
            className="h-10 px-6 bg-[#d64550] text-white rounded-[10px] text-[13px] font-medium hover:opacity-90 transition"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (!wishlist) return null;

  return (
    <div className="min-h-screen bg-[#f6f6f8] p-6 md:p-10">
      <div className="max-w-[860px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] bg-[#d64550] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.8" className="w-4 h-4">
                <path d="M8 14s-6-4-6-8a6 6 0 0 1 12 0c0 4-6 8-6 8z" />
              </svg>
            </div>
            <span className="font-serif text-[18px] font-semibold tracking-tight">Wishly</span>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="h-9 px-4 border border-[#d9d9e0] rounded-[10px] text-[12px] text-[#5e5e66] hover:bg-white transition"
          >
            Se connecter
          </button>
        </div>

        {/* Hero */}
        <div className="bg-[#fbe8ea] rounded-[20px] p-6 mb-6 flex items-center gap-5">
          <div className="w-[56px] h-[56px] rounded-[14px] bg-[#d64550] flex items-center justify-center text-[28px] flex-shrink-0">
            {wishlist.emoji || "📋"}
          </div>
          <div className="flex-1">
            <div className="font-serif text-[22px] font-semibold text-[#141418]">{wishlist.name}</div>
            {wishlist.description && (
              <p className="text-[12px] text-[#5e5e66] mt-1">{wishlist.description}</p>
            )}
            <div className="mt-2">
              <div className="flex justify-between text-[11px] text-[#a4a4ae] mb-[5px]">
                <span>Progression</span>
                <span>{checkedCount} / {items.length} achetés</span>
              </div>
              <div className="h-[5px] bg-white rounded-[10px] overflow-hidden">
                <div
                  className="h-full bg-[#d64550] rounded-[10px] transition-all duration-500"
                  style={{ width: `${items.length ? (checkedCount / items.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 ml-auto flex-shrink-0">
            {([
              { value: items.length.toString(), label: "Articles" },
              null,
              { value: checkedCount.toString(), label: "Achetés" },
              null,
              { value: totalEur.toLocaleString("fr-FR") + " €", label: "Total" },
            ] as ({ value: string; label: string } | null)[]).map((s, i) =>
              s === null ? (
                <div key={i} className="w-px h-8 bg-[#d64550]/20" />
              ) : (
                <div key={i} className="text-center">
                  <div className="font-serif text-[20px] font-semibold text-[#141418]">{s.value}</div>
                  <div className="text-[10px] text-[#a4a4ae] uppercase tracking-[0.05em] mt-[1px]">{s.label}</div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Banner rejoindre */}
        <div className="bg-white border border-[#d9d9e0] rounded-[16px] p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium text-[#141418]">Créez votre propre wishlist sur Wishly</div>
            <div className="text-[11px] text-[#a4a4ae]">Gratuit et facile à partager avec vos proches</div>
          </div>
          <button
            onClick={() => router.push("/register")}
            className="h-9 px-5 bg-[#d64550] text-white rounded-[10px] text-[12px] font-medium hover:opacity-90 transition flex-shrink-0"
          >
            Créer un compte
          </button>
        </div>

        {/* Articles */}
        {items.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-dashed border-[#d9d9e0] p-12 text-center">
            <div className="text-[#a4a4ae] text-[13px]">Aucun article dans cette liste</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className={"bg-white border border-[#d9d9e0] rounded-[16px] overflow-hidden flex flex-col " + (item.checked ? "opacity-55" : "")}
              >
                <div className="h-[150px] bg-[#efeff3] flex items-center justify-center relative">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 opacity-25">
                      <path d="M6 14h24v14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V14z" />
                      <path d="M10 14v-3a8 8 0 0 1 16 0v3" />
                    </svg>
                  )}
                  {item.checked && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-[11px] font-semibold text-[#d64550] bg-white px-3 py-1 rounded-full border border-[#d64550]">
                        Déjà acheté
                      </span>
                    </div>
                  )}
                  {item.category && (
                    <div className="absolute bottom-[8px] right-[8px] text-[9px] font-semibold px-[7px] py-[2px] rounded-full bg-white/90 border border-[#d9d9e0] text-[#5e5e66] max-w-[80px] truncate">
                      {item.category}
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-[6px] flex-1">
                  <div className={"text-[12px] font-medium text-[#141418] leading-[1.4] line-clamp-2 " + (item.checked ? "line-through text-[#a4a4ae]" : "")}>
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={"text-[14px] font-semibold font-serif " + (item.checked ? "text-[#a4a4ae]" : item.price > 0 ? "text-[#d64550]" : "text-[#a4a4ae]")}>
                      {item.price > 0 ? item.price.toLocaleString("fr-FR") + " €" : "—"}
                    </span>
                    {item.url && (
                      <button
                        onClick={() => window.open(item.url, "_blank")}
                        className="text-[10px] text-[#d64550] hover:underline font-medium bg-transparent border-0 cursor-pointer"
                      >
                        Voir →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-[11px] text-[#a4a4ae]">
          Partagé via <span className="font-semibold text-[#d64550]">Wishly</span>
        </div>
      </div>
    </div>
  );
}
