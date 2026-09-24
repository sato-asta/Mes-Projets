import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { backendFetch, API_URL } from "@/lib/backend-fetch"

export async function GET() {
  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email
  if (!userEmail) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  try {
    const wlRes = await backendFetch("/wishlists")
    if (!wlRes.ok) return NextResponse.json([], { status: 200 })
    const wishlists: Array<{ _id: string; name: string; emoji: string; color: string }> = await wlRes.json()

    const itemsByWishlist = await Promise.all(
      wishlists.map(async (wl) => {
        try {
          const itemsRes = await fetch(`${API_URL}/wishlists/${wl._id}/items`)
          if (!itemsRes.ok) return []
          const items = await itemsRes.json()
          return items.map((item: Record<string, unknown>) => ({
            ...item,
            wishlist_id: wl._id,
            wishlist_name: wl.name,
            wishlist_emoji: wl.emoji,
            wishlist_color: wl.color,
          }))
        } catch {
          return []
        }
      })
    )

    const allItems = itemsByWishlist.flat().filter((item) => typeof item.price === "number" && item.price > 0 && !item.is_being_offered)
    return NextResponse.json(allItems)
  } catch {
    return NextResponse.json({ error: "Backend inaccessible" }, { status: 503 })
  }
}
