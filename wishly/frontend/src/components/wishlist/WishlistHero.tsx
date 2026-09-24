"use client";

type Wishlist = {
  _id: string;
  name: string;
  is_public: boolean;
  emoji?: string;
  description?: string;
};

type Props = {
  wishlist: Wishlist;
  itemCount: number;
  checkedCount: number;
  totalEur: number;
};

export default function WishlistHero({ wishlist, itemCount, checkedCount, totalEur }: Props) {
  return (
    <div className="px-6 py-5 border-b border-[#d9d9e0] bg-[#fbe8ea] flex items-center gap-5 flex-shrink-0">
      <div className="w-[52px] h-[52px] rounded-[14px] bg-[#d64550] flex items-center justify-center text-[26px] flex-shrink-0">
        {wishlist.emoji || "📋"}
      </div>
      <div className="flex-1">
        <div className="font-serif text-[22px] font-semibold text-[#141418] tracking-tight leading-tight">
          {wishlist.name}
        </div>
        {wishlist.description && (
          <p className="text-[12px] text-[#5e5e66] mt-1">{wishlist.description}</p>
        )}
        <div className="flex items-center gap-[10px] mt-[5px]">
          <span className="text-[11px] font-medium px-[10px] py-[3px] rounded-full bg-[#d64550] text-white">
            {wishlist.is_public ? "Publique" : "Privée"}
          </span>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-[11px] text-[#a4a4ae] mb-[5px]">
            <span>Progression</span>
            <span>{checkedCount} / {itemCount} achetés</span>
          </div>
          <div className="h-[5px] bg-white rounded-[10px] overflow-hidden">
            <div
              className="h-full bg-[#d64550] rounded-[10px] transition-all duration-500"
              style={{ width: `${itemCount ? (checkedCount / itemCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 ml-auto flex-shrink-0">
        {([
          { value: itemCount.toString(), label: "Articles" },
          null,
          { value: checkedCount.toString(), label: "Achetés" },
          null,
          { value: totalEur.toLocaleString("fr-FR") + " €", label: "Total" },
        ] as ({ value: string; label: string } | null)[]).map((s, i) =>
          s === null ? (
            <div key={i} className="w-px h-8 bg-[#d9d9e0]" />
          ) : (
            <div key={i} className="text-center">
              <div className="font-serif text-[20px] font-semibold text-[#141418]">{s.value}</div>
              <div className="text-[10px] text-[#a4a4ae] uppercase tracking-[0.05em] mt-[1px]">{s.label}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}