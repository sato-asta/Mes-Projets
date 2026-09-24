import { NextResponse } from "next/server"

const API_URL = process.env.INTERNAL_API_URL ?? "http://localhost:8000"

export async function POST(req: Request) {
  const data = await req.json()

  let res: Response
  try {
    res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        provider: "local",
      }),
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    return NextResponse.json({ detail: "Backend inaccessible" }, { status: 503 })
  }

  const text = await res.text()
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    body = { detail: text }
  }

  return NextResponse.json(body, { status: res.status })
}
