// Middleware Next.js — s'exécute AVANT chaque requête vers les routes protégées
// Si l'utilisateur n'est pas connecté (pas de token JWT), on le redirige vers /login
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  // On vérifie si un token JWT valide existe dans les cookies de la requête
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Pas de token = pas connecté → on redirige vers la page de connexion
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Token présent = connecté → on laisse passer la requête normalement
  return NextResponse.next()
}

// Liste des routes protégées par ce middleware
// Toutes ces URLs nécessitent d'être connecté pour y accéder
export const config = {
  matcher: [
    "/wishlist/:path*",
    "/budget/:path*",
    "/friends/:path*",
    "/profile/:path*",
    "/home",
    "/home/:path*",
    "/createWish",
    "/createWish/:path*",
  ],
}
