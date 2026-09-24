"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

type Item = {
  _id: string;
  name: string;
  price: number;
  url: string;
  category: string;
  image?: string;
  checked: boolean;
  note?: string;
  is_being_offered?: boolean;
  price_alert_enabled?: boolean;
  price_alert_target?: number;
};

type Wishlist = {
  _id: string;
  name: string;
  is_public: boolean;
  emoji?: string;
  description?: string;
  color?: string;
  member_count?: number;
  collaborators?: string[];
  type?: string;
};


export default function WishlistViewPage() {
  const router = useRouter();
  const params = useParams();
  const wishlistId = params.id as string;

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [drawer, setDrawer] = useState<Item | null>(null);
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [alertTarget, setAlertTarget] = useState("");
  const [alertSaving, setAlertSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false });

  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  useEffect(() => {
    if (!wishlistId) return;

    Promise.all([
      fetch(`/api/wishlists/${wishlistId}`).then((res) => res.json()),
      fetch(`/api/wishlists/${wishlistId}/items`).then((res) => res.json()),
    ])
      .then(([wishlistData, itemsData]) => {
        setWishlist(wishlistData);
        if (Array.isArray(itemsData)) {
          setItems(itemsData.map((item: Item) => ({ ...item, checked: item.checked || false })));
        }
      })
      .catch(() => {
        showToast("Erreur lors du chargement de la liste");
      })
      .finally(() => setLoading(false));
  }, [wishlistId]);

  const toggleCheck = async (id: string) => {
    setItems((prev) => prev.map((it) => (it._id === id ? { ...it, checked: !it.checked } : it)));
    try {
      await fetch(`/api/items/${id}/check`, { method: "PATCH" });
    } catch {
      setItems((prev) => prev.map((it) => (it._id === id ? { ...it, checked: !it.checked } : it)));
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it._id !== id));
    showToast("Article retiré de la liste");
  };

  const openDrawer = (item: Item) => {
    setDrawer(item);
    setAlertEnabled(item.price_alert_enabled ?? false);
    setAlertTarget(item.price_alert_target?.toString() ?? "");
  };

  const saveAlert = async () => {
    if (!drawer) return;
    setAlertSaving(true);
    if (alertEnabled) {
      await fetch("/api/items/price-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: drawer._id, target_price: parseFloat(alertTarget) }),
      });
    } else {
      await fetch("/api/items/price-alert", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: drawer._id }),
      });
    }
    setItems((prev) =>
      prev.map((it) =>
        it._id === drawer._id
          ? { ...it, price_alert_enabled: alertEnabled, price_alert_target: alertEnabled ? parseFloat(alertTarget) : undefined }
          : it
      )
    );
    setAlertSaving(false);
    showToast(alertEnabled ? "Alerte de prix activée !" : "Alerte désactivée");
  };

  const handleShare = () => {
    if (!wishlist?.is_public) {
      showToast("La liste doit être publique pour être partagée");
      return;
    }
    const url = window.location.origin + "/share/" + wishlistId;
    navigator.clipboard.writeText(url).then(() => {
      showToast("Lien copié dans le presse-papier !");
    });
  };

  const handleExport = () => {
    const doc = new jsPDF();
    const listName = wishlist?.name ?? "Wishlist";
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(`${wishlist?.emoji ?? ""} ${listName}`.trim(), 14, 20);

    if (wishlist?.description) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 130);
      doc.text(wishlist.description, 14, 28);
    }

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 130);
    doc.text(
      `${items.length} article(s) · ${checkedCount} acheté(s) · Total : ${totalEur.toLocaleString("fr-FR")} €`,
      14,
      wishlist?.description ? 35 : 28
    );

    const startY = wishlist?.description ? 42 : 35;
    const cols = ["Nom", "Prix", "Catégorie", "Acheté"];
    const colWidths = [90, 25, 40, 22];
    const colX = [14, 104, 129, 169];
    const rowH = 8;

    doc.setFillColor(214, 69, 80);
    doc.rect(14, startY, pageWidth - 28, rowH, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    cols.forEach((col, i) => doc.text(col, colX[i] + 2, startY + 5.5));

    let y = startY + rowH;
    items.forEach((it, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 14;
      }
      const bg = idx % 2 === 0 ? [249, 249, 251] : [255, 255, 255];
      doc.setFillColor(bg[0], bg[1], bg[2]);
      doc.rect(14, y, pageWidth - 28, rowH, "F");

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(20, 20, 24);

      const name = doc.splitTextToSize(it.name, colWidths[0] - 4)[0];
      doc.text(name, colX[0] + 2, y + 5.5);
      doc.text(it.price > 0 ? `${it.price.toLocaleString("fr-FR")} €` : "—", colX[1] + 2, y + 5.5);
      doc.text(it.category || "—", colX[2] + 2, y + 5.5);

      if (it.checked) {
        doc.setTextColor(16, 185, 129);
        doc.text("Oui", colX[3] + 2, y + 5.5);
        doc.setTextColor(20, 20, 24);
      } else {
        doc.setTextColor(164, 164, 174);
        doc.text("Non", colX[3] + 2, y + 5.5);
        doc.setTextColor(20, 20, 24);
      }
      y += rowH;
    });

    doc.setFontSize(8);
    doc.setTextColor(164, 164, 174);
    doc.text(`Exporté le ${new Date().toLocaleDateString("fr-FR")} · Wishly`, 14, 290);

    doc.save(`${listName}.pdf`);
    showToast("Liste exportée en PDF");
  };

  const visible = items.filter((it) => {
    if (filter === "done") return it.checked;
    if (filter === "todo") return !it.checked;
    return true;
  });

  const totalEur = items.reduce((acc, it) => acc + it.price, 0);
  const checkedEur = items.filter((i) => i.checked).reduce((acc, it) => acc + it.price, 0);
  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <>
      <style>{`
        @keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .drawer-anim { animation: popIn 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes slideUp { from { transform: translateX(-50%) translateY(80px); } to { transform: translateX(-50%) translateY(0); } }
        .toast-show { animation: slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

      <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-8">
        <div className="w-full max-w-[1100px] h-[700px] bg-[var(--color-surface)] rounded-[20px] border border-[var(--color-border)] grid grid-cols-[220px_1fr] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)]">

          {/* ── SIDEBAR ── */}
          <Sidebar active="home" />

          {/* ── MAIN ── */}
          <main className="flex flex-col overflow-hidden">

            {/* TOPBAR */}
            <header className="px-6 py-[14px] border-b border-[#d9d9e0] bg-white flex items-center gap-[10px] flex-shrink-0">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-[6px] text-[13px] text-[#5e5e66] bg-transparent border-0 cursor-pointer px-[10px] py-[6px] rounded-lg hover:bg-[#efeff3] transition-colors font-sans"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[14px] h-[14px]"><path d="M10 3L5 8l5 5" /></svg>
                Retour
              </button>
              {wishlist && (
                <>
                  <div className="w-px h-[18px] bg-[#d9d9e0]" />
                  <div className="flex items-center gap-[6px] text-[13px] text-[#a4a4ae]">
                    <span className="text-[#141418] font-medium">{wishlist.emoji || "📋"} {wishlist.name}</span>
                  </div>
                </>
              )}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-[6px] h-8 px-3 rounded-[8px] text-[12px] border border-[#d9d9e0] text-[#5e5e66] hover:bg-[#efeff3] transition font-sans"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
                    <circle cx="12" cy="4" r="1.5" /><circle cx="4" cy="8" r="1.5" /><circle cx="12" cy="12" r="1.5" />
                    <path d="M5.5 7.5l5-2M5.5 8.5l5 2" />
                  </svg>
                  Partager
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-[6px] h-8 px-3 rounded-[8px] text-[12px] border border-[#d9d9e0] text-[#5e5e66] hover:bg-[#efeff3] transition font-sans"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
                    <path d="M8 3v7M5 8l3 3 3-3" /><path d="M3 13h10" />
                  </svg>
                  Exporter
                </button>
              </div>
            </header>

            {/* HERO */}
            {wishlist && (
              <div className="px-6 py-5 border-b border-[#d9d9e0] bg-[#fbe8ea] flex items-center gap-5 flex-shrink-0">
                <div className="w-[52px] h-[52px] rounded-[14px] bg-[#d64550] flex items-center justify-center text-[26px] flex-shrink-0">{wishlist.emoji || "📋"}</div>
                <div className="flex-1">
                  <div className="font-serif text-[22px] font-semibold text-[#141418] tracking-tight leading-tight">{wishlist.name}</div>
                  {wishlist.description && <p className="text-[12px] text-[#5e5e66] mt-1">{wishlist.description}</p>}
                  <div className="flex items-center gap-[10px] mt-[5px] flex-wrap">
                    <span className="text-[11px] font-medium px-[10px] py-[3px] rounded-full flex items-center gap-[5px] bg-[#d64550] text-white">
                      {wishlist.is_public ? "Publique" : "Privée"}
                    </span>
                    {wishlist.type === "collaborative" && (
                      <span className="text-[11px] font-medium px-[10px] py-[3px] rounded-full flex items-center gap-[5px] bg-blue-100 text-blue-600">
                        👥 {wishlist.member_count ?? 1} membre{(wishlist.member_count ?? 1) > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-[11px] text-[#a4a4ae] mb-[5px]">
                      <span>Progression</span>
                      <span>{checkedCount} / {items.length} achetés</span>
                    </div>
                    <div className="h-[5px] bg-white rounded-[10px] overflow-hidden">
                      <div className="h-full bg-[#d64550] rounded-[10px] transition-all duration-500" style={{ width: `${items.length ? (checkedCount / items.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-auto flex-shrink-0">
                  {[
                    { value: items.length.toString(), label: "Articles" },
                    null,
                    { value: checkedCount.toString(), label: "Achetés" },
                    null,
                    { value: `${totalEur.toLocaleString("fr-FR")} €`, label: "Total" },
                  ].map((s, i) =>
                    s === null ? (
                      <div key={i} className="w-px h-8 bg-[#d9d9e0]" />
                    ) : (
                      <div key={i} className="text-center">
                        <div className="font-serif text-[20px] font-semibold text-[#141418]">{(s as { value: string; label: string }).value}</div>
                        <div className="text-[10px] text-[#a4a4ae] uppercase tracking-[0.05em] mt-[1px]">{(s as { value: string; label: string }).label}</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* TOOLBAR */}
            <div className="px-6 py-3 border-b border-[#d9d9e0] bg-white flex items-center gap-[10px] flex-shrink-0">
              <div className="flex gap-[6px]">
                {([["all", `Tous (${items.length})`], ["todo", `À acheter (${items.filter(i => !i.checked).length})`], ["done", `Achetés (${items.filter(i => i.checked).length})`]] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-[5px] rounded-full text-[12px] border cursor-pointer transition-all font-sans ${
                      filter === key
                        ? "bg-[#141418] text-white border-transparent"
                        : "bg-transparent text-[#5e5e66] border-[#d9d9e0] hover:bg-[#efeff3]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ITEMS GRID OR EMPTY STATE */}
            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[#a4a4ae] mb-3">Chargement...</div>
                  </div>
                </div>
              ) : visible.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-[#d9d9e0] mx-auto mb-4">
                      <rect x="8" y="12" width="48" height="40" rx="4" />
                      <path d="M16 20h32M16 28h32M16 36h24" />
                    </svg>
                    <div className="text-[14px] font-medium text-[#a4a4ae] mb-1">Aucun article pour le moment</div>
                    <div className="text-[12px] text-[#d9d9e0]">Commencez par ajouter vos premiers articles à la liste</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {visible.map((item) => (
                    <div
                      key={item._id}
                      className={`bg-white border border-[var(--color-border)] rounded-[16px] overflow-hidden cursor-pointer relative transition-all hover:border-[#c8c3bb] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col ${item.checked ? "opacity-55" : ""}`}
                      onClick={() => openDrawer(item)}
                    >
                      {/* Image */}
                      <div className={`h-[130px] bg-[#efeff3] flex items-center justify-center relative flex-shrink-0 ${item.checked ? "[filter:grayscale(0.5)]" : ""}`}>
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 opacity-25">
                            <path d="M6 14h24v14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V14z" />
                            <path d="M10 14v-3a8 8 0 0 1 16 0v3" />
                          </svg>
                        )}
                        {/* Checkbox */}
                        <div
                          className={`absolute top-[8px] left-[8px] w-[22px] h-[22px] rounded-[6px] border-[1.5px] flex items-center justify-center cursor-pointer transition-all ${
                            item.checked ? "bg-[#d64550] border-[#d64550]" : "bg-white/90 border-[#d9d9e0]"
                          }`}
                          onClick={(e) => { e.stopPropagation(); toggleCheck(item._id); }}
                        >
                          <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" className={`w-[10px] h-[10px] transition-opacity ${item.checked ? "opacity-100" : "opacity-0"}`}>
                            <path d="M3 8l3.5 3.5 6.5-7" />
                          </svg>
                        </div>
                        {/* Delete */}
                        <div
                          className="absolute top-[8px] right-[8px] w-[26px] h-[26px] rounded-[7px] bg-white/95 border border-[#d9d9e0] flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors"
                          onClick={(e) => { e.stopPropagation(); removeItem(item._id); }}
                        >
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-[#5e5e66]"><path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4" /></svg>
                        </div>
                        {/* Source badge */}
                        {item.category && (
                          <div className="absolute bottom-[8px] right-[8px] text-[9px] font-semibold px-[7px] py-[2px] rounded-full bg-white/90 border border-[#d9d9e0] text-[#5e5e66] max-w-[80px] truncate">
                            {item.category}
                          </div>
                        )}
                        {/* Offered by a friend badge */}
                        {item.is_being_offered && (
                          <div className="absolute bottom-[8px] left-[8px] text-[9px] font-semibold px-[7px] py-[2px] rounded-full bg-[#16a34a] text-white flex items-center gap-[4px]">
                            <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" className="w-[9px] h-[9px]"><path d="M2 8l4 4 8-8" /></svg>
                            Offert par un ami
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3 flex flex-col gap-[6px] flex-1">
                        <div className={`text-[12px] font-medium text-[#141418] leading-[1.4] line-clamp-2 ${item.checked ? "line-through text-[#a4a4ae]" : ""}`}>
                          {item.name}
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className={`text-[14px] font-semibold font-serif ${item.checked ? "text-[#a4a4ae]" : item.price > 0 ? "text-[#d64550]" : "text-[#a4a4ae]"}`}>
                            {item.price > 0 ? `${item.price.toLocaleString("fr-FR")} €` : "—"}
                          </span>
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] text-[#d64550] hover:underline font-medium"
                            >
                              Voir →
                            </a>
                          )}
                        </div>
                        {item.note && (
                          <div className="text-[11px] text-[#a4a4ae] leading-[1.4] border-t border-[#d9d9e0] pt-[6px]">
                            {item.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TOTAL BAR */}
            {items.length > 0 && (
              <div className="px-6 py-[14px] border-t border-[#d9d9e0] bg-white flex items-center gap-3 flex-shrink-0">
                <span className="text-[13px] text-[#5e5e66]">Total de la liste</span>
                <span className="font-serif text-[16px] font-semibold text-[#141418]">{totalEur.toLocaleString("fr-FR")} €</span>
                <span className="text-[12px] text-[#a4a4ae]">· dont {checkedEur.toLocaleString("fr-FR")} € achetés</span>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── DRAWER ── */}
      {drawer && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[200] flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setDrawer(null)}
        >
          <div className="drawer-anim bg-white rounded-[20px] w-[380px] max-h-[80vh] overflow-y-auto shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
            <div className="h-[160px] bg-[#efeff3] rounded-[20px_20px_0_0] flex items-center justify-center relative overflow-hidden">
              {drawer.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={drawer.image} alt={drawer.name} className="w-full h-full object-cover" />
              ) : (
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 opacity-25">
                  <path d="M6 14h24v14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V14z" />
                  <path d="M10 14v-3a8 8 0 0 1 16 0v3" />
                </svg>
              )}
              <div
                className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/90 border border-[#d9d9e0] flex items-center justify-center cursor-pointer"
                onClick={() => setDrawer(null)}
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-[#5e5e66]"><path d="M4 4l8 8M12 4l-8 8" /></svg>
              </div>
            </div>
            <div className="p-5">
              <div className="font-serif text-[18px] font-semibold text-[#141418] leading-[1.3]">{drawer.name}</div>
              <div className="font-serif text-[22px] font-semibold text-[#d64550] mt-[6px] mb-[14px]">
                {drawer.price > 0 ? `${drawer.price.toLocaleString("fr-FR")} €` : "Prix non renseigné"}
              </div>
              {[
                { label: "Source", value: drawer.url ? <a href={drawer.url} target="_blank" rel="noopener noreferrer" className="text-[#d64550] hover:underline truncate max-w-[180px] block">{(() => { try { return new URL(drawer.url).hostname.replace("www.", ""); } catch { return drawer.url; } })()}</a> : "—" },
                { label: "Catégorie", value: drawer.category || "—" },
                { label: "Note", value: drawer.note ?? "—" },
              ].map((it, idx) => (
                <div key={idx} className="flex justify-between items-center py-[9px] border-b border-[#d9d9e0] last:border-0 text-[13px]">
                  <span className="text-[#a4a4ae]">{it.label}</span>
                  <span className="text-[#141418] font-medium text-[12px]">{it.value}</span>
                </div>
              ))}
              {/* Price alert section */}
              {drawer.price > 0 && (
                <div className="mt-4 border border-[#d9d9e0] rounded-[12px] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🔔</span>
                      <span className="text-[13px] font-medium text-[#141418]">Alerte de prix</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertEnabled((v) => !v)}
                      className={`relative w-10 h-[22px] rounded-full transition-colors ${alertEnabled ? "bg-[#d64550]" : "bg-[#d9d9e0]"}`}
                    >
                      <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform ${alertEnabled ? "translate-x-5" : "translate-x-[3px]"}`} />
                    </button>
                  </div>
                  {alertEnabled && (
                    <div className="space-y-2">
                      <label className="text-[12px] text-[#5e5e66]">
                        Me prévenir si le prix passe sous
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={alertTarget}
                          onChange={(e) => setAlertTarget(e.target.value)}
                          placeholder={`ex : ${Math.floor(drawer.price * 0.9)}`}
                          className="flex-1 rounded-[8px] px-3 py-2 bg-[#f6f6f8] border border-[#d9d9e0] text-[13px] text-[#141418] outline-none"
                        />
                        <span className="text-[13px] text-[#5e5e66] font-medium">€</span>
                      </div>
                      <div className="text-[11px] text-[#a4a4ae]">
                        Prix actuel : {drawer.price.toLocaleString("fr-FR")} €
                      </div>
                    </div>
                  )}
                  <button
                    onClick={saveAlert}
                    disabled={alertSaving || (alertEnabled && !alertTarget)}
                    className="w-full py-2 rounded-[8px] text-[12px] font-medium transition bg-[#141418] text-white hover:opacity-80 disabled:opacity-40"
                  >
                    {alertSaving ? "Sauvegarde..." : "Sauvegarder l'alerte"}
                  </button>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {drawer.url && (
                  <button
                    onClick={() => { window.open(drawer.url, '_blank'); setDrawer(null); }}
                    className="flex-[2] py-[11px] bg-[#d64550] text-white border-0 rounded-[10px] text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-[6px] font-sans hover:opacity-85 transition-opacity"
                  >
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                    Voir le site
                  </button>
                )}
                <button
                  onClick={() => { removeItem(drawer._id); setDrawer(null); }}
                  className="flex-1 py-[11px] bg-[#fee2e2] text-[#dc2626] border border-transparent rounded-[10px] text-[13px] font-medium cursor-pointer font-sans hover:opacity-85 transition-opacity"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast.visible && (
        <div className="toast-show fixed bottom-8 left-1/2 bg-[#141418] text-white px-[18px] py-[11px] rounded-xl text-[13px] font-medium flex items-center gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.2)] z-[999]">
          <svg viewBox="0 0 16 16" fill="none" stroke="#10b981" strokeWidth="2" className="w-[15px] h-[15px]"><path d="M2 8l4 4 8-8" /></svg>
          {toast.msg}
        </div>
      )}
    </>
  );
}
