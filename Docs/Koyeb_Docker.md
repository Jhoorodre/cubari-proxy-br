# PARTE A (Revisada): Deploy do Suwayomi-Server na Koyeb (Simples e Detalhado)

**Objetivo:** Colocar o seu servidor de mangás Suwayomi-Server para funcionar online usando uma imagem Docker pronta, para que você possa acessá-lo de qualquer lugar através de uma URL pública.

**O que você vai precisar (Pré-requisitos):**
*   Uma conta no site da [Koyeb](https://www.koyeb.com/).
    *   *Dica:* Se você tem uma conta no GitHub, pode usá-la para se inscrever ou fazer login na Koyeb. Facilita as coisas!

---

Vamos começar! Siga estes passos com atenção:

## Passo 1: Criar ou Acessar sua Conta na Koyeb

1.  Abra seu navegador de internet e vá para [https://www.koyeb.com/](https://www.koyeb.com/).
2.  Se você já tem uma conta, faça login.
3.  Se não tem, clique para se inscrever ("Sign Up"). Como sugerido, usar sua conta do GitHub é uma boa opção.

## Passo 2: Iniciar a Criação do seu Serviço na Koyeb

1.  Após fazer login, você estará no painel principal da Koyeb (dashboard).
2.  Procure e clique no botão **"Create Service"** (Criar Serviço).
3.  A Koyeb vai perguntar como você quer implantar seu serviço. Escolha a opção **"Docker Image"** (Imagem Docker).

## Passo 3: Configurar a Imagem Docker

Nesta etapa, você vai dizer à Koyeb qual imagem Docker usar.

1.  No campo chamado **"Docker Image"** (ou similar), você deve digitar ou colar o seguinte nome de imagem:
    ```
    ghcr.io/suwayomi/suwayomi-server:stable
    ```
    *   *O que é isso?* É o endereço da imagem Docker oficial e pronta do Suwayomi-Server, que já contém tudo o que o servidor precisa para rodar. A parte `:stable` significa que você usará a versão estável mais recente.
2.  **Image Tag** (Tag da Imagem): A Koyeb geralmente preenche a tag `:stable` automaticamente depois que você insere o nome da imagem. Se não preencher, digite `stable` no campo apropriado para a tag.

## Passo 4: Configurar os Detalhes do Serviço

Agora, vamos ajustar algumas configurações importantes para o seu servidor.

1.  **Ports** (Portas): Esta configuração diz à Koyeb como o mundo exterior acessa seu servidor e como ele se comunica com a aplicação dentro do contêiner.
    *   Procure a seção "Exposed ports" ou "Configure ports".
    *   **Port** (Porta de acesso público): Configure como `80`.
    *   **Protocol** (Protocolo): Selecione `HTTP`.
    *   **Path** (Caminho): Deixe como `/` (uma barra).
    *   **Target** (Porta interna da aplicação / Porta de Destino): Configure como `4567`.
        *   *Explicação:* Seu Suwayomi-Server dentro do Docker "escuta" na porta `4567`. A Koyeb vai direcionar o tráfego da porta pública (`80`, que será automaticamente gerenciada para HTTPS pela Koyeb) para esta porta interna `4567`.
    *   Marque a opção **"Public"** ou o ícone de cadeado ao lado da porta `80` para garantir que a Koyeb gerencie o SSL/HTTPS para você, tornando o acesso seguro.

2.  **Health Checks** (Verificações de Saúde):
    *   É importante que a Koyeb possa verificar se sua aplicação está rodando corretamente.
    *   Configure o "TCP health check" (Verificação de saúde TCP) para a porta `4567` (a mesma porta `Target` que sua aplicação usa).

3.  **Service Name** (Nome do Serviço): Dê um nome fácil de lembrar para o seu serviço.
    *   Exemplo: `meu-suwayomi-server` ou `servidor-mangas-pessoal`.
    *   Este nome fará parte da sua URL pública.

4.  **Region** (Região): Escolha a região do servidor que está geograficamente mais perto de você ou dos seus usuários (ex: Washington, D.C., Frankfurt). Isso pode ajudar a ter uma conexão mais rápida.

5.  **Instance Size** (Tamanho da Instância):
    *   Para começar e para uso pessoal, o plano **"Free"** (Gratuito) da Koyeb (ex: 0.1 vCPU, 512MB RAM, 2GB Disk) é uma opção.
    *   **ATENÇÃO:** Conforme veremos no próximo passo, o plano gratuito tem limitações importantes regardingo a persistência de dados.

## Passo 5: Configurar o Armazenamento Persistente com Volumes (LEIA COM MUITA ATENÇÃO!)

Este passo é **CRUCIAL** para a persistência dos dados do seu Suwayomi-Server (biblioteca, configurações, etc.). A Koyeb oferece "Volumes" para isso, mas existem **limitações importantes**, especialmente porque o recurso está em **Public Preview**.

**O que são Volumes na Koyeb?**
Volumes são dispositivos de armazenamento em bloco que fornecem armazenamento persistente entre deployments. Diferente do armazenamento local temporário das instâncias, os dados em volumes podem ser reanexados a novos deployments, salvando suas configurações e dados.

**⚠️ ALERTA IMPORTANTE: Volumes em Public Preview e Suas Implicações ⚠️**
*   **Status:** Os Volumes da Koyeb estão atualmente em **Public Preview**.
*   **Recomendação de Uso:** São adequados **apenas para testes** no momento.
*   **BACKUP OBRIGATÓRIO:** **FAÇA BACKUP DE TODOS OS DADOS QUE VOCÊ NÃO PODE PERDER AO USAR VOLUMES.** A Koyeb adverte que, por serem locais e vinculados a uma única máquina, os volumes podem falhar. Não há redundância automática, e a tolerância a falhas (incluindo o uso de Snapshots para minimizar perdas) é de sua responsabilidade.
*   **Downtime:** Serviços com volumes anexados podem experienciar downtime durante o processo de redeployment, enquanto o volume é desanexado da versão antiga e anexado à nova.

**Condições e Limitações para Usar Volumes na Koyeb:**

1.  **Tipo de Instância (MUITO IMPORTANTE):**
    *   Volumes **SÓ PODEM** ser anexados a instâncias do tipo **"Standard"** ou **"GPU"**.
    *   **NÃO SÃO SUPORTADOS** em instâncias "Free" (Gratuitas) nem em instâncias "eco-*" (como "eNano", "eMicro").
    *   Isso significa que para usar volumes e ter persistência de dados, você **PRECISARÁ OBRIGATORIAMENTE DE UM PLANO PAGO** que ofereça instâncias "Standard" ou "GPU".

2.  **Região do Serviço e do Volume:**
    *   Volumes estão atualmente disponíveis **apenas nas regiões Washington, D.C. (was) e Frankfurt (fra)**.
    *   Seu serviço e o volume que você criar devem estar na mesma dessas regiões.

3.  **Tamanho do Volume:**
    *   O tamanho de um volume deve ser entre **1 GB e 10 GB**.

4.  **Escala do Serviço:**
    *   Volumes atualmente só funcionam com Serviços configurados para rodar com **uma única instância** (scale of one).

5.  **Mobilidade do Volume:**
    *   Uma vez que um volume é anexado a um Serviço, ele **não pode ser desanexado ou movido** para outro Serviço, a menos que o Serviço original seja excluído. Para mover dados, você precisará usar Snapshots para copiar os dados e criar um novo volume a partir da cópia.

**Como Configurar um Volume (Assumindo que Você Escolheu um Plano e Região Compatíveis):**

Se você optou por uma instância "Standard" ou "GPU" em Washington D.C. ou Frankfurt:

1.  Na página de configuração do seu Serviço na Koyeb, procure pela seção **"Volumes"**.
    *   Alternativamente, você pode criar um volume primeiro através do painel de controle da Koyeb: clique em "Volumes" no menu lateral e depois em "Create volume".
2.  Ao configurar seu serviço ou editá-lo, clique para **"Add Volume"** (Adicionar Volume) ou selecione um volume existente que você já criou.
3.  Configure os detalhes do volume:
    *   **Name** (Nome do Volume): Dê um nome descritivo (ex: `data-suwayomi-server`).
    *   **Size** (Tamanho): Escolha um tamanho entre 1GB e 10GB.
    *   **Region** (Região): Certifique-se que é a mesma do seu serviço (Washington D.C. ou Frankfurt).
4.  Configure o **Path in container** (Caminho de montagem dentro do contêiner):
    *   Digite exatamente:
        ```
        /home/suwayomi/.local/share/Tachidesk
        ```
    *   *Explicação:* Este é o diretório padrão onde o Suwayomi-Server (na imagem Docker `ghcr.io/suwayomi/suwayomi-server:stable`) armazena todos os seus dados (configurações, banco de dados da biblioteca, etc.). Ao mapear este caminho para um volume persistente, seus dados sobreviverão a reinicializações e redeployments.

**E se eu usar o Plano Gratuito ("Free") ou Planos "Eco" (eNano, eMicro)?**
*   Como mencionado, esses planos **NÃO SUPORTAM VOLUMES**.
*   Qualquer dado do Suwayomi-Server armazenado dentro do contêiner (biblioteca, configurações) **SERÁ PERDIDO** se o serviço for reiniciado, atualizado, ou entrar em modo de espera por inatividade.
*   Esses planos são adequados apenas para testes rápidos onde a perda de dados não é um problema.

## Passo 6: Iniciar o Deploy (Colocar no Ar!)

1.  Revise todas as configurações que você fez (tipo de instância, portas, nome, região e, se aplicável, configuração de volume para planos pagos).
2.  Clique no botão **"Deploy"** (Implantar) ou **"Create Service"** (Criar Serviço).
3.  A Koyeb vai começar o trabalho: ela vai baixar a imagem Docker que você especificou e iniciar seu serviço Suwayomi-Server.
    *   Você poderá acompanhar o progresso e ver os logs (registros do que está acontecendo) no painel da Koyeb. Isso pode levar alguns minutos.

## Passo 7: Obter e Salvar sua URL Pública

1.  Quando o deploy terminar e o serviço estiver rodando com sucesso, a Koyeb mostrará uma **URL pública**.
    *   Ela geralmente tem um formato como: `https://<nome-do-seu-servico>.<nome-da-sua-organizacao-koyeb>.koyeb.app`
    *   Exemplo: `https://meu-suwayomi-server.minha-conta.koyeb.app`
2.  **Copie esta URL e guarde-a em um lugar seguro!**
    *   Você vai precisar dela na **Parte B** do guia para configurar seu aplicativo leitor.

---

Parabéns! Se tudo correu bem (e você está ciente das implicações de persistência de dados do plano escolhido), seu Suwayomi-Server está agora online e acessível através da URL pública que você acabou de salvar.