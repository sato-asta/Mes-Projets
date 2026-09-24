import { useMemo } from "react";
import { EVENT_TYPES, visLabels } from "../constants";
import type { Color, Friend, ListType } from "../types";

type Props = {
  name: string;
  desc: string;
  emoji: string;
  selectedColor: Color;
  visibility: string;
  listType: ListType;
  eventOn: boolean;
  eventType: string;
  eventDate: string;
  deadlineOn: boolean;
  deadline: string;
  selectedFriends: Friend[];
};

export default function ListPreview({
  name, desc, emoji, selectedColor, visibility,
  listType, eventOn, eventType, eventDate, deadlineOn, deadline, selectedFriends,
}: Props) {
  const deadlineLabel = useMemo(() => {
    if (!deadline) return "Sans deadline";
    return "📅 " + new Date(deadline).toLocaleDateString("fr-FR", {
      day: "numeric", month: "short", year: "numeric",
    });
  }, [deadline]);

  const eventDateLabel = useMemo(() => {
    if (!eventDate) return null;
    return new Date(eventDate).toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    });
  }, [eventDate]);

  const currentEventType = EVENT_TYPES.find((e) => e.key === eventType);

  return (
    <aside className="p-8 bg-[#efeff3] space-y-5 overflow-y-auto">
      <div className="text-xs uppercase tracking-wider text-[#a4a4ae]">Aperçu en direct</div>

      <div className="bg-white rounded-2xl border border-[#d9d9e0] overflow-hidden">
        <div className="p-5 flex gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: selectedColor.light }}
          >
            {emoji}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-[#141418] truncate">
              {name || "Nom de la liste"}
            </div>
            <div className="text-sm text-[#a4a4ae] line-clamp-2 mt-[2px]">
              {desc || "Ajoutez une description…"}
            </div>
          </div>
        </div>
        <div className="px-5 py-3 bg-[#f6f6f8] flex flex-wrap gap-2">
          {listType === "collaborative" && (
            <span className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#ede9fe] text-[#7c3aed]">
              👥 Collaborative
            </span>
          )}
          {eventOn && (
            <span className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#fce9eb] text-[#d64550]">
              {currentEventType?.emoji} {currentEventType?.label}
            </span>
          )}
          <span
            className="px-3 py-1 rounded-full text-[12px] font-medium"
            style={{ backgroundColor: selectedColor.light, color: selectedColor.color }}
          >
            {visLabels[visibility]}
          </span>
          {eventOn && eventDate && (
            <span className="px-3 py-1 rounded-full bg-[#fef9c3] text-[#b45309] text-[12px] font-medium">
              📅 {eventDateLabel}
            </span>
          )}
          {deadlineOn && deadline && (
            <span className="px-3 py-1 rounded-full bg-[#fef9c3] text-[#b45309] text-[12px] font-medium">
              {deadlineLabel}
            </span>
          )}
        </div>
      </div>

      {listType === "collaborative" && selectedFriends.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#d9d9e0] p-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#a4a4ae]">
            Collaborateurs ({selectedFriends.length})
          </div>
          <div className="space-y-2">
            {selectedFriends.map((f) => (
              <div key={f.email} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#d9d9e0] flex items-center justify-center text-xs font-medium text-[#5e5e66] overflow-hidden flex-shrink-0">
                  {f.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    f.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-sm text-[#141418]">{f.name}</div>
                <span className="ml-auto text-[10px] px-2 py-[2px] rounded-full bg-[#fef9c3] text-[#b45309]">
                  En attente
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {eventOn && (
        <div className="bg-white rounded-2xl border border-[#d9d9e0] p-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#a4a4ae]">Événement</div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentEventType?.emoji}</span>
            <span className="text-sm font-medium text-[#141418]">{currentEventType?.label}</span>
          </div>
          {eventDate ? (
            <div className="text-sm text-[#5e5e66]">📅 {eventDateLabel}</div>
          ) : (
            <div className="text-sm text-[#a4a4ae]">Aucune date renseignée</div>
          )}
        </div>
      )}
    </aside>
  );
}
