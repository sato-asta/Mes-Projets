import type { Friend } from "../types";

type Props = {
  friends: Friend[];
  loading: boolean;
  selected: string[];
  onToggle: (email: string) => void;
};

export default function CollaboratorsPicker({ friends, loading, selected, onToggle }: Props) {
  if (loading) {
    return <div className="text-sm text-[#a4a4ae]">Chargement de tes amis...</div>;
  }

  if (friends.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#d9d9e0] p-4 text-center">
        <div className="text-2xl mb-1">👥</div>
        <div className="text-sm text-[#5e5e66]">Aucun ami pour l&apos;instant</div>
        <div className="text-xs text-[#a4a4ae] mt-1">Ajoute des amis depuis l&apos;onglet Amis</div>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
      {friends.map((friend) => {
        const isSelected = selected.includes(friend.email);
        return (
          <button
            key={friend.email}
            type="button"
            onClick={() => onToggle(friend.email)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border transition ${
              isSelected ? "border-[#d64550] bg-[#fce9eb]" : "border-[#d9d9e0] hover:bg-[#f6f6f8]"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#d9d9e0] flex items-center justify-center text-sm font-medium text-[#5e5e66] flex-shrink-0 overflow-hidden">
              {friend.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
              ) : (
                friend.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-[#141418]">{friend.name}</div>
              <div className="text-xs text-[#a4a4ae]">{friend.email}</div>
            </div>
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${
              isSelected ? "bg-[#d64550] border-[#d64550]" : "border-[#d9d9e0]"
            }`}>
              {isSelected && (
                <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" className="w-3 h-3">
                  <path d="M3 8l3.5 3.5 6.5-7" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
