"use client";

type Item = {
  _id: string;
  name: string;
  price: number;
  url: string;
  category: string;
  image?: string;
  checked: boolean;
  note?: string;
};

type Props = {
  items: Item[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onSelect: (item: Item) => void;
};

export default function WishlistGrid({ items, onToggle, onRemove, onSelect }: Props) {
  if (items.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item._id}
          className={"bg-white border border-[#d9d9e0] rounded-[16px] overflow-hidden cursor-pointer relative transition-all hover:border-[#c8c3bb] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col " + (item.checked ? "opacity-55" : "")}
          onClick={() => onSelect(item)}
        >
          <div className={"h-[130px] bg-[#efeff3] flex items-center justify-center relative flex-shrink-0 " + (item.checked ? "[filter:grayscale(0.5)]" : "")}>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 opacity-25">
                <path d="M6 14h24v14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V14z" />
                <path d="M10 14v-3a8 8 0 0 1 16 0v3" />
              </svg>
            )}
            <div
              className={"absolute top-[8px] left-[8px] w-[22px] h-[22px] rounded-[6px] border-[1.5px] flex items-center justify-center cursor-pointer transition-all " + (item.checked ? "bg-[#d64550] border-[#d64550]" : "bg-white/90 border-[#d9d9e0]")}
              onClick={(e) => { e.stopPropagation(); onToggle(item._id); }}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" className={"w-[10px] h-[10px] transition-opacity " + (item.checked ? "opacity-100" : "opacity-0")}>
                <path d="M3 8l3.5 3.5 6.5-7" />
              </svg>
            </div>
            <div
              className="absolute top-[8px] right-[8px] w-[26px] h-[26px] rounded-[7px] bg-white/95 border border-[#d9d9e0] flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors"
              onClick={(e) => { e.stopPropagation(); onRemove(item._id); }}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-[#5e5e66]">
                <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4" />
              </svg>
            </div>
            {item.category && (
              <div className="absolute bottom-[8px] right-[8px] text-[9px] font-semibold px-[7px] py-[2px] rounded-full bg-white/90 border border-[#d9d9e0] text-[#5e5e66] max-w-[80px] truncate">
                {item.category}
              </div>
            )}
          </div>
          <div className="p-3 flex flex-col gap-[6px] flex-1">
            <div className={"text-[12px] font-medium text-[#141418] leading-[1.4] line-clamp-2 " + (item.checked ? "line-through text-[#a4a4ae]" : "")}>
              {item.name}
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className={"text-[14px] font-semibold font-serif " + (item.checked ? "text-[#a4a4ae]" : item.price > 0 ? "text-[#d64550]" : "text-[#a4a4ae]")}>
                {item.price > 0 ? item.price.toLocaleString("fr-FR") + " €" : "—"}
              </span>
              {item.url && (
                <button
                  onClick={(e) => { e.stopPropagation(); window.open(item.url, "_blank"); }}
                  className="text-[10px] text-[#d64550] hover:underline font-medium bg-transparent border-0 cursor-pointer"
                >
                  Voir →
                </button>
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
  );
}