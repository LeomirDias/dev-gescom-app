import { HttpError } from "@/lib/api/http-error"
import {
  loginClientResponseSchema,
  sessionBootstrapSchema,
  switchEnterpriseClientResponseSchema,
  type LoginClientResponse,
  type SessionBootstrap,
  type SwitchEnterpriseClientResponse,
} from "@/lib/auth/session-response"
import {
  loginRequestSchema,
  meResponseSchema,
  switchEnterpriseRequestSchema,
  type LoginRequest,
  type MeResponse,
} from "@/modules/authentication/auth.schema"

export type { LoginClientResponse as LoginResponse }

export async function loginService(input: {
  loginType: LoginRequest["loginType"]
  login: string
  password: string
}): Promise<LoginClientResponse> {
  const body = loginRequestSchema.parse({
    loginType: input.loginType,
    login: input.login,
    password: input.password,
  })

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw await HttpError.fromResponse(res)
  }

  return loginClientResponseSchema.parse(await res.json())
}

export async function fetchSessionBootstrap(): Promise<SessionBootstrap> {
  const res = await fetch("/api/auth/session", {
    method: "GET",
    credentials: "same-origin",
  })

  if (!res.ok) {
    throw await HttpError.fromResponse(res)
  }

  return sessionBootstrapSchema.parse(await res.json())
}

export async function fetchAuthMe(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "same-origin",
  })

  if (!res.ok) {
    throw await HttpError.fromResponse(res)
  }

  return meResponseSchema.parse(await res.json())
}

export async function switchEnterpriseService(
  enterpriseId: string
): Promise<SwitchEnterpriseClientResponse> {
  const body = switchEnterpriseRequestSchema.parse({ enterpriseId })
  const res = await fetch("/api/auth/switch-enterprise", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw await HttpError.fromResponse(res)
  }

  return switchEnterpriseClientResponseSchema.parse(await res.json())
}

export { logoutService } from "@/modules/authentication/auth-logout"

export function meUserToAuthUser(me: MeResponse["user"]) {
  return {
    id: me.id,
    name: me.name,
    email: me.email,
    registration: me.registration,
    onboardingCompleted: me.onboardingCompleted,
  }
}
