export type ApiErrorDetail = { path: string; message: string }

export type ApiErrorBody = {
  requestId?: string | null
  code: string
  message: string
  details?: ApiErrorDetail[]
}

export class HttpError extends Error {
  readonly status: number
  readonly code: string
  readonly requestId: string | null
  readonly details: ApiErrorDetail[]

  constructor(
    status: number,
    code: string,
    message: string,
    requestId: string | null = null,
    details: ApiErrorDetail[] = []
  ) {
    super(message)
    this.name = "HttpError"
    this.status = status
    this.code = code
    this.requestId = requestId
    this.details = details
  }

  static async fromResponse(res: Response): Promise<HttpError> {
    let body: Partial<ApiErrorBody> = {}
    try {
      body = (await res.json()) as ApiErrorBody
    } catch {
      /* empty */
    }
    return new HttpError(
      res.status,
      typeof body.code === "string" ? body.code : "UNKNOWN",
      typeof body.message === "string" ? body.message : res.statusText,
      body.requestId ?? null,
      Array.isArray(body.details) ? body.details : []
    )
  }
}
