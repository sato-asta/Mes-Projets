"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

type Section = {
  id: string;
  icon: string;
  title: string;
  items: { icon: string; label: string; desc: string }[];
};

const sections: Section[] = [
  {
    id: "sidebar",
    icon: "☰",
    title: "Barre de navigation",
    items: [
      {
        icon: "♥",
        label: "Bouton acceuil",
        desc: "Cliquez sur le logo en haut à gauche pour revenir à votre tableau de bord principal.",
      },
      {
        icon: "🛍️",
        label: "Mes listes",
        desc: "Retrouvez toutes vos wishlists dans cette section. Cliquez sur l'une d'elles pour l'ouvrir directement. La liste par défaut est signalée par ⭐.",
      },
      {
        icon: "＋",
        label: "Nouvelle liste...",
        desc: "Ouvre le formulaire de création d'une nouvelle wishlist (personnelle, collaborative ou liée à un événement).",
      },
      {
        icon: "🎅",
        label: "Secret Santa",
        desc: "Accédez à la section Secret Santa pour organiser des tirages au sort entre amis.",
      },
      {
        icon: "👥",
        label: "Amis",
        desc: "Ouvre la page de gestion des amis. Un badge rouge indique le nombre de demandes d'amis en attente.",
      },
      {
        icon: "🔔",
        label: "Alertes de prix",
        desc: "Affiche le panneau de notifications. Un badge rouge indique les alertes non lues — vous êtes averti quand un article passe sous le prix que vous avez fixé.",
      },
      {
        icon: "👤",
        label: "Votre profil",
        desc: "Cliquez sur votre nom en bas de la sidebar pour accéder à votre profil (gestion du nom, budget, analyse des achats).",
      },
      {
        icon: "↩",
        label: "Se déconnecter",
        desc: "Lien sous votre nom pour vous déconnecter de Wishly et revenir à la page de connexion.",
      },
    ],
  },
  {
    id: "home",
    icon: "🏠",
    title: "Tableau de bord (Accueil)",
    items: [
      {
        icon: "🔍",
        label: "Barre de recherche",
        desc: "Tapez le nom d'un article pour le rechercher sur le web. Les résultats apparaissent automatiquement après une courte pause.",
      },
      {
        icon: "×",
        label: "Effacer la recherche",
        desc: "La croix (×) à droite de la barre vide la recherche et revient à la vue normale de votre tableau de bord.",
      },
      {
        icon: "＋",
        label: "+ Ajouter (résultat de recherche)",
        desc: "Ajoute l'article à votre liste par défaut. Si vous avez plusieurs listes, un sélecteur s'affiche pour choisir la liste cible.",
      },
      {
        icon: "＋",
        label: "+ Nouvelle liste",
        desc: "Bouton raccourci dans la section « Mes souhaits » pour créer rapidement une nouvelle wishlist.",
      },
      {
        icon: "📋",
        label: "Carte de wishlist",
        desc: "Cliquez sur n'importe quelle carte de wishlist pour l'ouvrir et voir ou gérer ses articles.",
      },
      {
        icon: "✅",
        label: "Accepter (invitation)",
        desc: "Accepte une invitation à rejoindre une wishlist collaborative envoyée par un ami.",
      },
      {
        icon: "✕",
        label: "Refuser (invitation)",
        desc: "Refuse une invitation à une wishlist collaborative. Elle disparaît de la liste des invitations.",
      },
      {
        icon: "→",
        label: "Carte d'ami",
        desc: "Cliquez sur la carte d'un ami pour voir son profil public et ses wishlists partagées.",
      },
      {
        icon: "👥",
        label: "Inviter des amis",
        desc: "Bouton affiché quand vous n'avez pas encore d'amis — vous redirige vers la page Amis.",
      },
    ],
  },
  {
    id: "wishlist",
    icon: "📋",
    title: "Page d'une wishlist",
    items: [
      {
        icon: "←",
        label: "Retour",
        desc: "Revient à la page précédente (le tableau de bord ou la page depuis laquelle vous êtes arrivé).",
      },
      {
        icon: "↗",
        label: "Partager",
        desc: "Copie dans votre presse-papier un lien public vers cette liste. Nécessite que la liste soit en visibilité « Publique ».",
      },
      {
        icon: "↓",
        label: "Exporter",
        desc: "Télécharge la liste complète sous forme de fichier PDF, avec le nom, la description, tous les articles, leur prix et leur statut.",
      },
      {
        icon: "🔘",
        label: "Filtres (Tous / À acheter / Achetés)",
        desc: "Filtrez les articles de la liste : affichez tout, uniquement les articles non cochés, ou uniquement les articles déjà achetés.",
      },
      {
        icon: "☑",
        label: "Checkbox de l'article",
        desc: "Cochez un article pour le marquer comme « acheté ». L'article s'affiche alors en grisé et barré. Cliquez à nouveau pour annuler.",
      },
      {
        icon: "🗑",
        label: "Supprimer (icône poubelle)",
        desc: "Retire définitivement l'article de la wishlist. Cette action est immédiate.",
      },
      {
        icon: "🖱",
        label: "Clic sur un article",
        desc: "Ouvre le panneau de détail (drawer) avec les infos complètes de l'article : prix, source, catégorie, note, et les options d'alerte de prix.",
      },
      {
        icon: "🔔",
        label: "Alerte de prix (toggle)",
        desc: "Dans le panneau de détail, activez ce bouton pour être notifié quand le prix de l'article descend sous un seuil que vous définissez.",
      },
      {
        icon: "💾",
        label: "Sauvegarder l'alerte",
        desc: "Enregistre le prix cible de l'alerte. Vous recevrez une notification dans la sidebar dès que le prix passe sous ce seuil.",
      },
      {
        icon: "→",
        label: "Voir le site",
        desc: "Ouvre la page du produit sur le site marchand dans un nouvel onglet.",
      },
      {
        icon: "🗑",
        label: "Supprimer (dans le drawer)",
        desc: "Supprime l'article depuis le panneau de détail, puis le ferme automatiquement.",
      },
    ],
  },
  {
    id: "friends",
    icon: "👥",
    title: "Page Amis",
    items: [
      {
        icon: "📋",
        label: "Mon code ami",
        desc: "Code unique à 8 caractères qui vous identifie. Partagez-le à vos amis pour qu'ils puissent vous envoyer une demande.",
      },
      {
        icon: "📋",
        label: "Copier",
        desc: "Copie votre code ami dans le presse-papier. Le bouton affiche « Copié ! » pendant 2 secondes.",
      },
      {
        icon: "✉",
        label: "Envoyer (demande d'ami)",
        desc: "Envoie une demande d'ami à la personne dont vous avez saisi le code. Le bouton est actif uniquement quand le code fait 8 caractères.",
      },
      {
        icon: "👁",
        label: "Voir wishlist",
        desc: "Depuis une demande reçue ou votre liste d'amis, ouvre le profil public de cette personne et ses listes partagées.",
      },
      {
        icon: "✅",
        label: "Accepter",
        desc: "Accepte une demande d'ami reçue. La personne est ajoutée à votre liste d'amis et vous à la sienne.",
      },
      {
        icon: "✕",
        label: "Refuser",
        desc: "Refuse une demande d'ami. Elle disparaît de la liste sans notification à l'expéditeur.",
      },
      {
        icon: "✕",
        label: "Retirer",
        desc: "Supprime un ami de votre liste. La relation est supprimée des deux côtés.",
      },
    ],
  },
  {
    id: "secret-santa",
    icon: "🎅",
    title: "Secret Santa",
    items: [
      {
        icon: "＋",
        label: "+ Créer un groupe",
        desc: "Crée un nouveau groupe Secret Santa en définissant le nom, la date, le budget et les participants.",
      },
      {
        icon: "🎅",
        label: "Carte de groupe",
        desc: "Cliquez sur un groupe existant pour voir les détails : participants, tirage au sort, et résultats.",
      },
      {
        icon: "＋",
        label: "Nouveau Secret Santa (carte pointillée)",
        desc: "Raccourci alternatif pour créer un nouveau groupe Secret Santa.",
      },
    ],
  },
  {
    id: "create",
    icon: "✏",
    title: "Créer une liste",
    items: [
      {
        icon: "←",
        label: "Retour",
        desc: "Annule la création et revient à la page précédente sans sauvegarder.",
      },
      {
        icon: "🔘",
        label: "Type de liste (Personnelle / Collaborative / Événement)",
        desc: "Choisissez le type de liste. Personnelle = pour vous seul. Collaborative = partagée avec des amis qui peuvent y ajouter des articles. Événement = liée à une occasion spéciale.",
      },
      {
        icon: "📐",
        label: "Templates",
        desc: "Modèles prédéfinis (anniversaire, Noël, mariage…) qui pré-remplissent le nom, la description et l'icône de la liste.",
      },
      {
        icon: "😀",
        label: "Sélecteur d'icône (emoji)",
        desc: "Choisissez l'emoji qui représentera votre liste dans la sidebar et sur les cartes.",
      },
      {
        icon: "🎨",
        label: "Sélecteur de couleur",
        desc: "Choisissez la couleur d'accent de la liste. Elle sera utilisée comme arrière-plan de l'icône sur les cartes.",
      },
      {
        icon: "🌐",
        label: "Visibilité (Publique / Privée / Amis)",
        desc: "Définit qui peut voir votre liste. Publique = accessible via un lien. Amis = visible par vos amis Wishly. Privée = uniquement pour vous.",
      },
      {
        icon: "👥",
        label: "Inviter des collaborateurs",
        desc: "Visible uniquement pour les listes collaboratives. Cochez vos amis pour les inviter à contribuer à cette liste.",
      },
      {
        icon: "📅",
        label: "Associer à un événement",
        desc: "Lie la liste à un événement (anniversaire, Noël, etc.) avec une date. Permet d'indiquer le contexte de la liste.",
      },
      {
        icon: "⏰",
        label: "Ajouter une date limite",
        desc: "Définit une date après laquelle la liste ne sera plus active (ex : date d'un anniversaire).",
      },
      {
        icon: "✕",
        label: "Annuler",
        desc: "Abandonne la création de la liste et revient à la page précédente.",
      },
      {
        icon: "✅",
        label: "Créer la liste",
        desc: "Valide et enregistre la nouvelle wishlist avec tous les paramètres définis. Vous êtes ensuite redirigé vers le tableau de bord.",
      },
    ],
  },
  {
    id: "profile",
    icon: "👤",
    title: "Profil",
    items: [
      {
        icon: "✏",
        label: "Modifier le nom",
        desc: "Cliquez sur « Modifier » pour changer le nom affiché sur votre profil. Confirmez avec « Sauvegarder ».",
      },
      {
        icon: "💰",
        label: "Budget mensuel",
        desc: "Renseignez votre salaire mensuel pour activer l'analyse de budget. Wishly calcule votre capacité d'épargne et colore chaque article selon son accessibilité.",
      },
      {
        icon: "🟢",
        label: "Indicateurs d'accessibilité",
        desc: "Vert = Abordable (< 10% du salaire). Orange = Attention (10–30%). Rouge = Difficile (> 30%). Ils sont affichés sur chaque article de vos wishlists.",
      },
    ],
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-[1100px] h-[700px] bg-[var(--color-surface)] rounded-[20px] border border-[var(--color-border)] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] grid grid-cols-[220px_1fr]">

        <Sidebar active="home" />

        <main className="flex flex-col overflow-hidden">
          {/* Header */}
          <header className="border-b border-[#d9d9e0] px-6 py-[14px] flex items-center gap-3 flex-shrink-0 bg-white">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-[6px] text-[13px] text-[#5e5e66] px-[10px] py-[6px] rounded-lg hover:bg-[#efeff3] transition"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[14px] h-[14px]">
                <path d="M10 3L5 8l5 5" />
              </svg>
              Retour
            </button>
            <div className="w-px h-[18px] bg-[#d9d9e0]" />
            <span className="text-[13px] font-medium text-[#141418]">Centre d&apos;aide</span>
          </header>

          {/* Content: two-column */}
          <div className="flex-1 overflow-hidden grid grid-cols-[200px_1fr]">

            {/* Left nav */}
            <nav className="border-r border-[#d9d9e0] overflow-y-auto py-4 px-3 flex flex-col gap-1">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#a4a4ae] font-semibold px-2 mb-2">
                Sections
              </p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-[10px] text-[12px] transition text-left ${
                    activeSection === s.id
                      ? "bg-[#d64550]/10 text-[#d64550] font-semibold"
                      : "text-[#5e5e66] hover:bg-[#efeff3]"
                  }`}
                >
                  <span className="text-base leading-none flex-shrink-0">{s.icon}</span>
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </nav>

            {/* Main content */}
            <div className="overflow-y-auto px-8 py-6 space-y-10 bg-[#f6f6f8]">

              {/* Hero */}
              <div className="bg-white border border-[#d9d9e0] rounded-2xl p-6 flex items-center gap-5">
                <div className="w-12 h-12 rounded-[14px] bg-[#d64550] flex items-center justify-center text-2xl flex-shrink-0">
                  ❓
                </div>
                <div>
                  <h1 className="font-serif text-[20px] font-semibold text-[#141418]">Centre d&apos;aide Wishly</h1>
                  <p className="text-[13px] text-[#5e5e66] mt-1">
                    Retrouvez ici l&apos;explication de chaque bouton et fonctionnalité de l&apos;application.
                  </p>
                </div>
              </div>

              {/* Sections */}
              {sections.map((section) => (
                <div key={section.id} id={`section-${section.id}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl">{section.icon}</span>
                    <h2 className="font-serif text-[16px] font-semibold text-[#141418]">{section.title}</h2>
                  </div>
                  <div className="space-y-2">
                    {section.items.map((item, i) => (
                      <div
                        key={i}
                        className="bg-white border border-[#d9d9e0] rounded-[14px] p-4 flex gap-4 items-start"
                      >
                        <div className="w-8 h-8 rounded-[8px] bg-[#d64550]/10 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-[#141418] mb-1">{item.label}</div>
                          <div className="text-[12px] text-[#5e5e66] leading-relaxed">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pb-4" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
