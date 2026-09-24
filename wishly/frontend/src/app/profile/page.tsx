"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";

type WishlistItem = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  checked: boolean;
  wishlist_id: string;
  wishlist_name: string;
  wishlist_emoji: string;
  wishlist_color: string;
};

type BudgetCalcs = {
  salary: number;
  total_expenses: number;
  monthly_capacity: number;
  annual_capacity: number;
  expenses_percentage: number;
};

type Budget = {
  _id: string;
  user_id: string;
  salary: number;
  expenses: unknown[];
  calculs: BudgetCalcs;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

function affordability(price: number, salary: number): { label: string; color: string; bg: string; dot: string } {
  if (salary <= 0) return { label: "N/A", color: "#a4a4ae", bg: "#efeff3", dot: "#a4a4ae" };
  const ratio = price / salary;
  if (ratio <= 0.1) return { label: "Abordable", color: "#15803d", bg: "#dcfce7", dot: "#22c55e" };
  if (ratio <= 0.3) return { label: "Attention", color: "#b45309", bg: "#fef3c7", dot: "#f59e0b" };
  return { label: "Difficile", color: "#b91c1c", bg: "#fee2e2", dot: "#ef4444" };
}

export default function ProfilePage(): JSX.Element {
  const { data: session, update } = useSession();

  const [name, setName] = useState(session?.user?.name ?? "");
  const [editing, setEditing] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const [budget, setBudget] = useState<Budget | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [setupSalary, setSetupSalary] = useState("");
  const [creating, setCreating] = useState(false);

  const [editSalary, setEditSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState("");
  const [salaryLoading, setSalaryLoading] = useState(false);

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch("/api/budget")
      .then((r) => r.json())
      .then((d) => { setBudget(d); setBudgetLoading(false); })
      .catch(() => setBudgetLoading(false));
  }, []);

  useEffect(() => {
    if (!budget) return;
    setItemsLoading(true);
    fetch("/api/budget/wishlists")
      .then((r) => r.json())
      .then((items) => { setWishlistItems(Array.isArray(items) ? items : []); setItemsLoading(false); })
      .catch(() => setItemsLoading(false));
  }, [budget]);

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    setNameLoading(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    setNameLoading(false);
    if (res.ok) {
      await update({ name: name.trim() });
      setEditing(false);
      showToast("Nom mis à jour !");
    } else {
      showToast("Erreur lors de la mise à jour", "err");
    }
  };

  const handleCreateBudget = async () => {
    const salary = parseFloat(setupSalary.replace(",", "."));
    if (!salary || salary <= 0) return;
    setCreating(true);
    const res = await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salary }),
    });
    if (res.ok) {
      const data = await res.json();
      setBudget({ _id: data.id, user_id: "", salary, expenses: [], calculs: data.calculs });
      showToast("Budget créé !");
    } else {
      showToast("Erreur lors de la création", "err");
    }
    setCreating(false);
  };

  const handleUpdateSalary = async () => {
    const salary = parseFloat(salaryInput.replace(",", "."));
    if (!salary || salary <= 0) return;
    setSalaryLoading(true);
    const res = await fetch("/api/budget/salary", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salary }),
    });
    if (res.ok) {
      const data = await res.json();
      setBudget((prev) => prev ? { ...prev, salary, calculs: data.calculs } : prev);
      setEditSalary(false);
      showToast("Salaire mis à jour !");
    } else {
      showToast("Erreur lors de la mise à jour", "err");
    }
    setSalaryLoading(false);
  };

  const userName = session?.user?.name ?? "Utilisateur";
  const userEmail = session?.user?.email ?? "";
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const salary = budget?.salary ?? 0;
  const totalWishlistCost = wishlistItems.reduce((sum, item) => sum + (item.price ?? 0), 0);
  const reste = salary - totalWishlistCost;
  const isPositive = reste >= 0;
  const shareRatio = salary > 0 ? Math.min((totalWishlistCost / salary) * 100, 100) : 0;
  const shareColor = shareRatio > 80 ? "#ef4444" : shareRatio > 40 ? "#f59e0b" : "#22c55e";

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-6 md:p-10">

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 text-white text-[12px] px-4 py-2 rounded-[10px] shadow-lg flex items-center gap-2 ${toast.type === "err" ? "bg-[#d64550]" : "bg-[#141418]"}`}>
          <span>{toast.type === "err" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* Même max-w et hauteur que les autres pages */}
      <div className="w-full max-w-[1100px] h-[700px] bg-[var(--color-surface)] rounded-[20px] border border-[var(--color-border)] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] grid grid-cols-[220px_260px_1fr]">

        <Sidebar active="profile" />

        {/* ── Colonne profil ── */}
        <div className="border-r border-[#d9d9e0] flex flex-col overflow-hidden">
          <header className="border-b border-[#d9d9e0] p-6 flex-shrink-0">
            <h1 className="font-serif text-[17px] font-semibold text-[#141418]">Mon profil</h1>
          </header>

          <section className="flex-1 overflow-y-auto px-4 py-4 bg-[#f6f6f8] space-y-3">

            {/* Avatar + nom */}
            <div className="bg-white rounded-2xl border border-[#d9d9e0] p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#d64550] text-white text-[15px] font-bold flex items-center justify-center flex-shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-[#141418] truncate">{userName}</div>
                <div className="text-[11px] text-[#a4a4ae] truncate">{userEmail}</div>
              </div>
            </div>

            {/* Nom affiché */}
            <div className="bg-white rounded-2xl border border-[#d9d9e0] p-4">
              <h2 className="text-[11px] text-[#a4a4ae] font-semibold mb-2">Nom affiché</h2>
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdateName()}
                    className="w-full h-9 rounded-[8px] border border-[#d9d9e0] bg-[#efeff3] px-3 text-[12px] text-[#141418] outline-none focus:border-[#d64550] focus:bg-white transition"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateName}
                      disabled={nameLoading || !name.trim()}
                      className="flex-1 h-8 rounded-[8px] bg-[#d64550] text-white text-[11px] font-medium hover:opacity-90 transition disabled:opacity-40"
                    >
                      {nameLoading ? "…" : "Sauvegarder"}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setName(userName); }}
                      className="h-8 px-3 rounded-[8px] border border-[#d9d9e0] text-[#5e5e66] text-[11px] hover:bg-[#efeff3] transition"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-9 flex-1 bg-[#efeff3] rounded-[8px] px-3 flex items-center text-[12px] text-[#141418] truncate">
                    {userName}
                  </div>
                  <button
                    onClick={() => { setEditing(true); setName(userName); }}
                    className="h-9 px-3 rounded-[8px] border border-[#d9d9e0] text-[#5e5e66] text-[11px] hover:bg-[#efeff3] transition flex-shrink-0"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl border border-[#d9d9e0] p-4">
              <h2 className="text-[11px] text-[#a4a4ae] font-semibold mb-2">Email</h2>
              <div className="h-9 bg-[#efeff3] rounded-[8px] px-3 flex items-center text-[12px] text-[#a4a4ae] truncate">
                {userEmail}
              </div>
            </div>

            {/* Session */}
            <div className="bg-white rounded-2xl border border-[#d9d9e0] p-4">
              <h2 className="text-[11px] text-[#a4a4ae] font-semibold mb-2">Session</h2>
              <button
                onClick={() => import("next-auth/react").then(({ signOut }) => signOut({ callbackUrl: "/login" }))}
                className="w-full h-9 rounded-[8px] border border-[#d64550]/50 text-[#d64550] text-[11px] font-medium hover:bg-[#d64550] hover:text-white hover:border-[#d64550] transition"
              >
                Se déconnecter
              </button>
            </div>

          </section>
        </div>

        {/* ── Colonne budget ── */}
        <main className="flex flex-col overflow-hidden">
          <header className="border-b border-[#d9d9e0] p-6 flex-shrink-0 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-[17px] font-semibold text-[#141418]">Capacité d&apos;achat</h1>
              <p className="text-[11px] text-[#a4a4ae]">Basé sur vos wishlists</p>
            </div>
            {budget && wishlistItems.length > 0 && (
              <span className="text-[11px] text-[#a4a4ae]">
                {wishlistItems.length} article{wishlistItems.length !== 1 ? "s" : ""}
              </span>
            )}
          </header>

          <section className="flex-1 overflow-y-auto px-4 py-4 bg-[#f6f6f8] space-y-4">

            {budgetLoading ? (
              <div className="flex items-center justify-center h-full text-[12px] text-[#a4a4ae]">
                Chargement…
              </div>

            ) : !budget ? (
              /* ── Setup ── */
              <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#d64550]/10 flex items-center justify-center text-2xl">
                  💰
                </div>
                <div>
                  <h2 className="font-serif text-[15px] font-semibold text-[#141418] mb-1">
                    Configurez votre budget
                  </h2>
                  <p className="text-[11px] text-[#a4a4ae] max-w-[260px] leading-relaxed">
                    Renseignez votre salaire mensuel net pour évaluer la faisabilité de vos achats wishlist.
                  </p>
                </div>
                <div className="w-full max-w-[260px] space-y-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={setupSalary}
                      onChange={(e) => setSetupSalary(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreateBudget()}
                      placeholder="Ex : 2500"
                      className="w-full h-10 rounded-[10px] border border-[#d9d9e0] bg-white px-4 pr-12 text-[13px] text-[#141418] outline-none focus:border-[#d64550] transition"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#a4a4ae]">€/mois</span>
                  </div>
                  <button
                    onClick={handleCreateBudget}
                    disabled={creating || !setupSalary}
                    className="w-full h-10 rounded-[10px] bg-[#d64550] text-white text-[13px] font-medium hover:opacity-90 transition disabled:opacity-40"
                  >
                    {creating ? "Création…" : "Créer mon budget"}
                  </button>
                </div>
              </div>

            ) : (
              <>
                {/* ── 4 stat cards ── */}
                <div className="grid grid-cols-2 gap-3">

                  {/* Salaire */}
                  <div className="bg-white rounded-2xl border border-[#d9d9e0] p-4">
                    <div className="text-[10px] uppercase tracking-[0.06em] text-[#a4a4ae] font-semibold mb-1">Salaire mensuel</div>
                    {editSalary ? (
                      <div className="space-y-2 mt-1">
                        <div className="relative">
                          <input
                            type="number"
                            value={salaryInput}
                            onChange={(e) => setSalaryInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleUpdateSalary()}
                            placeholder={String(budget.salary)}
                            className="w-full h-8 rounded-[8px] border border-[#d9d9e0] bg-[#efeff3] px-3 pr-7 text-[12px] text-[#141418] outline-none focus:border-[#d64550] transition"
                            autoFocus
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#a4a4ae]">€</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={handleUpdateSalary} disabled={salaryLoading} className="flex-1 h-7 rounded-[6px] bg-[#d64550] text-white text-[10px] font-medium hover:opacity-90 transition disabled:opacity-40">OK</button>
                          <button onClick={() => setEditSalary(false)} className="h-7 px-2 rounded-[6px] border border-[#d9d9e0] text-[10px] text-[#5e5e66] hover:bg-[#efeff3] transition">✕</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-end justify-between mt-1">
                        <span className="text-[20px] font-bold text-[#141418]">{fmt(budget.salary)}</span>
                        <button
                          onClick={() => { setEditSalary(true); setSalaryInput(String(budget.salary)); }}
                          className="text-[10px] text-[#a4a4ae] hover:text-[#d64550] transition mb-0.5"
                        >
                          Modifier
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reste */}
                  <div className={`rounded-2xl border p-4 ${isPositive ? "bg-[#f0fdf4] border-[#bbf7d0]" : "bg-[#fef2f2] border-[#fecaca]"}`}>
                    <div className={`text-[10px] uppercase tracking-[0.06em] font-semibold mb-1 ${isPositive ? "text-[#15803d]" : "text-[#b91c1c]"}`}>
                      Reste si tout acheté
                    </div>
                    <div className="text-[20px] font-bold mt-1" style={{ color: isPositive ? "#15803d" : "#b91c1c" }}>
                      {fmt(reste)}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isPositive ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                      sur {fmt(salary)}/mois
                    </div>
                  </div>

                  {/* Total souhaité */}
                  <div className="bg-white rounded-2xl border border-[#d9d9e0] p-4">
                    <div className="text-[10px] uppercase tracking-[0.06em] text-[#a4a4ae] font-semibold mb-1">Total souhaité</div>
                    <div className="text-[20px] font-bold text-[#141418] mt-1">{fmt(totalWishlistCost)}</div>
                    <div className="text-[10px] text-[#a4a4ae] mt-0.5">
                      {wishlistItems.length} article{wishlistItems.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Part du salaire */}
                  <div className="bg-white rounded-2xl border border-[#d9d9e0] p-4">
                    <div className="text-[10px] uppercase tracking-[0.06em] text-[#a4a4ae] font-semibold mb-1">Part du salaire</div>
                    <div className="text-[20px] font-bold text-[#141418] mt-1">
                      {salary > 0 ? shareRatio.toFixed(1) : "—"}%
                    </div>
                    <div className="mt-2 h-1.5 bg-[#efeff3] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${shareRatio}%`, backgroundColor: shareColor }}
                      />
                    </div>
                  </div>

                </div>

                {/* ── Articles wishlist ── */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-[17px] font-semibold text-[#141418]">Mes articles</h2>
                  </div>

                  {itemsLoading ? (
                    <div className="text-center py-8 text-[12px] text-[#a4a4ae]">Chargement…</div>
                  ) : wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center text-center gap-2 p-8 bg-white border border-dashed border-[#d9d9e0] rounded-2xl">
                      <div className="w-[38px] h-[38px] flex items-center justify-center text-xl rounded-[10px] bg-[#efeff3] opacity-50">
                        🛍️
                      </div>
                      <h3 className="text-[13px] font-serif font-semibold text-[#141418]">Aucun article dans vos wishlists</h3>
                      <p className="max-w-[260px] text-[11px] leading-relaxed text-[#a4a4ae]">
                        Ajoutez des articles à vos wishlists pour voir leur faisabilité ici.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {wishlistItems.map((item) => {
                        const aff = affordability(item.price, salary);
                        return (
                          <div
                            key={item._id}
                            className="bg-white rounded-[14px] border border-[#d9d9e0] overflow-hidden flex items-stretch hover:shadow-sm transition"
                          >
                            <div className="w-[3px] flex-shrink-0" style={{ backgroundColor: item.wishlist_color ?? "#d64550" }} />
                            <div className="flex items-center gap-3 px-4 py-3 flex-1 min-w-0">
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-semibold text-[#141418] truncate">{item.name}</div>
                                <div className="text-[11px] text-[#a4a4ae]">
                                  {item.wishlist_emoji} {item.wishlist_name}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                  style={{ color: aff.color, backgroundColor: aff.bg }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: aff.dot }} />
                                  {aff.label}
                                </span>
                                <span className="text-[13px] font-semibold text-[#141418] tabular-nums">{fmt(item.price)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
