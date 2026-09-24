import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const API_URL = process.env.INTERNAL_API_URL ?? "http://localhost:8000"

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const res = await fetch(`${API_URL}/wishlists/${params.id}`)
  
  if (!res.ok) {
    return NextResponse.json(
      { error: "Liste introuvable" },
      { status: res.status }
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}
