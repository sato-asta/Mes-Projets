import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

const API_URL = process.env.INTERNAL_API_URL ?? "http://localhost:8000"

export { API_URL }

export async function backendFetch(path: string, options: RequestInit = {}) {
  const session = await getServerSession(authOptions)
  const token = session?.backendToken
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  })
}
