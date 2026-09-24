import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { backendFetch } from "@/lib/backend-fetch"

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email
  if (!userEmail) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { salary } = await req.json()
  try {
    const res = await backendFetch(`/budgets/${encodeURIComponent(userEmail)}/salary?salary=${salary}`, {
      method: "PUT",
    })
    if (!res.ok) return NextResponse.json({ error: "Erreur backend" }, { status: 500 })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ error: "Backend inaccessible" }, { status: 503 })
  }
}
