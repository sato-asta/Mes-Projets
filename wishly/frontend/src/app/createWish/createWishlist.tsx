"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { colors, emojis, visLabels } from "./constants";
import type { ListType, Friend, Color } from "./types";
import TypeSelector from "./components/TypeSelector";
import EventSection from "./components/EventSection";
import CollaboratorsPicker from "./components/CollaboratorsPicker";
import TemplatesGrid from "./components/TemplatesGrid";
import ListPreview from "./components/ListPreview";

export default function WishlyNewCategory() {
  const router = useRouter();

  const [listType,       setListType]       = useState<ListType>("personal");
  const [name,           setName]           = useState("");
  const [desc,           setDesc]           = useState("");
  const [emoji,          setEmoji]          = useState("🛍️");
  const [selectedColor,  setSelectedColor]  = useState<Color>(colors[0]);
  const [visibility,     setVisibility]     = useState("public");
  const [deadlineOn,     setDeadlineOn]     = useState(false);
  const [deadline,       setDeadline]       = useState("");
  const [eventOn,        setEventOn]        = useState(false);
  const [eventType,      setEventType]      = useState("birthday");
  const [eventDate,      setEventDate]      = useState("");
  const [collaborators,  setCollaborators]  = useState<string[]>([]);
  const [friends,        setFriends]        = useState<Friend[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [toast,          setToast]          = useState(false);
  const [error,          setError]          = useState(false);

  useEffect(() => {
    if (listType !== "collaborative") return;
    setFriendsLoading(true);
    fetch("/api/friends")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setFriends(data); })
      .finally(() => setFriendsLoading(false));
  }, [listType]);

  const toggleCollaborator = (email: string) => {
    setCollaborators((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const createList = async () => {
    if (!name.trim()) { setError(true); return; }
    setError(false);

    const res = await fetch("/api/wishlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: desc,
        emoji,
        color: selectedColor.color,
        visibility,
        is_public: visibility === "public",
        type: listType,
        event_type:    eventOn ? eventType : null,
        event_date:    eventOn ? eventDate || null : null,
        collaborators: listType === "collaborative" ? collaborators : [],
        deadline:      deadlineOn ? deadline || null : null,
      }),
    });

    if (res.ok) {
      setToast(true);
      setTimeout(() => { setToast(false); router.push("/home"); }, 1500);
    }
  };

  const selectedFriends = friends.filter((f) => collaborators.includes(f.email));

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
            <span className="text-sm font-medium text-[#141418]">Créer une nouvelle liste</span>
          </div>

          {/* CONTENT */}
          <div className="flex-1 grid grid-cols-[1fr_340px] overflow-hidden">
            {/* FORM */}
            <section className="p-8 overflow-y-auto border-r border-[#d9d9e0] space-y-6">
              <h1 className="text-2xl font-semibold text-[#141418]">Nouvelle liste</h1>

              <TypeSelector value={listType} onChange={setListType} />

              <TemplatesGrid
                listType={listType}
                onApplyPersonal={(tpl) => { setName(tpl.name); setDesc(tpl.desc); setEmoji(tpl.emoji); }}
                onApplyEvent={(tpl) => {
                  setName(tpl.name); setDesc(tpl.desc); setEmoji(tpl.emoji);
                  setEventType(tpl.eventType); setEventOn(true);
                }}
              />

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#141418]">Nom de la liste *</label>
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(false); }}
                  maxLength={40}
                  placeholder="ex : Vacances d'été..."
                  className={`w-full rounded-xl px-4 py-3 bg-[#f6f6f8] border outline-none text-[#141418] placeholder-[#a4a4ae] ${error ? "border-red-500" : "border-[#d9d9e0]"}`}
                />
                <div className="text-xs text-[#a4a4ae]">{name.length} / 40 caractères</div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#141418]">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Une petite description..."
                  className="w-full rounded-xl px-4 py-3 bg-[#f6f6f8] border border-[#d9d9e0] outline-none resize-none text-[#141418] placeholder-[#a4a4ae]"
                />
              </div>

              {/* Emoji */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#141418]">Icône</label>
                <div className="grid grid-cols-8 gap-2">
                  {emojis.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setEmoji(item)}
                      className={`h-10 rounded-lg border text-lg transition ${emoji === item ? "border-[#d64550] bg-[#fce9eb]" : "border-[#d9d9e0] bg-[#f6f6f8]"}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#141418]">Couleur</label>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition ${selectedColor.color === c.color ? "border-[#141418]" : "border-transparent"}`}
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#141418]">Visibilité</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(visLabels).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setVisibility(key)}
                      className={`rounded-xl border p-3 text-sm transition ${visibility === key ? "border-[#d64550] bg-[#fce9eb] text-[#141418]" : "border-[#d9d9e0] text-[#5e5e66] hover:bg-[#f6f6f8]"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collaborators */}
              {listType === "collaborative" && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-[#141418]">Inviter des collaborateurs</div>
                  <CollaboratorsPicker
                    friends={friends}
                    loading={friendsLoading}
                    selected={collaborators}
                    onToggle={toggleCollaborator}
                  />
                </div>
              )}

              {/* Event toggle */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setEventOn(!eventOn)}
                  className="text-sm font-medium text-[#d64550] hover:text-[#b83845] transition"
                >
                  {eventOn ? "Retirer l'événement" : "Associer à un événement"}
                </button>
                {eventOn && (
                  <EventSection
                    eventType={eventType}
                    eventDate={eventDate}
                    onEventTypeChange={setEventType}
                    onEventDateChange={setEventDate}
                  />
                )}
              </div>

              {/* Deadline */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setDeadlineOn(!deadlineOn)}
                  className="text-sm font-medium text-[#d64550] hover:text-[#b83845] transition"
                >
                  {deadlineOn ? "Retirer la date limite" : "Ajouter une date limite"}
                </button>
                {deadlineOn && (
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="rounded-xl px-4 py-3 bg-[#f6f6f8] border border-[#d9d9e0] text-[#141418] outline-none"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => router.back()}
                  className="flex-1 border border-[#d9d9e0] rounded-xl py-3 text-[#5e5e66] hover:bg-[#f6f6f8] transition"
                >
                  Annuler
                </button>
                <button
                  onClick={createList}
                  className="flex-[2] bg-[#d64550] text-white rounded-xl py-3 hover:bg-[#c23947] transition font-medium"
                >
                  Créer la liste
                </button>
              </div>
            </section>

            <ListPreview
              name={name}
              desc={desc}
              emoji={emoji}
              selectedColor={selectedColor}
              visibility={visibility}
              listType={listType}
              eventOn={eventOn}
              eventType={eventType}
              eventDate={eventDate}
              deadlineOn={deadlineOn}
              deadline={deadline}
              selectedFriends={selectedFriends}
            />
          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#141418] text-white px-5 py-3 rounded-xl shadow-xl text-sm">
          Liste créée avec succès !
        </div>
      )}
    </div>
  );
}
