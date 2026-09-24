import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { backendFetch } from "@/lib/backend-fetch"

export async function GET() {
  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email
  if (!userEmail) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  try {
    const res = await backendFetch(`/budgets/${encodeURIComponent(userEmail)}`)
    if (res.status === 404) return NextResponse.json(null)
    if (!res.ok) return NextResponse.json({ error: "Erreur backend" }, { status: 500 })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ error: "Backend inaccessible" }, { status: 503 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email
  if (!userEmail) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const body = await req.json()
  try {
    const res = await backendFetch("/budgets", {
      method: "POST",
      body: JSON.stringify({ user_id: userEmail, salary: body.salary ?? 0, expenses: body.expenses ?? [] }),
    })
    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err.detail ?? "Erreur" }, { status: res.status })
    }
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ error: "Backend inaccessible" }, { status: 503 })
  }
}
