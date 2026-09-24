"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

type SecretSantaEvent = {
  _id: string;
  name: string;
  event_date?: string;
  budget?: number;
  participants: { email: string; name: string }[];
  organizer_id: string;
};

export default function SecretSantaListPage() {
  const router = useRouter();
  const [events,  setEvents]  = useState<SecretSantaEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/secret-santa")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setEvents(d); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f6f8] p-8 flex items-center justify-center text-[#1A1814]">
      <div className="w-full max-w-[1100px] h-[700px] bg-[var(--color-surface)] rounded-[20px] border border-[var(--color-border)] shadow-[0_8px_40px_rgba(0,0,0,0.08)] grid grid-cols-[220px_1fr] overflow-hidden">

        <Sidebar active="home" />

        <main className="flex flex-col overflow-hidden">
          {/* TOPBAR */}
          <div className="border-b border-[#d9d9e0] px-6 h-16 flex-shrink-0 flex items-center justify-between">
            <span className="text-sm font-medium text-[#141418]">🎅 Secret Santa</span>
            <button
              onClick={() => router.push("/secret-santa/create")}
              className="flex items-center gap-2 h-8 px-4 bg-[#d64550] text-white rounded-lg text-[12px] font-medium hover:bg-[#c23947] transition"
            >
              + Créer un groupe
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="h-full flex items-center justify-center text-[#a4a4ae]">Chargement...</div>
            ) : events.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-xs">
                  <div className="text-6xl mb-4">🎅</div>
                  <div className="text-[16px] font-semibold text-[#141418] mb-2">Aucun Secret Santa</div>
                  <div className="text-sm text-[#5e5e66] mb-6">
                    Organise un tirage au sort avec tes amis pour les fêtes, anniversaires ou tout autre événement.
                  </div>
                  <button
                    onClick={() => router.push("/secret-santa/create")}
                    className="px-6 py-3 bg-[#d64550] text-white rounded-xl text-sm font-medium hover:bg-[#c23947] transition"
                  >
                    🎲 Créer mon premier Secret Santa
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {events.map((ev) => {
                  const dateLabel = ev.event_date
                    ? new Date(ev.event_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
                    : null;
                  return (
                    <button
                      key={ev._id}
                      onClick={() => router.push(`/secret-santa/${ev._id}`)}
                      className="bg-white border border-[#d9d9e0] rounded-2xl overflow-hidden text-left hover:border-[#d64550] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition group"
                    >
                      <div className="bg-[#d64550] px-4 py-4 group-hover:bg-[#c23947] transition">
                        <div className="text-2xl mb-1">🎅</div>
                        <div className="font-semibold text-white text-[14px] leading-tight truncate">{ev.name}</div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex gap-2 flex-wrap">
                          {dateLabel && (
                            <span className="text-[11px] px-2 py-1 rounded-full bg-[#f6f6f8] text-[#5e5e66]">
                              📅 {dateLabel}
                            </span>
                          )}
                          {ev.budget && (
                            <span className="text-[11px] px-2 py-1 rounded-full bg-[#f6f6f8] text-[#5e5e66]">
                              🎁 {ev.budget.toLocaleString("fr-FR")} €
                            </span>
                          )}
                        </div>
                        <div className="text-[12px] text-[#a4a4ae]">
                          {ev.participants.length} participant{ev.participants.length > 1 ? "s" : ""}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Create card */}
                <button
                  onClick={() => router.push("/secret-santa/create")}
                  className="border-2 border-dashed border-[#d9d9e0] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-[#a4a4ae] hover:border-[#d64550] hover:text-[#d64550] transition"
                >
                  <span className="text-3xl">＋</span>
                  <span className="text-sm font-medium">Nouveau Secret Santa</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
