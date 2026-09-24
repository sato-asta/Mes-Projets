import { personalTemplates, eventTemplates } from "../constants";
import type { ListType } from "../types";

type Props = {
  listType: ListType;
  onApplyPersonal: (tpl: typeof personalTemplates[0]) => void;
  onApplyEvent: (tpl: typeof eventTemplates[0]) => void;
};

export default function TemplatesGrid({ listType, onApplyPersonal, onApplyEvent }: Props) {
  void listType;
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-[#141418]">Partir d&apos;un modèle</div>
      <div className="grid grid-cols-2 gap-2">
        {personalTemplates.map((tpl) => (
          <button
            key={tpl.name}
            type="button"
            onClick={() => onApplyPersonal(tpl)}
            className="border border-[#d9d9e0] rounded-xl p-3 text-left hover:bg-[#efeff3] transition"
          >
            <div className="text-xl">{tpl.emoji}</div>
            <div className="font-medium text-sm mt-1 text-[#141418]">{tpl.name}</div>
            <div className="text-xs text-[#5e5e66]">{tpl.desc}</div>
          </button>
        ))}
        {eventTemplates.map((tpl) => (
          <button
            key={tpl.name}
            type="button"
            onClick={() => onApplyEvent(tpl)}
            className="border border-[#d9d9e0] rounded-xl p-3 text-left hover:bg-[#efeff3] transition"
          >
            <div className="text-xl">{tpl.emoji}</div>
            <div className="font-medium text-sm mt-1 text-[#141418]">{tpl.name}</div>
            <div className="text-xs text-[#5e5e66]">{tpl.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
