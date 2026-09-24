// Page racine de l'app — redirige directement vers /register
// Comme ça, si quelqu'un va sur "/", il arrive sur la page d'inscription
import { redirect } from "next/navigation"

export default function Home() {
  redirect("/register")
}
