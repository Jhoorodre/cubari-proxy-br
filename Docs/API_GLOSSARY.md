# Glossário da API e Dicionário de Endpoints

Este documento serve como um dicionário para os endpoints da API do Cubari Proxy (backend Django) e outros termos técnicos relevantes. O objetivo é manter um registro claro da funcionalidade por trás dos nomes anonimizados utilizados na API, facilitando o desenvolvimento e a manutenção.

## Mapeamento de Endpoints Anonimizados

### 1. Provedores de Conteúdo

#### 1.1. Listar Provedores de Conteúdo

- **Endpoint Anonimizado:** `GET /api/v1/content-providers/list`
- **Funcionalidade Real:** Lista todas as fontes (sources) disponíveis no Suwayomi-Server.
- **Query GraphQL Suwayomi Equivalente:**

  ```graphql
  query {
    sources {
      nodes {
        id
        name
        lang
        iconUrl
        isNsfw
        sourceType
      }
    }
  }
  ```

- **Parâmetros da Requisição:** Nenhum.
- **Resposta Esperada (Exemplo JSON):**

  ```json
  [
    {
      "id": "5183927995038089800", // ID real do Suwayomi
      "name": "MangaLivre",
      "language": "pt-BR",
      "icon_url_proxy": "/api/v1/icon-proxy/5183927995038089800/mangalivre.png/",
      "is_nsfw": false,
      "type": "HttpSource"
    }
    // ... outros provedores
  ]
  ```

- **Notas Adicionais:**
  - O `id` retornado é o ID real do Suwayomi, usado internamente pelo proxy para chamadas subsequentes.
  - `icon_url_proxy` é a URL para buscar o ícone através do nosso backend.

#### 1.2. Proxy de Ícones de Provedores

- **Endpoint Anonimizado:** `GET /api/v1/icon-proxy/<provider_id>/<icon_filename>/`
  - `<provider_id>`: O ID do provedor (fonte) retornado por `/content-providers/list`.
  - `<icon_filename>`: O nome do arquivo do ícone (ex: `mangalivre.png`).
- **Funcionalidade Real:** Serve a imagem do ícone de um provedor específico, fazendo proxy da URL original fornecida pelo Suwayomi.
- **Lógica Interna:**
  1. `ContentProviderListView` cacheia o `original_icon_url` (ex: `http://<suwayomi_host>/image/source/5183927995038089800.png`) associado ao `provider_id`.
  2. Esta view busca essa URL cacheada e faz um GET para ela, retornando o conteúdo da imagem.
- **Resposta Esperada:** Conteúdo da imagem (ex: `image/png`).

### 2. Descoberta e Detalhes de Conteúdo

#### 2.1. Busca de Conteúdo (Mangás)

- **Endpoint Anonimizado:** `GET /api/v1/content-discovery/search`
- **Funcionalidade Real:** Busca mangás no Suwayomi-Server.
- **Parâmetros de Query (Query Params):**
  - `query` (String, opcional): Termo de busca para o título do mangá. Se omitido, deve retornar os mangás populares/em destaque.
  - `page` (Int, opcional, default=1): Número da página para paginação dos resultados.
  - `type` (String, obrigatório): Define o tipo de busca. Valores possíveis:
    - `"POPULAR"`: Para buscar mangás populares (quando `query` é omitido).
    - `"SEARCH"`: Para buscar mangás por termo (quando `query` é fornecido).
- **Lógica Interna:**
  1. Se `type` for `"POPULAR"` e `query` estiver vazio, realiza uma busca por mangás populares.
  2. Se `type` for `"SEARCH"` e `query` estiver preenchido, realiza uma busca filtrando pelo termo fornecido.
  3. A paginação é controlada pelo parâmetro `page`.
- **Resposta Esperada (Exemplo JSON):**

  ```json
  {
    "results": [
      {
        "provider_id": "5183927995038089800", // sourceId do Suwayomi
        "content_id": "12345", // id do Manga no Suwayomi
        "title": "Título do Mangá Encontrado",
        "thumbnail_url_proxy": "/api/v1/thumbnail-proxy/5183927995038089800/12345/",
        // ... outros campos mapeados (autor, status, etc.)
      }
    ],
    "has_more": true
  }
  ```

- **Notas Adicionais:**
  - O backend usará `provider_id` como `sourceId` e `content_id` como `id` nas chamadas subsequentes para detalhes, capítulos, etc.
  - Implementar caching para buscas frequentes no backend Django.

#### 2.2. Detalhes do Item de Conteúdo

- **Endpoint Anonimizado:** `GET /api/v1/content/item/<provider_id>/<content_id>/detail/`
  - `<provider_id>`: ID do provedor (fonte) do Suwayomi.
  - `<content_id>`: ID do conteúdo (mangá) no Suwayomi.
- **Funcionalidade Real:** Busca informações detalhadas de um mangá específico no Suwayomi-Server, incluindo metadados e lista de capítulos.
- **Query GraphQL Suwayomi Equivalente:**

  ```graphql
  query GetMangaDetails($id: Int!) { # content_id é o $id aqui
      manga(id: $id) {
          id
          title
          author
          artist
          description
          genre
          status
          url # URL original na fonte
          # isInitialized <- Removido, não presente no schema atual ou causa erro
          sourceId # ID da fonte original
          thumbnailUrl # Relativo ao SUWAYOMI_BASE_URL
          chapters {
              nodes {
                  id # ID do Capítulo (Int!)
                  name
                  url # URL original do capítulo na fonte
                  chapterNumber
                  scanlator
                  # dateUpload <- Removido, não presente no schema atual ou causa erro
                  isRead
                  isBookmarked
                  lastPageRead
              }
          }
      }
  }
  ```

- **Parâmetros da Requisição:**
  - **Path Parameters:**
    - `provider_id` (String/Long, obrigatório): ID da fonte no Suwayomi.
    - `content_id` (String/Int, obrigatório): ID do mangá no Suwayomi.
- **Resposta Esperada (Exemplo JSON):**

  ```json
  {
    "id": "12345", // content_id
    "provider_id": "5183927995038089800",
    "title": "Título do Mangá",
    "author": "Nome do Autor",
    "artist": "Nome do Artista",
    "description": "Sinopse do mangá...",
    "genres": ["Ação", "Aventura"],
    "status": "Em andamento",
    "url_suwayomi": "http://original.source.com/manga/123",
    "thumbnail_url_proxy": "/api/v1/thumbnail-proxy/5183927995038089800/12345/",
    "chapters": [
      {
        "id": "67890", // ID do capítulo no Suwayomi
        "name": "Capítulo 1: O Início",
        "chapter_number": 1,
        "scanlator": "Grupo Scanlator",
        "uploaded_at": "2023-10-26T10:00:00Z" // Convertido de timestamp
        // ... outros campos do capítulo
      }
    ]
  }
  ```

- **Notas Adicionais:**
  - `provider_id` no path é usado para consistência e pode ser usado para validação ou logging, mas a query GraphQL `manga(id: Int!)` usa apenas o ID do mangá.
  - Caching no backend é recomendado.

#### 2.3. Proxy de Miniaturas de Conteúdo

- **Endpoint Anonimizado:** `GET /api/v1/thumbnail-proxy/<provider_id>/<content_id>/`
  - `<provider_id>`: ID do provedor (fonte) do Suwayomi.
  - `<content_id>`: ID do conteúdo (mangá) no Suwayomi.
- **Funcionalidade Real:** Serve a imagem da miniatura (thumbnail/cover) de um item de conteúdo.
- **Lógica Interna:**
  1. Faz uma query GraphQL `manga(id: $content_id) { thumbnailUrl }` para obter o caminho relativo da miniatura no Suwayomi.
  2. Concatena com `SUWAYOMI_BASE_URL` para formar a URL completa.
  3. Faz um GET para essa URL completa e retorna o conteúdo da imagem.
  4. Cacheia a URL completa da imagem para evitar refazer a query GraphQL em requisições futuras para a mesma miniatura.
- **Resposta Esperada:** Conteúdo da imagem (ex: `image/jpeg`).

### 3. Leitura de Conteúdo

#### 3.1. Páginas do Capítulo

- **Endpoint Anonimizado:** `GET /api/v1/content/item/<provider_id>/<content_id>/chapter/<chapter_id>/pages/`
  - `<provider_id>`: ID do provedor (fonte) do Suwayomi.
  - `<content_id>`: ID do conteúdo (mangá) no Suwayomi.
  - `<chapter_id>`: ID do capítulo no Suwayomi.
- **Funcionalidade Real:** Busca a lista de URLs das páginas para um capítulo específico.
- **Query GraphQL Suwayomi Equivalente (Mutação):**

  ```graphql
  mutation FetchChapterPages($input: FetchChapterPagesInput!) { # input é {"chapterId": chapterId}
      fetchChapterPages(input: $input) {
          pages # Lista de URLs das imagens das páginas
      }
  }
  ```

- **Parâmetros da Requisição (Path):** `provider_id`, `content_id`, `chapter_id`.
- **Resposta Esperada (Exemplo JSON):**

  ```json
  {
    "pages": [
      {
        "page_index": 0,
        "proxy_image_url": "/api/v1/page-image-proxy/5183927995038089800/12345/67890/0/"
      },
      {
        "page_index": 1,
        "proxy_image_url": "/api/v1/page-image-proxy/5183927995038089800/12345/67890/1/"
      }
    ]
  }
  ```

- **Notas Adicionais:**
  - O backend chama a mutação `fetchChapterPages`.
  - As URLs retornadas (`proxy_image_url`) apontam para o endpoint de proxy de imagem de página (ver abaixo).
  - O backend cacheia a lista de URLs de páginas reais (`internal_urls`) retornadas pelo Suwayomi para uso pelo `ChapterPageImageProxyView`.

#### 3.2. Proxy de Imagens de Páginas de Capítulos

- **Endpoint Anonimizado:** `GET /api/v1/page-image-proxy/<provider_id>/<content_id>/<chapter_id>/<page_index_str>/`
  - `<provider_id>`: ID do provedor (fonte) do Suwayomi.
  - `<content_id>`: ID do conteúdo (mangá) no Suwayomi.
  - `<chapter_id>`: ID do capítulo no Suwayomi.
  - `<page_index_str>`: Índice da página (base 0) dentro do capítulo.
- **Funcionalidade Real:** Serve a imagem de uma página específica de um capítulo.
- **Lógica Interna:**
  1. Busca no cache a lista de URLs de páginas reais (`internal_urls`) para o capítulo (preenchido por `ContentItemChapterPagesView`).
  2. Seleciona a URL da página correspondente ao `page_index_str`.
  3. Se a URL for relativa, concatena com `SUWAYOMI_BASE_URL`.
  4. Faz um GET para a URL da imagem e retorna o conteúdo.
- **Resposta Esperada:** Conteúdo da imagem (ex: `image/jpeg`).


### 4. Gerenciamento de Biblioteca e Progresso do Usuário (Suwayomi)

Esta seção detalha os endpoints que interagem com as funcionalidades de gerenciamento de biblioteca (favoritos) e progresso de leitura do usuário diretamente no Suwayomi-Server.

#### 4.1. Atualizar Progresso do Capítulo

- **Endpoint Anonimizado:** `POST /api/v1/suwayomi/chapter/update_progress/`
- **Funcionalidade Real:** Marca um capítulo como lido/não lido e/ou atualiza a última página lida no Suwayomi.
- **Mutação GraphQL Suwayomi Equivalente:**

  ```graphql
  mutation UpdateChapterProgress($chapterId: Int!, $read: Boolean, $lastPageRead: Int) {
    updateChapterProgress(input: {id: $chapterId, read: $read, lastPageRead: $lastPageRead}) {
      id
      isRead
      lastPageRead
      # Outros campos do capítulo que podem ser úteis para o frontend confirmar
      isBookmarked 
      name
      chapterNumber
    }
  }
  ```

- **Corpo da Requisição (JSON):**

  ```json
  {
    "chapterId": 123,       // (Int, Obrigatório) ID do capítulo no Suwayomi
    "read": true,           // (Boolean, Opcional) Marcar como lido ou não lido
    "lastPageRead": 10      // (Int, Opcional) Última página lida
  }
  ```

- **Resposta Esperada (Exemplo JSON):**

  ```json
  {
    "id": 123,
    "isRead": true,
    "lastPageRead": 10,
    "isBookmarked": false,
    "name": "Capítulo Exemplo",
    "chapterNumber": 10.0
  }
  ```

- **Notas Adicionais:**
  - Pelo menos um dos campos `read` ou `lastPageRead` deve ser fornecido.

#### 4.2. Atualizar Status de "Na Biblioteca" (Favorito) do Mangá

- **Endpoint Anonimizado:** `POST /api/v1/suwayomi/manga/update_in_library/`
- **Funcionalidade Real:** Adiciona ou remove um mangá da biblioteca (favoritos) do usuário no Suwayomi.
- **Mutação GraphQL Suwayomi Equivalente:**

  ```graphql
  mutation UpdateMangaInLibrary($mangaId: Int!, $inLibrary: Boolean!) {
    updateUserManga(input: {mangaId: $mangaId, inLibrary: $inLibrary}) {
      id
      title # Para confirmação
      inLibrary
    }
  }
  ```

- **Corpo da Requisição (JSON):**

  ```json
  {
    "mangaId": 456,         // (Int, Obrigatório) ID do mangá no Suwayomi
    "inLibrary": true       // (Boolean, Obrigatório) true para adicionar, false para remover
  }
  ```

- **Resposta Esperada (Exemplo JSON):**

  ```json
  {
    "id": 456,
    "title": "Título do Mangá Exemplo",
    "inLibrary": true
  }
  ```

#### 4.3. Listar Mangás Favoritados (Na Biblioteca)

- **Endpoint Anonimizado:** `GET /api/v1/suwayomi/mangas/favorites/`
- **Funcionalidade Real:** Lista todos os mangás que o usuário marcou como "na biblioteca" (favoritos) no Suwayomi.
- **Query GraphQL Suwayomi Equivalente:**

  ```graphql
  query GetFavoriteMangas {
    userMangas(filter: {inLibrary: true}) {
      nodes {
        id
        title
        thumbnailUrl # Proxy será necessário no frontend ou backend
        inLibrary # Deve ser true
        # Outros campos úteis para exibição na lista de favoritos
        status 
        author
        description # Pode ser útil para tooltips ou visualizações expandidas
      }
      # pageInfo { # Se precisar de paginação no futuro
      #   hasNextPage
      #   endCursor
      # }
    }
  }
  ```

- **Parâmetros da Requisição:** Nenhum.
- **Resposta Esperada (Exemplo JSON):**

  ```json
  {
    "nodes": [
      {
        "id": 456,
        "title": "Título do Mangá Exemplo",
        "thumbnailUrl": "/api/v1/thumbnail-proxy/source_id_placeholder/456/", // Exemplo, o backend precisaria construir isso
        "inLibrary": true,
        "status": "COMPLETED",
        "author": "Autor Exemplo",
        "description": "Descrição breve do mangá favorito..."
      }
      // ... outros mangás favoritados
    ]
  }
  ```

- **Notas Adicionais:**
  - O `thumbnailUrl` retornado pelo Suwayomi é relativo. O backend Django, ao servir esta lista, pode optar por:
    1. Retornar a URL relativa do Suwayomi e deixar o frontend construir a URL de proxy.
    2. (Melhor) Construir a URL de proxy completa (ex: `/api/v1/thumbnail-proxy/<source_id_do_manga>/<manga_id>/`) antes de enviar a resposta. Isso exigiria que a query `GetFavoriteMangas` também retornasse `sourceId` para cada mangá, ou que o backend fizesse uma busca adicional/cache para obter o `sourceId`. Atualmente, a query `userMangas` não parece retornar `sourceId` diretamente. Uma alternativa seria o frontend, ao receber a lista, fazer chamadas individuais para obter detalhes do mangá (que inclui `sourceId`) se precisar do thumbnail, ou o backend enriquecer os dados. Para simplificar, a resposta acima assume que o `thumbnailUrl` já é uma URL de proxy.

---

*Este documento será atualizado conforme novos endpoints e termos forem definidos.*

**Última Atualização:** 14 de junho de 2025
