// Configuration de NextAuth — définit comment l'authentification fonctionne
// On supporte deux méthodes : Google OAuth et email/mot de passe classique
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

// URL de notre API backend (FastAPI) — utilisée pour vérifier les identifiants
const API_URL = process.env.INTERNAL_API_URL ?? "http://localhost:8000"

export const authOptions: NextAuthOptions = {
  providers: [
    // ── Connexion via Google OAuth ──
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Connexion classique email + mot de passe ──
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize() est appelée quand l'utilisateur soumet le formulaire de connexion
      // On envoie les identifiants à notre API et on retourne l'utilisateur si OK
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        let res: Response
        try {
          res = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })
        } catch {
          // Si l'API est inaccessible, on refuse la connexion silencieusement
          return null
        }

        if (!res.ok) return null

        // L'API nous renvoie l'utilisateur → on le retourne à NextAuth
        const user = await res.json()
        return { id: user.id, name: user.name, email: user.email, image: user.avatar || null, backendToken: user.access_token }
      },
    }),
  ],

  // Redirige vers notre page de login personnalisée au lieu de celle de NextAuth
  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  // On utilise des JWT stockés en cookie côté client (pas de session en base de données)
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        if (user.backendToken) token.backendToken = user.backendToken
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string
      if (token.backendToken) session.backendToken = token.backendToken
      return session
    },

    // Appelé lors d'une connexion Google : on crée ou retrouve l'utilisateur dans notre API
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const res = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name ?? "",
            email: user.email ?? "",
            avatar: user.image ?? "",
            provider: "google",
          }),
        })
        // 400 = email déjà utilisé = utilisateur existant, c'est OK
        if (!res.ok && res.status !== 400) return false
        if (res.ok) {
          const data = await res.json()
          user.id = data.id
        }
        // Récupère un token backend pour les users Google
        const tokenRes = await fetch(`${API_URL}/users/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        })
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json()
          user.backendToken = tokenData.access_token
        }
      }
      return true
    },
  },
}
