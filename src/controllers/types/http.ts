export type HttpRequest = {
  params?: any
  body?: any
  query?: any
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
  },
  badRequest: {
    code: 400,
    message: 'Bad Request'
  },
  serverError: {
    code: 500,
    message: 'Internal Server Error'
  }
}
