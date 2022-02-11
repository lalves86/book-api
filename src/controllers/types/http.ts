export type HttpRequest = {
  body: any
}

export type HttpResponse = {
  httpStatusCode: number
  body?: any
}

export const HttpStatusCodes = {
  ok: {
    code: 200,
    message: 'OK'
  },
  created: {
    code: 201,
    message: 'Created'
  }
}
