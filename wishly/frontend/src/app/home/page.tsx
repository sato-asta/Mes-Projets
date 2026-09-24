"use client";

// Page d'accueil / tableau de bord — affiche les wishlists de l'utilisateur
// et permet de rechercher des articles à ajouter via une barre de recherche
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";

// Type d'une wishlist récupérée depuis l'API
type Wishlist = {
  _id: string;
  name: string;
  is_public: boolean;
  emoji?: string;
  description?: string;
  color?: string;
  is_default?: boolean;
  member_count?: number;
  is_collaborative?: boolean;
  is_owner?: boolean;
};

type WishlistInvitation = {
  _id: string;
  name: string;
  emoji: string;
  color: string;
  owner_name: string;
  owner_email: string;
};

// Type d'un ami
type Friend = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  friend_code: string;
};

// Type d'un résultat de recherche d'article
type SearchResult = {
  title: string;
  url: string;
  thumbnail: string;
  source: string;
  snippet: string;
};

export default function WishlistDashboardSection(): JSX.Element {
  const router = useRouter();
  const { data: session } = useSession();
  const searchRef = useRef<HTMLInputElement>(null);
  // Référence du timer de debounce pour éviter d'envoyer une requête à chaque frappe
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [invitations, setInvitations] = useState<WishlistInvitation[]>([]);
  // Valeur actuelle de la barre de recherche
  const [query, setQuery] = useState("");
  // Résultats retournés par l'API de recherche
  const [results, setResults] = useState<SearchResult[]>([]);
  // Indique si une recherche est en cours (affiche ⏳)
  const [searching, setSearching] = useState(false);
  // URL du résultat dont on a cliqué "+ Ajouter" (affiche le sélecteur de liste)
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  // Message toast affiché en bas de l'écran après ajout d'un article
  const [toast, setToast] = useState<string | null>(null);
  // Liste des amis
  const [friends, setFriends] = useState<Friend[]>([]);

  // Charge les wishlists au montage — la liste par défaut est triée en premier
  useEffect(() => {
    fetch("/api/wishlists")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = [...data].sort(
            (a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0)
          );
          setWishlists(sorted);
        }
      })
      .catch(() => {});

    // Charge les amis
    fetch("/api/friends")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFriends(data);
        }
      })
      .catch(() => {});

    // Charge les invitations de wishlists collaboratives en attente
    fetch("/api/wishlists/invitations")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setInvitations(data);
      })
      .catch(() => {});
  }, []);

  // Gère la recherche avec debounce de 400ms pour ne pas surcharger l'API
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setExpandedResult(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Si la barre est vide, on vide les résultats
    if (!value.trim()) {
      setResults([]);
      return;
    }

    // On attend 400ms après la dernière frappe avant d'envoyer la requête
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, []);

  // Extrait le prix depuis le snippet texte (ex: "49,99 €" → 49.99)
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/[^\d,]/g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // Ajoute un article à une wishlist via l'API, puis affiche un toast de confirmation
  const addToWishlist = async (
    item: SearchResult,
    wishlistId: string,
    wishlistName: string
  ) => {
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: item.title,
        price: parsePrice(item.snippet),
        image: item.thumbnail,
        url: item.url,
        category: item.source,
        wishlist_id: wishlistId,
      }),
    });
    setExpandedResult(null);
    setToast(`Ajouté à "${wishlistName}"`);
    // Le toast disparaît automatiquement après 3 secondes
    setTimeout(() => setToast(null), 3000);
  };

  // Gère le clic sur "+ Ajouter" :
  // - Si l'utilisateur n'a qu'une liste (la liste par défaut), on ajoute directement
  // - Sinon, on affiche le sélecteur de liste sous la carte
  const handleAddClick = (result: SearchResult) => {
    const nonDefault = wishlists.filter((wl) => !wl.is_default);
    const def = wishlists.find((wl) => wl.is_default);

    if (nonDefault.length === 0 && def) {
      addToWishlist(result, def._id, def.name);
    } else {
      setExpandedResult(expandedResult === result.url ? null : result.url);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    const res = await fetch(`/api/wishlists/${invitationId}/accept`, { method: "PATCH" });
    if (!res.ok) return;
    setInvitations((prev) => prev.filter((inv) => inv._id !== invitationId));
    const wlRes = await fetch("/api/wishlists");
    const wlData = await wlRes.json();
    if (Array.isArray(wlData)) {
      const sorted = [...wlData].sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));
      setWishlists(sorted);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    const res = await fetch(`/api/wishlists/${invitationId}/decline`, { method: "PATCH" });
    if (!res.ok) return;
    setInvitations((prev) => prev.filter((inv) => inv._id !== invitationId));
  };

  // On est en mode recherche si la barre contient du texte
  const isSearchMode = query.trim().length > 0;

  return (
    // Fond gris clair plein écran centré
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-6 md:p-10">

      {/* Toast de confirmation en bas à droite — s'affiche après ajout d'un article */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141418] text-white text-[12px] px-4 py-2 rounded-[10px] shadow-lg flex items-center gap-2">
          {/* Coche verte */}
          <span className="text-[#4ade80]">✓</span>
          {toast}
        </div>
      )}

      {/* Carte principale : sidebar + contenu — grid 2 colonnes */}
      {/* grid-cols-[220px_1fr] : sidebar fixe à 220px, le reste prend tout l'espace */}
      <div className="w-full max-w-[1100px] h-[700px] bg-[var(--color-surface)] rounded-[20px] border border-[var(--color-border)] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] grid grid-cols-[220px_1fr]">

        {/* Sidebar avec "home" actif */}
        <Sidebar active="home" />

        {/* ── Zone principale ── */}
        <main className="flex flex-col overflow-hidden">

          {/* En-tête avec la barre de recherche */}
          <header className="border-b border-[#d9d9e0] p-6">
            {/* Barre de recherche avec icône à gauche et bouton clear à droite */}
            <div className="relative">
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Rechercher un article à ajouter…"
                // focus:bg-white : le fond devient blanc au focus pour un effet "activé"
                className="w-full h-10 rounded-[10px] border border-[#d9d9e0] bg-[#efeff3] pl-10 pr-4 text-[13px] outline-none focus:border-[#d64550] focus:bg-white transition"
              />
              {/* Icône de recherche / chargement positionnée à l'intérieur de l'input */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4a4ae] text-sm pointer-events-none">
                {searching ? "⏳" : "🔍"}
              </span>
              {/* Bouton ×  pour effacer la recherche — visible uniquement si query non vide */}
              {query && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a4a4ae] hover:text-[#141418] text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>
          </header>

          {/* Zone de contenu scrollable */}
          <section className="flex-1 overflow-y-auto px-4 py-4 bg-[#f6f6f8] space-y-4">

            {/* ── Mode recherche : affiche les résultats ── */}
            {isSearchMode ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-[17px] font-semibold text-[#141418]">
                    Résultats pour &laquo;&nbsp;{query}&nbsp;&raquo;
                  </h2>
                  {searching && (
                    <span className="text-[11px] text-[#a4a4ae]">Recherche en cours…</span>
                  )}
                </div>

                {/* Message vide si aucun résultat — bordure en pointillés */}
                {results.length === 0 && !searching ? (
                  <div className="text-center p-8 bg-white rounded-2xl border border-dashed border-[#d9d9e0] text-[12px] text-[#a4a4ae]">
                    Aucun résultat trouvé
                  </div>
                ) : (
                  <div className="space-y-2">
                    {results.map((result, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-[14px] border border-[#d9d9e0] overflow-hidden"
                      >
                        {/* Ligne principale d'un résultat : image + infos + bouton */}
                        <div className="flex items-center gap-3 p-3">
                          {result.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={result.thumbnail}
                              alt=""
                              // object-cover pour que l'image remplisse le carré sans déformation
                              className="w-12 h-12 rounded-[8px] object-cover flex-shrink-0 bg-[#efeff3]"
                            />
                          ) : (
                            // Placeholder si pas d'image
                            <div className="w-12 h-12 rounded-[8px] bg-[#efeff3] flex-shrink-0 flex items-center justify-center text-xl">
                              🛍️
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            {/* truncate coupe le texte trop long avec "..." */}
                            <div className="text-[13px] font-semibold text-[#141418] truncate">
                              {result.title}
                            </div>
                            <div className="text-[11px] text-[#a4a4ae]">{result.source}</div>
                            <div className="text-[11px] text-[#5e5e66] truncate">{result.snippet}</div>
                          </div>
                          {/* Bouton "+ Ajouter" : rouge plein si sélecteur ouvert, transparent sinon */}
                          <button
                            onClick={() => handleAddClick(result)}
                            className={`flex-shrink-0 h-8 px-3 rounded-[8px] text-[12px] font-medium transition ${
                              expandedResult === result.url
                                ? "bg-[#d64550] text-white"
                                : "bg-[#d64550]/10 text-[#d64550] hover:bg-[#d64550] hover:text-white"
                            }`}
                          >
                            + Ajouter
                          </button>
                        </div>

                        {/* Sélecteur de liste — visible uniquement pour le résultat sélectionné */}
                        {expandedResult === result.url && (
                          <div className="border-t border-[#f0f0f3] bg-[#fafafa] px-4 py-3">
                            <p className="text-[11px] text-[#a4a4ae] font-medium mb-2">
                              Choisir une liste :
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {wishlists.map((wl) => (
                                <button
                                  key={wl._id}
                                  onClick={() => addToWishlist(result, wl._id, wl.name)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] bg-white border border-[#d9d9e0] text-[#5e5e66] hover:border-[#d64550] hover:text-[#d64550] transition"
                                >
                                  <span>{wl.is_default ? "⭐" : wl.emoji ?? "🛍️"}</span>
                                  <span>{wl.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            ) : (
              // ── Mode normal : affiche les wishlists + section amis ──
              <>
                {/* Section "Invitations en attente" */}
                {invitations.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="font-serif text-[17px] font-semibold text-[#141418]">
                      Invitations en attente
                    </h2>
                    {invitations.map((inv) => (
                      <div
                        key={inv._id}
                        className="bg-white border border-[#d64550]/30 rounded-2xl p-4 flex items-center gap-3"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ backgroundColor: inv.color + "22" }}
                        >
                          {inv.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-[#141418] truncate">{inv.name}</div>
                          <div className="text-[11px] text-[#a4a4ae]">Invité par {inv.owner_name}</div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleAcceptInvitation(inv._id)}
                            className="h-8 px-3 rounded-[8px] text-[12px] font-medium bg-[#16a34a] text-white hover:opacity-85 transition"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => handleDeclineInvitation(inv._id)}
                            className="h-8 px-3 rounded-[8px] text-[12px] font-medium bg-[#efeff3] text-[#5e5e66] hover:bg-[#d9d9e0] transition"
                          >
                            Refuser
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Section "Mes souhaits" */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-[17px] font-semibold text-[#141418]">
                      Mes souhaits
                    </h2>
                    <button
                      onClick={() => router.push("/createWish")}
                      className="h-8 px-4 rounded-lg border border-[#d9d9e0] text-xs text-[#5e5e66] hover:bg-white transition"
                    >
                      + Nouvelle liste
                    </button>
                  </div>

                  {/* État vide : aucune wishlist */}
                  {wishlists.length === 0 ? (
                    <div className="flex flex-col items-center text-center gap-2 p-8 bg-white border border-dashed border-[#d9d9e0] rounded-2xl">
                      {/* Icône décorative atténuée */}
                      <div className="w-[38px] h-[38px] flex items-center justify-center text-xl rounded-[10px] bg-[#efeff3] opacity-50">
                        ♥
                      </div>
                      <h3 className="text-[13px] font-serif font-semibold text-[#141418]">
                        Votre wishlist est vide
                      </h3>
                      <p className="max-w-[260px] text-[11px] leading-relaxed text-[#a4a4ae]">
                        Commencez par créer une liste ou rechercher un article dans la barre de recherche.
                      </p>
                      {/* Bouton focus sur la barre de recherche */}
                      <button
                        onClick={() => searchRef.current?.focus()}
                        className="mt-1 h-8 px-4 text-[11px] font-medium text-white bg-[#d64550] rounded-lg hover:opacity-90 transition"
                      >
                        Rechercher un article
                      </button>
                    </div>
                  ) : (
                    // Grille 2 colonnes des wishlists
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {wishlists.map((wl) => (
                        <div
                          key={wl._id}
                          onClick={() => router.push("/wishlist/" + wl._id)}
                          // hover:shadow-sm : légère ombre au survol pour l'interactivité
                          className="bg-white border border-[#d9d9e0] rounded-2xl p-4 flex gap-3 items-start cursor-pointer hover:shadow-sm transition"
                        >
                          {/* Icône de la liste avec couleur personnalisée en arrière-plan */}
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                            style={{
                              // On ajoute "22" en hexa pour obtenir ~13% d'opacité
                              backgroundColor: wl.color ? `${wl.color}22` : "#efeff3",
                            }}
                          >
                            {wl.is_default ? "⭐" : wl.emoji ?? "🛍️"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="font-semibold text-[13px] text-[#141418] truncate">
                                {wl.name}
                              </div>
                              {wl.is_default && (
                                <span className="text-[9px] px-[6px] py-[2px] rounded-full bg-[#d64550]/10 text-[#d64550] font-semibold flex-shrink-0">
                                  Par défaut
                                </span>
                              )}
                              {wl.is_collaborative && (
                                <span className="text-[9px] px-[6px] py-[2px] rounded-full bg-blue-100 text-blue-600 font-semibold flex-shrink-0">
                                  Collaboratif
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#a4a4ae] flex items-center gap-2">
                              <span>{wl.is_public ? "Publique" : "Privée"}</span>
                              {wl.is_collaborative && wl.member_count !== undefined && (
                                <span className="flex items-center gap-1">
                                  · 👥 {wl.member_count} membre{wl.member_count > 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                            {wl.description && (
                              <div className="text-[11px] text-[#a4a4ae] truncate">
                                {wl.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section "Wishlists de mes amis" */}
                <div className="space-y-3">
                  <h2 className="font-serif text-[17px] font-semibold text-[#141418]">
                    Wishlists de mes amis
                  </h2>
                  {/* État vide — invite à ajouter des amis */}
                  {friends.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#d9d9e0] bg-white p-8 flex flex-col items-center text-center gap-2">
                      <div className="w-[38px] h-[38px] rounded-[10px] bg-[#efeff3] flex items-center justify-center text-xl opacity-50">
                        👥
                      </div>
                      <h3 className="font-serif text-[13px] font-semibold text-[#141418]">
                        Aucun ami pour l&apos;instant
                      </h3>
                      <p className="max-w-[260px] text-[11px] text-[#a4a4ae] leading-relaxed">
                        Invitez des amis pour découvrir leurs souhaits et partager les
                        vôtres pour les grandes occasions.
                      </p>
                      <button
                        onClick={() => router.push("/friends")}
                        className="mt-1 h-8 px-4 rounded-lg bg-[#d64550] text-white text-[11px] font-medium hover:opacity-90 transition"
                      >
                        Inviter des amis
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {friends.map((friend) => (
                        <div
                          key={friend.id}
                          className="rounded-2xl border border-[#d9d9e0] bg-white p-4 flex items-center gap-3 hover:border-[#d64550]/50 hover:bg-[#fafafa] transition cursor-pointer"
                          onClick={() => router.push(`/friend-profile/${encodeURIComponent(friend.email)}`)}
                        >
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-[#d64550] text-white text-[12px] font-semibold flex items-center justify-center flex-shrink-0">
                            {friend.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-[#141418] truncate">
                              {friend.name}
                            </div>
                            <div className="text-[10px] text-[#a4a4ae] font-mono">{friend.friend_code}</div>
                          </div>
                          {/* Icône flèche */}
                          <div className="text-[#a4a4ae] flex-shrink-0">→</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
