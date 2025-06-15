\
# Contêiner Docker Suwayomi-Server

|                                                                                                                                                                                                                                                   Status                                                                                                                                                                                                                                                    |                                                                                                                             Estável                                                                                                                              |                                                                                                                             Pré-lançamento                                                                                                                              |                                                                      Suporte no Discord                                                                       |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [![Build Docker Images](https://github.com/Suwayomi/Suwayomi-Server-docker/actions/workflows/build_container_images.yml/badge.svg)](https://github.com/Suwayomi/Suwayomi-Server-docker/actions/workflows/build_container_images.yml) [![Docker Pulls](https://img.shields.io/badge/dynamic/json?url=https://github.com/Suwayomi/Suwayomi-Server-docker/raw/main/scripts/tachidesk_version.json&label=docker_pulls&query=$.total_downloads&color=blue)](https://github.com/orgs/suwayomi/packages/container/package/tachidesk) | [![Latest](https://img.shields.io/badge/dynamic/json?url=https://github.com/Suwayomi/Suwayomi-Server-docker/raw/main/scripts/tachidesk_version.json&label=version&query=$.stable&color=blue)](https://github.com/orgs/suwayomi/packages/container/package/tachidesk/) | [![Preview](https://img.shields.io/badge/dynamic/json?url=https://github.com/Suwayomi/Suwayomi-Server-docker/raw/main/scripts/tachidesk_version.json&label=version&query=$.preview&color=blue)](https://github.com/orgs/suwayomi/packages/container/package/tachidesk) | [![Discord](https://img.shields.io/discord/801021177333940224.svg?label=discord&labelColor=7289da&color=2c2f33&style=flat)](https://discord.gg/DDZdqZWaHA) |

Execute o [Suwayomi-Server](https://github.com/Suwayomi/Suwayomi-Server) dentro de um contêiner Docker como usuário não root. O servidor estará rodando em http://localhost:4567, abra esta URL no seu navegador.

Releases do Docker - https://github.com/Suwayomi/Suwayomi-Server-docker/pkgs/container/tachidesk

Dockerfile - https://github.com/Suwayomi/Suwayomi-Server-docker

_**Localização dos dados do Suwayomi - /home/suwayomi/.local/share/Tachidesk**_

As imagens Docker são multi-arquitetura (linux/amd64, linux/arm64/v8, linux/ppc64le, linux/s390x, linux/riscv64) e possuem tamanho reduzido, baseadas no Ubuntu Linux.

Os logs são enviados para stdout.
Isso permite que o Docker gerencie os logs; visualize-os usando `docker logs --tail=1000 <nome do contêiner>` ou, se estiver usando o arquivo docker-compose, `docker compose logs --tail=1000 suwayomi`.
Por padrão, o Docker armazena logs indefinidamente, você pode [configurar o logging globalmente](https://docs.docker.com/engine/logging/configure/) ou editar o [arquivo compose com um driver de logging](https://docs.docker.com/reference/compose-file/services/#logging).

### Docker compose

Use o template [docker-compose.yml](./docker-compose.yml) neste repositório para criar e iniciar o contêiner Docker do Tachidesk.

# Variáveis de Ambiente

> [!CAUTION]
> Fornecer uma variável de ambiente irá **sobrescrever** o valor da configuração atual ao iniciar o contêiner.

> [!Tip]
> Na maioria das vezes, você não precisará usar variáveis de ambiente; em vez disso, as configurações podem ser alteradas durante a execução através da interface web. (que se tornará inútil ao fornecer uma variável de ambiente)

> [!NOTE]
> Veja [server-reference.conf](https://github.com/Suwayomi/Suwayomi-Server/blob/master/server/src/main/resources/server-reference.conf) no repositório [Suwayomi-Server](https://github.com/Suwayomi/Suwayomi-Server) para os valores padrão.

Há uma série de variáveis de ambiente disponíveis para configurar o Suwayomi:

|               Variável               |     Padrão do Servidor      |                                                                                              Descrição                                                                                              |
|:------------------------------------:|:-----------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|                **TZ**                |        `Etc/UTC`        |                                                                              Qual fuso horário o contêiner considera que está.                                                                               |
|             **BIND_IP**              |        `0.0.0.0`        |                                                        A interface na qual escutar, dentro do contêiner. Você quase nunca desejará alterar isso.                                                        |
|            **BIND_PORT**             |         `4567`          |                                                                                  Qual porta o Suwayomi escutará                                                                                   |
|       **SOCKS_PROXY_ENABLED**        |         `false`         |                                                                         Se o Suwayomi se conectará através de um proxy SOCKS5                                                                          |
|         **SOCKS_PROXY_HOST**         |           ` `           |                                                                                   O host TCP do proxy SOCKS5                                                                                    |
|         **SOCKS_PROXY_PORT**         |           ` `           |                                                                                     A porta do proxy SOCKS5                                                                                      |
|         **DOWNLOAD_AS_CBZ**          |         `false`         |                                                                     Se o Suwayomi deve salvar o mangá no disco no formato CBZ                                                                      |
|        **BASIC_AUTH_ENABLED**        |         `false`         |                                                                         Se o Suwayomi requer Autenticação Básica HTTP para acesso.                                                                          |
|       **BASIC_AUTH_USERNAME**        |           ` `           |                                                                                  O nome de usuário para fazer login no Suwayomi.                                                                                  |
|       **BASIC_AUTH_PASSWORD**        |           ` `           |                                                                                  A senha para fazer login no Suwayomi.                                                                                  |
|              **DEBUG**               |         `false`         |                                                               Se o logging extra está habilitado. Útil para desenvolvimento e solução de problemas.                                                                |
|          **WEB_UI_ENABLED**          |         `true`          |                                                                                  Se o servidor deve servir uma interface web                                                                                   |
|          **WEB_UI_FLAVOR**           |         `WebUI`         |                                                                                          "WebUI" ou "Custom"                                                                                          |
|          **WEB_UI_CHANNEL**          |        `stable`         |                                        "bundled" (a versão empacotada com o release do servidor), "stable" ou "preview" - a versão da interface web que deve ser usada                                         |
|      **WEB_UI_UPDATE_INTERVAL**      |          `23`           |                                          Tempo em horas - 0 para desabilitar atualização automática - intervalo: 1 <= n < 24 - com que frequência o servidor deve verificar atualizações da interface web                                          |
|      **AUTO_DOWNLOAD_CHAPTERS**      |         `false`         |                                                             Se novos capítulos que foram recuperados devem ser baixados automaticamente                                                              |
|   **AUTO_DOWNLOAD_EXCLUDE_UNREAD**   |         `true`          |                                                                  Ignorar downloads automáticos de capítulos de entradas com capítulos não lidos                                                                   |
| **AUTO_DOWNLOAD_NEW_CHAPTERS_LIMIT** |           `0`           |                           0 para desabilitar - quantos capítulos baixados não lidos devem estar disponíveis - se o limite for atingido, novos capítulos não serão baixados automaticamente                            |
|  **AUTO_DOWNLOAD_IGNORE_REUPLOADS**  |         `false`         |                                                           Decide se reenvios devem ser ignorados durante o download automático de novos capítulos                                                                   |
|         **EXTENSION_REPOS**          |          `[]`           |                       Quaisquer repositórios de extensão adicionais a serem usados, o formato é `["https://github.com/MINHA_CONTA/MEU_REPO/tree/repo", "https://github.com/MINHA_CONTA_2/MEU_REPO_2/"]`                        |
|     **MAX_SOURCES_IN_PARALLEL**      |           `6`           | Intervalo: 1 <= n <= 20 - Define quantas fontes podem fazer requisições (atualizações, downloads) em paralelo. Atualizações/Downloads são agrupados por fonte e todos os mangás de uma fonte são atualizados/baixados sincronicamente |
|      **UPDATE_EXCLUDE_UNREAD**       |         `true`          |                                                                            Se mangás não lidos devem ser excluídos das atualizações                                                                            |
|      **UPDATE_EXCLUDE_STARTED**      |         `true`          |                                                                  Se mangás que não foram iniciados devem ser excluídos das atualizações                                                                   |
|     **UPDATE_EXCLUDE_COMPLETED**     |         `true`          |                                                                          Se mangás concluídos devem ser excluídos das atualizações                                                                           |
|         **UPDATE_INTERVAL**          |          `12`           |                 Tempo em horas - 0 para desabilitar - (não precisa ser horas cheias, ex: 12.5) - intervalo: 6 <= n < ∞ - Intervalo em que a atualização global será acionada automaticamente                 |
|        **UPDATE_MANGA_INFO**         |         `false`         |                                                                        Se as informações do mangá devem ser atualizadas junto com os capítulos                                                                        |
|           **BACKUP_TIME**            |         `00:00`         |                                                    Intervalo: hora: 0-23, minuto: 0-59 - Hora do dia em que o backup automático deve ser acionado                                                    |
|         **BACKUP_INTERVAL**          |           `1`           |                                         Tempo em dias - 0 para desabilitar - intervalo: 1 <= n < ∞ - Intervalo em que o servidor criará um backup automaticamente                                          |
|            **BACKUP_TTL**            |          `14`           |                                         Tempo em dias - 0 para desabilitar - intervalo: 1 <= n < ∞ - Por quanto tempo os arquivos de backup serão mantidos antes de serem excluídos                                          |
|       **FLARESOLVERR_ENABLED**       |         `false`         |                                                                         Se o FlareSolverr está habilitado e disponível para uso                                                                          |
|         **FLARESOLVERR_URL**         | `http://localhost:8191` |                                                                                 A URL da instância do FlareSolverr                                                                                  |
|       **FLARESOLVERR_TIMEOUT**       |          `60`           |                                                              Tempo em segundos para o FlareSolverr expirar se o desafio não for resolvido                                                               |
|    **FLARESOLVERR_SESSION_NAME**     |       `suwayomi`        |                                                                   O nome da sessão que o Suwayomi usará com o FlareSolverr                                                                    |
|     **FLARESOLVERR_SESSION_TTL**     |          `15`           |                                                                             O tempo de vida para a sessão do FlareSolverr                                                                             |
|     **OPDS_USE_BINARY_FILE_SIZES**   |         `false`         |                                                              Se os tamanhos dos arquivos devem ser exibidos em binário (KiB, MiB, GiB) ou decimal (KB, MB, GB)                                                              |
|       **OPDS_ITEMS_PER_PAGE**        |          `50`           |                                                              Quantos itens mostrar por página - 10 <= n < 5000                                                                                       |
|   **OPDS_ENABLE_PAGE_READ_PROGRESS** |         `true`          |                                                              Rastreie e atualize seu progresso de leitura por página para cada capítulo durante o streaming de páginas                                                              |
|   **OPDS_MARK_AS_READ_ON_DOWNLOAD**  |          `false`        |                                                              Marcar capítulos automaticamente como lidos quando você os baixa                                                                 |
| **OPDS_SHOW_ONLY_UNREAD_CHAPTERS**   |          `false`        |                                                              Filtrar o feed de mangás para exibir apenas capítulos que você não leu                                                                          |
| **OPDS_SHOW_ONLY_DOWNLOADED_CHAPTERS**|          `false`        |                                                              Filtrar o feed de mangás para exibir apenas capítulos que você baixou                                                                        |
|     **OPDS_CHAPTER_SORT_ORDER**      |          `DESC`         |                                                              "DESC" ou "ASC"                                                                                                                            |

### Pasta de Downloads
Não permitimos a configuração da pasta de downloads, pois os Volumes do Docker podem lidar com isso. Aqui está um exemplo de um `docker-compose.yaml` que possui configuração de volume de downloads:
```yaml
  tachidesk:
    image: ghcr.io/suwayomi/suwayomi-server:stable
    container_name: tachidesk
    volumes: # A ordem importa! Certifique-se de que 'downloads' seja o primeiro na lista de volumes ou não funcionará!
      - /exemplo/tachidesk/downloads:/home/suwayomi/.local/share/Tachidesk/downloads
      - /exemplo/tachidesk/files:/home/suwayomi/.local/share/Tachidesk
    ports:
      - 4568:4567
    restart: unless-stopped
```

# Tags Docker

## Latest (Mais Recente)

`ghcr.io/suwayomi/suwayomi-server:latest` 

O release estável mais recente do servidor. Também tagueado como `:stable`.

## Preview (Pré-lançamento)

`ghcr.io/suwayomi/suwayomi-server:preview`

O release de pré-lançamento mais recente do servidor. Pode conter bugs!

# Créditos

[Suwayomi-Server](https://github.com/Suwayomi/Suwayomi-Server) é licenciado sob `MPL v. 2.0`.

# Licença

```text
Este Formulário de Código Fonte está sujeito aos termos da Mozilla Public
License, v. 2.0. Se uma cópia da MPL não foi distribuída com este
arquivo, Você pode obter uma em http://mozilla.org/MPL/2.0/.
```
