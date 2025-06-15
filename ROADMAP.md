# 🗺️ Roadmap de Implementação - Cubari Proxy (Arquitetura Moderna)

Este roadmap detalha o plano de implementação para o Cubari Proxy, alinhado com uma arquitetura moderna utilizando React (Vercel) para o frontend, Django + PostgreSQL (Vercel) para o backend principal, e Suwayomi-Server (Koyeb) como microserviço de fontes.

---

## 📒 Legenda de Status

- 🔲 **Pendente**: Tarefa ainda não iniciada.
- 🔄 **Em Andamento**: Tarefa atualmente em desenvolvimento.
- ✅ **Concluído**: Tarefa implementada e testada.
- ⚠️ **Bloqueado**: Tarefa impedida por dependências não resolvidas.
- 🚫 **Cancelado**: Tarefa não será implementada.
- 💡 **Ideia**: Nova ideia ou sugestão a ser considerada.

---

## 🏗️ Fase 1: Backend e Infraestrutura Base

**Objetivo**: Estabelecer a fundação do backend e serviços necessários para o funcionamento do Cubari Proxy.
**Responsável**: Equipe Backend
**Tempo Estimado Total da Fase**: 2-3 semanas

### 1.1. Configuração do Backend Principal (Django + PostgreSQL)

- **Status**: 🔲 Pendente
- **Prioridade**: Crítica
- **Tempo Estimado**: 1 semana
- **Tarefas**:
  - [ ] Definir modelos de dados para o backend (ex: para caching de mangás, capítulos, mas não dados de usuário que serão via Remote Storage). - *Parcialmente abordado com o sistema de cache do Django.*
  - [ ] Configurar projeto Django.
  - [ ] Configurar banco de dados PostgreSQL (para caching e dados operacionais do backend). - *Atualmente usando cache in-memory, PostgreSQL pode ser uma melhoria futura.*
  - [ ] Criar APIs CRUD para gerenciamento de mangás na biblioteca do usuário (a lógica de armazenamento será via Remote Storage, o backend pode atuar como proxy ou facilitador).
  - [ ] Criar APIs para registro de histórico de leitura (mesma lógica acima, via Remote Storage).
  - [ ] Configurar CORS e segurança básica.
  - [ ] Deploy inicial na Vercel (ou plataforma similar para Django).
- **Entregáveis**: Backend funcional com endpoints para interagir com dados de mangás, facilitando a integração com Remote Storage para dados de biblioteca e histórico.

### 1.2. Configuração do Suwayomi-Server como Microserviço

- **Status**: 🔲 Pendente
- **Prioridade**: Crítica
- **Tempo Estimado**: 3-4 dias
- **Tarefas**:
  - [ ] Preparar o Suwayomi-Server para deploy.
  - [ ] Configurar e realizar deploy do Suwayomi-Server na Koyeb (ou plataforma similar).
  - [ ] Garantir que o servidor Suwayomi esteja acessível e funcional.
  - [ ] Definir como o backend Django irá se comunicar com o Suwayomi-Server (proxy reverso ou chamadas diretas). - *Chamadas diretas GraphQL via HTTP POST.*
- **Entregáveis**: Instância do Suwayomi-Server rodando e acessível.

### 1.3. API Gateway/Proxy (Django) para Suwayomi

- **Status**: 🔲 Pendente
- **Prioridade**: Alta
- **Tempo Estimado**: 2-3 dias
- **Tarefas**:
  - [ ] Definir e implementar os seguintes endpoints REST anonimizados no Django, que atuarão como proxy para a API GraphQL do Suwayomi-Server:
    - [ ] `GET /api/v1/content-providers/list` (Listar fontes/provedores de conteúdo)
    - [ ] `GET /api/v1/content-discovery/search` (Buscar itens de conteúdo, ex: mangás)
    - [ ] `GET /api/v1/content-item/{provider_id}/{content_id}/details` (Detalhes de um item de conteúdo)
    - [ ] `GET /api/v1/content-item/{provider_id}/{content_id}/chapter/{chapter_id}/pages` (Páginas de um capítulo)
    - [ ] `GET /api/v1/icon-proxy/<provider_id>/<icon_filename>/` (Proxy para ícones de provedores)
    - [ ] `GET /api/v1/thumbnail-proxy/<provider_id>/<content_id>/` (Proxy para miniaturas de conteúdo)
    - [ ] `GET /api/v1/page-image-proxy/<provider_id>/<content_id>/<chapter_id>/<page_index_str>/` (Proxy para imagens de páginas de capítulos)
    - *Nota sobre Anonimização*: Conforme definido no `API_GLOSSARY.md`, os nomes dos endpoints, parâmetros e IDs devem ser anonimizados. - *Em progresso, IDs do Suwayomi são usados internamente, mas as URLs do proxy são o foco da anonimização externa.*
  - [ ] Para cada endpoint acima (implementados):
    - [ ] Implementar a lógica de recebimento da requisição e validação dos parâmetros de entrada.
    - [ ] Construir a chamada GraphQL apropriada para o Suwayomi-Server.
    - [ ] Enviar a requisição ao Suwayomi-Server e tratar a resposta, incluindo erros HTTP e erros específicos do GraphQL.
    - [ ] Formatar a resposta do Suwayomi para o formato JSON anonimizado definido no `API_GLOSSARY.md` (ou similar), incluindo o mapeamento de dados e IDs.
  - [ ] Implementar tratamento de erros robusto e logging para todas as interações com o Suwayomi-Server.
  - [ ] Configurar e implementar autenticação/autorização para as chamadas ao Suwayomi-Server, se aplicável (ex: API keys, tokens). - *Atualmente não implementado, Suwayomi acessível diretamente pela URL configurada.*
  - [ ] Implementar estratégias de caching (ex: `django.core.cache`) para as respostas dos endpoints.
- **Entregáveis**: Endpoints no backend Django para interagir com o Suwayomi-Server de forma segura e controlada, utilizando GraphQL, com proxy de imagens e caching.

---

## 🔗 Fase 2: Integração Frontend-Backend e Funcionalidades Essenciais

**Objetivo**: Conectar o frontend React existente com o novo backend Django e implementar as funcionalidades básicas de um leitor de mangás, utilizando Remote Storage para dados do usuário.
**Responsável**: Equipe Frontend & Backend
**Tempo Estimado Total da Fase**: 3-4 semanas

### 2.1. Configuração do Armazenamento de Dados do Usuário (Remote Storage)

- **Status**: 🔲 Pendente
- **Prioridade**: Crítica
- **Tempo Estimado**: 3-4 dias
- **Tarefas**:
  - [ ] Garantir que o frontend React possa se conectar e sincronizar dados (biblioteca, histórico, configurações) com o Remote Storage (ex: 5apps).
  - [ ] Implementar a interface no frontend para que o usuário configure sua conta do Remote Storage.
  - [ ] Assegurar que as operações de salvar/carregar biblioteca e histórico utilizem o Remote Storage.
  - [ ] O backend Django não gerenciará estado de usuário ou autenticação; toda a persistência de dados do usuário é via Remote Storage.
- **Entregáveis**: Usuários conseguem configurar e usar o Remote Storage para salvar e sincronizar seus dados de leitura entre dispositivos.

### 2.2. Funcionalidade de Busca de Mangás

- **Status**: 🔲 Pendente
- **Prioridade**: Crítica
- **Tempo Estimado**: 1 semana
- **Tarefas**:
  - [ ] Criar interface de busca no frontend.
  - [ ] Frontend envia requisição de busca para o backend Django.
  - [ ] Backend Django repassa a busca para o Suwayomi-Server (via API Gateway/Proxy).
  - [ ] Exibir resultados da busca no frontend.
  - [ ] Permitir seleção de fontes (se aplicável, via Suwayomi).
- **Entregáveis**: Usuários conseguem buscar mangás de diversas fontes.

### 2.3. Visualização de Detalhes do Mangá e Capítulos

- **Status**: 🔲 Pendente
- **Prioridade**: Crítica
- **Tempo Estimado**: 1 semana
- **Tarefas**:
  - [ ] Frontend solicita detalhes de um mangá específico ao backend Django.
  - [ ] Backend Django obtém informações do Suwayomi-Server.
  - [ ] Exibir informações do mangá (capa, sinopse, autor, etc.) e lista de capítulos.
- **Entregáveis**: Usuários conseguem ver detalhes e capítulos de um mangá.

### 2.4. Leitor de Mangá

- **Status**: 🔲 Pendente
- **Prioridade**: Crítica
- **Tempo Estimado**: 1 semana
- **Tarefas**:
  - [ ] Frontend solicita páginas de um capítulo ao backend Django.
  - [ ] Backend Django obtém as páginas do Suwayomi-Server e fornece URLs de proxy.
  - [ ] Implementar interface de leitura no frontend (navegação entre páginas, zoom, etc.).
- **Entregáveis**: Usuários conseguem ler capítulos de mangás.

### 2.5. Biblioteca Pessoal (Favoritos)

- **Status**: 🔲 Pendente
- **Prioridade**: Alta
- **Tempo Estimado**: 4-5 dias
- **Tarefas**:
  - [ ] Permitir que usuários adicionem/removam mangás à sua biblioteca pessoal.
  - [ ] Frontend interage diretamente com o Remote Storage para salvar e gerenciar a biblioteca do usuário.
  - [ ] O backend Django não armazena dados da biblioteca no PostgreSQL; pode, no máximo, prover endpoints que facilitem a interação com metadados de mangás, mas não a biblioteca em si.
  - [ ] Exibir a lista de mangás salvos no frontend, carregada do Remote Storage.
- **Entregáveis**: Usuários conseguem gerenciar sua biblioteca de mangás, com dados armazenados e sincronizados via Remote Storage.

### 2.6. Histórico de Leitura

- **Status**: 🔲 Pendente
- **Prioridade**: Alta
- **Tempo Estimado**: 3-4 dias
- **Tarefas**:
  - [ ] Registrar automaticamente os capítulos lidos pelo usuário.
  - [ ] Frontend interage diretamente com o Remote Storage para salvar e gerenciar o histórico de leitura.
  - [ ] O backend Django não armazena dados de histórico no PostgreSQL; pode, no máximo, prover endpoints relacionados a capítulos, mas não o histórico do usuário.
  - [ ] Exibir o histórico de leitura no frontend, carregado do Remote Storage.
- **Entregáveis**: Usuários conseguem ver seu histórico de leitura, com dados armazenados e sincronizados via Remote Storage.

---

## ✨ Fase 3: Features de Alta Prioridade (Adaptadas do Roadmap Original)

**Objetivo**: Implementar funcionalidades cruciais que melhoram significativamente a experiência do usuário, adaptando-as à nova arquitetura.
**Responsável**: Equipe Frontend & Backend
**Tempo Estimado Total da Fase**: 2-3 semanas

### 3.1. Melhoria da Integração com Remote Storage (Ex: 5apps)

- **Status**: 🔲 Pendente
- **Prioridade**: Alta
- **Tempo Estimado**: 1 semana
- **Objetivo**: Melhorar a experiência do usuário com o sistema de backup e sincronização na nuvem via Remote Storage.
- **Tarefas**:
  - [ ] **Backend (Django)**:
    - [ ] Investigar e, se benéfico, implementar rotas no Django que possam facilitar a configuração inicial ou interações específicas com o Remote Storage (ex: proxy para CORS, endpoints de ajuda para configuração), sem armazenar dados do usuário.
    - [ ] Garantir que qualquer token de acesso ou configuração sensível relacionada ao Remote Storage seja gerenciada de forma segura, preferencialmente no lado do cliente ou com mecanismos que não exijam que o backend Django os armazene permanentemente.
  - [ ] **Frontend**:
    - [ ] Criar componente `RemoteStorageHelp.js` para guiar o usuário na configuração.
    - [ ] Posicionar botão flutuante fixo na tela.
    - [ ] Implementar modal explicativo passo-a-passo.
    - [ ] Melhorar Página de Configurações: Reorganizar seção, adicionar explicações claras, indicadores de status.
- **Arquivos a Modificar (Frontend)**: `src/components/RemoteStorageHelp.js` (criar), `src/containers/Settings.js` (modificar), `src/style/index.css`, `src/locales/ptBR/translation.json`.
- **Entregáveis**: Sistema de backup/sincronização mais intuitivo e robusto.

### 3.2. Migração para Extensões em Português Brasileiro (via Suwayomi)

- **Status**: 🔲 Pendente
- **Prioridade**: Alta
- **Tempo Estimado**: 1-2 semanas (depende da configuração do Suwayomi e da interface no frontend)
- **Objetivo**: Priorizar e facilitar o acesso a conteúdo em português brasileiro.
- **Tarefas**:
  - [ ] **Backend (Suwayomi)**:
    - [ ] Garantir que o Suwayomi-Server esteja configurado com as extensões PT-BR desejadas (Union Mangás, Manga Livre, etc.).
    - [ ] Verificar se o Suwayomi permite configurar preferências de idioma por fonte ou globalmente.
  - [ ] **Backend (Django)**:
    - [ ] Se o frontend enviar preferências de idioma/fonte (lidas do Remote Storage do usuário), o backend Django pode usar essas informações para customizar as chamadas ao Suwayomi-Server.
  - [ ] **Frontend**:
    - [ ] Interface para o usuário selecionar fontes preferenciais ou idioma (salvas no Remote Storage).
    - [ ] Ajustar `src/sources/Sources.ts` e `SourceUtils.ts` para interagir com o backend Django, que por sua vez interage com Suwayomi, em vez de configurar fontes diretamente no frontend. A lógica de fontes agora reside primariamente no Suwayomi.
    - [ ] Atualizar traduções em `src/locales/ptBR/translation.json`.
- **Entregáveis**: Aplicação prioriza fontes em PT-BR e permite fácil configuração.

---

## 🚀 Fase 4: Features de Média Prioridade (Adaptadas do Roadmap Original)

**Objetivo**: Adicionar funcionalidades que enriquecem a experiência do usuário.
**Responsável**: Equipe Frontend & Backend
**Tempo Estimado Total da Fase**: 2-3 semanas

### 4.1. Interface Mobile Aprimorada

- **Status**: 🔲 Pendente
- **Prioridade**: Média
- **Tempo Estimado**: 1 semana
- **Objetivo**: Melhorar a experiência em dispositivos móveis.
- **Tarefas (Frontend)**:
  - [ ] Implementar gestos de navegação (swipe em carrosséis, pull-to-refresh).
  - [ ] Otimizar layout para mobile (cards maiores, navegação bottom sheet, botões de ação maiores).
  - [ ] Melhorar performance mobile (lazy loading, imagens otimizadas).
- **Entregáveis**: Interface mais fluida e adaptada para mobile.

### 4.2. Sistema de Busca Avançada

- **Status**: 🔲 Pendente
- **Prioridade**: Média
- **Tempo Estimado**: 1 semana
- **Objetivo**: Implementar filtros avançados na busca.
- **Tarefas**:
  - [ ] **Backend (Django & Suwayomi)**:
    - [ ] Verificar quais filtros o Suwayomi-Server suporta por fonte.
    - [ ] Backend Django deve ser capaz de passar esses filtros para o Suwayomi.
  - [ ] **Frontend**:
    - [ ] Interface para filtros (gêneros, status, ano, etc.).
    - [ ] Implementar lógica para aplicar filtros na busca.
    - [ ] Considerar sugestões automáticas. O histórico de busca, se implementado, será armazenado localmente no cliente ou via Remote Storage, e não no backend Django, para manter a privacidade e consistência dos dados do usuário.
- **Entregáveis**: Busca mais poderosa e personalizável.

### 4.3. Sistema de Estatísticas (Dados do Usuário via Remote Storage)

- **Status**: 🔲 Pendente
- **Prioridade**: Média
- **Tempo Estimado**: 4-5 dias
- **Objetivo**: Mostrar estatísticas de leitura para o usuário, processadas no frontend a partir dos dados do Remote Storage.
- **Tarefas**:
  - [ ] **Frontend**:
    - [ ] Desenvolver lógica no frontend para ler dados de histórico e biblioteca do Remote Storage.
    - [ ] Processar esses dados no cliente para gerar estatísticas (mangás lidos, tempo gasto estimado, gêneros favoritos).
    - [ ] Desenvolver dashboard pessoal para exibir estatísticas.
    - [ ] Criar gráficos e visualizações.
    - [ ] (Opcional) Sistema de metas e conquistas (dados também no Remote Storage).
  - [ ] **Backend (Django)**:
    - [ ] Não envolvido no armazenamento ou processamento direto dos dados de estatísticas do usuário. Pode fornecer dados agregados anônimos globais, se desejado no futuro, mas não estatísticas pessoais.
- **Entregáveis**: Painel de estatísticas para o usuário, com dados processados no cliente a partir do Remote Storage.

### 4.4. Modo de Leitura Noturna

- **Status**: 🔲 Pendente
- **Prioridade**: Média
- **Tempo Estimado**: 2-3 dias
- **Objetivo**: Implementar modo de leitura específico com configurações de brilho, contraste e filtros.
- **Tarefas (Frontend)**:
  - [ ] Implementar tema escuro para a interface de leitura.
  - [ ] Adicionar controles para brilho (se possível via CSS/JS), filtro de cor (ex: sépia).
  - [ ] (Opcional) Programação automática baseada no horário ou tema do sistema.
- **Entregáveis**: Modo de leitura confortável para ambientes escuros.

---

## 🎨 Fase 5: Features de Baixa Prioridade (Adaptadas do Roadmap Original)

**Objetivo**: Adicionar funcionalidades complementares e melhorias de longo prazo.
**Responsável**: Equipe Frontend & Backend
**Tempo Estimado Total da Fase**: A definir

### 5.1. Sistema de Notificações (Novos Capítulos)

- **Status**: 🔲 Pendente
- **Prioridade**: Baixa
- **Tempo Estimado**: 1 semana
- **Objetivo**: Notificar usuários sobre novos capítulos de mangás favoritos.
- **Tarefas**:
  - [ ] **Backend (Django)**:
    - [ ] Implementar um sistema que permita ao frontend registrar interesse em notificações para determinados mangás (ex: enviando IDs de mangás, sem associar a um usuário específico, mas a um token de notificação anônimo).
    - [ ] Job periódico para verificar atualizações no Suwayomi-Server para os mangás monitorados (de forma agregada e anônima).
    - [ ] Armazenar estado de novos capítulos (de forma agregada).
    - [ ] Implementar sistema de envio de notificações (ex: Web Push) para os tokens registrados interessados em mangás atualizados.
  - [ ] **Frontend**:
    - [ ] Interface para o usuário indicar interesse em receber notificações para mangás (preferências salvas no Remote Storage).
    - [ ] Lógica para registrar o dispositivo/navegador para Web Push Notifications e enviar os IDs dos mangás de interesse (lidos do Remote Storage) para o backend.
- **Entregáveis**: Usuários são notificados sobre novos capítulos de mangás que escolheram seguir.

### 5.2. Sistema de Plugins (Reavaliar Complexidade)

- **Status**: 🔲 Pendente
- **Prioridade**: Baixa
- **Tempo Estimado**: 2-3 semanas (alta complexidade)
- **Objetivo**: Permitir que usuários adicionem suas próprias extensões e customizações.
- **Observação**: Com o Suwayomi-Server gerenciando as fontes, a necessidade e a forma de um sistema de plugins no Cubari Proxy precisam ser reavaliadas. Poderia focar em plugins para o frontend (temas, scripts de usuário) ou integrações.
- **Tarefas**:
  - [ ] Reavaliar a necessidade e escopo desta feature na nova arquitetura.
  - [ ] Se prosseguir, definir API de plugins, sandboxing, etc.
- **Entregáveis**: (Se aplicável) Capacidade de estender a funcionalidade do Cubari Proxy.

### 5.3. Sistema de Listas Personalizadas

- **Status**: 🔲 Pendente
- **Prioridade**: Baixa
- **Tempo Estimado**: 1 semana
- **Objetivo**: Permitir que usuários criem listas personalizadas além de favoritos, com dados salvos no Remote Storage.
- **Tarefas**:
  - [ ] **Frontend**:
    - [ ] Interface para gerenciamento de listas (criar, editar, adicionar/remover mangás).
    - [ ] Lógica para salvar e carregar listas personalizadas do Remote Storage.
    - [ ] (Opcional) Compartilhamento de listas (poderia ser via exportação/importação de um formato de dados da lista).
  - [ ] **Backend (Django)**:
    - [ ] Não envolvido no armazenamento de listas personalizadas. Pode fornecer metadados de mangás para popular as listas no frontend.
- **Entregáveis**: Usuários podem organizar mangás em listas customizadas, sincronizadas via Remote Storage.

---

## 🔄 Fase 6: Melhorias Técnicas Contínuas

**Objetivo**: Manter a qualidade, performance e segurança do projeto ao longo do tempo.
**Responsável**: Todas as Equipes
**Tempo Estimado**: Contínuo

### 6.1. Otimização de Performance

- **Status**: 🔲 Pendente
- **Prioridade**: Média (Contínua)
- **Tarefas**:
  - [ ] Code Splitting (React).
  - [ ] Otimização de queries no backend Django.
  - [ ] Caching (frontend e backend).
  - [ ] Bundle Analysis.
  - [ ] Otimização de Imagens.
  - [ ] Indexação de Banco de Dados (PostgreSQL).

### 6.2. Segurança e Privacidade

- **Status**: 🔲 Pendente
- **Prioridade**: Alta (Contínua)
- **Tarefas**:
  - [ ] Revisão de segurança regular.
  - [ ] Content Security Policy (CSP).
  - [ ] Proteção contra vulnerabilidades comuns (XSS, CSRF, SQL Injection).
  - [ ] Gerenciamento de dependências e atualizações de segurança.
  - [ ] Controles de privacidade para dados do usuário, com ênfase na configuração e segurança do Remote Storage pelo usuário e na minimização de dados processados ou armazenados pelo backend.
  - [ ] (Se aplicável) Conformidade com GDPR/LGPD.

### 6.3. Testes e Qualidade

- **Status**: 🔲 Pendente
- **Prioridade**: Média (Contínua)
- **Tarefas**:
  - [ ] Aumentar cobertura de testes unitários (Frontend e Backend).
  - [ ] Implementar testes de integração.
  - [ ] (Opcional) Testes E2E.
  - [ ] Testes de performance.
  - [ ] Testes de acessibilidade.
  - [ ] CI/CD pipeline para automação de testes e deploy.

---

## 🤝 Como Contribuir

1. **Escolha uma tarefa** de uma fase apropriada (idealmente começando pelas fases iniciais ou conforme prioridade).
2. **Comunique sua intenção** para evitar duplicação de esforços.
3. **Marque o status da tarefa** conforme o progresso.
4. **Crie uma branch** específica para a feature/tarefa (ex: `feature/nome-da-feature` ou `fix/nome-do-bug`).
5. **Implemente** a funcionalidade seguindo as melhores práticas e a arquitetura definida.
6. **Escreva testes** para sua implementação.
7. **Teste** a funcionalidade exaustivamente.
8. **Atualize o status da tarefa** para "Concluído" (✅).
9. **Envie um Pull Request** para a branch principal (`main` ou `develop`), detalhando as mudanças.

---

**📅 Última Atualização**: 13 de junho de 2025
**👥 Contribuidores**: Equipe Cubari Proxy e Comunidade
