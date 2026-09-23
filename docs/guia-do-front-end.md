# Guia do Front-end — NexoTI Helpdesk

Este documento apresenta, de forma simples, o que foi implementado no front-end e como as partes do sistema se comunicam.

## 1. Visão geral

O NexoTI é a interface usada para abrir, acompanhar e atender chamados de suporte.

Existem dois públicos principais:

- **Solicitante:** abre um chamado, acompanha o andamento e envia mensagens.
- **Equipe de TI:** assume o atendimento, conversa com o solicitante e finaliza ou cancela o chamado.

O React cuida da interface. A API Laravel continua responsável pelos dados e pelas regras de negócio.

```text
Usuário
   ↓
Interface React
   ↓
Services do front-end
   ↓
API Laravel
   ↓
Banco de dados
```

## 2. Funcionalidades implementadas

### Chamados

- Listagem de todos os chamados.
- Busca pelo título ou número do chamado.
- Filtro por status.
- Indicadores com total, chamados ativos e chamados urgentes.
- Abertura de um novo chamado.
- Visualização dos detalhes do chamado.
- Exibição de status e prioridade com cores diferentes.
- Exibição de categoria, solicitante, técnico e datas.
- Tratamento de carregamento, erro e lista vazia.

### Atendimento

- Técnico pode assumir um chamado aberto.
- Solicitante ou técnico pode adicionar mensagens.
- Técnico pode marcar um chamado em atendimento como resolvido.
- Chamado ainda não finalizado pode ser cancelado.
- Histórico do chamado é apresentado em ordem visual.

### Categorias

- Listagem de categorias.
- Criação de categoria.
- Edição de categoria.
- Remoção de categoria com confirmação.

### Interface

- Menu lateral em telas grandes.
- Menu compacto em celulares.
- Formulário de chamado aberto em uma janela sobre a página.
- Textos pensados para pessoas que não trabalham com TI.
- Componentes reutilizáveis para botões, campos, cards, badges e mensagens de estado.

## 3. Fluxo simples para o solicitante

### Abrir um chamado

```text
1. Usuário acessa “Chamados”
2. Clica em “Novo chamado”
3. Informa o problema e seus detalhes
4. Escolhe impacto e categoria
5. Informa seu código de usuário
6. Clica em “Abrir chamado”
7. O front envia os dados para a API
8. A lista é atualizada
```

Dados enviados:

```json
{
  "titulo": "Não consigo acessar o e-mail",
  "descricao": "O acesso parou de funcionar hoje pela manhã.",
  "prioridade": "alta",
  "usuario_id": 1,
  "categoria_id": 2
}
```

### Acompanhar e conversar

```text
1. Usuário busca o chamado pelo título ou número
2. Abre o chamado
3. Consulta status, responsável e histórico
4. Escreve uma mensagem na área “Conversa”
5. O front envia a mensagem para a API
6. Os detalhes são atualizados
```

## 4. Fluxo simples para a equipe de TI

```text
1. Técnico abre um chamado com status “Aberto”
2. Informa seu código de técnico
3. Clica em “Assumir atendimento”
4. O status passa para “Em atendimento”
5. Técnico conversa com o solicitante pela área de mensagens
6. Ao resolver o problema, clica em “Marcar como resolvido”
7. A API finaliza o chamado e registra a ação no histórico
```

Se o chamado não precisar continuar, ele pode ser cancelado após uma confirmação.

## 5. Como as partes do front-end se comunicam

### Fluxo de leitura

Exemplo ao abrir a lista de chamados:

```text
ChamadosPage.jsx
   ↓ chama
listarChamados()
   ↓ definido em
services/chamadoService.js
   ↓ faz
GET /api/chamados
   ↓ retorna dados para
ChamadosPage.jsx
   ↓ renderiza
Cards, badges, busca e filtros
```

### Fluxo de alteração

Exemplo ao assumir um chamado:

```text
Usuário clica em “Assumir atendimento”
   ↓
ChamadoDetalhesPage.jsx chama assumirChamado()
   ↓
chamadoService.js envia POST /api/chamados/{id}/assumir
   ↓
API valida e altera o chamado
   ↓
Página busca novamente os dados
   ↓
Interface mostra o novo status
```

As páginas não montam URLs diretamente. Elas chamam funções dos services, mantendo a comunicação com a API centralizada.

## 6. Responsabilidade dos arquivos

### Configuração da API

| Arquivo | Responsabilidade |
|---|---|
| `src/api/api.js` | Define a URL base da API usando `VITE_API_URL`. |
| `.env.example` | Exemplo da variável usada para configurar a API. |

### Services

| Arquivo | Responsabilidade |
|---|---|
| `src/services/chamadoService.js` | Lista, cria e busca chamados; envia comentários; assume, finaliza e cancela. |
| `src/services/categoriaService.js` | Lista, cria, edita e remove categorias. |

Os services também transformam erros da API em mensagens que podem ser mostradas ao usuário.

### Páginas

| Arquivo | Responsabilidade |
|---|---|
| `src/pages/ChamadosPage.jsx` | Lista, busca e filtra chamados; apresenta os indicadores. |
| `src/pages/ChamadoDetalhesPage.jsx` | Mostra dados, conversa, histórico e ações do chamado. |
| `src/pages/CategoriasPage.jsx` | Gerencia as categorias. |

### Componentes compartilhados

| Arquivo | Responsabilidade |
|---|---|
| `src/components/Button.jsx` | Botões com variações visualmente consistentes. |
| `src/components/Card.jsx` | Blocos de conteúdo usados pelas páginas. |
| `src/components/Badge.jsx` | Cores de status e prioridade. |
| `src/components/FormField.jsx` | Campo, seleção e área de texto padronizados. |
| `src/components/Feedback.jsx` | Loading, erro e estado vazio. |
| `src/components/Icon.jsx` | Ícones usados pela interface. |
| `src/components/NovoChamadoForm.jsx` | Formulário completo de abertura de chamado. |

### Estrutura geral

`src/App.jsx` controla a navegação entre chamados, detalhes e categorias. A navegação atual usa estado do React e não depende de React Router.

## 7. Comunicação com a API

A URL é configurada no arquivo `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Caso a variável não exista, essa mesma URL local é usada como padrão.

### Endpoints de chamados

| Ação | Método e endpoint |
|---|---|
| Listar | `GET /chamados` |
| Criar | `POST /chamados` |
| Detalhar | `GET /chamados/{id}` |
| Assumir | `POST /chamados/{id}/assumir` |
| Comentar | `POST /chamados/{id}/comentarios` |
| Finalizar | `POST /chamados/{id}/finalizar` |
| Cancelar | `POST /chamados/{id}/cancelar` |

### Endpoints de categorias

| Ação | Método e endpoint |
|---|---|
| Listar | `GET /categorias` |
| Criar | `POST /categorias` |
| Editar | `PUT /categorias/{id}` |
| Remover | `DELETE /categorias/{id}` |

## 8. Estados visuais

Toda área que depende da API trata quatro situações:

1. **Carregando:** informa que os dados estão sendo buscados.
2. **Erro:** mostra uma mensagem e, quando possível, o botão “Tentar novamente”.
3. **Vazio:** explica que ainda não existem dados e orienta a próxima ação.
4. **Sucesso:** apresenta os dados e libera as ações disponíveis.

### Cores dos status

| Status | Cor |
|---|---|
| Aberto | Azul |
| Em atendimento | Amarelo |
| Aguardando usuário | Roxo |
| Finalizado | Verde |
| Cancelado | Vermelho |

### Cores das prioridades

| Prioridade | Cor |
|---|---|
| Baixa | Cinza |
| Média | Azul |
| Alta | Laranja |
| Urgente | Vermelho |

## 9. Regras importantes da interface

- Apenas chamados abertos exibem a ação de assumir.
- Apenas chamados em atendimento exibem a ação de finalizar.
- Chamados finalizados ou cancelados não permitem novas mensagens ou ações.
- Exclusão de categoria e cancelamento de chamado pedem confirmação.
- Após uma alteração, os dados são buscados novamente na API para evitar informações desatualizadas.
- Regras definitivas de permissão e transição de status continuam sendo responsabilidade da API.

## 10. Limites atuais

Conforme definido no levantamento, ainda não fazem parte do MVP:

- Login e autenticação por token.
- Identificação automática do usuário conectado.
- Permissões reais por perfil.
- Upload de anexos.
- Notificações em tempo real.
- Dashboard com gráficos.
- Tema claro.
- Rotas com React Router.

Por ainda não existir autenticação, os códigos de solicitante e técnico são informados manualmente nos formulários.

## 11. Como executar

```bash
npm install
npm run dev
```

Validações disponíveis:

```bash
npm run lint
npm run build
```

Para conhecer os requisitos originais, consulte [`levantamento-front.md`](levantamento-front.md).
