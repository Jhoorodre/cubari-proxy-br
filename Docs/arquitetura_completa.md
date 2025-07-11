# Arquitetura Completa - React, Django (API Gateway), Suwayomi-Server, PostgreSQL (Cache) e Remote Storage

Excelente! Com os detalhes da API, podemos montar o quebra-cabeça completo com a arquitetura moderna, focada em privacidade, controle do usuário e funcionalidades avançadas.

Neste modelo, a aplicação é distribuída e centrada no usuário, mas de forma inteligente, aproveitando o melhor de cada componente. As analogias são:

-   **O Frontend (React na Vercel):** É o **Salão e o Organizador Pessoal do Cliente**. É a interface que o usuário vê. É responsável por gerenciar os dados do usuário (biblioteca, histórico) conectando-se a um serviço de armazenamento que o cliente controla.
-   **O Backend (Django na Vercel):** É o **Tradutor e Porteiro Inteligente**. Sua função é receber pedidos do "salão" (frontend), traduzi-los de forma segura para o fornecedor (Suwayomi), e proteger o acesso a ele. Ele é um intermediário *stateless* que não armazena dados de usuários, mas pode retransmitir comandos de sincronização.
-   **O Banco de Dados (PostgreSQL):** É a **Memória de Curto Prazo do Porteiro**. Sua única função é servir como um **cache**, guardando as respostas recentes do fornecedor para que o porteiro (Django) possa responder mais rápido e evitar chamadas repetidas.
-   **O Suwayomi-Server (na Koyeb):** É um **Fornecedor Externo Especializado**. Seu trabalho é buscar dados e imagens das fontes de mangá. Ele também mantém uma lista interna de "favoritos" para tarefas operacionais, como verificar atualizações.
-   **O Remote Storage (ex: 5apps):** É o **Cofre Pessoal e Fonte da Verdade do Cliente**. É um serviço de armazenamento na nuvem controlado pelo usuário. É aqui que a biblioteca, histórico e configurações ficam guardados. A aplicação (frontend) só acessa esse cofre com a permissão (chave/token) do usuário.

## O Fluxo de Trabalho na Prática

Vamos imaginar dois fluxos: **buscar um mangá** e **adicioná-lo à biblioteca**.

**Cenário:** Sua aplicação React está no ar. Seu backend Django + PostgreSQL está rodando como um serviço de API. Seu Suwayomi-Server está na Koyeb. O usuário configurou sua conta do Remote Storage no frontend.

### Fluxo 1: A Busca (O Frontend Usa o Porteiro para Falar com o Fornecedor)

Este fluxo permanece focado no papel do Django como um proxy de cache.

1.  O usuário entra no seu site e busca por um título.
2.  O componente React faz uma requisição para a **sua API Gateway em Django** (ex: `GET /api/v1/content-discovery/search`).
3.  Seu backend **Django** recebe a requisição. Ele primeiro verifica em seu **cache (PostgreSQL)** se já fez essa busca recentemente.
4.  Se não estiver em cache, ele traduz o pedido em uma requisição **GraphQL** para o **Suwayomi-Server**.
5.  O **Suwayomi-Server** busca o mangá na fonte e retorna a lista para o Django.
6.  O **Django** armazena o resultado no cache (PostgreSQL) para futuras requisições e envia a resposta final para o **frontend React**.
7.  O React recebe a lista e a exibe para o usuário.

### Fluxo 2: Adicionando à Biblioteca (Sincronização Híbrida)

Este fluxo é onde a nova arquitetura brilha, combinando controle do usuário com funcionalidades do servidor.

1.  O usuário vê o resultado da busca e clica em "Adicionar à Biblioteca".
2.  A aplicação React executa **duas ações principais**:
    * **Ação Primária (Fonte da Verdade):** Conecta-se diretamente à API do **Remote Storage (5apps)** e salva os metadados completos do mangá. Isso garante que o usuário tenha posse total e permanente de seus dados.
    * **Ação Secundária (Sincronização Funcional):** Faz uma requisição para o backend **Django** (ex: `POST /api/v1/suwayomi/manga/update_in_library/`) com o ID do mangá e o status `inLibrary: true`.
3.  O backend **Django** recebe essa chamada de sincronização e a repassa como uma mutação GraphQL (`updateManga` ou `updateUserManga`) para o **Suwayomi-Server**.
4.  O **Suwayomi-Server** recebe a mutação e marca o mangá em sua própria base de dados interna como sendo "favorito". Ele não armazena dados do usuário, apenas a associação necessária para tarefas futuras (como "verificar novos capítulos para este mangá").
5.  O Django e o Suwayomi retornam uma resposta de sucesso, e o React atualiza a interface, mostrando o item "Na Biblioteca".

## Diagramas do Fluxo Completo

**Busca de Conteúdo:**
```
[React na Vercel] ➔ [API Gateway Django + Cache PostgreSQL] ➔ [Suwayomi-Server na Koyeb]
```

**Adicionar à Biblioteca (Modelo Híbrido):**
```
                                        ┌───► [API Gateway Django] ➔ [Suwayomi-Server] (Sincronização)
[React na Vercel] ───┤
                                        └───► [Remote Storage (5apps)] (Fonte da Verdade)
```

## Vantagens Finais Desta Arquitetura

-   **Privacidade e Controle (User-Centric):** Os dados pessoais do usuário (biblioteca, progresso) têm como fonte da verdade o **Remote Storage**, um serviço que ele controla. A aplicação não armazena permanentemente esses dados.
-   **Funcionalidades Avançadas:** Ao sincronizar o estado "favorito" com o Suwayomi-Server (de forma anonimizada, apenas o ID do conteúdo), a aplicação pode oferecer recursos poderosos como a verificação automática de novos capítulos no backend, sem comprometer a privacidade dos dados do usuário.
-   **Segurança e Abstração:** A infraestrutura (Suwayomi) fica completamente oculta. O navegador do usuário só conversa com a API Gateway do Django, que anonimiza os endpoints e faz o proxy de imagens, prevenindo a exposição de URLs ou chaves.
-   **Escalabilidade e Baixo Custo:** O backend é *stateless* em relação aos dados do usuário. Ele não precisa de um banco de dados robusto para armazenar bibliotecas crescentes, apenas um cache. Isso simplifica a manutenção e reduz os custos de escalabilidade.
