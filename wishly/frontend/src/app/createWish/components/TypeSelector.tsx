import { LIST_TYPES } from "../constants";
import type { ListType } from "../types";

type Props = {
  value: ListType;
  onChange: (type: ListType) => void;
};

export default function TypeSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-[#141418]">Type de liste</div>
      <div className="grid grid-cols-2 gap-2">
        {LIST_TYPES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={`rounded-xl border p-3 text-left transition ${
              value === t.key
                ? "border-[#d64550] bg-[#fce9eb]"
                : "border-[#d9d9e0] hover:bg-[#f6f6f8]"
            }`}
          >
            <div className="text-xl">{t.icon}</div>
            <div className="font-medium text-sm mt-1 text-[#141418]">{t.label}</div>
            <div className="text-xs text-[#5e5e66] mt-[2px]">{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
