"use client"

// Page d'inscription — formulaire complet avec validation + conditions d'utilisation
// Si l'utilisateur est déjà connecté, on le redirige vers /home
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"

export default function RegisterPage() {
  const router = useRouter()
  const { status } = useSession()

  // Erreurs de validation par champ
  const [errors, setErrors] = useState<Record<string, string>>({})
  // Indique si le formulaire est en cours d'envoi
  const [loading, setLoading] = useState(false)
  // Contrôle l'affichage de la modale des CGU
  const [showTerms, setShowTerms] = useState(false)
  // Indique si l'utilisateur a coché la case CGU
  const [termsChecked, setTermsChecked] = useState(false)

  // Redirection si déjà connecté
  useEffect(() => {
    if (status === "authenticated") router.replace("/home")
  }, [status, router])

  // Gère la soumission du formulaire d'inscription
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {
      firstname: fd.get("firstname") as string,
      lastname: fd.get("lastname") as string,
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      confirm: fd.get("confirm") as string,
    }

    // Validation de tous les champs avant d'envoyer
    const errs: Record<string, string> = {}
    if (!data.firstname) errs.firstname = "Prénom requis"
    if (!data.lastname) errs.lastname = "Nom requis"
    if (!data.email.includes("@")) errs.email = "Email invalide"
    // Règles du mot de passe : 8-20 caractères, 1 majuscule, 2 chiffres minimum
    if (data.password.length < 8) {
      errs.password = "Minimum 8 caractères"
    } else if (data.password.length > 20) {
      errs.password = "Maximum 20 caractères"
    } else if (!/[A-Z]/.test(data.password)) {
      errs.password = "Le mot de passe doit contenir au moins 1 majuscule"
    } else if ((data.password.match(/\d/g) ?? []).length < 2) {
      errs.password = "Le mot de passe doit contenir au moins 2 chiffres"
    }
    if (data.password !== data.confirm) errs.confirm = "Les mots de passe ne correspondent pas"
    if (!termsChecked) errs.terms = "Veuillez accepter les conditions d'utilisation"

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)
    // Appel à notre API pour créer le compte
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setLoading(false)

    if (res.ok) {
      // Compte créé → on redirige vers /login avec un paramètre pour afficher le message de succès
      router.push("/login?registered=true")
    } else {
      const json = await res.json().catch(() => ({}))
      setErrors({ global: (json as { detail?: string }).detail ?? "Erreur lors de la création du compte" })
    }
  }

  return (
    // Fond plein écran centré
    <div className="min-h-screen bg-bg flex items-center justify-center p-8">

      {/* Carte principale 2 colonnes */}
      <div className="w-full max-w-5xl bg-surface border border-border rounded-[20px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] grid md:grid-cols-2">

        {/* ── Panneau gauche : illustration (masqué sur mobile) ── */}
        <div className="hidden md:flex flex-col bg-gradient-to-b from-[#E8F0EB] to-[#EAF0F8] flex-col items-center justify-center p-12 border-r border-border">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-accent rounded-[12px] flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.8" className="w-6 h-6">
                <path d="M8 14s-6-4-6-8a6 6 0 0 1 12 0c0 4-6 8-6 8z" />
              </svg>
            </div>
            <span className="text-text text-2xl font-semibold font-serif">Wishly</span>
          </div>

          <div className="text-center max-w-xs">
            <h2 className="text-text text-2xl font-semibold font-serif mb-4">Bienvenue!</h2>
            <p className="text-text-2 text-sm leading-relaxed mb-8">
              Créez votre liste de souhaits personnelle et partagez vos envies avec vos amis.
            </p>
            <div className="w-28 h-28 bg-[rgba(45,90,61,0.1)] rounded-[16px] flex items-center justify-center mx-auto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 text-accent">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Panneau droit : formulaire d'inscription ── */}
        <div className="flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-sm">

            {/* Toggle Connexion / Inscription — ici c'est "Inscription" qui est actif */}
            <div className="flex gap-2 bg-surface2 rounded-[10px] p-1 mb-8">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="flex-1 py-2.5 text-xs font-medium bg-transparent text-text-2 rounded-[8px] hover:bg-surface/30 transition-all"
              >
                Connexion
              </button>
              {/* Onglet actif : fond blanc avec bordure */}
              <button
                type="button"
                className="flex-1 py-2.5 text-xs font-medium bg-surface text-text rounded-[8px] border border-border transition-all"
              >
                Inscription
              </button>
            </div>

            {/* Erreur globale (ex: email déjà utilisé) */}
            {errors.global && (
              <div className="bg-accent-light border border-accent text-accent text-xs rounded-[10px] px-4 py-3 mb-4">
                {errors.global}
              </div>
            )}

            <h1 className="text-text text-xl font-semibold font-serif mb-1">Créer un compte</h1>
            <p className="text-text-2 text-xs mb-6">Rejoignez la communauté Wishly</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Prénom et Nom côte à côte — grid 2 colonnes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-text text-xs font-medium">Prénom</label>
                  <input
                    name="firstname"
                    placeholder="Jean"
                    className="border border-border rounded-[10px] px-3.5 py-2.5 text-xs text-text placeholder-text-3 bg-surface outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(214,69,80,0.08)]"
                  />
                  {errors.firstname && <span className="text-xs text-accent">{errors.firstname}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-text text-xs font-medium">Nom</label>
                  <input
                    name="lastname"
                    placeholder="Dupont"
                    className="border border-border rounded-[10px] px-3.5 py-2.5 text-xs text-text placeholder-text-3 bg-surface outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(214,69,80,0.08)]"
                  />
                  {errors.lastname && <span className="text-xs text-accent">{errors.lastname}</span>}
                </div>
              </div>

              {/* Champ email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-text text-xs font-medium">Adresse email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  className="border border-border rounded-[10px] px-3.5 py-2.5 text-xs text-text placeholder-text-3 bg-surface outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(214,69,80,0.08)]"
                />
                {errors.email && <span className="text-xs text-accent">{errors.email}</span>}
              </div>

              {/* Champ mot de passe */}
              <div className="flex flex-col gap-1.5">
                <label className="text-text text-xs font-medium">Mot de passe</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Minimum 8 caractères"
                  className="border border-border rounded-[10px] px-3.5 py-2.5 text-xs text-text placeholder-text-3 bg-surface outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(214,69,80,0.08)]"
                />
                {errors.password && <span className="text-xs text-accent">{errors.password}</span>}
              </div>

              {/* Confirmation du mot de passe */}
              <div className="flex flex-col gap-1.5">
                <label className="text-text text-xs font-medium">Confirmer le mot de passe</label>
                <input
                  name="confirm"
                  type="password"
                  placeholder="••••••••"
                  className="border border-border rounded-[10px] px-3.5 py-2.5 text-xs text-text placeholder-text-3 bg-surface outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(214,69,80,0.08)]"
                />
                {errors.confirm && <span className="text-xs text-accent">{errors.confirm}</span>}
              </div>

              {/* Case à cocher personnalisée pour les CGU */}
              {/* On utilise un button pour que le clic sur tout le bloc coche/décoche */}
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setTermsChecked((v) => !v)}
                  className="flex items-start gap-3 text-left"
                >
                  {/* Checkbox visuelle custom : rouge si cochée, grise sinon */}
                  <span
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-all ${
                      termsChecked
                        ? "bg-accent border-accent"         // Cochée : fond rouge
                        : "bg-surface border-border hover:border-accent"  // Décochée : fond blanc
                    }`}
                  >
                    {/* Coche SVG visible uniquement si cochée */}
                    {termsChecked && (
                      <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" className="w-3 h-3">
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    )}
                  </span>
                  <span className="text-text-2 text-xs leading-relaxed">
                    J&apos;accepte les{" "}
                    {/* Lien vers la modale CGU — stopPropagation pour ne pas déclencher le toggle */}
                    <span
                      role="link"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); setShowTerms(true) }}
                      onKeyDown={(e) => e.key === "Enter" && setShowTerms(true)}
                      className="text-accent font-medium underline hover:opacity-80 transition-opacity"
                    >
                      conditions d&apos;utilisation
                    </span>
                  </span>
                </button>
                {/* pl-8 pour aligner l'erreur sous le texte (pas sous la checkbox) */}
                {errors.terms && <span className="text-xs text-accent pl-8">{errors.terms}</span>}
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={loading}
                className="bg-accent hover:opacity-90 text-white font-medium py-3 rounded-[10px] text-xs transition-all active:scale-98 disabled:opacity-60 w-full"
              >
                {loading ? "Création en cours..." : "Créer mon compte"}
              </button>

              {/* Séparateur "ou" */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-text-3 text-xs">ou</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Inscription via Google */}
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/home" })}
                className="border border-border bg-surface2 hover:bg-border text-text font-medium py-2.5 rounded-[10px] text-xs flex items-center justify-center gap-2 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                S&apos;inscrire avec Google
              </button>

              {/* Lien vers la page de connexion */}
              <p className="text-center text-text-2 text-xs">
                Déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-accent font-medium hover:opacity-80 transition-opacity"
                >
                  Se connecter
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* ── Modale des Conditions d'utilisation ── */}
      {showTerms && (
        // Overlay sombre derrière la modale — clic dessus = ferme la modale
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowTerms(false)}
        >
          {/* Contenu de la modale — stopPropagation pour ne pas fermer au clic intérieur */}
          <div
            className="bg-surface border border-border rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-md max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête de la modale avec bouton de fermeture */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
              <h2 className="text-text text-sm font-semibold font-serif">Conditions d&apos;utilisation</h2>
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="text-text-3 hover:text-text transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Corps scrollable des CGU */}
            <div className="overflow-y-auto px-6 py-4 flex flex-col gap-4 text-text-2 text-xs leading-relaxed">
              <p>
                En utilisant <strong className="text-text">Wishly</strong>, vous acceptez les présentes conditions d&apos;utilisation. Veuillez les lire attentivement avant de créer votre compte.
              </p>
              <div>
                <h3 className="text-text text-xs font-semibold mb-1">1. Utilisation du service</h3>
                <p>Wishly est un service permettant de créer et partager des listes de souhaits. Vous vous engagez à utiliser le service de manière légale et respectueuse envers les autres utilisateurs.</p>
              </div>
              <div>
                <h3 className="text-text text-xs font-semibold mb-1">2. Données personnelles</h3>
                <p>Vos données (nom, email) sont utilisées uniquement pour le fonctionnement du service. Elles ne sont pas revendues à des tiers. Vous pouvez demander la suppression de votre compte à tout moment.</p>
              </div>
              <div>
                <h3 className="text-text text-xs font-semibold mb-1">3. Responsabilité</h3>
                <p>Vous êtes responsable du contenu que vous publiez. Wishly se réserve le droit de supprimer tout contenu inapproprié et de désactiver les comptes ne respectant pas ces conditions.</p>
              </div>
              <div>
                <h3 className="text-text text-xs font-semibold mb-1">4. Modifications</h3>
                <p>Ces conditions peuvent être mises à jour. Vous serez informé par email en cas de changement significatif.</p>
              </div>
            </div>

            {/* Pied de la modale avec bouton de fermeture */}
            <div className="px-6 py-4 border-t border-border">
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="w-full bg-accent hover:opacity-90 text-white font-medium py-2.5 rounded-[10px] text-xs transition-all"
              >
                J&apos;ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
