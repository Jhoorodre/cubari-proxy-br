import { CubariSourceMixin } from "./CubariSource";
import * as cheerio from 'cheerio';
import { Base64 } from "js-base64";
import { CubariSource, State } from "./types";

const IMAGE_RESIZE_URL = "https://resizer.f-ck.me";

const getJsDelivrBaseUrl = (
  user: string,
  repo: string,
  commit: string,
  filePath: string
): string => {
  return `https://cdn.jsdelivr.net/gh/${user}/${repo}@${commit}/${filePath}`;
};

const loadExternalSource = async (
  baseUrl: string,
  sourceName: string,
  getMangaUrlCallback: (slug: string) => string,
  immutableState: State = {}
): Promise<CubariSource> => {
  // These sources should be loaded sequentially in order to prevent race conditions
  const script: HTMLScriptElement = document.createElement("script");
  script.type = "text/javascript";
  script.src = baseUrl + "/source.js";

  const waitForScript: Promise<Event> = new Promise(
    (resolve: (e: Event) => any): void => {
      script.onload = resolve;
    }
  );

  // Append the script to load it
  document.body.appendChild(script);
  await waitForScript;

  // The source should be loaded on window.Sources now
  const source = (<any>window).Sources[sourceName];
  const sourceInfo = (<any>window).Sources[sourceName + "Info"];

  // For the icon retrieval later
  sourceInfo.remoteBaseUrl = baseUrl;

  const cubariSource = new (CubariSourceMixin(
    source,
    sourceInfo,
    getMangaUrlCallback
  ))(cheerio);

  cubariSource.stateManager = {
    store: () => {}, // No-op, immutable
    retrieve: (key: string) => immutableState[key],
    keychain: {
      store: () => {},
      retrieve: (key: string) => immutableState[key],
    },
  };

  // Cleanup
  delete (<any>window).Sources;
  script.remove();

  return cubariSource;
};

const base64UrlEncode = (s: string): string => {
  return Base64.encode(s, true);
};

const convertImageUrl = (originalUrl: string): string => {
  // Modificado para usar o proxy local em /api/proxy
  const encodedUrl = base64UrlEncode(originalUrl); // Usar a função local base64UrlEncode
  // Adicionamos um parâmetro extra para que o proxy saiba que é uma requisição de imagem,
  // caso precisemos de lógica especial para imagens no futuro (ex: adicionar Referer).
  return `/api/proxy?targetUrl=${encodeURIComponent(originalUrl)}&isImage=true`;
};

const resizedImageUrl = (url: string, queryParams: string): string => {
  // Temporariamente, vamos retornar a URL diretamente,
  // assumindo que 'url' já é a URL do proxy vinda de convertImageUrl
  // ou que não queremos redimensionamento se 'url' for uma URL original.
  // No futuro, podemos decidir se 'url' aqui deve ser a original ou a do proxy
  // e como integrar o resizer corretamente.
  console.log('[DEBUG] resizedImageUrl called. Input url:', url, 'queryParams:', queryParams);
  // return `${IMAGE_RESIZE_URL}/?url=${url}&${queryParams ?? ""}`; // Linha original comentada
  return url; // Retorna a URL diretamente
};

export {
  loadExternalSource,
  getJsDelivrBaseUrl,
  base64UrlEncode,
  convertImageUrl,
  resizedImageUrl,
};
