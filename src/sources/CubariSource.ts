import { SourceInfo } from "paperback-extensions-common";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { Constructor } from "./types";

const UNSAFE_HEADERS = [
  'connection',
  'content-length',
  'content-type', // Será definido pelo proxy ou pelo servidor de destino
  'cookie',
  'host',
  'proxy-authorization',
  'proxy-connection',
  'referer', // O proxy pode adicionar um referer mais apropriado se necessário
  'transfer-encoding',
  'user-agent', // O proxy pode definir um User-Agent padrão
  'via'
];

const requestInterceptor = async (req: AxiosRequestConfig) => {
  const originalUrl = req.url;
  const originalMethod = req.method?.toUpperCase() || 'GET';
  const originalData = req.data;
  const originalHeaders = { ...req.headers }; // Copia os cabeçalhos

  // Limpar cabeçalhos inseguros ou desnecessários antes de enviar ao proxy
  for (const header of UNSAFE_HEADERS) {
    delete originalHeaders[header];
  }
  // Remover quaisquer cabeçalhos específicos do Axios que não devam ir para o servidor de destino
  delete originalHeaders.common;
  delete originalHeaders.delete;
  delete originalHeaders.get;
  delete originalHeaders.head;
  delete originalHeaders.post;
  delete originalHeaders.put;
  delete originalHeaders.patch;

  // Se a URL já for para o nosso proxy, não interceptar novamente
  if (originalUrl?.startsWith('/api/proxy')) {
    return req;
  }

  console.log(`[AXIOS INTERCEPTOR] Original: ${originalMethod} ${originalUrl}`);

  const proxyPayload = {
    targetUrl: originalUrl,
    originalMethod: originalMethod,
    originalHeaders: originalHeaders,
    originalBody: originalData,
    isImage: false // Assumir que não é imagem, a menos que especificado de outra forma
  };

  req.url = '/api/proxy';
  req.method = 'POST';
  req.data = proxyPayload;
  // Definir Content-Type para a requisição ao proxy
  req.headers = { 'Content-Type': 'application/json' };

  console.log('[AXIOS INTERCEPTOR] Encaminhando para proxy POST /api/proxy com payload:', proxyPayload);
  return req;
};

const responseInterceptor = (res: AxiosResponse) => {
  return res;
};

const retryInterceptor = (error: any) => {
  // Só tenta novamente se a requisição original falhou e já estava usando nosso proxy
  if (error.config && error.config.url?.startsWith('/api/proxy') && !error.config.retried) {
    error.config.retried = true; // Marca como "retried" para evitar loops infinitos
    console.log('[RETRY INTERCEPTOR] Retrying request to proxy.');
    console.log('[RETRY INTERCEPTOR] Original Config URL:', error.config.url);
    console.log('[RETRY INTERCEPTOR] Original Config Method:', error.config.method);
    console.log('[RETRY INTERCEPTOR] Original Config Headers:', JSON.stringify(error.config.headers));

    // Limpar cabeçalhos para a tentativa de repetição ao proxy
    // Manter apenas Content-Type e quaisquer outros cabeçalhos essenciais para o proxy em si.
    const newHeadersForRetry = { 'Content-Type': 'application/json' };
    // Se houver outros cabeçalhos que o /api/proxy espera especificamente, adicione-os aqui.
    // Por exemplo, se o Accept padrão do Axios for necessário:
    // newHeadersForRetry['Accept'] = 'application/json, text/plain, */*'; 
    // No entanto, para o erro 431, é melhor ser minimalista.

    error.config.headers = newHeadersForRetry;

    console.log('[RETRY INTERCEPTOR] Retrying with NEW Headers:', JSON.stringify(error.config.headers));

    if (error.config.data && typeof error.config.data === 'object') {
      const keys = Object.keys(error.config.data);
      console.log('[RETRY INTERCEPTOR] Retrying with data keys:', keys);
      if (error.config.data.originalHeaders) {
        console.log('[RETRY INTERCEPTOR] Retrying with originalHeaders in data:', JSON.stringify(error.config.data.originalHeaders));
      }
    }
    return axios.request(error.config); // Tenta a mesma URL do proxy novamente com cabeçalhos limpos
  }
  return Promise.reject(error);
};

// Interceptors to preserve the requestManager within each source. Thanks Paper!
/* COMMENTING OUT GLOBAL AXIOS REQUEST INTERCEPTOR
axios.interceptors.request.use(
  async (config) => {
    const ประเภท = config.url?.endsWith('.jpg') || config.url?.endsWith('.png') || config.url?.endsWith('.jpeg') || config.url?.endsWith('.gif') || config.url?.endsWith('.webp') ? 'image' : 'other';
    const PROXY_URL = '/api/proxy'; // Use a relative path for same-origin proxy

    // Check if the request is NOT to the proxy itself and NOT to other local API endpoints
    if (config.url !== PROXY_URL && !config.url?.startsWith('http://localhost') && !config.url?.startsWith('/api/')) {
      console.log(`[GLOBAL AXIOS REQUEST INTERCEPTOR] Original: ${config.method?.toUpperCase()} ${config.url}`);

      const headersToProxy = { ...config.headers };

      // Remove headers that the browser can't/shouldn't set for XHR or are problematic to forward
      const forbiddenHeaders = [
        'cookie', 'user-agent', 'referer', 'host',
        'connection', 'content-length', 'transfer-encoding',
        'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform',
        'sec-fetch-site', 'sec-fetch-mode', 'sec-fetch-dest',
        'accept-encoding' // Let the proxy/target server handle content encoding negotiation
      ];

      for (const headerKey in headersToProxy) {
        if (forbiddenHeaders.includes(headerKey.toLowerCase()) ||
          headersToProxy[headerKey] === undefined ||
          headersToProxy[headerKey] === null) {
          delete headersToProxy[headerKey];
        }
      }
      // Clean Axios specific headers from the payload to be sent to the target server
      delete headersToProxy.common;
      delete headersToProxy.delete;
      delete headersToProxy.get;
      delete headersToProxy.head;
      delete headersToProxy.post;
      delete headersToProxy.put;
      delete headersToProxy.patch;


      const proxyPayload = {
        targetUrl: config.url,
        originalMethod: config.method?.toUpperCase() ?? 'GET',
        originalHeaders: headersToProxy, // Use the filtered headers
        originalBody: config.data,
        isImage: ประเภท === 'image',
      };

      console.log(`[GLOBAL AXIOS REQUEST INTERCEPTOR] Forwarding to proxy POST ${PROXY_URL} with payload:`, proxyPayload);

      // Modify the request to go to the proxy
      config.url = PROXY_URL;
      config.method = 'POST';
      config.data = proxyPayload;
      config.headers = { // Headers for the request TO THE PROXY SERVER ITSELF
        'Content-Type': 'application/json',
      };
    }
    return config;
  },
  (error) => {
    console.error('[GLOBAL AXIOS REQUEST INTERCEPTOR] Erro na requisição:', error);
    return Promise.reject(error);
  }
);
*/
axios.interceptors.response.use(responseInterceptor, retryInterceptor);

export function CubariSourceMixin<TBase extends Constructor>(
  Base: TBase,
  sourceInfo: SourceInfo,
  getMangaUrlCallback: (slug: string) => string
) {
  return class CubariSource extends Base {
    getMangaUrl = getMangaUrlCallback;

    getSourceDetails = () => {
      return sourceInfo;
    };

    requestManager = App.createRequestManager({
      requestsPerSecond: 5,
      requestTimeout: 20000,
      interceptor: {
        interceptRequest: async (request) => {
          let targetUrl;
          if (request.url.startsWith('http')) {
            targetUrl = request.url;
          } else {
            // Tentar construir a URL completa se for um caminho relativo
            const baseUrl = sourceInfo.websiteBaseURL; // Corrigido: Usar sourceInfo do escopo do Mixin e a propriedade correta
            if (baseUrl) {
              targetUrl = new URL(request.url, baseUrl).toString();
            } else {
              console.warn(`[REQUEST_MANAGER INTERCEPTOR] sourceInfo.websiteBaseURL não definido. Usando request.url como está: ${request.url}`);
              targetUrl = request.url; // Fallback: usa a URL como está (pode ser absoluta ou falhar se relativa)
            }
          }

          const originalMethod = request.method ? request.method.toUpperCase() : 'GET';
          const originalData = request.data; // Pode ser string, FormData, etc.
          let originalHeaders = { ...(request.headers || {}) };

          // Limpar cabeçalhos inseguros
          for (const header of UNSAFE_HEADERS) {
            delete originalHeaders[header];
          }

          console.log(`[REQUEST_MANAGER INTERCEPTOR] Original: ${originalMethod} ${targetUrl}`);

          const proxyPayload = {
            targetUrl: targetUrl,
            originalMethod: originalMethod,
            originalHeaders: originalHeaders,
            originalBody: originalData,
            isImage: false // Assumir que não é imagem, a menos que especificado de outra forma
          };

          // Modificar o objeto 'request' para o proxy
          request.url = '/api/proxy'; // URL do endpoint do proxy
          request.method = 'POST';
          request.data = JSON.stringify(proxyPayload); // Enviar o payload como JSON string
          request.headers = { 'Content-Type': 'application/json' };

          console.log('[REQUEST_MANAGER INTERCEPTOR] Encaminhando para proxy POST /api/proxy com payload:', proxyPayload);
          return request;
        },
        interceptResponse: async (response) => {
          // Não há necessidade de modificar a resposta por enquanto
          return response;
        },
      },
    });
  };
}
