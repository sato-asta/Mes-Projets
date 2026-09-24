"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

type Friend = { id: string; name: string; email: string; avatar: string };

export default function CreateSecretSantaPage() {
  const router = useRouter();

  const [name,         setName]         = useState("🎅 Noël en famille");
  const [eventDate,    setEventDate]    = useState("");
  const [budget,       setBudget]       = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [friends,      setFriends]      = useState<Friend[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState("");
  const [toast,        setToast]        = useState(false);

  useEffect(() => {
    fetch("/api/friends")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setFriends(d); })
      .finally(() => setLoading(false));
  }, []);

  const toggleParticipant = (email: string) => {
    setParticipants((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) { setError("Donne un nom à ton Secret Santa"); return; }
    if (participants.length < 2) { setError("Il faut au moins 2 participants"); return; }
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/secret-santa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        event_date: eventDate || null,
        budget: budget ? parseFloat(budget) : null,
        participants,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setToast(true);
      setTimeout(() => router.push(`/secret-santa/${data.id ?? ""}`), 1500);
    } else {
      setError("Erreur lors de la création");
      setSubmitting(false);
    }
  };

  const selectedFriends = friends.filter((f) => participants.includes(f.email));

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
            <span className="text-sm font-medium text-[#141418]">Créer un Secret Santa</span>
          </div>

          <div className="flex-1 grid grid-cols-[1fr_340px] overflow-hidden">
            {/* FORM */}
            <section className="p-8 overflow-y-auto border-r border-[#d9d9e0] space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-[#141418]">Nouveau Secret Santa 🎅</h1>
                <p className="text-sm text-[#5e5e66] mt-1">Organise le tirage au sort et chacun verra qui il doit gâter.</p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#141418]">Nom de l&apos;événement *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  className="w-full rounded-xl px-4 py-3 bg-[#f6f6f8] border border-[#d9d9e0] outline-none text-[#141418]"
                />
              </div>

              {/* Date + Budget */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#141418]">Date de l&apos;échange</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 bg-[#f6f6f8] border border-[#d9d9e0] outline-none text-[#141418]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#141418]">Budget max par cadeau</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="ex : 30"
                      className="w-full rounded-xl px-4 py-3 pr-8 bg-[#f6f6f8] border border-[#d9d9e0] outline-none text-[#141418]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a4a4ae] text-sm">€</span>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#141418]">Participants *</label>
                  <span className="text-xs text-[#a4a4ae]">{participants.length} sélectionné(s)</span>
                </div>
                {loading ? (
                  <div className="text-sm text-[#a4a4ae]">Chargement de tes amis...</div>
                ) : friends.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#d9d9e0] p-6 text-center">
                    <div className="text-3xl mb-2">👥</div>
                    <div className="text-sm text-[#5e5e66]">Aucun ami pour l&apos;instant</div>
                    <div className="text-xs text-[#a4a4ae] mt-1">Ajoute des amis d&apos;abord depuis l&apos;onglet Amis</div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {friends.map((friend) => {
                      const selected = participants.includes(friend.email);
                      return (
                        <button
                          key={friend.email}
                          type="button"
                          onClick={() => toggleParticipant(friend.email)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border transition ${
                            selected ? "border-[#d64550] bg-[#fce9eb]" : "border-[#d9d9e0] hover:bg-[#f6f6f8]"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-[#d9d9e0] flex items-center justify-center text-sm font-medium text-[#5e5e66] flex-shrink-0 overflow-hidden">
                            {friend.avatar
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                              : friend.name.charAt(0).toUpperCase()
                            }
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-[#141418]">{friend.name}</div>
                            <div className="text-xs text-[#a4a4ae]">{friend.email}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${selected ? "bg-[#d64550] border-[#d64550]" : "border-[#d9d9e0]"}`}>
                            {selected && (
                              <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" className="w-3 h-3">
                                <path d="M3 8l3.5 3.5 6.5-7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => router.back()}
                  className="flex-1 border border-[#d9d9e0] rounded-xl py-3 text-[#5e5e66] hover:bg-[#f6f6f8] transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreate}
                  disabled={submitting}
                  className="flex-[2] bg-[#d64550] text-white rounded-xl py-3 hover:bg-[#c23947] transition font-medium disabled:opacity-50"
                >
                  {submitting ? "Tirage en cours..." : "🎲 Lancer le tirage"}
                </button>
              </div>
            </section>

            {/* PREVIEW */}
            <aside className="p-8 bg-[#efeff3] space-y-5 overflow-y-auto">
              <div className="text-xs uppercase tracking-wider text-[#a4a4ae]">Aperçu</div>

              {/* Event card */}
              <div className="bg-white rounded-2xl border border-[#d9d9e0] overflow-hidden">
                <div className="bg-[#d64550] px-5 py-4">
                  <div className="text-2xl mb-1">🎅</div>
                  <div className="font-semibold text-white text-[15px] leading-tight">{name || "Nom de l'événement"}</div>
                  {eventDate && (
                    <div className="text-[12px] text-white/80 mt-1">
                      📅 {new Date(eventDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  )}
                  {budget && (
                    <div className="text-[12px] text-white/80 mt-[2px]">🎁 Budget max : {parseFloat(budget).toLocaleString("fr-FR")} €</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#a4a4ae] mb-3">
                    Participants ({participants.length})
                  </div>
                  {selectedFriends.length === 0 ? (
                    <div className="text-sm text-[#a4a4ae]">Aucun participant sélectionné</div>
                  ) : (
                    <div className="space-y-2">
                      {selectedFriends.map((f) => (
                        <div key={f.email} className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#d9d9e0] flex items-center justify-center text-xs font-medium text-[#5e5e66] flex-shrink-0 overflow-hidden">
                            {f.avatar
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" />
                              : f.name.charAt(0).toUpperCase()
                            }
                          </div>
                          <span className="text-sm text-[#141418]">{f.name}</span>
                          <span className="ml-auto text-[10px] text-[#a4a4ae]">🎁 ?</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {participants.length >= 2 && (
                <div className="bg-[#dcfce7] border border-[#86efac] rounded-xl p-3 text-sm text-[#16a34a]">
                  ✓ Prêt pour le tirage — chaque participant recevra en privé qui il doit gâter.
                </div>
              )}
              {participants.length === 1 && (
                <div className="bg-[#fef9c3] border border-[#fde047] rounded-xl p-3 text-sm text-[#b45309]">
                  Il faut au moins 2 participants pour lancer le tirage.
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#141418] text-white px-5 py-3 rounded-xl shadow-xl text-sm">
          🎅 Secret Santa créé ! Redirection...
        </div>
      )}
    </div>
  );
}
