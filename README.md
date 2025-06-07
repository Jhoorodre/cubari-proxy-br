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
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia servidor local em http://localhost:3000

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
- Content Security Policy otimizada

## 🔧 Configuração

### Variáveis de Ambiente
```bash
GENERATE_SOURCEMAP=false  # Desabilita source maps em produção
```

### Recursos Principais

#### Proxy System
- **URL Base**: `https://services.f-ck.me`
- **Redimensionamento**: `https://resizer.f-ck.me`
- **CDN**: JSDelivr para extensões

#### Fontes Suportadas
Integração com extensões do Paperback para múltiplas fontes de mangá.

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
