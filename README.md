# NexoTI — Helpdesk Front

Interface web para abertura e acompanhamento de chamados de suporte. O projeto consome a API Laravel do helpdesk e foi pensado para ser simples tanto para solicitantes quanto para a equipe de TI.

## Funcionalidades

- Listagem, busca e filtro de chamados
- Abertura de chamado com categoria e prioridade
- Detalhes, comentários e histórico do atendimento
- Ações para assumir, finalizar e cancelar chamados
- Listagem, criação, edição e remoção de categorias
- Estados de carregamento, erro e lista vazia
- Layout responsivo para computador e celular

## Tecnologias

React 19, Vite, JavaScript, Tailwind CSS e Fetch API.

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e ajuste a URL da API, se necessário.

3. Inicie o projeto:

   ```bash
   npm run dev
   ```

Por padrão, o front utiliza `http://127.0.0.1:8000/api`.

## Comandos

```bash
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção
npm run lint     # análise do código
npm run preview  # visualização do build
```

## API esperada

O back-end precisa disponibilizar os endpoints REST descritos em [`docs/levantamento-front.md`](docs/levantamento-front.md), incluindo `/chamados`, `/categorias` e as ações específicas de chamados.

Uma explicação simples das funcionalidades, fluxos e comunicação entre as partes está disponível em [`docs/guia-do-front-end.md`](docs/guia-do-front-end.md).
