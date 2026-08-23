// Cloudflare R2 S3-Compatible Image Upload Utility (Native Web Crypto SigV4)

const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID || '30c98764906af20860ebb9974de7c1f7';
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '2a64baf2d204bc8f5b023b25d69812913c390f55ae8e5b98cb332b35ffc91e8c';
const R2_ENDPOINT = import.meta.env.VITE_R2_ENDPOINT || 'https://1c814e1821a0777ffe4eb60b359a79b5.r2.cloudflarestorage.com';
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME || 'pandalimages';
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-1c814e1821a0777ffe4eb60b359a79b5.r2.dev';

// Helper: SHA-256 Hex Digest using Web Crypto API
async function sha256Hex(dataBuffer) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper: HMAC-SHA256 using Web Crypto API
async function hmacSha256(key, message) {
  const encoder = new TextEncoder();
  const keyData = typeof key === 'string' ? encoder.encode(key) : key;
  const messageData = typeof message === 'string' ? encoder.encode(message) : message;

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return new Uint8Array(signature);
}

// Helper: HMAC-SHA256 Hex Digest
async function hmacSha256Hex(key, message) {
  const sig = await hmacSha256(key, message);
  return Array.from(sig).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper: Convert Data URL (base64) to ArrayBuffer & Content-Type
function parseDataUrl(dataUrl) {
  const matches = dataUrl.match(/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,(.+)$/);
  if (matches) {
    const contentType = matches[1];
    const base64Data = matches[2];
    const binaryStr = atob(base64Data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return { contentType, buffer: bytes.buffer };
  }
  return { contentType: 'image/jpeg', buffer: new ArrayBuffer(0) };
}

/**
 * Upload image (File or base64 Data URL) to Cloudflare R2
 * @param {File | string} input - Image File object or base64 Data URL
 * @param {string} [customFilename] - Optional custom filename key
 * @returns {Promise<string>} R2 Public CDN / Image URL
 */
export async function uploadImageToR2(input, customFilename) {
  try {
    let buffer;
    let contentType = 'image/jpeg';

    if (typeof input === 'string' && input.startsWith('data:')) {
      const parsed = parseDataUrl(input);
      buffer = parsed.buffer;
      contentType = parsed.contentType;
    } else if (input instanceof File || input instanceof Blob) {
      buffer = await input.arrayBuffer();
      contentType = input.type || 'image/jpeg';
    } else {
      console.warn('R2 Upload: Invalid image input format');
      return typeof input === 'string' ? input : '';
    }

    const ext = contentType.split('/')[1] || 'jpeg';
    const filename = customFilename || `pandal-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const urlObj = new URL(R2_ENDPOINT);
    const host = urlObj.host;
    const region = 'auto';
    const service = 's3';

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z';
    const dateStamp = amzDate.substring(0, 8);

    const payloadHash = await sha256Hex(buffer);
    const canonicalUri = `/${R2_BUCKET_NAME}/${filename}`;

    const canonicalHeaders =
      `content-type:${contentType}\n` +
      `host:${host}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`;

    const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';

    const canonicalRequest =
      `PUT\n` +
      `${canonicalUri}\n` +
      `\n` +
      `${canonicalHeaders}\n` +
      `${signedHeaders}\n` +
      `${payloadHash}`;

    const canonicalRequestHash = await sha256Hex(new TextEncoder().encode(canonicalRequest));

    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign =
      `AWS4-HMAC-SHA256\n` +
      `${amzDate}\n` +
      `${credentialScope}\n` +
      `${canonicalRequestHash}`;

    // Derive SigV4 Signing Key
    const kDate = await hmacSha256(`AWS4${R2_SECRET_ACCESS_KEY}`, dateStamp);
    const kRegion = await hmacSha256(kDate, region);
    const kService = await hmacSha256(kRegion, service);
    const kSigning = await hmacSha256(kService, 'aws4_request');
    const signature = await hmacSha256Hex(kSigning, stringToSign);

    const authHeader =
      `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY_ID}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, ` +
      `Signature=${signature}`;

    const targetUploadUrl = `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${filename}`;

    const response = await fetch(targetUploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'x-amz-date': amzDate,
        'x-amz-content-sha256': payloadHash,
        'Authorization': authHeader
      },
      body: buffer
    });

    if (response.ok) {
      console.log(`✓ Image successfully uploaded to R2: ${filename}`);
      const publicImageUrl = R2_PUBLIC_URL.endsWith('/')
        ? `${R2_PUBLIC_URL}${filename}`
        : `${R2_PUBLIC_URL}/${filename}`;
      return publicImageUrl;
    } else {
      const errText = await response.text();
      console.warn(`R2 upload status ${response.status}:`, errText);
    }
  } catch (err) {
    console.warn('Cloudflare R2 upload fallback active:', err);
  }

  // Fallback to original image input if R2 request is blocked/CORS
  return typeof input === 'string' ? input : '';
}
