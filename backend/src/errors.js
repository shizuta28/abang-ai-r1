export class AppError extends Error {
  constructor(statusCode, code, message, details) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export function parse(schema, data) {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new AppError(400, 'validation_error', 'Please check the form and try again.', result.error.flatten())
  }
  return result.data
}

export function errorHandler(error, request, reply) {
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      error: error.code,
      message: error.message,
      details: error.details
    })
  }
  if (error.code === 'P2002') {
    return reply.code(409).send({ error: 'conflict', message: 'That record already exists.' })
  }
  if (error.code === 'P2025') {
    return reply.code(404).send({ error: 'not_found', message: 'That record was not found.' })
  }
  if (error.code === 'P2003') {
    return reply.code(409).send({ error: 'in_use', message: 'That record is still used by an order.' })
  }
  if (error.code === 'FST_ERR_CTP_BODY_TOO_LARGE' || error.code === 'FST_REQ_FILE_TOO_LARGE') {
    return reply.code(413).send({ error: 'file_too_large', message: 'The file is larger than 20 MB.' })
  }
  request.log.error(error)
  return reply.code(500).send({ error: 'server_error', message: 'Something went wrong. Please try again.' })
}

export function integrationError(error) {
  const map = {
    payments_not_configured: [503, 'ToyyibPay is not configured yet.'],
    toyyibpay_rejected: [502, 'ToyyibPay rejected the payment request.'],
    toyyibpay_http: [502, 'ToyyibPay could not be reached.'],
    r2_not_configured: [503, 'Cloudflare R2 is not configured yet.'],
    unsupported_file: [400, error.message],
    invalid_key: [400, 'That file reference is not valid.'],
    threads_not_configured: [503, 'The Threads API is not configured yet.'],
    threads_rejected: [502, error.message || 'Threads rejected the post.'],
    oauth_not_configured: [503, 'Google sign-in is not configured yet.'],
    oauth_token: [502, 'Google sign-in could not be completed.'],
    oauth_profile: [502, 'Google did not return a verified email.']
  }
  const match = map[error.code]
  if (!match) return null
  return new AppError(match[0], error.code, match[1])
}
