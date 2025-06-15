# Explorador da API GraphQL do Suwayomi

Este documento lista as operações da API GraphQL do Suwayomi, fornecendo sua descrição, uso e as queries e variáveis correspondentes em formatos prontos para copiar.

## 1. GET_ABOUT

**Descrição:** Busca informações sobre a versão do servidor e da interface web (WebUI), incluindo build, canais de atualização e links para GitHub/Discord.

**Como Usar:** Execute esta query para verificar as versões atuais do software. Nenhuma variável é necessária.

**Query GraphQL:**
```graphql
fragment ABOUT_WEBUI on AboutWebUI {
  channel
  tag
  __typename
}

query GET_ABOUT {
  aboutServer {
    buildTime
    buildType
    discord
    github
    name
    revision
    version
    __typename
  }
  aboutWebUI {
    ...ABOUT_WEBUI
    __typename
  }
}
```

**Variáveis:**
```json
{}
```

## 2. GET_CATEGORIES_LIBRARY

**Descrição:** Retorna a lista de todas as categorias da sua biblioteca (ex: "Default").

**Como Usar:** Útil para construir a navegação da biblioteca. A variável order define a ordenação.

**Query GraphQL:**
```graphql
fragment CATEGORY_BASE_FIELDS on CategoryType {
  id
  name
  default
  order
  __typename
}

fragment CATEGORY_META_FIELDS on CategoryMetaType {
  categoryId
  key
  value
  __typename
}

fragment CATEGORY_LIBRARY_FIELDS on CategoryType {
  ...CATEGORY_BASE_FIELDS
  meta {
    ...CATEGORY_META_FIELDS
    __typename
  }
  mangas {
    totalCount
    __typename
  }
  __typename
}

fragment PAGE_INFO on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  __typename
}

query GET_CATEGORIES_LIBRARY($after: Cursor, $before: Cursor, $condition: CategoryConditionInput, $filter: CategoryFilterInput, $first: Int, $last: Int, $offset: Int, $order: [CategoryOrderInput!]) {
  categories(
    after: $after
    before: $before
    condition: $condition
    filter: $filter
    first: $first
    last: $last
    offset: $offset
    order: $order
  ) {
    nodes {
      ...CATEGORY_LIBRARY_FIELDS
      __typename
    }
    pageInfo {
      ...PAGE_INFO
      __typename
    }
    totalCount
    __typename
  }
}
```

**Variáveis:**
```json
{
  "order": [
    {
      "by": "ORDER"
    }
  ]
}
```

## 3. GET_CATEGORY_MANGAS

**Descrição:** Busca todos os mangás que pertencem a uma categoria específica da biblioteca. ID 0 para categoria "Default".

**Como Usar:** Forneça o id da categoria para listar seus mangás.

**Query GraphQL:**
```graphql
fragment MANGA_BASE_FIELDS on MangaType {
  id
  title
  thumbnailUrl
  thumbnailUrlLastFetched
  inLibrary
  initialized
  sourceId
  __typename
}

fragment MANGA_CHAPTER_STAT_FIELDS on MangaType {
  id
  unreadCount
  downloadCount
  bookmarkCount
  hasDuplicateChapters
  chapters {
    totalCount
    __typename
  }
  __typename
}

fragment MANGA_CHAPTER_NODE_FIELDS on MangaType {
  firstUnreadChapter {
    id
    sourceOrder
    isRead
    mangaId
    __typename
  }
  lastReadChapter {
    id
    sourceOrder
    lastReadAt
    __typename
  }
  latestReadChapter {
    id
    sourceOrder
    lastReadAt
    __typename
  }
  latestFetchedChapter {
    id
    fetchedAt
    __typename
  }
  latestUploadedChapter {
    id
    uploadDate
    __typename
  }
  __typename
}

fragment MANGA_LIBRARY_FIELDS on MangaType {
  ...MANGA_BASE_FIELDS
  ...MANGA_CHAPTER_STAT_FIELDS
  ...MANGA_CHAPTER_NODE_FIELDS
  genre
  lastFetchedAt
  inLibraryAt
  status
  artist
  author
  description
  source {
    id
    displayName
    __typename
  }
  trackRecords {
    totalCount
    nodes {
      id
      trackerId
      __typename
    }
    __typename
  }
  __typename
}

fragment PAGE_INFO on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  __typename
}

query GET_CATEGORY_MANGAS($id: Int!) {
  category(id: $id) {
    id
    mangas {
      nodes {
        ...MANGA_LIBRARY_FIELDS
        __typename
      }
      pageInfo {
        ...PAGE_INFO
        __typename
      }
      totalCount
      __typename
    }
    __typename
  }
}
```

**Variáveis:**
```json
{
  "id": 0
}
```

## 4. GET_DOWNLOAD_STATUS

**Descrição:** Recupera o status de download atual do servidor, incluindo a fila de capítulos sendo baixados.

**Como Usar:** Execute esta query para monitorar o progresso dos downloads. Nenhuma variável é necessária.

**Query GraphQL:**
```graphql
fragment DOWNLOAD_TYPE_FIELDS on DownloadType {
  chapter {
    id
    name
    sourceOrder
    isDownloaded
    __typename
  }
  manga {
    id
    title
    downloadCount
    __typename
  }
  progress
  state
  tries
  __typename
}

fragment DOWNLOAD_STATUS_FIELDS on DownloadStatus {
  state
  queue {
    ...DOWNLOAD_TYPE_FIELDS
    __typename
  }
  __typename
}

query GET_DOWNLOAD_STATUS {
  downloadStatus {
    ...DOWNLOAD_STATUS_FIELDS
    __typename
  }
}
```

**Variáveis:**
```json
{}
```

## 5. GET_GLOBAL_METADATAS

**Descrição:** Retorna metadados globais armazenados no servidor.

**Como Usar:** Pode ser usada para buscar configurações ou dados gerais que não estão associados a um recurso específico. Variáveis de paginação e filtro podem ser aplicadas.

**Query GraphQL:**
```graphql
fragment GLOBAL_METADATA on GlobalMetaType {
  key
  value
  __typename
}

fragment PAGE_INFO on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  __typename
}

query GET_GLOBAL_METADATAS($after: Cursor, $before: Cursor, $condition: MetaConditionInput, $filter: MetaFilterInput, $first: Int, $last: Int, $offset: Int, $order: [MetaOrderInput!]) {
  metas(
    after: $after
    before: $before
    condition: $condition
    filter: $filter
    first: $first
    last: $last
    offset: $offset
    order: $order
  ) {
    nodes {
      ...GLOBAL_METADATA
      __typename
    }
    pageInfo {
      ...PAGE_INFO
      __typename
    }
    totalCount
    __typename
  }
}
```

**Variáveis:**
```json
{}
```

## 6. GET_LAST_UPDATE_TIMESTAMP

**Descrição:** Retorna o timestamp da última vez que a biblioteca foi atualizada.

**Como Usar:** Útil para verificar quando a última sincronização da biblioteca ocorreu.

**Query GraphQL:**
```graphql
query GET_LAST_UPDATE_TIMESTAMP {
  lastUpdateTimestamp {
    timestamp
    __typename
  }
}
```

**Variáveis:**
```json
{}
```

## 7. GET_LIBRARY_MANGA_COUNT

**Descrição:** Retorna a contagem total de mangás na sua biblioteca.

**Como Usar:** Uma query simples para obter o número total de entradas na biblioteca, sem precisar buscar a lista completa.

**Query GraphQL:**
```graphql
query GET_LIBRARY_MANGA_COUNT {
  mangas(condition: {inLibrary: true}) {
    totalCount
    __typename
  }
}
```

**Variáveis:**
```json
{}
```

## 8. GET_SERVER_SETTINGS

**Descrição:** Recupera todas as configurações do servidor Suwayomi.

**Como Usar:** Útil para verificar ou exibir as configurações atuais do backend, como portas, proxies, caminhos de download, etc.

**Query GraphQL:**
```graphql
fragment SERVER_SETTINGS on SettingsType {
  ip
  port
  socksProxyEnabled
  socksProxyVersion
  socksProxyHost
  socksProxyPort
  socksProxyUsername
  socksProxyPassword
  webUIFlavor
  initialOpenInBrowserEnabled
  webUIInterface
  electronPath
  webUIChannel
  webUIUpdateCheckInterval
  downloadAsCbz
  downloadsPath
  autoDownloadNewChapters
  excludeEntryWithUnreadChapters
  autoDownloadNewChaptersLimit
  autoDownloadIgnoreReUploads
  extensionRepos
  maxSourcesInParallel
  excludeUnreadChapters
  excludeNotStarted
  excludeCompleted
  globalUpdateInterval
  updateMangas
  basicAuthEnabled
  basicAuthUsername
  basicAuthPassword
  debugLogsEnabled
  systemTrayEnabled
  maxLogFileSize
  maxLogFiles
  maxLogFolderSize
  backupPath
  backupTime
  backupInterval
  backupTTL
  localSourcePath
  flareSolverrEnabled
  flareSolverrUrl
  flareSolverrTimeout
  flareSolverrSessionName
  flareSolverrSessionTtl
  flareSolverrAsResponseFallback
  __typename
}

query GET_SERVER_SETTINGS {
  settings {
    ...SERVER_SETTINGS
    __typename
  }
}
```

**Variáveis:**
```json
{}
```

## 9. GET_TRACKERS_SETTINGS

**Descrição:** Lista os serviços de tracking (ex: MyAnimeList, AniList) e informa se o usuário está logado em cada um.

**Como Usar:** Para gerenciar integrações com serviços de tracking.

**Query GraphQL:**
```graphql
fragment PAGE_INFO on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  __typename
}

fragment TRACKER_BASE_FIELDS on TrackerType {
  id
  name
  icon
  isLoggedIn
  isTokenExpired
  __typename
}

fragment TRACKER_SETTING_FIELDS on TrackerType {
  ...TRACKER_BASE_FIELDS
  authUrl
  __typename
}

query GET_TRACKERS_SETTINGS {
  trackers {
    totalCount
    pageInfo {
      ...PAGE_INFO
      __typename
    }
    nodes {
      ...TRACKER_SETTING_FIELDS
      __typename
    }
    __typename
  }
}
```

**Variáveis:**
```json
{}
```

## 10. GET_UPDATE_STATUS

**Descrição:** Obtém o status atual das atualizações da biblioteca, incluindo informações sobre trabalhos em andamento e categorias/mangás atualizados.

**Como Usar:** Monitore o progresso das atualizações da sua biblioteca. Nenhuma variável é necessária.

**Query GraphQL:**
```graphql
fragment UPDATER_JOB_INFO_FIELDS on UpdaterJobsInfoType {
  isRunning
  totalJobs
  finishedJobs
  skippedCategoriesCount
  skippedMangasCount
  __typename
}

fragment UPDATER_CATEGORY_FIELDS on CategoryUpdateType {
  status
  category {
    id
    name
    __typename
  }
  __typename
}

fragment UPDATER_MANGA_FIELDS on MangaUpdateType {
  status
  manga {
    id
    title
    thumbnailUrl
    __typename
  }
  __typename
}

fragment UPDATER_STATUS_FIELDS on LibraryUpdateStatus {
  jobsInfo {
    ...UPDATER_JOB_INFO_FIELDS
    __typename
  }
  categoryUpdates {
    ...UPDATER_CATEGORY_FIELDS
    __typename
  }
  mangaUpdates {
    ...UPDATER_MANGA_FIELDS
    __typename
  }
  __typename
}

query GET_UPDATE_STATUS {
  libraryUpdateStatus {
    ...UPDATER_STATUS_FIELDS
    __typename
  }
}
```

**Variáveis:**
```json
{}
```

## 11. GET_WEBUI_UPDATE_STATUS

**Descrição:** Verifica o status da atualização da interface web (WebUI), incluindo informações de versão e progresso.

**Como Usar:** Utilizado para verificar se há uma nova versão da WebUI disponível e o status de download/instalação. Nenhuma variável é necessária.

**Query GraphQL:**
```graphql
fragment WEBUI_UPDATE_INFO on WebUIUpdateInfo {
  channel
  tag
  __typename
}

fragment WEBUI_UPDATE_STATUS on WebUIUpdateStatus {
  info {
    ...WEBUI_UPDATE_INFO
    __typename
  }
  progress
  state
  __typename
}

query GET_WEBUI_UPDATE_STATUS {
  getWebUIUpdateStatus {
    ...WEBUI_UPDATE_STATUS
    __typename
  }
}
```

**Variáveis:**
```json
{}
```

## 12. GET_MANGA_SCREEN

**Descrição:** Busca todos os detalhes de um mangá específico para exibição em sua página de detalhes.

**Como Usar:** Forneça o id do mangá.

**Query GraphQL:**
```graphql
fragment MANGA_BASE_FIELDS on MangaType {
  id
  title
  thumbnailUrl
  thumbnailUrlLastFetched
  inLibrary
  initialized
  sourceId
  __typename
}

fragment MANGA_CHAPTER_STAT_FIELDS on MangaType {
  id
  unreadCount
  downloadCount
  bookmarkCount
  hasDuplicateChapters
  chapters {
    totalCount
    __typename
  }
  __typename
}

fragment MANGA_CHAPTER_NODE_FIELDS on MangaType {
  firstUnreadChapter {
    id
    sourceOrder
    isRead
    mangaId
    __typename
  }
  lastReadChapter {
    id
    sourceOrder
    lastReadAt
    __typename
  }
  latestReadChapter {
    id
    sourceOrder
    lastReadAt
    __typename
  }
  latestFetchedChapter {
    id
    fetchedAt
    __typename
  }
  latestUploadedChapter {
    id
    uploadDate
    __typename
  }
  __typename
}

fragment MANGA_LIBRARY_FIELDS on MangaType {
  ...MANGA_BASE_FIELDS
  ...MANGA_CHAPTER_STAT_FIELDS
  ...MANGA_CHAPTER_NODE_FIELDS
  genre
  lastFetchedAt
  inLibraryAt
  status
  artist
  author
  description
  source {
    id
    displayName
    __typename
  }
  trackRecords {
    totalCount
    nodes {
      id
      trackerId
      __typename
    }
    __typename
  }
  __typename
}

fragment MANGA_SCREEN_FIELDS on MangaType {
  ...MANGA_LIBRARY_FIELDS
  artist
  author
  description
  status
  realUrl
  sourceId
  source {
    id
    displayName
    __typename
  }
  trackRecords {
    totalCount
    nodes {
      id
      trackerId
      __typename
    }
    __typename
  }
  __typename
}

query GET_MANGA_SCREEN($id: Int!) {
  manga(id: $id) {
    ...MANGA_SCREEN_FIELDS
    __typename
  }
}
```

**Variáveis:**
```json
{
  "id": 87
}
```

## 13. GET_CHAPTERS_MANGA

**Descrição:** Lista os capítulos de um mangá, ideal para a tela de detalhes do mangá.

**Como Usar:** Forneça o mangaId na condição e defina a ordem. No exemplo, a ordem é descendente (DESC).

**Query GraphQL:**
```graphql
fragment CHAPTER_BASE_FIELDS on ChapterType {
  id
  name
  mangaId
  scanlator
  realUrl
  sourceOrder
  chapterNumber
  __typename
}

fragment CHAPTER_STATE_FIELDS on ChapterType {
  id
  isRead
  isDownloaded
  isBookmarked
  __typename
}

fragment CHAPTER_LIST_FIELDS on ChapterType {
  ...CHAPTER_BASE_FIELDS
  ...CHAPTER_STATE_FIELDS
  fetchedAt
  uploadDate
  lastReadAt
  __typename
}

fragment PAGE_INFO on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  __typename
}

query GET_CHAPTERS_MANGA($after: Cursor, $before: Cursor, $condition: ChapterConditionInput, $filter: ChapterFilterInput, $first: Int, $last: Int, $offset: Int, $order: [ChapterOrderInput!]) {
  chapters(
    after: $after
    before: $before
    condition: $condition
    filter: $filter
    first: $first
    last: $last
    offset: $offset
    order: $order
  ) {
    nodes {
      ...CHAPTER_LIST_FIELDS
      __typename
    }
    pageInfo {
      ...PAGE_INFO
      __typename
    }
    totalCount
    __typename
  }
}
```

**Variáveis:**
```json
{
  "condition": {
    "mangaId": 87
  },
  "order": [
    {
      "by": "SOURCE_ORDER",
      "byType": "DESC"
    }
  ]
}
```

## 14. GET_MANGA_READER

**Descrição:** Busca os dados essenciais de um mangá necessários para a tela de leitura (reader).

**Como Usar:** Forneça o id do mangá que será lido.

**Query GraphQL:**
```graphql
fragment MANGA_BASE_FIELDS on MangaType {
  id
  title
  thumbnailUrl
  thumbnailUrlLastFetched
  inLibrary
  initialized
  sourceId
  __typename
}

fragment MANGA_META_FIELDS on MangaMetaType {
  mangaId
  key
  value
  __typename
}

fragment SOURCE_BASE_FIELDS on SourceType {
  id
  name
  displayName
  __typename
}

fragment MANGA_READER_FIELDS on MangaType {
  ...MANGA_BASE_FIELDS
  genre
  source {
    ...SOURCE_BASE_FIELDS
    __typename
  }
  meta {
    ...MANGA_META_FIELDS
    __typename
  }
  chapters {
    totalCount
    __typename
  }
  trackRecords {
    totalCount
    __typename
  }
  __typename
}

query GET_MANGA_READER($id: Int!) {
  manga(id: $id) {
    ...MANGA_READER_FIELDS
    __typename
  }
}
```

**Variáveis:**
```json
{
  "id": 87
}
```

## 15. GET_CHAPTERS_READER

**Descrição:** Semelhante à GET_CHAPTERS_MANGA, mas busca campos adicionais úteis para a tela de leitura, como lastPageRead e pageCount.

**Como Usar:** Forneça o mangaId para listar os capítulos com dados específicos do leitor.

**Query GraphQL:**
```graphql
fragment CHAPTER_BASE_FIELDS on ChapterType {
  id
  name
  mangaId
  scanlator
  realUrl
  sourceOrder
  chapterNumber
  __typename
}

fragment CHAPTER_STATE_FIELDS on ChapterType {
  id
  isRead
  isDownloaded
  isBookmarked
  __typename
}

fragment CHAPTER_READER_FIELDS on ChapterType {
  ...CHAPTER_BASE_FIELDS
  ...CHAPTER_STATE_FIELDS
  uploadDate
  lastPageRead
  pageCount
  __typename
}

fragment PAGE_INFO on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
  __typename
}

query GET_CHAPTERS_READER($after: Cursor, $before: Cursor, $condition: ChapterConditionInput, $filter: ChapterFilterInput, $first: Int, $last: Int, $offset: Int, $order: [ChapterOrderInput!]) {
  chapters(
    after: $after
    before: $before
    condition: $condition
    filter: $filter
    first: $first
    last: $last
    offset: $offset
    order: $order
  ) {
    nodes {
      ...CHAPTER_READER_FIELDS
      __typename
    }
    pageInfo {
      ...PAGE_INFO
      __typename
    }
    totalCount
    __typename
  }
}
```

**Variáveis:**
```json
{
  "condition": {
    "mangaId": 87
  },
  "order": [
    {
      "by": "SOURCE_ORDER",
      "byType": "DESC"
    }
  ]
}
```

## 16. GET_CHAPTER_PAGES_FETCH

**Descrição:** Esta é uma mutação que instrui o servidor a buscar (fazer o fetch) da lista de páginas de um capítulo específico a partir da fonte original.

**Como Usar:** Forneça o chapterId do capítulo cujas páginas você quer carregar. A resposta conterá as URLs para cada imagem.

**Query GraphQL:**
```graphql
mutation GET_CHAPTER_PAGES_FETCH($input: FetchChapterPagesInput!) {
  fetchChapterPages(input: $input) {
    chapter {
      id
      pageCount
      __typename
    }
    pages
    __typename
  }
}
```

**Variáveis:**
```json
{
  "input": {
    "chapterId": 513
  }
}
```

## 17. GET_SOURCES_LIST

**Descrição:** Retorna uma lista de todas as fontes (extensões) instaladas no servidor.

**Como Usar:** Ideal para a tela de "Explorar", permitindo ao usuário escolher uma fonte para navegar.

**Query GraphQL:**
```graphql
fragment SOURCE_BASE_FIELDS on SourceType {
  id
  name
  displayName
  __typename
}

fragment SOURCE_LIST_FIELDS on SourceType {
  ...SOURCE_BASE_FIELDS
  lang
  iconUrl
  isNsfw
  isConfigurable
  supportsLatest
  extension {
    pkgName
    repo
    __typename
  }
  __typename
}

query GET_SOURCES_LIST {
  sources {
    nodes {
      ...SOURCE_LIST_FIELDS
      __typename
    }
    __typename
  }
}
```

**Variáveis:**
```json
{}
```

## 18. GET_SOURCE_BROWSE

**Descrição:** Obtém os detalhes de uma fonte específica, incluindo os filtros disponíveis (gênero, status, etc.).

**Como Usar:** Forneça o id da fonte. A resposta é usada para construir dinamicamente a interface de filtros para a busca de mangás.

**Query GraphQL:**
```graphql
query GET_SOURCE_BROWSE($id: LongString!) {
  source(id: $id) {
    id
    name
    displayName
    isConfigurable
    supportsLatest
    meta {
      sourceId
      key
      value
      __typename
    }
    filters {
      ... on CheckBoxFilter {
        type: __typename
        CheckBoxFilterDefault: default
        name
      }
      ... on HeaderFilter {
        type: __typename
        name
      }
      ... on SelectFilter {
        type: __typename
        SelectFilterDefault: default
        name
        values
      }
      ... on TriStateFilter {
        type: __typename
        TriStateFilterDefault: default
        name
      }
      ... on TextFilter {
        type: __typename
        TextFilterDefault: default
        name
      }
      ... on SortFilter {
        type: __typename
        SortFilterDefault: default {
          ascending
          index
          __typename
        }
        name
        values
      }
      ... on SeparatorFilter {
        type: __typename
        name
      }
      ... on GroupFilter {
        type: __typename
        name
        filters {
          ... on CheckBoxFilter {
            type: __typename
            CheckBoxFilterDefault: default
            name
          }
          ... on HeaderFilter {
            type: __typename
            name
          }
          ... on SelectFilter {
            type: __typename
            SelectFilterDefault: default
            name
            values
          }
          ... on TriStateFilter {
            type: __typename
            TriStateFilterDefault: default
            name
          }
          ... on TextFilter {
            type: __typename
            TextFilterDefault: default
            name
          }
          ... on SortFilter {
            type: __typename
            SortFilterDefault: default {
              ascending
              index
              __typename
            }
            name
            values
          }
          ... on SeparatorFilter {
            type: __typename
            name
          }
          __typename
        }
      }
      __typename
    }
    __typename
  }
}
```

**Variáveis:**
```json
{
  "id": "4630910107107422596"
}
```

## 19. GET_SOURCE_MANGAS_FETCH

**Descrição:** Uma mutação que busca mangás de uma fonte específica, com base em um tipo de busca (POPULAR, LATEST) e número de página.

**Como Usar:** Forneça o source (ID da fonte), o type da busca e a page. É a operação central para explorar o catálogo de uma fonte.

**Query GraphQL:**
```graphql
mutation GET_SOURCE_MANGAS_FETCH($input: FetchSourceMangaInput!) {
  fetchSourceManga(input: $input) {
    hasNextPage
    mangas {
      ...MANGA_BASE_FIELDS
      __typename
    }
    __typename
  }
}

fragment MANGA_BASE_FIELDS on MangaType {
  id
  title
  thumbnailUrl
  thumbnailUrlLastFetched
  inLibrary
  initialized
  sourceId
  __typename
}
```

**Variáveis:**
```json
{
  "input": {
    "type": "POPULAR",
    "source": "4630910107107422596",
    "page": 1
  }
}
```

## 20. GET_FAVORITE_MANGAS (GET_LIBRARY_MANGAS)

**Descrição:** Busca a lista de mangás que o usuário marcou como "na biblioteca" (favoritos), permitindo paginação e ordenação.

**Como Usar:** Execute esta query para listar os mangás favoritados. É crucial fornecer `condition: {inLibrary: true}` nas variáveis. Outras variáveis de paginação e ordenação são opcionais.

**Query GraphQL:**
```graphql
query GetFavoriteMangas($condition: MangaConditionInput!, $after: Cursor, $before: Cursor, $first: Int, $last: Int, $offset: Int, $order: [MangaOrderInput!]) {
  mangas(condition: $condition, after: $after, before: $before, first: $first, last: $last, offset: $offset, order: $order) {
    nodes {
      id
      title
      thumbnailUrl
      inLibrary
      status
      author
      description
      genre
      unreadCount
      # Você pode adicionar outros campos que desejar do tipo MangaType.
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    totalCount
  }
}
```

**Variáveis de Exemplo (buscar os primeiros 20 favoritos, ordenados por título):**
```json
{
  "condition": {
    "inLibrary": true
  },
  "first": 20,
  "order": [
    {
      "by": "TITLE",
      "byType": "ASC"
    }
  ]
}
```
**Nota:** O nome da query no código (`GetFavoriteMangas`) é um alias para a operação `mangas` do GraphQL, tornando-a mais descritiva para este caso de uso específico. A funcionalidade é similar à `GET_CATEGORY_MANGAS` (item 3), mas focada no filtro `inLibrary: true` em vez de um `categoryId`.

## 21. UPDATE_CHAPTER_PROGRESS

**Descrição:** Atualiza o estado de um capítulo, permitindo marcar como lido/não lido, definir a última página lida e marcar/desmarcar como favorito (bookmark).

**Como Usar:** Forneça o `chapterId` e os campos que deseja alterar dentro do objeto `patch`.

**Mutação GraphQL:**
```graphql
mutation UpdateChapterProgress($chapterId: Int!, $isReadStatus: Boolean, $lastPage: Int, $isBookmarkedStatus: Boolean) {
  updateChapter(input: {
    id: $chapterId,
    patch: {
      isRead: $isReadStatus,
      lastPageRead: $lastPage,
      isBookmarked: $isBookmarkedStatus
    }
  }) {
    chapter {
      id
      isRead
      lastPageRead
      isBookmarked
      name
      chapterNumber
    }
  }
}
```

**Variáveis de Exemplo (marcar capítulo 123 como lido, página 10, não favorito):**
```json
{
  "chapterId": 123,
  "isReadStatus": true,
  "lastPage": 10,
  "isBookmarkedStatus": false
}
```

**Variáveis de Exemplo (marcar capítulo 456 como não lido):**
```json
{
  "chapterId": 456,
  "isReadStatus": false
}
```
**Nota:** Esta mutação usa a operação `updateChapter` do GraphQL, que espera um `UpdateChapterInput`. Este input, por sua vez, contém um `id` (do capítulo) e um objeto `patch` do tipo `UpdateChapterPatchInput`. O `UpdateChapterPatchInput` aceita os campos `isRead` (Boolean), `lastPageRead` (Int), e `isBookmarked` (Boolean).
**Observação Importante sobre `lastPageRead`**: Testes indicam que ao definir `isRead: true`, o campo `lastPageRead` no capítulo resultante pode ser definido como `0` pelo servidor, independentemente do valor fornecido para `lastPage` na mutação. Isso sugere uma lógica interna do servidor para resetar o progresso de página quando um capítulo é marcado como totalmente lido.

## 22. UPDATE_MANGA_IN_LIBRARY

**Descrição:** Adiciona ou remove um mangá da biblioteca do usuário (equivalente a favoritar/desfavoritar), alterando o status `inLibrary`.

**Como Usar:** Forneça o `mangaId` e o status desejado para `isInLibrary` (true para adicionar, false para remover) dentro do objeto `patch`.

**Mutação GraphQL:**
```graphql
mutation UpdateMangaInLibrary($mangaId: Int!, $isInLibrary: Boolean!) {
  updateManga(input: {
    id: $mangaId,
    patch: {
      inLibrary: $isInLibrary
    }
  }) {
    manga {
      id
      title
      inLibrary
    }
  }
}
```

**Variáveis de Exemplo (adicionar mangá 87 à biblioteca):**
```json
{
  "mangaId": 87,
  "isInLibrary": true
}
```

**Variáveis de Exemplo (remover mangá 199 da biblioteca):**
```json
{
  "mangaId": 199,
  "isInLibrary": false
}
```
**Nota:** Esta mutação usa a operação `updateManga` do GraphQL, que espera um `UpdateMangaInput`. Este input, por sua vez, contém um `id` (do mangá) e um objeto `patch` do tipo `UpdateMangaPatchInput`. O `UpdateMangaPatchInput` aceita o campo `inLibrary` (Boolean).