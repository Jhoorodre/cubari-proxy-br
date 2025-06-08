# Cubari Proxy

Uma aplicação web moderna e gratuita para leitura de mangás, criada para oferecer a melhor experiência de navegação possível. O Cubari Proxy conecta você às suas fontes favoritas de mangá através de uma interface limpa, rápida e intuitiva, completamente em português brasileiro.

## ✨ O que é o Cubari Proxy?

O Cubari Proxy é como um "navegador especial" para mangás que:
- **Reúne várias fontes** de mangá em um só lugar
- **Remove anúncios** e oferece uma experiência limpa
- **Funciona em qualquer dispositivo** - celular, tablet ou computador
- **Salva seu progresso** automaticamente na nuvem
- **É completamente gratuito** e sem propagandas

## 🌟 Principais Funcionalidades

### 📚 **Navegação Simples**
- **Descoberta**: Veja os mangás mais populares e novos lançamentos
- **Busca Inteligente**: Encontre qualquer mangá em segundos
- **Favoritos**: Salve seus mangás preferidos
- **Histórico**: Continue lendo de onde parou

### 🎨 **Interface Moderna**
- **Tema Escuro/Claro**: Escolha o que é mais confortável para você
- **Design Responsivo**: Funciona perfeitamente em qualquer tela
- **Carregamento Rápido**: Otimizado para economizar seus dados

### ☁️ **Backup na Nuvem (5apps)**
- **Sincronização Automática**: Seus favoritos e histórico salvos na nuvem
- **Acesso de Qualquer Lugar**: Continue lendo em qualquer dispositivo
- **Segurança Total**: Seus dados protegidos e privados
- **100% Gratuito**: Sem custos para o usuário

## 📖 Fontes de Mangá Disponíveis

### 🔥 **Fontes Ativas (Atualmente Disponíveis)**

- **Guya** - Plataforma especializada em mangás de alta qualidade
- **DankeFursLesen** - Versão alemã do Guya com conteúdo traduzido
- **MangaDex** - Uma das maiores plataformas de mangá do mundo
- **WeebCentral** - Fonte focada em mangás populares
- **MangaKatana** - Ampla variedade de títulos em inglês
- **AssortedScans** - Scanlations de alta qualidade

### 📚 **Fontes Especiais (Modo Adulto)**

> **Nota**: Para acessar conteúdo adulto, vá em Configurações e ative o "Modo Hentai"

- **NHentai** - Plataforma especializada em conteúdo adulto
- **MangaDex (Adulto)** - Versão com conteúdo pornográfico habilitado

### 🌍 **Idiomas Suportados**

Atualmente, a maioria das fontes está em **inglês**, mas estamos trabalhando para adicionar mais fontes em **português brasileiro** e outros idiomas.

## ☁️ Como Funciona o Backup na Nuvem (5apps)

### 🤔 **O que é o 5apps?**

O 5apps é um serviço **gratuito** que oferece armazenamento na nuvem seguindo o padrão **remoteStorage**. Pense nele como um "Google Drive" especialmente feito para aplicações web que respeitam sua privacidade.

### 🔐 **Por que é Seguro?**

- **Seus dados são seus**: Apenas você tem acesso aos seus favoritos e histórico
- **Criptografia**: Tudo é protegido durante a transmissão
- **Sem rastreamento**: O 5apps não monitora o que você lê
- **Código aberto**: Toda a tecnologia é transparente e auditável

### 📱 **Como Configurar (Passo a Passo)**

1. **Acesse as Configurações** no Cubari Proxy
2. **Clique em "Connect"** na seção "Armazenamento Remoto"
3. **Escolha "5apps"** como seu provedor
4. **Crie uma conta gratuita** no 5apps (se não tiver)
5. **Autorize a conexão** e pronto!

### ✨ **Benefícios do Backup**

- **Sincronização Automática**: Favoritos e histórico salvos automaticamente
- **Acesso Universal**: Continue lendo em qualquer dispositivo
- **Sem Perda de Dados**: Mesmo se limpar o navegador, seus dados estão seguros
- **Offline**: Funciona mesmo sem internet (dados ficam sincronizados quando voltar online)

## 💻 Para Desenvolvedores

### 🚀 **Tecnologias Utilizadas**

- **Frontend**: React 16.13.1 com TypeScript
- **Estilização**: Tailwind CSS e Headless UI
- **Internacionalização**: i18next para múltiplos idiomas
- **Deploy**: Vercel com funções serverless
- **Extensões**: Sistema baseado em Paperback Extensions

### 📁 **Estrutura do Projeto**

```
src/
├── components/          # Componentes reutilizáveis da UI
├── containers/          # Páginas principais da aplicação
├── sources/            # Sistema de fontes e proxy
├── locales/            # Traduções (português, inglês)
├── utils/              # Utilitários e helpers
└── style/              # Estilos globais CSS
```

## 🛠️ Instalação e Desenvolvimento

### **Pré-requisitos**
- Node.js 14+ instalado
- npm ou yarn

### **Instalação Rápida**

```bash
# Clone o repositório
git clone <repository-url>
cd cubari-proxy

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### **Scripts Disponíveis**

```bash
npm start              # Servidor local (http://localhost:3000)
vercel dev             # Servidor com proxy functions (recomendado)
npm run build          # Build de produção
npm test               # Executar testes
```

## 🌐 Deploy e Configuração

O projeto está otimizado para deploy automático no **Vercel**:

1. **Conecte** seu repositório ao Vercel
2. **Configure** as variáveis de ambiente (se necessário)
3. **Deploy** acontece automaticamente a cada push

### **Sistema de Proxy**

O Cubari Proxy usa um sistema inteligente para contornar limitações técnicas:

- **Proxy Próprio**: Function serverless em `/api/proxy`
- **CORS**: Headers configurados para acesso universal
- **Performance**: Cache e otimizações automáticas
- **Segurança**: Filtros de segurança integrados

## ❓ Dúvidas Frequentes

### **Como habilitar conteúdo adulto?**
1. Vá em **Configurações**
2. Ative o **"Modo Hentai"**
3. A página irá recarregar automaticamente
4. Novas fontes estarão disponíveis

### **Meus favoritos sumiram, o que fazer?**
- Configure o **backup na nuvem** para evitar perda de dados
- Verifique se está logado no mesmo provedor (5apps)
- Limpar cache do navegador pode causar perda de dados locais

### **O site não está carregando mangás**
- Verifique sua conexão com a internet
- Algumas fontes podem estar temporariamente indisponíveis
- Tente uma fonte diferente

### **Como contribuir com o projeto?**
1. Faça um **Fork** do repositório
2. Crie uma **branch** para sua funcionalidade
3. Faça suas mudanças e **commit**
4. Envie um **Pull Request**
5. Aguarde a revisão da equipe

## 🤝 Comunidade e Suporte

### **Precisa de Ajuda?**
- **Chat de Feedback**: Use o ícone de chat no site
- **Discord**: [Entre em nossa comunidade](https://discord.gg/wwD2xTbQxe)
- **GitHub Issues**: Reporte bugs e problemas técnicos

### **Projetos Relacionados**
- [**Cubari.moe**](https://cubari.moe/) - Projeto original e inspiração
- [**Paperback**](https://paperback.moe/) - App oficial para iOS
- [**5apps**](https://5apps.com/) - Serviço de armazenamento na nuvem

## 📱 Dicas de Uso

### **Melhor Experiência**
- **Configure o backup** para não perder seus dados
- **Use tema escuro** para leitura noturna
- **Adicione aos favoritos** do navegador para acesso rápido
- **Ative o modo adulto** se necessário (apenas para maiores de idade)

### **Economizar Dados**
- O site é otimizado para usar poucos dados móveis
- Imagens são comprimidas automaticamente
- Cache inteligente reduz downloads repetidos

## 🔧 Notas Técnicas

### **Para Desenvolvedores**

```javascript
// Para habilitar conteúdo adulto localmente durante desenvolvimento
localStorage.setItem("hentai", true);
```

### **Problemas Comuns**
- **Erro de dependências**: Use `npm install --legacy-peer-deps`
- **WebSocket bloqueado**: Extensões do navegador podem interferir
- **Build falha**: Verifique versões do Node.js (recomendado 14+)

---

## 📄 Licença e Avisos

Este projeto é **independente** e **distinto** do cubari.moe principal. Desenvolvido com foco em fontes de qualidade e experiência do usuário.

**⚠️ Importante**: Este projeto não hospeda nem distribui conteúdo protegido por direitos autorais. Funciona apenas como uma interface para fontes já disponíveis publicamente na internet.

---

**🎯 Missão**: Oferecer a melhor experiência de leitura de mangás em português brasileiro, de forma gratuita e acessível para todos.
