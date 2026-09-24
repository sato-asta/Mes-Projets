import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { backendFetch } from "@/lib/backend-fetch"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const res = await backendFetch("/friends")
  const data = await res.json()
  return NextResponse.json(data, { status: res.ok ? 200 : res.status })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const body = await req.json()
  const res = await backendFetch("/friends", {
    method: "DELETE",
    body: JSON.stringify({ user_email: session.user.email, friend_email: body.friend_email }),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.ok ? 200 : res.status })
}
