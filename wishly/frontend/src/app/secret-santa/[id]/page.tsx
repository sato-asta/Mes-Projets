"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

type Item = {
  _id: string;
  name: string;
  price: number;
  url: string;
  image?: string;
  category: string;
};

type Participant = {
  email: string;
  name: string;
  avatar?: string;
  confirmed: boolean;
};

type SecretSantaEvent = {
  _id: string;
  name: string;
  event_date?: string;
  budget?: number;
  organizer_id: string;
  participants: Participant[];
  assigned_to?: { name: string; email: string; avatar?: string };
  assigned_wishlist?: Item[];
};

export default function SecretSantaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event,   setEvent]   = useState<SecretSantaEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawer,  setDrawer]  = useState<Item | null>(null);

  useEffect(() => {
    if (!eventId) return;
    fetch(`/api/secret-santa/${eventId}`)
      .then((r) => r.json())
      .then((data) => setEvent(data))
      .finally(() => setLoading(false));
  }, [eventId]);

  const budgetOk = (price: number) =>
    !event?.budget || price <= event.budget;

  const eventDateLabel = event?.event_date
    ? new Date(event.event_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-[#f6f6f8] p-8 flex items-center justify-center text-[#1A1814]">
      <div className="w-full max-w-[1100px] h-[700px] bg-[var(--color-surface)] rounded-[20px] border border-[#d9d9e0] shadow-[0_8px_40px_rgba(0,0,0,0.08)] grid grid-cols-[220px_1fr] overflow-hidden">

        <Sidebar active="home" />

        <main className="flex flex-col overflow-hidden">
          {/* TOPBAR */}
          <div className="border-b border-[#d9d9e0] px-6 h-16 flex-shrink-0 flex items-center gap-4">
            <button onClick={() => router.back()} className="text-sm text-[#5e5e66] hover:text-[#141418] transition">
              ← Retour
            </button>
            <div className="w-px h-5 bg-[#d9d9e0]" />
            <span className="text-sm font-medium text-[#141418]">
              {event?.name ?? "Secret Santa"}
            </span>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-[#a4a4ae]">Chargement...</div>
          ) : !event ? (
            <div className="flex-1 flex items-center justify-center text-[#a4a4ae]">Événement introuvable</div>
          ) : (
            <div className="flex-1 grid grid-cols-[1fr_300px] overflow-hidden">

              {/* MAIN */}
              <div className="flex flex-col overflow-hidden">
                {/* Hero banner */}
                <div className="bg-[#d64550] px-6 py-5 flex-shrink-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-3xl mb-1">🎅</div>
                      <div className="text-white font-semibold text-xl leading-tight">{event.name}</div>
                      <div className="flex gap-3 mt-2 flex-wrap">
                        {eventDateLabel && (
                          <span className="text-[12px] bg-white/20 text-white px-3 py-1 rounded-full">
                            📅 {eventDateLabel}
                          </span>
                        )}
                        {event.budget && (
                          <span className="text-[12px] bg-white/20 text-white px-3 py-1 rounded-full">
                            🎁 Budget : {event.budget.toLocaleString("fr-FR")} €
                          </span>
                        )}
                        <span className="text-[12px] bg-white/20 text-white px-3 py-1 rounded-full">
                          👥 {event.participants.length} participants
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment reveal */}
                {event.assigned_to ? (
                  <div className="px-6 py-4 border-b border-[#d9d9e0] bg-[#fdf5f5] flex-shrink-0">
                    <div className="text-xs uppercase tracking-wider text-[#a4a4ae] mb-2">Tu offres à</div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#d64550] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 overflow-hidden">
                        {event.assigned_to.avatar
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={event.assigned_to.avatar} alt={event.assigned_to.name} className="w-full h-full object-cover" />
                          : event.assigned_to.name.charAt(0).toUpperCase()
                        }
                      </div>
                      <div>
                        <div className="font-semibold text-[#141418]">{event.assigned_to.name}</div>
                        <div className="text-xs text-[#5e5e66]">Voici sa wishlist pour t&apos;inspirer 👇</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-4 border-b border-[#d9d9e0] bg-[#fef9c3] flex-shrink-0">
                    <div className="text-sm text-[#b45309]">⏳ Le tirage n&apos;a pas encore eu lieu ou tu n&apos;es pas encore assigné(e).</div>
                  </div>
                )}

                {/* Wishlist of assigned person */}
                <div className="flex-1 overflow-y-auto p-5">
                  {!event.assigned_to ? null : !event.assigned_wishlist?.length ? (
                    <div className="h-full flex items-center justify-center text-center">
                      <div>
                        <div className="text-4xl mb-3">🎁</div>
                        <div className="text-sm text-[#5e5e66] font-medium">{event.assigned_to.name} n&apos;a pas encore de wishlist</div>
                        <div className="text-xs text-[#a4a4ae] mt-1">Reviens plus tard ou offre une surprise !</div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {event.assigned_wishlist.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => setDrawer(item)}
                          className="bg-white border border-[var(--color-border)] rounded-[16px] overflow-hidden cursor-pointer hover:border-[#c8c3bb] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition flex flex-col"
                        >
                          <div className="h-[110px] bg-[#efeff3] flex items-center justify-center relative flex-shrink-0">
                            {item.image
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              : (
                                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 opacity-25">
                                  <path d="M6 14h24v14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V14z" />
                                  <path d="M10 14v-3a8 8 0 0 1 16 0v3" />
                                </svg>
                              )
                            }
                            {event.budget && !budgetOk(item.price) && (
                              <div className="absolute top-2 right-2 text-[10px] bg-[#fee2e2] text-[#dc2626] px-2 py-[2px] rounded-full font-medium">
                                Hors budget
                              </div>
                            )}
                          </div>
                          <div className="p-3 flex-1 flex flex-col gap-1">
                            <div className="text-[12px] font-medium text-[#141418] line-clamp-2 leading-[1.4]">{item.name}</div>
                            <div className={`text-[14px] font-semibold font-serif mt-auto ${budgetOk(item.price) ? "text-[#d64550]" : "text-[#a4a4ae]"}`}>
                              {item.price > 0 ? `${item.price.toLocaleString("fr-FR")} €` : "—"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SIDEBAR — participants */}
              <aside className="border-l border-[#d9d9e0] bg-[#efeff3] p-5 overflow-y-auto">
                <div className="text-xs uppercase tracking-wider text-[#a4a4ae] mb-4">Participants</div>
                <div className="space-y-3">
                  {event.participants.map((p) => (
                    <div key={p.email} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#d9d9e0] flex items-center justify-center text-xs font-medium text-[#5e5e66] flex-shrink-0 overflow-hidden">
                        {p.avatar
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                          : p.name.charAt(0).toUpperCase()
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#141418] truncate">{p.name}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-[2px] rounded-full font-medium ${p.confirmed ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#f6f6f8] text-[#a4a4ae]"}`}>
                        {p.confirmed ? "Prêt" : "En attente"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-[#d9d9e0]">
                  <div className="text-xs uppercase tracking-wider text-[#a4a4ae] mb-3">Règle du jeu</div>
                  <div className="text-[12px] text-[#5e5e66] space-y-2">
                    <p>🎲 Chaque participant a été assigné aléatoirement.</p>
                    <p>🤫 Seul toi sais qui tu dois gâter.</p>
                    {event.budget && <p>💰 Budget max : <strong>{event.budget.toLocaleString("fr-FR")} €</strong></p>}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>

      {/* DRAWER */}
      {drawer && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[200] flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setDrawer(null)}
        >
          <div className="bg-white rounded-[20px] w-[360px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
            <div className="h-[150px] bg-[#efeff3] flex items-center justify-center relative">
              {drawer.image
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={drawer.image} alt={drawer.name} className="w-full h-full object-cover" />
                : (
                  <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-25">
                    <path d="M6 14h24v14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V14z" />
                    <path d="M10 14v-3a8 8 0 0 1 16 0v3" />
                  </svg>
                )
              }
              <button
                onClick={() => setDrawer(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/90 border border-[#d9d9e0] flex items-center justify-center"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-[#5e5e66]">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <div className="font-serif text-[17px] font-semibold text-[#141418]">{drawer.name}</div>
              <div className="font-serif text-[22px] font-semibold text-[#d64550] mt-1 mb-4">
                {drawer.price > 0 ? `${drawer.price.toLocaleString("fr-FR")} €` : "Prix non renseigné"}
              </div>
              {event?.budget && drawer.price > event.budget && (
                <div className="mb-3 text-[12px] text-[#dc2626] bg-[#fee2e2] px-3 py-2 rounded-lg">
                  ⚠️ Dépasse le budget de {(drawer.price - event.budget).toLocaleString("fr-FR")} €
                </div>
              )}
              <div className="flex gap-2">
                {drawer.url && (
                  <button
                    onClick={() => window.open(drawer.url, "_blank")}
                    className="flex-[2] py-[11px] bg-[#d64550] text-white rounded-[10px] text-[13px] font-semibold flex items-center justify-center gap-2 hover:opacity-85 transition"
                  >
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                    Voir le site
                  </button>
                )}
                <button
                  onClick={() => setDrawer(null)}
                  className="flex-1 py-[11px] border border-[#d9d9e0] text-[#5e5e66] rounded-[10px] text-[13px] hover:bg-[#f6f6f8] transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
