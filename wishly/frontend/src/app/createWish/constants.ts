export const colors = [
  { color: "#d64550", light: "#fce9eb" },
  { color: "#f97316", light: "#fef3c7" },
  { color: "#eab308", light: "#fef9c3" },
  { color: "#22c55e", light: "#dcfce7" },
  { color: "#06b6d4", light: "#cffafe" },
  { color: "#3b82f6", light: "#dbeafe" },
  { color: "#8b5cf6", light: "#ede9fe" },
  { color: "#d946ef", light: "#fae8ff" },
];

export const emojis = [
  "🛍️", "💻", "✈️", "🎮", "📚", "🏠", "👗", "🎁",
  "🌿", "🎵", "🏋️", "✨", "🌍", "🍳", "🎯", "❤️",
];

export const LIST_TYPES = [
  { key: "personal",      label: "Personnelle",  icon: "👤", desc: "Liste pour toi seul(e)"     },
  { key: "collaborative", label: "Collaborative", icon: "👥", desc: "Gérez la liste à plusieurs" },
] as const;

export const EVENT_TYPES = [
  { key: "birthday",    label: "Anniversaire", emoji: "🎂" },
  { key: "christmas",   label: "Noël",         emoji: "🎄" },
  { key: "wedding",     label: "Mariage",      emoji: "💍" },
  { key: "baby_shower", label: "Baby shower",  emoji: "👶" },
  { key: "other",       label: "Autre",        emoji: "🎉" },
] as const;

export const personalTemplates = [
  { emoji: "🗓️", name: "Ce mois-ci",  desc: "Achats urgents du mois"   },
  { emoji: "📅", name: "Cette année", desc: "Mes projets pour l'année" },
  { emoji: "✨", name: "Un jour...",  desc: "Mes rêves sans deadline"   },
  { emoji: "🎁", name: "Cadeaux",     desc: "Idées cadeaux pour moi"   },
];

export const eventTemplates = [
  { emoji: "🎂", name: "Mon anniversaire", desc: "Ma wishlist cadeau",         eventType: "birthday"    },
  { emoji: "🎄", name: "Ma liste de Noël", desc: "Envies pour les fêtes",      eventType: "christmas"   },
  { emoji: "💍", name: "Liste de mariage", desc: "Nos envies pour la vie à 2", eventType: "wedding"     },
  { emoji: "👶", name: "Baby shower",      desc: "Préparer l'arrivée de bébé", eventType: "baby_shower" },
];

export const visLabels: Record<string, string> = {
  public:  "Publique",
  friends: "Amis only",
  private: "Privée",
};
