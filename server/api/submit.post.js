import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  const { resendApiKey, resendFrom, resendTo } = useRuntimeConfig(event)

  if (!resendApiKey || !resendFrom || !resendTo) {
    throw createError({ statusCode: 503, statusMessage: 'Mail is not configured' })
  }

  const { senderName, senderEmail, senderMessage, turnstileToken } = await readBody(event)

  // Validate Turnstile token
  if (!turnstileToken) {
    throw createError({ statusCode: 400, statusMessage: 'Token not provided' })
  }
  const turnstile = await verifyTurnstileToken(turnstileToken, event)
  if (!turnstile.success) {
    throw createError({ statusCode: 403, statusMessage: 'Invalid token' })
  }

  // Validate submission
  if (!senderName?.trim() || !senderMessage?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Missing field' })
  }

  const email = senderEmail?.trim()
  const messageBody = `${email ? `FROM: ${email}\n\n` : ''}NAME: ${senderName}\nMESSAGE:\n\n${senderMessage}`

  const resend = new Resend(resendApiKey)
  const { data, error } = await resend.emails.send({
    from: `${senderName} <${resendFrom}>`,
    to: resendTo,
    reply_to: email || undefined,
    subject: `Message from ${senderName} (Portfolio)`,
    text: messageBody,
  })

  if (error) {
    throw createError({ statusCode: 502, statusMessage: 'Server issue sending message' })
  }

  return { data }
})
