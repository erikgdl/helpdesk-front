# NexoTI — Helpdesk Front

Interface web responsiva para abertura, acompanhamento e atendimento de chamados de suporte. A aplicação consome a API Laravel do NexoTI e oferece experiências específicas para solicitantes, técnicos e administradores.

## Funcionalidades

- Login separado entre o portal do solicitante e o acesso da equipe técnica
- Sessão autenticada por token e encerramento automático em respostas não autorizadas
- Painel de chamados com indicadores, busca por título ou número e filtro por status
- Abertura de chamados com categoria, prioridade e descrição
- Página de detalhes com conversa, histórico e informações do atendimento
- Fluxos de assumir, finalizar, cancelar e remover chamados conforme o perfil
- Gestão de categorias com criação, edição e exclusão
- Estados de carregamento, erro, tentativa novamente e listas vazias
- Layout responsivo para desktop e dispositivos móveis

## Perfis de acesso

| Perfil | Permissões principais |
| --- | --- |
| Solicitante | Abrir e acompanhar chamados e enviar mensagens |
| Técnico | Visualizar chamados, assumir atendimentos e finalizar os próprios atendimentos |
| Administrador | Visualizar chamados, cancelar atendimentos e gerenciar categorias |

## Tecnologias

- React 19
- Vite 8
- Tailwind CSS 4
- JavaScript
- Fetch API

## Pré-requisitos

- Node.js compatível com o Vite 8
- npm
- API do NexoTI em execução

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo de ambiente a partir do exemplo:

   ```bash
   cp .env.example .env
   ```

3. Se necessário, altere a URL da API em `.env`:

   ```env
   VITE_API_URL=http://127.0.0.1:8000/api
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

## Comandos disponíveis

```bash
npm run dev      # inicia o ambiente de desenvolvimento
npm run build    # gera o build de produção
npm run lint     # executa a análise estática do código
npm run preview  # visualiza localmente o build gerado
```

## Integração com a API

A aplicação espera uma API REST com autenticação Bearer e rotas para login, logout, chamados, comentários, ações de atendimento e categorias. Por padrão, as requisições são enviadas para `http://127.0.0.1:8000/api`; esse endereço pode ser substituído pela variável `VITE_API_URL`.
