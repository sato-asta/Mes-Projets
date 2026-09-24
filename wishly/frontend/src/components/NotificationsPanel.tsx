"use client";

export type PriceNotification = {
  _id: string;
  item_id: string;
  item_name: string;
  wishlist_id: string;
  wishlist_name: string;
  old_price: number;
  new_price: number;
  target_price: number;
  created_at: string;
  read: boolean;
};

type Props = {
  notifications: PriceNotification[];
  onClose: () => void;
  onMarkAllRead: () => void;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${Math.floor(hours / 24)}j`;
}

export default function NotificationsPanel({ notifications, onClose, onMarkAllRead }: Props) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 z-[300]" onClick={onClose} />

      {/* panel */}
      <div className="fixed left-[232px] top-4 z-[301] w-[320px] bg-white rounded-2xl border border-[#d9d9e0] shadow-[0_16px_48px_rgba(0,0,0,0.14)] overflow-hidden">
        {/* header */}
        <div className="px-4 py-3 border-b border-[#d9d9e0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#141418]">Alertes de prix</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-[#d64550] text-white rounded-full px-[6px] py-[1px] font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-[11px] text-[#a4a4ae] hover:text-[#d64550] transition"
            >
              Tout marquer lu
            </button>
          )}
        </div>

        {/* list */}
        <div className="max-h-[380px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-10 text-center">
              <div className="text-3xl mb-2">🔔</div>
              <div className="text-sm text-[#5e5e66]">Aucune alerte pour l&apos;instant</div>
              <div className="text-xs text-[#a4a4ae] mt-1">
                Active des alertes sur tes articles pour être prévenu(e) des baisses de prix
              </div>
            </div>
          ) : (
            notifications.map((n) => {
              const drop = n.old_price - n.new_price;
              const dropPct = Math.round((drop / n.old_price) * 100);
              return (
                <div
                  key={n._id}
                  className={`px-4 py-3 border-b border-[#f0f0f4] last:border-0 ${!n.read ? "bg-[#fdf5f5]" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#fce9eb] flex items-center justify-center flex-shrink-0 text-sm">
                      🔔
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-[#141418] truncate">{n.item_name}</div>
                      <div className="flex items-center gap-1 mt-[2px]">
                        <span className="text-[11px] text-[#a4a4ae] line-through">
                          {n.old_price.toLocaleString("fr-FR")} €
                        </span>
                        <span className="text-[11px]">→</span>
                        <span className="text-[12px] font-semibold text-[#22c55e]">
                          {n.new_price.toLocaleString("fr-FR")} €
                        </span>
                        <span className="text-[10px] px-[5px] py-[1px] rounded-full bg-[#dcfce7] text-[#16a34a] font-semibold">
                          -{dropPct}%
                        </span>
                      </div>
                      <div className="text-[10px] text-[#a4a4ae] mt-[2px]">
                        {n.wishlist_name} · {timeAgo(n.created_at)}
                      </div>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-[#d64550] flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
