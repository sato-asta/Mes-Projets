"use client";

type Filter = "all" | "todo" | "done";

type Props = {
  filter: Filter;
  setFilter: (f: Filter) => void;
  itemCount: number;
  todoCount: number;
  doneCount: number;
  onShare: () => void;
  onExportPDF: () => void;
};

export default function WishlistToolbar({
  filter, setFilter, itemCount, todoCount, doneCount, onShare, onExportPDF,
}: Props) {
  return (
    <div className="px-6 py-3 border-b border-[#d9d9e0] bg-white flex items-center justify-between gap-[10px] flex-shrink-0">
      <div className="flex gap-[6px]">
        {([
          ["all",  "Tous (" + itemCount + ")"],
          ["todo", "À acheter (" + todoCount + ")"],
          ["done", "Achetés (" + doneCount + ")"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={
              "px-3 py-[5px] rounded-full text-[12px] border cursor-pointer transition-all font-sans " +
              (filter === key
                ? "bg-[#141418] text-white border-transparent"
                : "bg-transparent text-[#5e5e66] border-[#d9d9e0] hover:bg-[#efeff3]")
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-[6px]">
        <button
          onClick={onShare}
          className="flex items-center gap-[6px] px-3 py-[5px] rounded-full text-[12px] border border-[#d9d9e0] text-[#5e5e66] hover:bg-[#efeff3] transition-all cursor-pointer font-sans"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[13px] h-[13px]">
            <path d="M10 2l4 4-4 4M14 6H6a4 4 0 0 0 0 8h1" />
          </svg>
          Partager
        </button>
        <button
          onClick={onExportPDF}
          className="flex items-center gap-[6px] px-3 py-[5px] rounded-full text-[12px] border border-[#d9d9e0] text-[#5e5e66] hover:bg-[#efeff3] transition-all cursor-pointer font-sans"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[13px] h-[13px]">
            <path d="M3 11v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2M8 2v8M5 7l3 3 3-3" />
          </svg>
          Exporter PDF
        </button>
      </div>
    </div>
  );
}