import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const API_URL = process.env.INTERNAL_API_URL ?? "http://localhost:8000"

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { name } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 })
  }

  let res: Response
  try {
    res = await fetch(`${API_URL}/users/name`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, name: name.trim() }),
    })
  } catch {
    return NextResponse.json({ error: "Backend inaccessible" }, { status: 503 })
  }

  if (!res.ok) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}