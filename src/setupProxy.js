const fetch = require('node-fetch');
const express = require('express');

module.exports = function(app) {
  app.use(express.json({ limit: '50mb' }));

  app.all('/api/proxy', async (req, res) => {
    console.log(`\n\n--- NEW PROXY REQUEST ---`);
    console.log(`[PROXY] ${req.method} ${req.url}`);
    
    const isImage = req.query.isImage === 'true';
    
    let targetUrl;
    let originalMethod;
    let originalHeaders;
    let originalBody;

    if (req.method === 'POST' && !isImage) {
      const body = req.body || {};
      targetUrl = body.targetUrl;
      originalMethod = body.originalMethod || 'GET';
      originalHeaders = body.originalHeaders || {};
      originalBody = body.originalBody;
      
      if (!targetUrl) {
         console.error('[PROXY] POST request missing targetUrl. req.body was:', req.body);
      }
    } else if (req.method === 'GET' && isImage) {
      targetUrl = req.query.targetUrl;
      originalMethod = 'GET';
      originalHeaders = {};
      
      if (!targetUrl) {
         console.error('[PROXY] GET request missing targetUrl. req.query was:', req.query);
      }
    } else {
      console.error(`[PROXY] Method Not Allowed. isImage: ${isImage}`);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!targetUrl) {
      return res.status(400).json({ error: 'Target URL is missing' });
    }

    try {
      new URL(targetUrl);
    } catch (error) {
      console.error(`[PROXY] Invalid target URL: ${targetUrl}`);
      return res.status(400).json({ error: 'Invalid Target URL', details: error.message });
    }

    console.log(`[PROXY] Proceeding to fetch: ${targetUrl}`);

    const fetchOptions = {
      method: originalMethod,
      headers: {
        ...(originalHeaders && typeof originalHeaders === 'object' ? originalHeaders : {}),
      },
      body: originalBody ? (typeof originalBody === 'string' ? originalBody : JSON.stringify(originalBody)) : undefined,
      timeout: 30000,
    };

    if (fetchOptions.headers) {
      delete fetchOptions.headers['host'];
      delete fetchOptions.headers['content-length'];
      delete fetchOptions.headers['connection'];
    }

    try {
      const targetResponse = await fetch(targetUrl, fetchOptions);
      
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        return res.status(204).end();
      }

      targetResponse.headers.forEach((value, name) => {
        const lowerName = name.toLowerCase();
        const excludedHeaders = [
          'content-encoding', 'transfer-encoding', 'connection', 'keep-alive',
          'access-control-allow-origin', 'access-control-allow-methods',
          'access-control-allow-headers', 'set-cookie'
        ];
        if (!excludedHeaders.includes(lowerName)) {
          res.setHeader(name, value);
        }
      });

      res.status(targetResponse.status);

      const responseBuffer = await targetResponse.buffer();
      if (targetResponse.status === 204 || targetResponse.status === 304) {
        res.end();
      } else {
        res.send(responseBuffer);
      }
    } catch (error) {
      if (!res.headersSent) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ error: `Proxy error: ${error.message}`, targetUrl: targetUrl });
      }
    }
  });
};
