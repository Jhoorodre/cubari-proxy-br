console.log('[PROXY_MODULE] api/proxy.js module loaded'); // Log no nível do módulo
import fetch from 'node-fetch';

export default async function handler(req, res) {
  console.log('[PROXY_REQUEST_INCOMING] Received headers:', JSON.stringify(req.headers, null, 2)); // Log detalhado dos cabeçalhos recebidos

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const isImage = searchParams.get('isImage') === 'true';
  let targetUrl;
  let originalMethod;
  let originalHeaders;
  let originalBody;

  console.log(`[PROXY_REQUEST] Received: ${req.method} ${req.url}, IsImage: ${isImage}`);

  if (req.method === 'POST' && !isImage) {
    try {
      const body = req.body;
      targetUrl = body.targetUrl;
      originalMethod = body.originalMethod || 'GET';
      originalHeaders = body.originalHeaders || {};
      originalBody = body.originalBody;
      console.log(`[PROXY_REQUEST_DATA] Parsed POST body. Target: ${targetUrl}, Method: ${originalMethod}`);
    } catch (error) {
      console.error('[PROXY_ERROR] Error parsing POST body:', error);
      res.status(400).json({ error: 'Error parsing POST body', details: error.message });
      return;
    }
  } else if (req.method === 'GET' && isImage) {
    targetUrl = searchParams.get('targetUrl');
    originalMethod = 'GET';
    originalHeaders = {}; // Para imagens, começamos com cabeçalhos limpos
    console.log(`[PROXY_REQUEST_IMAGE] Parsed GET query. Target: ${targetUrl}`);
  } else {
    console.warn(`[PROXY_WARN] Method ${req.method} not allowed for this combination of isImage=${isImage}. URL: ${req.url}`);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!targetUrl) {
    console.error('[PROXY_ERROR] Target URL is missing.');
    res.status(400).json({ error: 'Target URL is missing' });
    return;
  }

  try {
    new URL(targetUrl); // Validar URL
  } catch (error) {
    console.error(`[PROXY_ERROR] Invalid Target URL: ${targetUrl}`, error);
    res.status(400).json({ error: 'Invalid Target URL', details: error.message });
    return;
  }

  console.log(`[PROXY_FETCH_INIT] Fetching: ${originalMethod} ${targetUrl}`);
  if (Object.keys(originalHeaders).length > 0) console.log('[PROXY_FETCH_INIT] Original Headers:', JSON.stringify(originalHeaders));
  if (originalBody) console.log('[PROXY_FETCH_INIT] Original Body Type:', typeof originalBody);

  try {
    const fetchOptions = {
      method: originalMethod,
      headers: {
        ...(originalHeaders && typeof originalHeaders === 'object' ? originalHeaders : {}),
      },
      body: originalBody ? (typeof originalBody === 'string' ? originalBody : JSON.stringify(originalBody)) : undefined,
      timeout: 30000, // Increased timeout to 30 seconds
    };

    if (fetchOptions.headers) {
      delete fetchOptions.headers['host'];
      delete fetchOptions.headers['content-length'];
      delete fetchOptions.headers['connection'];
    }

    console.log(`[PROXY API] Fetching ${targetUrl} with options:`, {
      method: fetchOptions.method,
      headers: fetchOptions.headers,
    });

    const targetResponse = await fetch(targetUrl, fetchOptions);
    console.log(`[PROXY_TARGET_RESPONSE] Status: ${targetResponse.status} for ${targetUrl}`);
    const targetResponseHeadersObj = Object.fromEntries(targetResponse.headers.entries());
    console.log('[PROXY_TARGET_RESPONSE] Raw Headers from target:', JSON.stringify(targetResponseHeadersObj, null, 2));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      console.log('[PROXY_OPTIONS_REQUEST] Responding to OPTIONS request.');
      res.status(204).end();
      return;
    }

    targetResponse.headers.forEach((value, name) => {
      const lowerName = name.toLowerCase();
      const excludedHeaders = [
        'content-encoding',
        'transfer-encoding',
        'connection',
        'keep-alive',
        'public-key-pins',
        'strict-transport-security',
        'content-security-policy',
        'content-security-policy-report-only',
        'expect-ct',
        'feature-policy',
        'access-control-allow-origin',
        'access-control-allow-methods',
        'access-control-allow-headers',
        'access-control-allow-credentials',
        'access-control-expose-headers',
        'access-control-max-age',
        'set-cookie',
      ];

      if (!excludedHeaders.includes(lowerName)) {
        res.setHeader(name, value);
      } else {
        console.log(`[PROXY_HEADER_SKIP] Skipping/Handling header from target: ${name}: ${value}`);
      }
    });

    res.status(targetResponse.status);

    const responseBuffer = await targetResponse.buffer();
    console.log(`[PROXY_RESPONSE_BODY] Sending buffer of length: ${responseBuffer.length}. Status: ${targetResponse.status}`);

    if (responseBuffer.length === 0 && targetResponse.status === 200) {
      console.warn(`[PROXY_WARN] Target ${targetUrl} returned 200 with empty body.`);
    }

    if (targetResponse.status === 204 || targetResponse.status === 304) {
      res.end();
    } else {
      res.send(responseBuffer);
    }

  } catch (error) {
    console.error(`[PROXY_FETCH_ERROR] Error during fetch or response processing for ${targetUrl}:`, error);
    if (!res.headersSent) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    let statusCode = 500;
    let message = `Proxy error: ${error.message}`;

    if (error.code) {
      message = `Proxy network error: ${error.code} - ${error.message}`;
      if (error.code === 'ENOTFOUND') statusCode = 502;
      else if (error.code === 'ECONNREFUSED') statusCode = 502;
      else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') statusCode = 504;
    } else if (error.type) {
      message = `Proxy fetch error type: ${error.type} - ${error.message}`;
      if (error.type === 'request-timeout') statusCode = 504;
      else if (error.type === 'body-timeout') statusCode = 504;
    }

    if (res.headersSent) {
      console.error("[PROXY_FETCH_ERROR] Headers already sent, cannot send error response to client.");
    } else {
      res.status(statusCode).json({ error: message, targetUrl: targetUrl, details: error.stack });
    }
  }
}
