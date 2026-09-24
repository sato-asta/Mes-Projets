"use client"

// Page de connexion — formulaire email/mdp + bouton Google
// Si l'utilisateur est déjà connecté, on le redirige directement vers /home
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const { status } = useSession()

  // Stocke les erreurs de validation par champ (ex: { email: "Email invalide" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  // Message de succès affiché après une inscription réussie
  const [success, setSuccess] = useState("")
  // Indique si la requête de connexion est en cours (pour désactiver le bouton)
  const [loading, setLoading] = useState(false)

  // Si l'utilisateur est déjà connecté, on le redirige vers /home
  useEffect(() => {
    if (status === "authenticated") router.replace("/home")
  }, [status, router])

  // Si on arrive depuis /register avec ?registered=true, on affiche un message de succès
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get("registered")) {
      setSuccess("Compte créé avec succès ! Vous pouvez vous connecter.")
    }
  }, [])

  // Gère la soumission du formulaire de connexion
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = fd.get("email") as string
    const password = fd.get("password") as string

    // Validation côté client avant d'envoyer la requête
    const errs: Record<string, string> = {}
    if (!email.includes("@")) errs.email = "Email invalide"
    if (!password) errs.password = "Mot de passe requis"

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)
    // On appelle NextAuth avec notre provider "credentials"
    // redirect: false pour gérer la redirection nous-mêmes
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    setLoading(false)

    if (result?.error) {
      setErrors({ global: "Email ou mot de passe incorrect" })
    } else {
      router.push("/home")
    }
  }

  return (
    // Fond plein écran centré — bg-bg = couleur de fond globale définie dans le thème
    <div className="min-h-screen bg-bg flex items-center justify-center p-8">

      {/* Carte principale : 2 colonnes sur écran moyen+, 1 colonne sur mobile */}
      {/* shadow-[...] = ombre personnalisée pour donner du relief */}
      <div className="w-full max-w-5xl bg-surface border border-border rounded-[20px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] grid md:grid-cols-2">

        {/* ── Panneau gauche : illustration décorative (masqué sur mobile) ── */}
        {/* hidden md:flex = invisible sur mobile, visible sur écran md+ */}
        {/* bg-gradient-to-b = dégradé vertical du vert clair au bleu clair */}
        <div className="hidden md:flex flex-col bg-gradient-to-b from-[#E8F0EB] to-[#EAF0F8] flex-col items-center justify-center p-12 border-r border-border">

          {/* Logo Wishly */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {/* Icône rouge arrondie avec le symbole cœur */}
            <div className="w-12 h-12 bg-accent rounded-[12px] flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.8" className="w-6 h-6">
                <path d="M8 14s-6-4-6-8a6 6 0 0 1 12 0c0 4-6 8-6 8z" />
              </svg>
            </div>
            {/* font-serif = Fraunces, notre police de titre */}
            <span className="text-text text-2xl font-semibold font-serif">Wishly</span>
          </div>

          {/* Texte d'accroche + icône décorative */}
          <div className="text-center max-w-xs">
            <h2 className="text-text text-2xl font-semibold font-serif mb-4">Bienvenue!</h2>
            {/* text-text-2 = couleur de texte secondaire (plus grise) */}
            <p className="text-text-2 text-sm leading-relaxed mb-8">
              Créez votre liste de souhaits personnelle et partagez vos envies avec vos amis.
            </p>
            {/* Cadre illustratif avec l'icône cœur SVG */}
            <div className="w-28 h-28 bg-[rgba(45,90,61,0.1)] rounded-[16px] flex items-center justify-center mx-auto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 text-accent">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Panneau droit : formulaire de connexion ── */}
        <div className="flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-sm">

            {/* Toggle Connexion / Inscription — l'onglet actif a un fond blanc */}
            <div className="flex gap-2 bg-surface2 rounded-[10px] p-1 mb-8">
              {/* Onglet actif "Connexion" : fond blanc + bordure */}
              <button
                type="button"
                className="flex-1 py-2.5 text-xs font-medium bg-surface text-text rounded-[8px] border border-border transition-all"
              >
                Connexion
              </button>
              {/* Onglet inactif "Inscription" : transparent, hover léger */}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="flex-1 py-2.5 text-xs font-medium bg-transparent text-text-2 rounded-[8px] hover:bg-surface/30 transition-all"
              >
                Inscription
              </button>
            </div>

            {/* Message de succès après inscription (fond bleu clair) */}
            {success && (
              <div className="bg-blue-light border border-blue text-blue text-xs rounded-[10px] px-4 py-3 mb-4">
                {success}
              </div>
            )}

            {/* Erreur globale (mauvais identifiants) — fond rouge clair */}
            {errors.global && (
              <div className="bg-accent-light border border-accent text-accent text-xs rounded-[10px] px-4 py-3 mb-4">
                {errors.global}
              </div>
            )}

            {/* Titre du formulaire */}
            <h1 className="text-text text-xl font-semibold font-serif mb-1">Bon retour !</h1>
            <p className="text-text-2 text-xs mb-6">Connectez-vous à votre compte Wishly</p>

            {/* Formulaire principal */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Champ email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-text text-xs font-medium">Adresse email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  // focus:shadow-[...] = anneau de focus personnalisé rouge translucide
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
                  placeholder="Votre mot de passe"
                  className="border border-border rounded-[10px] px-3.5 py-2.5 text-xs text-text placeholder-text-3 bg-surface outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(214,69,80,0.08)]"
                />
                {errors.password && <span className="text-xs text-accent">{errors.password}</span>}
              </div>

              {/* Lien "mot de passe oublié" aligné à droite */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-accent text-xs font-medium hover:opacity-80 transition-opacity"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Bouton de soumission — désactivé pendant le chargement */}
              {/* active:scale-98 = légère compression au clic pour un effet "press" */}
              <button
                type="submit"
                disabled={loading}
                className="bg-accent hover:opacity-90 text-white font-medium py-3 rounded-[10px] text-xs transition-all active:scale-98 disabled:opacity-60 w-full"
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>

              {/* Séparateur "ou" */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-text-3 text-xs">ou</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Bouton Google OAuth */}
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/home" })}
                className="border border-border bg-surface2 hover:bg-border text-text font-medium py-2.5 rounded-[10px] text-xs flex items-center justify-center gap-2 transition-all"
              >
                {/* Logo Google en SVG inline avec les 4 couleurs officielles */}
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Se connecter avec Google
              </button>

              {/* Lien vers la page d'inscription */}
              <p className="text-center text-text-2 text-xs">
                Pas de compte ?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="text-accent font-medium hover:opacity-80 transition-opacity"
                >
                  S&apos;inscrire
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
