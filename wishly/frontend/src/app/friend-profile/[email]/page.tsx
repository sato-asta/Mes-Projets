"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";

type Item = {
  _id: string;
  name: string;
  price: number;
  image: string;
  url: string;
  category: string;
  is_offered_by_me: boolean;
};

type Wishlist = {
  _id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  items: Item[];
};

type FriendProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  friend_code: string;
  wishlists: Wishlist[];
};

export default function FriendProfilePage(): JSX.Element {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openWishlists, setOpenWishlists] = useState<Set<string>>(new Set());

  const toggleWishlist = (id: string) => {
    setOpenWishlists((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleOffer = async (wishlistId: string, itemId: string) => {
    const res = await fetch(`/api/items/${itemId}/offer`, { method: "PATCH" });
    if (!res.ok) return;
    const { is_offered } = await res.json();
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        wishlists: prev.wishlists.map((wl) =>
          wl._id !== wishlistId ? wl : {
            ...wl,
            items: wl.items.map((it) =>
              it._id !== itemId ? it : { ...it, is_offered_by_me: is_offered }
            ),
          }
        ),
      };
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = params.email as string;
        if (!email) {
          setError("Email non trouvé");
          return;
        }

        const res = await fetch(`/api/users/${decodeURIComponent(email)}/profile`);
        if (!res.ok) {
          throw new Error("Profil non trouvé");
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.email]);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center">
        <p>Veuillez vous connecter pour accéder à cette page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center">
        <p className="text-[#a4a4ae]">Chargement...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[1100px] bg-[var(--color-surface)] rounded-[20px] border border-[#d9d9e0] p-8 text-center">
          <p className="text-[#d64550] font-medium mb-4">{error || "Erreur lors du chargement du profil"}</p>
          <button
            onClick={() => router.back()}
            className="h-10 px-4 rounded-[10px] bg-[#d64550] text-white text-[12px] font-medium hover:opacity-90 transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-[1100px] bg-[var(--color-surface)] rounded-[20px] border border-[var(--color-border)] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] grid grid-cols-[220px_1fr]">
        
        <Sidebar active="friends" />

        <main className="flex flex-col overflow-hidden">
          {/* Header avec info du profil */}
          <header className="border-b border-[#d9d9e0] px-6 py-5 bg-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#d64550] text-white text-[16px] font-semibold flex items-center justify-center flex-shrink-0">
                {profile.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="font-serif text-[18px] font-semibold text-[#141418]">
                  {profile.name}
                </h1>
                <p className="text-[11px] text-[#a4a4ae] font-mono">{profile.friend_code}</p>
              </div>
            </div>
          </header>

          {/* Contenu scrollable */}
          <section className="flex-1 overflow-y-auto px-6 py-5 bg-[#f6f6f8] space-y-6">
            
            {/* État vide */}
            {profile.wishlists.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d9d9e0] bg-white p-8 flex flex-col items-center text-center gap-2">
                <div className="w-[38px] h-[38px] rounded-[10px] bg-[#efeff3] flex items-center justify-center text-xl opacity-50">
                  🛍️
                </div>
                <h3 className="font-serif text-[13px] font-semibold text-[#141418]">
                  Aucune wishlist publique
                </h3>
                <p className="max-w-[260px] text-[11px] text-[#a4a4ae] leading-relaxed">
                  {profile.name} n&apos;a pas encore créé de wishlist publique.
                </p>
              </div>
            ) : (
              profile.wishlists.map((wishlist) => {
                const isOpen = openWishlists.has(wishlist._id);
                return (
                  <div key={wishlist._id} className="bg-white rounded-2xl border border-[#d9d9e0] overflow-hidden">
                    <button
                      onClick={() => toggleWishlist(wishlist._id)}
                      className="w-full flex items-center gap-3 p-5 text-left hover:bg-[#fafafa] transition"
                    >
                      <div
                        className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px] flex-shrink-0"
                        style={{ backgroundColor: wishlist.color + "20" }}
                      >
                        {wishlist.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-serif text-[14px] font-semibold text-[#141418]">
                          {wishlist.name}
                        </h2>
                        {wishlist.description && (
                          <p className="text-[11px] text-[#a4a4ae] truncate">{wishlist.description}</p>
                        )}
                      </div>
                      <span className="text-[12px] font-medium text-[#a4a4ae] flex-shrink-0">
                        {wishlist.items.length} article{wishlist.items.length !== 1 ? "s" : ""}
                      </span>
                      <svg
                        className={`w-4 h-4 text-[#a4a4ae] flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-[#f0f0f3]">
                        {wishlist.items.length === 0 ? (
                          <p className="text-center text-[12px] text-[#a4a4ae] py-4">
                            Aucun article dans cette wishlist
                          </p>
                        ) : (
                          <div className="space-y-3 pt-4">
                            {wishlist.items.map((item) => (
                              <div
                                key={item._id}
                                className={`flex gap-3 p-3 rounded-[12px] border transition ${
                                  item.is_offered_by_me
                                    ? "border-[#16a34a]/40 bg-[#f0fdf4]"
                                    : "border-[#f0f0f3] hover:border-[#d64550]/50 hover:bg-[#fafafa]"
                                }`}
                              >
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-16 h-16 rounded-[8px] bg-[#efeff3] flex-shrink-0 overflow-hidden"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </a>
                                <div className="flex-1 min-w-0">
                                  <div className="text-[13px] font-medium text-[#141418] line-clamp-2">
                                    {item.name}
                                  </div>
                                  <div className="text-[11px] text-[#a4a4ae] mt-1">
                                    {item.category}
                                  </div>
                                  {item.price > 0 && (
                                    <div className="text-[12px] font-semibold text-[#d64550] mt-1">
                                      {item.price.toFixed(2)} €
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-6 h-6 text-[#a4a4ae] hover:text-[#d64550]"
                                  >
                                    ↗
                                  </a>
                                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={item.is_offered_by_me}
                                      onChange={() => toggleOffer(wishlist._id, item._id)}
                                      className="w-3.5 h-3.5 accent-[#16a34a] cursor-pointer"
                                    />
                                    <span className={`text-[10px] font-medium ${item.is_offered_by_me ? "text-[#16a34a]" : "text-[#a4a4ae]"}`}>
                                      Offrir ?
                                    </span>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
