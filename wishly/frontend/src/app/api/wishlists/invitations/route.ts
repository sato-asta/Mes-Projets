import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { backendFetch } from "@/lib/backend-fetch"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const res = await backendFetch("/wishlists/invitations")
  const data = await res.json()
  return NextResponse.json(data)
}
