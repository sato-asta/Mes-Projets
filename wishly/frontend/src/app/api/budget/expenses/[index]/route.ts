import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { backendFetch } from "@/lib/backend-fetch"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ index: string }> }
) {
  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email
  if (!userEmail) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { index } = await params
  try {
    const res = await backendFetch(`/budgets/${encodeURIComponent(userEmail)}/expenses/${index}`, {
      method: "DELETE",
    })
    if (!res.ok) return NextResponse.json({ error: "Erreur backend" }, { status: 500 })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ error: "Backend inaccessible" }, { status: 503 })
  }
}
