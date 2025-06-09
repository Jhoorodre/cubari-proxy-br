# 🗺️ Roadmap de Melhorias - Cubari Proxy

Um guia detalhado com todas as melhorias planejadas para o projeto. Cada item pode ser implementado independentemente e inclui instruções detalhadas.

---

## 🎯 Prioridade Alta

### ☁️ **Melhoria da Integração com Remote Storage (5apps)**

**Status**: 🔲 Não Implementado  
**Prioridade**: Alta  
**Tempo Estimado**: 2-3 dias  

#### **Objetivo**
Melhorar drasticamente a experiência do usuário com o sistema de backup na nuvem, tornando-o mais intuitivo e acessível para leigos.

#### **Tarefas Específicas**

- [ ] **Botão Flutuante de Ajuda**
  - Criar componente `RemoteStorageHelp.js`
  - Posicionar botão flutuante fixo na tela
  - Adicionar ícone de interrogação ou "?"
  - Implementar modal explicativo passo-a-passo

- [ ] **Modal de Tutorial**
  - Criar tutorial interativo em etapas
  - Incluir screenshots do processo
  - Adicionar botões "Anterior/Próximo"
  - Explicar benefícios do backup

- [ ] **Melhorar Página de Configurações**
  - Reorganizar seção de Remote Storage
  - Adicionar explicações mais claras
  - Incluir indicadores de status de conexão
  - Mostrar espaço usado/disponível

#### **Arquivos a Modificar**
```
src/components/RemoteStorageHelp.js (criar)
src/containers/Settings.js (modificar)
src/style/index.css (adicionar estilos)
src/locales/ptBR/translation.json (adicionar traduções)
```

#### **Implementação Detalhada**

1. **Criar Componente de Ajuda**
```javascript
// src/components/RemoteStorageHelp.js
import React, { useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';

const RemoteStorageHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Implementar modal com steps explicativos
};
```

2. **Adicionar CSS para Botão Flutuante**
```css
.remote-storage-help-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

---

### 🇧🇷 **Migração para Extensões em Português Brasileiro**

**Status**: 🔲 Não Implementado  
**Prioridade**: Alta  
**Tempo Estimado**: 1-2 semanas  

#### **Objetivo**
Substituir todas as extensões atuais por versões em português brasileiro e configurar extensões multi-idioma para PT-BR.

#### **Tarefas Específicas**

- [ ] **Pesquisar Extensões BR**
  - Mapear extensões Paperback com suporte a PT-BR
  - Verificar qualidade e disponibilidade
  - Criar lista de prioridades

- [ ] **Substituir Fontes Principais**
  - Union Mangás (BR)
  - Manga Livre (BR)
  - Ler Mangá (BR)
  - Central de Mangás (BR)
  - Mangá Online (BR)

- [ ] **Configurar Multi-idioma**
  - MangaDex configurado para PT-BR
  - Outras fontes com suporte a múltiplos idiomas

#### **Arquivos a Modificar**
```
src/sources/Sources.ts (modificar completamente)
src/sources/SourceUtils.ts (ajustar configurações)
src/locales/ptBR/translation.json (adicionar novos nomes)
```

#### **Implementação Detalhada**

1. **Novo Mapeamento de Fontes**
```typescript
// src/sources/Sources.ts
const brazilianSourceMap: RawSourceMap = {
  UnionMangas: {
    user: "paperback-community",
    repo: "extensions",
    commit: "latest",
    filePath: "src/UnionMangas",
    state: { language: "pt-br" },
    slugMapper: (slug) => `https://unionmangas.top/manga/${slug}/`
  },
  MangaLivre: {
    // Configuração similar
  }
  // ... outras fontes brasileiras
};
```

---

### 📱 **Interface Mobile Aprimorada**

**Status**: 🔲 Não Implementado  
**Prioridade**: Média  
**Tempo Estimado**: 1 semana  

#### **Objetivo**
Melhorar a experiência em dispositivos móveis com gestos, navegação otimizada e layout específico.

#### **Tarefas Específicas**

- [ ] **Gestos de Navegação**
  - Swipe horizontal nos carrosséis
  - Pull-to-refresh nas listas
  - Tap duplo para favoritar

- [ ] **Layout Mobile**
  - Cards maiores em telas pequenas
  - Navegação bottom sheet
  - Botões de ação maiores

- [ ] **Performance Mobile**
  - Lazy loading mais agressivo
  - Imagens otimizadas para mobile
  - Cache local aprimorado

---

## 🚀 Prioridade Média

### 🔍 **Sistema de Busca Avançada**

**Status**: 🔲 Não Implementado  
**Prioridade**: Média  
**Tempo Estimado**: 1 semana  

#### **Objetivo**
Implementar filtros avançados, busca por gênero, ano, status e outras categorias.

#### **Tarefas Específicas**

- [ ] **Filtros de Busca**
  - Gêneros (Ação, Romance, Comédia, etc.)
  - Status (Completo, Em andamento, Hiato)
  - Ano de publicação
  - Classificação etária

- [ ] **Busca Inteligente**
  - Sugestões automáticas
  - Correção de ortografia
  - Busca fonética para nomes japoneses

- [ ] **Histórico de Busca**
  - Salvar buscas recentes
  - Sugestões baseadas no histórico
  - Buscas favoritas

---

### 📊 **Sistema de Estatísticas**

**Status**: 🔲 Não Implementado  
**Prioridade**: Média  
**Tempo Estimado**: 4-5 dias  

#### **Objetivo**
Mostrar estatísticas de leitura para o usuário, como mangás lidos, tempo gasto, gêneros favoritos.

#### **Tarefas Específicas**

- [ ] **Dashboard Pessoal**
  - Total de mangás lidos
  - Tempo total de leitura estimado
  - Gêneros mais lidos
  - Fontes mais utilizadas

- [ ] **Gráficos e Visualizações**
  - Gráfico de barras para gêneros
  - Timeline de leitura
  - Heatmap de atividade

- [ ] **Metas e Conquistas**
  - Sistema de badges
  - Metas mensais de leitura
  - Streaks de leitura diária

---

### 🌙 **Modo de Leitura Noturna**

**Status**: 🔲 Não Implementado  
**Prioridade**: Média  
**Tempo Estimado**: 2-3 dias  

#### **Objetivo**
Implementar modo de leitura específico com configurações de brilho, contraste e filtros.

#### **Tarefas Específicas**

- [ ] **Configurações de Display**
  - Controle de brilho da tela
  - Filtro azul automático
  - Temas de alto contraste

- [ ] **Programação Automática**
  - Ativação baseada no horário
  - Detecção automática de ambiente
  - Sincronização com configurações do sistema

---

## 🎨 Prioridade Baixa

### 🎵 **Sistema de Notificações**

**Status**: 🔲 Não Implementado  
**Prioridade**: Baixa  
**Tempo Estimado**: 1 semana  

#### **Objetivo**
Implementar notificações para novos capítulos de mangás favoritos.

#### **Tarefas Específicas**

- [ ] **Web Push Notifications**
  - Solicitar permissão do usuário
  - Configurar service worker
  - Sistema de subscrição

- [ ] **Monitoramento de Atualizações**
  - Verificar novos capítulos periodicamente
  - Cache de últimas verificações
  - Sistema de prioridades

---

### 🔧 **Sistema de Plugins**

**Status**: 🔲 Não Implementado  
**Prioridade**: Baixa  
**Tempo Estimado**: 2-3 semanas  

#### **Objetivo**
Permitir que usuários adicionem suas próprias extensões e customizações.

#### **Tarefas Específicas**

- [ ] **API de Plugins**
  - Sistema de hooks
  - Sandboxing de código
  - Validação de segurança

- [ ] **Marketplace de Plugins**
  - Interface para instalar plugins
  - Sistema de avaliações
  - Atualizações automáticas

---

### 📚 **Sistema de Listas Personalizadas**

**Status**: 🔲 Não Implementado  
**Prioridade**: Baixa  
**Tempo Estimado**: 1 semana  

#### **Objetivo**
Permitir que usuários criem listas personalizadas além de favoritos.

#### **Tarefas Específicas**

- [ ] **Criação de Listas**
  - Interface para criar/editar listas
  - Categorização por tags
  - Listas públicas/privadas

- [ ] **Compartilhamento**
  - URLs para compartilhar listas
  - Exportação em formatos padrão
  - Importação de outras plataformas

---

## 🔄 Melhorias Técnicas

### ⚡ **Otimização de Performance**

**Status**: 🔲 Não Implementado  
**Prioridade**: Média  
**Tempo Estimado**: 1 semana  

- [ ] **Code Splitting**
- [ ] **Service Worker**
- [ ] **Bundle Analysis**
- [ ] **Image Optimization**
- [ ] **Database Indexing**

### 🛡️ **Segurança e Privacidade**

**Status**: 🔲 Não Implementado  
**Prioridade**: Alta  
**Tempo Estimado**: 4-5 dias  

- [ ] **Content Security Policy**
- [ ] **Data Encryption**
- [ ] **Privacy Controls**
- [ ] **GDPR Compliance**

### 🧪 **Testes e Qualidade**

**Status**: 🔲 Não Implementado  
**Prioridade**: Média  
**Tempo Estimado**: 1-2 semanas  

- [ ] **Unit Tests**
- [ ] **Integration Tests**
- [ ] **E2E Tests**
- [ ] **Performance Tests**
- [ ] **Accessibility Tests**

---

## 📋 Como Contribuir

1. **Escolha uma tarefa** da lista acima
2. **Marque como "Em Progresso"** (🔄)
3. **Crie uma branch** específica para a feature
4. **Implemente** seguindo as instruções detalhadas
5. **Teste** a funcionalidade
6. **Marque como "Concluído"** (✅)
7. **Envie um Pull Request**

---

## 📈 Status Legend

- 🔲 **Não Implementado** - Aguardando desenvolvimento
- 🔄 **Em Progresso** - Sendo desenvolvido atualmente
- ✅ **Concluído** - Implementado e testado
- ⚠️ **Bloqueado** - Dependências não resolvidas
- 🚫 **Cancelado** - Não será implementado

---

**📅 Última Atualização**: Junho 2025  
**👥 Contribuidores**: Aguardando voluntários!
