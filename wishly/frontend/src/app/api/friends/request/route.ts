import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { backendFetch } from "@/lib/backend-fetch"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const body = await req.json()
  const res = await backendFetch("/friends/request", {
    method: "POST",
    body: JSON.stringify({ from_email: session.user.email, friend_code: body.friend_code }),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.ok ? 200 : res.status })
}
