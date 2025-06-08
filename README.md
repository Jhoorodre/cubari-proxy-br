# Cubari Proxy

Uma aplicação web moderna para navegação de mangás, alimentada pelas extensões do Paperback e relacionada ao projeto [cubari.moe](https://cubari.moe/). Este projeto evolui independentemente do site principal, focando em fontes com leitores decentes e sem anúncios excessivos.

## 🌟 Características

- **Interface Moderna**: Interface construída com React e Tailwind CSS
- **Navegação Intuitiva**: Sistema de descoberta, histórico, favoritos e pesquisa
- **Tema Escuro/Claro**: Suporte completo para preferências de tema
- **Fontes Múltiplas**: Integração com extensões do Paperback para diversas fontes de mangá
- **Proxy CORS**: Sistema próprio de proxy para contornar limitações CORS
- **Responsivo**: Totalmente otimizado para dispositivos móveis e desktop

## 🚀 Tecnologias

- **Frontend**: React 16.13.1, TypeScript
- **Estilização**: Tailwind CSS, Headless UI
- **Internacionalização**: i18next, react-i18next
- **Roteamento**: React Router DOM
- **Build**: Create React App
- **Deploy**: Vercel
- **Parsing**: Cheerio para manipulação de HTML
- **Extensões**: Paperback Extensions Framework

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis da UI
├── containers/          # Páginas principais da aplicação
├── sources/            # Sistema de fontes e proxy
├── style/              # Estilos globais
└── utils/              # Utilitários e helpers
```

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 14+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd cubari-proxy

# Instale as dependências
# Nota: Se encontrar erros de resolução de peer dependency (ERESOLVE),
# a configuração "overrides" no package.json deve ajudar.
# Como alternativa, você pode tentar: npm install --legacy-peer-deps
npm install

# Inicie o servidor de desenvolvimento
# Para testar funcionalidades que dependem de Vercel Functions (como o proxy),
# use o Vercel CLI:
vercel dev
# Ou para o servidor de desenvolvimento padrão do React:
npm start
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia servidor local padrão do React em http://localhost:3000
vercel dev             # Inicia servidor local com Vercel CLI (recomendado para testar proxy)

# Build
npm run build          # Build de produção
npm run winBuild       # Build para Windows

# Testes
npm test               # Executa testes
```

## 🌐 Deploy

O projeto está configurado para deploy automático no Vercel:

1. **Automático**: Conecte o repositório ao Vercel
2. **Manual**: Use `npx vercel --prod`

### Configurações do Vercel

O arquivo `vercel.json` inclui:
- Reescritas para SPA
- Headers CORS configurados
- Content Security Policy (CSP) otimizada.
  - A CSP foi ajustada para incluir `ws://localhost:*` e `wss://localhost:*` na diretiva `connect-src` para permitir o funcionamento correto do WebSocket do `webpack-dev-server` (usado pelo `react-scripts` e `vercel dev`) durante o desenvolvimento local, especialmente no Firefox.
  - Adicionalmente, foram incluídos `http://5apps.com`, `https://5apps.com`, e `https://storage.5apps.com` na diretiva `connect-src` para garantir a funcionalidade de remote storage com provedores como o 5apps.

## 🔧 Configuração

### Variáveis de Ambiente
```bash
GENERATE_SOURCEMAP=false  # Desabilita source maps em produção
```

### Recursos Principais

#### Proxy System

O sistema de proxy é crucial para acessar e exibir imagens de capítulos de diversas fontes, contornando restrições de CORS (Cross-Origin Resource Sharing). Ele opera da seguinte forma:

- **Proxy Auto-hospedado (`/api/proxy`)**:
  - A maioria das requisições de imagens e dados de capítulos é roteada através de uma Vercel Function localizada em `/api/proxy`.
  - Esta função atua como um intermediário, buscando o conteúdo da fonte original e repassando-o para o cliente.
  - Isso resolve problemas de CORS e permite um controle mais granular sobre os cabeçalhos das requisições, como a filtragem de headers problemáticos que poderiam causar erros (ex: `431 Request Header Fields Too Large`).
- **Serviços Externos (Legado/Fallback)**:
  - `https://services.f-ck.me`: Anteriormente utilizado como URL base para algumas requisições de proxy. Embora o sistema atual priorize o proxy auto-hospedado, referências a este serviço podem existir em partes mais antigas do código ou em extensões específicas.
  - `https://resizer.f-ck.me`: Serviço utilizado para redimensionamento de imagens. Algumas fontes podem ainda depender deste serviço para otimizar a entrega de imagens.
- **CDN para Extensões**:
  - As extensões do Paperback são carregadas via JSDelivr CDN, garantindo entrega rápida e eficiente dos scripts das fontes.

Essa abordagem híbrida garante flexibilidade e robustez, permitindo que o aplicativo acesse uma ampla gama de conteúdos enquanto gerencia ativamente os desafios de proxy.

#### Fontes Suportadas

Integração com extensões do Paperback para múltiplas fontes de mangá.

## 💡 Solução de Problemas Comuns

- **Erro `ERESOLVE` durante `npm install`**:
  Este projeto utiliza a seção `overrides` no `package.json` para forçar versões específicas de dependências e resolver conflitos, como os relacionados ao `typescript`. Se ainda encontrar problemas, certifique-se de que seu `package-lock.json` está atualizado após executar `npm install`. O comando `npm install --legacy-peer-deps` pode ser uma alternativa em alguns casos, mas `overrides` é a abordagem preferida.

- **Bloqueio de WebSocket no Firefox (NS_ERROR_CONTENT_BLOCKED)**:
  Se o Firefox bloquear conexões WebSocket para `localhost` durante o desenvolvimento com `vercel dev` ou `npm start`, verifique se a Content Security Policy no `vercel.json` (diretiva `connect-src`) permite `ws://localhost:*` e `wss://localhost:*`. As configurações atuais já incluem isso. Extensões do navegador também podem causar este problema.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Notas de Desenvolvimento

```javascript
// Para habilitar conteúdo adulto localmente
localStorage.setItem("hentai", true);
```

## 🔗 Links Relacionados

- [Cubari.moe](https://cubari.moe/) - Projeto principal
- [Paperback](https://paperback.moe/) - App para iOS
- [Discord](https://discord.gg/wwD2xTbQxe) - Comunidade

## 📄 Licença

Este projeto é independente do cubari.moe principal e deve ser considerado como um projeto distinto.

---

**Nota**: Este projeto evolui independentemente do site principal cubari.moe e foca em fontes com boa experiência de leitura.
