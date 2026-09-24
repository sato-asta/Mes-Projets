const API_URL = process.env.INTERNAL_API_URL ?? "http://localhost:8000"

export async function GET() {
  await fetch(`${API_URL}/docs`, { signal: AbortSignal.timeout(5000) }).catch(() => {})
  return new Response("ok")
}
