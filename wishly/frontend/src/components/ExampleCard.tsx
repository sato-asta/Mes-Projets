// Composant de démonstration — carte générique stylée avec Tailwind
// Sert d'exemple de référence pour les conventions de style du projet

export default function ExampleCard() {
  return (
    // bg-white : fond blanc | rounded-lg : coins arrondis | shadow-md : ombre moyenne
    // p-6 : padding intérieur | border : fine bordure grise autour de la carte
    <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-200">

      {/* Titre de la carte */}
      {/* text-lg : taille de texte grande | font-semibold : semi-gras | mb-2 : marge basse */}
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        Example Card
      </h3>

      {/* Description */}
      {/* text-neutral-600 : gris moyen | mb-4 : marge basse avant les tags */}
      <p className="text-neutral-600 mb-4">
        This is an example card component styled with Tailwind CSS
      </p>

      {/* Rangée de tags */}
      {/* flex gap-2 : tags côte à côte avec espace entre eux */}
      <div className="flex gap-2">
        {/* Tag primaire — fond coloré clair avec texte assorti */}
        {/* inline-block px-3 py-1 : padding horizontal/vertical compact */}
        {/* rounded-full : bordures complètement arrondies (forme pilule) */}
        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          Tag
        </span>

        {/* Tag "Active" — couleur de succès (vert) */}
        <span className="inline-block px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
          Active
        </span>
      </div>
    </div>
  );
}
