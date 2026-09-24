"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import NotificationsPanel, { type PriceNotification } from "./NotificationsPanel";
import { useTheme } from "./ThemeProvider";

type Friend = {
  id: string;
  name: string;
  email: string;
  friend_code: string;
};

type Wishlist = {
  _id: string;
  name: string;
  is_public: boolean;
  emoji?: string;
  color?: string;
  is_default?: boolean;
};

export default function Sidebar({ active }: { active: "home" | "friends" | "profile" }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requestCount, setRequestCount] = useState(0);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [notifications, setNotifications] = useState<PriceNotification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    fetch("/api/friends")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setFriends(d); })
      .catch(() => {});

    fetch("/api/friends/requests")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setRequestCount(d.length); })
      .catch(() => {});

    fetch("/api/wishlists")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          const sorted = [...d].sort(
            (a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0)
          );
          setWishlists(sorted);
        }
      })
      .catch(() => {});

    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setNotifications(d); })
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const userName = session?.user?.name ?? "Utilisateur";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="bg-[#efeff3] dark:bg-[#22222C] border-r border-[#d9d9e0] dark:border-[#2E2E3A] flex flex-col h-full min-h-0">
      {/* Logo — fixe */}
      <div
        className="flex items-center gap-3 cursor-pointer px-6 pt-6 pb-4 flex-shrink-0"
        onClick={() => router.push("/home")}
      >
        <div className="w-[30px] h-[30px] rounded-lg bg-[#d64550] flex items-center justify-center text-white text-sm font-bold">
          ♥
        </div>
        <span className="font-serif text-lg font-semibold tracking-tight dark:text-[#EDEDF3]">Wishly</span>
      </div>

      {/* Zone scrollable — navigation */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 flex flex-col gap-6 pb-4">

        {/* Mes listes */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.08em] text-[#a4a4ae] dark:text-[#606070] font-semibold px-2 mb-1">
            Mes listes
          </span>

          {wishlists.length > 0 ? (
            <div className="flex flex-col gap-0.5 max-h-[160px] overflow-y-auto">
              {wishlists.map((wl) => (
                <button
                  key={wl._id}
                  onClick={() => router.push(`/wishlist/${wl._id}`)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] hover:bg-[var(--color-border)] transition ${
                    wl.is_default
                      ? "text-[#141418] dark:text-[#EDEDF3] font-semibold"
                      : "text-[#5e5e66] dark:text-[#9898A4]"
                  }`}
                >
                  <span className="text-sm leading-none flex-shrink-0">
                    {wl.is_default ? "⭐" : wl.emoji ?? "🛍️"}
                  </span>
                  <span className="truncate">{wl.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[#a4a4ae] dark:text-[#606070] px-2">Aucune liste</p>
          )}

          <button
            onClick={() => router.push("/createWish")}
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] bg-[var(--color-surface)] border border-[#d9d9e0] dark:border-[#2E2E3A] text-[#141418] dark:text-[#EDEDF3] font-medium hover:bg-[var(--color-surface2)] transition mt-1"
          >
            <span className="text-lg leading-none">＋</span>
            Nouvelle liste...
          </button>
        </div>

        {/* Secret Santa */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.08em] text-[#a4a4ae] dark:text-[#606070] font-semibold px-2 mb-1">
            Événements
          </span>
          <button
            onClick={() => router.push("/secret-santa")}
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] text-[#5e5e66] dark:text-[#9898A4] hover:bg-[var(--color-border)] transition"
          >
            <span>🎅</span> Secret Santa
          </button>
        </div>

        {/* Amis */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.08em] text-[#a4a4ae] dark:text-[#606070] font-semibold px-2 mb-1">
            Amis
          </span>
          <button
            onClick={() => router.push("/friends")}
            className={`flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] transition bg-[var(--color-surface)] border border-[#d9d9e0] dark:border-[#2E2E3A] hover:bg-[var(--color-surface2)] ${
              active === "friends"
                ? "text-[#141418] dark:text-[#EDEDF3] font-semibold"
                : "text-[#5e5e66] dark:text-[#9898A4]"
            }`}
          >
            <span>👥</span> Amis
            {requestCount > 0 && (
              <span className="ml-auto text-[10px] bg-[#d64550] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {requestCount}
              </span>
            )}
          </button>

          {friends.length > 0 ? (
            <div className="flex flex-col gap-0.5 pl-2 max-h-[120px] overflow-y-auto mt-0.5">
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => router.push(`/friend-profile/${encodeURIComponent(friend.email)}`)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] text-[12px] text-[#5e5e66] dark:text-[#9898A4] hover:bg-[var(--color-border)] transition"
                >
                  <div className="w-5 h-5 rounded-full bg-[#d64550]/20 text-[#d64550] text-[9px] font-semibold flex items-center justify-center flex-shrink-0">
                    {friend.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="truncate">{friend.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[#a4a4ae] dark:text-[#606070] px-2 mt-1">
              Vous n&apos;avez pas encore d&apos;amis.
            </p>
          )}
        </div>

        {/* Alertes de prix */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.08em] text-[#a4a4ae] dark:text-[#606070] font-semibold px-2 mb-1">
            Alertes
          </span>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] text-[#5e5e66] dark:text-[#9898A4] hover:bg-[var(--color-border)] transition"
          >
            <span>🔔</span>
            Alertes de prix
            {unreadCount > 0 && (
              <span className="ml-auto text-[10px] bg-[#d64550] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Bouton mode sombre */}
      <div className="px-6 pb-2 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-[13px] text-[#5e5e66] dark:text-[#9898A4] hover:bg-[var(--color-border)] transition"
          aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
        >
          <span className="flex items-center gap-2">
            <span>{theme === "dark" ? "🌙" : "☀️"}</span>
            <span>{theme === "dark" ? "Mode sombre" : "Mode clair"}</span>
          </span>
          {/* Toggle pill */}
          <div
            className={`w-8 h-[18px] rounded-full transition-colors duration-300 flex items-center px-[3px] flex-shrink-0 ${
              theme === "dark" ? "bg-[#d64550]" : "bg-[#d9d9e0]"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                theme === "dark" ? "translate-x-[14px]" : "translate-x-0"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Aide */}
      <div className="px-6 pb-2 flex-shrink-0">
        <button
          onClick={() => router.push("/help")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] text-[#5e5e66] dark:text-[#9898A4] hover:bg-[var(--color-border)] transition"
        >
          <span>❓</span>
          <span>Aide</span>
        </button>
      </div>

      {/* User — fixe en bas */}
      <div className="px-6 pb-6 pt-3 flex-shrink-0 border-t border-[#d9d9e0] dark:border-[#2E2E3A]">
        <div
          className="flex items-center gap-3 p-3 rounded-[10px] border border-[#d9d9e0] dark:border-[#2E2E3A] bg-[var(--color-surface)] cursor-pointer hover:bg-[var(--color-surface2)] transition"
          onClick={() => router.push("/profile")}
        >
          <div className="w-[30px] h-[30px] rounded-full bg-[#d64550] text-white text-[11px] font-semibold flex items-center justify-center flex-shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[#141418] dark:text-[#EDEDF3] truncate">{userName}</div>
            <div className="text-[10px] text-[#a4a4ae] dark:text-[#606070] truncate">{session?.user?.email ?? ""}</div>
            <button
              onClick={(e) => { e.stopPropagation(); signOut({ callbackUrl: "/login" }); }}
              className="text-[10px] text-[#a4a4ae] dark:text-[#606070] hover:text-[#d64550] transition"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      {notifOpen && (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onMarkAllRead={handleMarkAllRead}
        />
      )}
    </aside>
  );
}
