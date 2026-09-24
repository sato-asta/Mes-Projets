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
  item: Item;
  onClose: () => void;
  onRemove: (id: string) => void;
};

export default function WishlistDrawer({ item, onClose, onRemove }: Props) {
  const hostname = item.url
    ? item.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]
    : "";

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[200] flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[20px] w-[380px] max-h-[80vh] overflow-y-auto shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
        <div className="h-[160px] bg-[#efeff3] rounded-[20px_20px_0_0] flex items-center justify-center relative overflow-hidden">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 opacity-25">
              <path d="M6 14h24v14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V14z" />
              <path d="M10 14v-3a8 8 0 0 1 16 0v3" />
            </svg>
          )}
          <div
            className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/90 border border-[#d9d9e0] flex items-center justify-center cursor-pointer"
            onClick={onClose}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-[#5e5e66]">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </div>
        </div>

        <div className="p-5">
          <div className="font-serif text-[18px] font-semibold text-[#141418] leading-[1.3]">
            {item.name}
          </div>
          <div className="font-serif text-[22px] font-semibold text-[#d64550] mt-[6px] mb-[14px]">
            {item.price > 0 ? item.price.toLocaleString("fr-FR") + " €" : "Prix non renseigné"}
          </div>

          {item.url && (
            <div className="flex justify-between items-center py-[9px] border-b border-[#d9d9e0] text-[13px]">
              <span className="text-[#a4a4ae]">Source</span>
              <button
                onClick={() => window.open(item.url, "_blank")}
                className="text-[#d64550] hover:underline truncate max-w-[180px] block text-[12px] font-medium bg-transparent border-0 cursor-pointer"
              >
                {hostname}
              </button>
            </div>
          )}

          <div className="flex justify-between items-center py-[9px] border-b border-[#d9d9e0] text-[13px]">
            <span className="text-[#a4a4ae]">Catégorie</span>
            <span className="text-[#141418] font-medium text-[12px]">{item.category || "—"}</span>
          </div>

          <div className="flex justify-between items-center py-[9px] border-b border-[#d9d9e0] text-[13px]">
            <span className="text-[#a4a4ae]">Note</span>
            <span className="text-[#141418] font-medium text-[12px]">{item.note ?? "—"}</span>
          </div>

          <div className="flex gap-2 mt-4">
            {item.url && (
              <button
                onClick={() => { window.open(item.url, "_blank"); onClose(); }}
                className="flex-[2] py-[11px] bg-[#d64550] text-white border-0 rounded-[10px] text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-[6px] font-sans hover:opacity-85 transition-opacity"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
                Voir le site
              </button>
            )}
            <button
              onClick={() => { onRemove(item._id); onClose(); }}
              className="flex-1 py-[11px] bg-[#fee2e2] text-[#dc2626] border border-transparent rounded-[10px] text-[13px] font-medium cursor-pointer font-sans hover:opacity-85 transition-opacity"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}