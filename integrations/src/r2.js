import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/zip',
  'video/mp4'
])

export function safeObjectKey(filename) {
  const base = String(filename || 'file')
    .split(/[/\\]/)
    .pop()
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/^\.+/, '')
    .slice(0, 80)
  return `uploads/${Date.now()}-${base || 'file'}`
}

export function assertAllowedType(contentType) {
  if (!allowedTypes.has(contentType)) {
    const error = new Error('Upload a JPG, PNG, WEBP, PDF, ZIP, or MP4 file.')
    error.code = 'unsupported_file'
    throw error
  }
}

export function createR2(config) {
  const enabled = Boolean(config.accountId && config.accessKeyId && config.secretAccessKey && config.bucket)
  if (!enabled) {
    return {
      enabled: false,
      async upload() {
        const error = new Error('Cloudflare R2 is not configured.')
        error.code = 'r2_not_configured'
        throw error
      },
      async signedDownload() {
        const error = new Error('Cloudflare R2 is not configured.')
        error.code = 'r2_not_configured'
        throw error
      }
    }
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    }
  })

  return {
    enabled: true,
    async upload({ key, body, contentType }) {
      assertAllowedType(contentType)
      if (!key.startsWith('uploads/') || key.includes('..')) {
        const error = new Error('Invalid storage key.')
        error.code = 'invalid_key'
        throw error
      }
      await client.send(new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: body,
        ContentType: contentType
      }))
      return { key }
    },
    async signedDownload(key, expiresIn = 300) {
      if (!key?.startsWith('uploads/') || key.includes('..')) {
        const error = new Error('Invalid storage key.')
        error.code = 'invalid_key'
        throw error
      }
      const url = await getSignedUrl(client, new GetObjectCommand({
        Bucket: config.bucket,
        Key: key
      }), { expiresIn })
      return url
    }
  }
}
