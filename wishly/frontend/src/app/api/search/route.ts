import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const API_URL = process.env.INTERNAL_API_URL ?? "http://localhost:8000"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")
  if (!q?.trim()) return NextResponse.json({ results: [] })

  const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(q)}`)
  const data = await res.json()
  return NextResponse.json(data)
}
