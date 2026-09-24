import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { backendFetch } from "@/lib/backend-fetch"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email
  if (!userEmail) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const expense = await req.json()
  try {
    const res = await backendFetch(`/budgets/${encodeURIComponent(userEmail)}/expenses`, {
      method: "PUT",
      body: JSON.stringify(expense),
    })
    if (!res.ok) return NextResponse.json({ error: "Erreur backend" }, { status: 500 })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ error: "Backend inaccessible" }, { status: 503 })
  }
}
