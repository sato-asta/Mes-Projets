import { EVENT_TYPES } from "../constants";

type Props = {
  eventType: string;
  eventDate: string;
  onEventTypeChange: (type: string) => void;
  onEventDateChange: (date: string) => void;
};

export default function EventSection({ eventType, eventDate, onEventTypeChange, onEventDateChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-[#141418]">Type d&apos;événement</div>
      <div className="flex flex-wrap gap-2">
        {EVENT_TYPES.map((et) => (
          <button
            key={et.key}
            type="button"
            onClick={() => onEventTypeChange(et.key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition ${
              eventType === et.key
                ? "border-[#d64550] bg-[#fce9eb] text-[#141418]"
                : "border-[#d9d9e0] text-[#5e5e66] hover:bg-[#f6f6f8]"
            }`}
          >
            <span>{et.emoji}</span>
            <span>{et.label}</span>
          </button>
        ))}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#141418]">Date de l&apos;événement</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => onEventDateChange(e.target.value)}
          className="rounded-xl px-4 py-3 bg-[#f6f6f8] border border-[#d9d9e0] text-[#141418] w-full outline-none"
        />
      </div>
    </div>
  );
}
