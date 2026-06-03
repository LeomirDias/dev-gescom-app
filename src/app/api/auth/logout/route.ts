import { NextResponse } from "next/server"
import { clearAuthCookies } from "@/lib/auth/cookies"
import { jsonError } from "@/lib/auth/route-utils"
import { apiServerFetch } from "@/lib/auth/server-fetch"
import { HttpError } from "@/lib/api/http-error"

export async function POST() {
  try {
    const res = await apiServerFetch("auth/logout", { method: "POST" })

    if (!res.ok) {
      throw await HttpError.fromResponse(res)
    }

    await clearAuthCookies()
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    await clearAuthCookies()
    return jsonError(error)
  }
}
