"use client";

// Page de gestion des amis — affiche le code ami, permet d'en ajouter,
// de gérer les demandes reçues et de voir/retirer ses amis
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";

// Type d'une demande d'ami reçue
type FriendRequest = {
  id: string;
  from_email: string;
  from_name: string;
  from_avatar: string;
  from_friend_code: string;
  created_at: string;
};

// Type d'un ami accepté
type Friend = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  friend_code: string;
};

export default function FriendsPage(): JSX.Element {
  useSession();
  const router = useRouter();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  // Mon propre code ami (généré par l'API)
  const [myCode, setMyCode] = useState("");
  // Valeur saisie dans le champ "ajouter un ami par code"
  const [addCode, setAddCode] = useState("");
  // Toast de notification (ok = vert/noir, err = rouge)
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  // Indique si le code ami a été copié dans le presse-papiers (feedback visuel)
  const [copyCopied, setCopyCopied] = useState(false);
  // ID de la demande en cours de traitement (pour désactiver les boutons)
  const [loadingReq, setLoadingReq] = useState<string | null>(null);

  // Affiche un toast pendant 3 secondes
  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Charge amis + demandes + mon code ami depuis l'API
  const fetchAll = useCallback(() => {
    fetch("/api/friends")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setFriends(d); })
      .catch(() => {});

    fetch("/api/friends/requests")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setRequests(d); })
      .catch(() => {});

    fetch("/api/friends/code")
      .then((r) => r.json())
      .then((d) => { if (d.friend_code) setMyCode(d.friend_code); })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Copie le code ami dans le presse-papiers et affiche "Copié !" pendant 2s
  const copyCode = () => {
    navigator.clipboard.writeText(myCode).then(() => {
      setCopyCopied(true);
      setTimeout(() => setCopyCopied(false), 2000);
    });
  };

  // Envoie une demande d'ami via le code saisi
  const sendRequest = async () => {
    if (!addCode.trim()) return;
    const res = await fetch("/api/friends/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friend_code: addCode.trim().toUpperCase() }),
    });
    const data = await res.json();
    if (res.ok) {
      showToast(`Demande envoyée à ${data.to}`);
      setAddCode("");
    } else {
      showToast(data.detail ?? "Erreur", "err");
    }
  };

  // Accepte une demande d'ami et recharge toute la liste
  const accept = async (reqId: string) => {
    setLoadingReq(reqId);
    const res = await fetch("/api/friends/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: reqId }),
    });
    const data = await res.json();
    if (res.ok) {
      showToast("Ami ajouté !");
      fetchAll();
    } else {
      showToast(data.detail ?? "Erreur", "err");
    }
    setLoadingReq(null);
  };

  // Refuse une demande d'ami et la retire de la liste localement (optimistic update)
  const decline = async (reqId: string) => {
    setLoadingReq(reqId);
    const res = await fetch("/api/friends/decline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: reqId }),
    });
    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
      showToast("Demande refusée");
    }
    setLoadingReq(null);
  };

  // Supprime un ami et le retire de la liste localement
  const removeFriend = async (friendEmail: string) => {
    const res = await fetch("/api/friends", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friend_email: friendEmail }),
    });
    if (res.ok) {
      setFriends((prev) => prev.filter((f) => f.email !== friendEmail));
      showToast("Ami supprimé");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-6 md:p-10">

      {/* Toast de notification — rouge si erreur, noir si succès */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 text-white text-[12px] px-4 py-2 rounded-[10px] shadow-lg flex items-center gap-2 ${
            toast.type === "err" ? "bg-[#d64550]" : "bg-[#141418]"
          }`}
        >
          <span>{toast.type === "err" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* Carte principale : sidebar + contenu */}
      <div className="w-full max-w-[1100px] h-[700px] bg-[var(--color-surface)] rounded-[20px] border border-[var(--color-border)] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] grid grid-cols-[220px_1fr]">

        <Sidebar active="friends" />

        {/* ── Zone principale ── */}
        <main className="flex flex-col overflow-hidden">
          <header className="border-b border-[#d9d9e0] px-6 py-5">
            <h1 className="font-serif text-[18px] font-semibold text-[#141418]">Amis</h1>
          </header>

          {/* Contenu scrollable avec espacement vertical */}
          <section className="flex-1 overflow-y-auto px-6 py-5 bg-[#f6f6f8] space-y-6">

            {/* ── Mon code ami ── */}
            <div className="bg-white rounded-2xl border border-[#d9d9e0] p-5">
              <h2 className="font-serif text-[14px] font-semibold text-[#141418] mb-1">
                Mon code ami
              </h2>
              <p className="text-[11px] text-[#a4a4ae] mb-3">
                Partage ce code pour que tes amis puissent t&apos;envoyer une demande.
              </p>
              <div className="flex items-center gap-3">
                {/* Police mono + tracking large pour une meilleure lisibilité du code */}
                {/* select-all : sélectionne tout le texte en un clic */}
                <div className="flex-1 bg-[#efeff3] rounded-[10px] px-4 py-2 font-mono text-[16px] font-bold tracking-[0.2em] text-[#141418] text-center select-all">
                  {myCode || "—"}
                </div>
                <button
                  onClick={copyCode}
                  disabled={!myCode}
                  className="h-10 px-4 rounded-[10px] bg-[#d64550] text-white text-[12px] font-medium hover:opacity-90 transition disabled:opacity-40"
                >
                  {copyCopied ? "Copié !" : "Copier"}
                </button>
              </div>
            </div>

            {/* ── Ajouter un ami par code ── */}
            <div className="bg-white rounded-2xl border border-[#d9d9e0] p-5">
              <h2 className="font-serif text-[14px] font-semibold text-[#141418] mb-1">
                Ajouter un ami
              </h2>
              <p className="text-[11px] text-[#a4a4ae] mb-3">
                Entre le code ami d&apos;une personne pour lui envoyer une demande.
              </p>
              <div className="flex gap-3">
                {/* Input code ami : majuscules forcées, police mono, max 8 caractères */}
                <input
                  type="text"
                  value={addCode}
                  onChange={(e) => setAddCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && sendRequest()}
                  placeholder="Ex : A3X9KL2M"
                  maxLength={8}
                  className="flex-1 h-10 rounded-[10px] border border-[#d9d9e0] bg-[#efeff3] px-4 font-mono text-[14px] tracking-[0.12em] uppercase outline-none focus:border-[#d64550] focus:bg-white transition"
                />
                {/* Bouton actif uniquement quand le code fait exactement 8 caractères */}
                <button
                  onClick={sendRequest}
                  disabled={addCode.trim().length !== 8}
                  className="h-10 px-5 rounded-[10px] bg-[#d64550] text-white text-[12px] font-medium hover:opacity-90 transition disabled:opacity-40"
                >
                  Envoyer
                </button>
              </div>
            </div>

            {/* ── Demandes d'amis reçues (masquée si aucune demande) ── */}
            {/* Bordure rouge légère pour signaler visuellement qu'une action est requise */}
            {requests.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#d64550]/30 p-5">
                <h2 className="font-serif text-[14px] font-semibold text-[#141418] mb-3 flex items-center gap-2">
                  Demandes reçues
                  {/* Badge rouge avec le nombre de demandes en attente */}
                  <span className="text-[10px] bg-[#d64550] text-white rounded-full px-2 py-0.5 font-bold">
                    {requests.length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center gap-3 p-3 rounded-[12px] border border-[#f0f0f3] bg-[#fafafa]"
                    >
                      {/* Avatar initiales de l'expéditeur */}
                      <div className="w-9 h-9 rounded-full bg-[#d64550] text-white text-[12px] font-semibold flex items-center justify-center flex-shrink-0">
                        {req.from_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#141418] truncate">
                          {req.from_name}
                        </div>
                        <div className="text-[10px] text-[#a4a4ae] font-mono">{req.from_friend_code}</div>
                      </div>
                      {/* Boutons accepter / refuser / voir wishlist — désactivés pendant le traitement */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => router.push(`/friend-profile/${encodeURIComponent(req.from_email)}`)}
                          className="h-8 px-3 rounded-[8px] bg-[#d64550] text-white text-[11px] font-medium hover:opacity-90 transition disabled:opacity-50"
                        >
                          Voir wishlist
                        </button>
                        <button
                          onClick={() => accept(req.id)}
                          disabled={loadingReq === req.id}
                          className="h-8 px-3 rounded-[8px] bg-[#d64550] text-white text-[11px] font-medium hover:opacity-90 transition disabled:opacity-50"
                        >
                          Accepter
                        </button>
                        <button
                          onClick={() => decline(req.id)}
                          disabled={loadingReq === req.id}
                          className="h-8 px-3 rounded-[8px] border border-[#d9d9e0] text-[#5e5e66] text-[11px] font-medium hover:bg-[#efeff3] transition disabled:opacity-50"
                        >
                          Refuser
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Liste de mes amis ── */}
            <div className="bg-white rounded-2xl border border-[#d9d9e0] p-5">
              <h2 className="font-serif text-[14px] font-semibold text-[#141418] mb-3">
                Mes amis ({friends.length})
              </h2>

              {/* État vide */}
              {friends.length === 0 ? (
                <div className="text-center py-6 flex flex-col items-center gap-2">
                  <div className="w-[38px] h-[38px] rounded-[10px] bg-[#efeff3] flex items-center justify-center text-xl opacity-50">
                    👥
                  </div>
                  <p className="text-[11px] text-[#a4a4ae]">
                    Aucun ami pour l&apos;instant. Entre un code ci-dessus pour commencer.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center gap-3 p-3 rounded-[12px] border border-[#f0f0f3] hover:bg-[#fafafa] transition"
                    >
                      {/* Avatar initiales avec fond rose translucide */}
                      <div className="w-9 h-9 rounded-full bg-[#d64550]/20 text-[#d64550] text-[12px] font-semibold flex items-center justify-center flex-shrink-0">
                        {friend.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#141418] truncate">
                          {friend.name}
                        </div>
                        <div className="text-[10px] text-[#a4a4ae] font-mono">{friend.friend_code}</div>
                      </div>
                      {/* Boutons : voir wishlist + retirer */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => router.push(`/friend-profile/${encodeURIComponent(friend.email)}`)}
                          className="h-7 px-3 rounded-[8px] bg-[#d64550] text-white text-[10px] hover:opacity-90 transition flex-shrink-0"
                        >
                          Voir wishlist
                        </button>
                        <button
                          onClick={() => removeFriend(friend.email)}
                          className="h-7 px-3 rounded-[8px] border border-[#d9d9e0] text-[#a4a4ae] text-[10px] hover:border-[#d64550] hover:text-[#d64550] transition flex-shrink-0"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
