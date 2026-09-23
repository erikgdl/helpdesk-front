# Helpdesk Front — Levantamento de Requisitos

## 1. Objetivo do front-end

O objetivo do front-end é criar uma interface web para consumir a API Laravel do sistema de chamados.

O usuário deverá conseguir visualizar chamados, abrir novos chamados, ver detalhes, comentar, assumir, finalizar e cancelar chamados por meio de telas simples e organizadas.

O front-end será separado do back-end.

```text
helpdesk-api
→ Laravel API
→ Regras de negócio
→ Banco de dados
→ Endpoints REST

helpdesk-front
→ React
→ Interface visual
→ Formulários
→ Consumo da API
```

---

## 2. Stack do front-end

O projeto será feito com:

```text
React
Vite
JavaScript
CSS
Fetch API
ESLint
```

Futuramente pode ser adicionado:

```text
React Router
Axios
Tailwind CSS
React Hook Form
```

---

## 3. Ideia visual do sistema

O sistema terá uma aparência parecida com um painel administrativo simples.

A estrutura visual principal será:

```text
Topo / Header
    ↓
Conteúdo principal
    ↓
Cards, tabelas e formulários
```

Exemplo geral:

```text
+--------------------------------------------------+
| Helpdesk Front                                   |
| Sistema de gerenciamento de chamados             |
+--------------------------------------------------+

+----------------------+---------------------------+
| Menu / Navegação     | Conteúdo principal         |
|                      |                           |
| - Dashboard          | Lista de chamados          |
| - Chamados           | Cards / Tabela             |
| - Categorias         | Formulários                |
| - Usuários           | Detalhes do chamado        |
+----------------------+---------------------------+
```

No começo, o sistema pode ser simples, sem sidebar. Depois pode evoluir para layout com menu lateral.

---

## 4. Páginas principais

### 4.1 Página de Chamados

Essa será a tela principal do sistema.

Ela deverá listar todos os chamados cadastrados na API.

Informações exibidas:

```text
ID
Título
Status
Prioridade
Categoria
Solicitante
Técnico responsável
Data de abertura
Ações
```

Exemplo visual:

```text
+------------------------------------------------------------+
| Chamados                                                   |
+------------------------------------------------------------+
| [Novo chamado]                                             |
+------------------------------------------------------------+
| # | Título                 | Status          | Prioridade   |
| 1 | Erro ao acessar sistema| finalizado      | alta         |
| 2 | Computador não liga    | em_atendimento  | media        |
+------------------------------------------------------------+
```

Ações esperadas:

```text
Ver detalhes
Assumir chamado
Finalizar chamado
Cancelar chamado
```

---

### 4.2 Página de Criar Chamado

Tela com formulário para abrir um novo chamado.

Campos:

```text
Título
Descrição
Prioridade
Usuário solicitante
Categoria
```

Payload enviado para a API:

```json
{
  "titulo": "Erro ao acessar sistema",
  "descricao": "Não consigo acessar o sistema.",
  "prioridade": "alta",
  "usuario_id": 1,
  "categoria_id": 1
}
```

Resultado esperado:

```text
Chamado criado com status aberto
tecnico_id = null
data_abertura preenchida
histórico "Chamado criado"
```

---

### 4.3 Página de Detalhes do Chamado

Essa página mostra todas as informações de um chamado específico.

Deve exibir:

```text
Título
Descrição
Status
Prioridade
Solicitante
Técnico responsável
Categoria
Data de abertura
Data de fechamento
Comentários
Histórico
```

Exemplo visual:

```text
+--------------------------------------------------+
| Erro ao acessar sistema                          |
+--------------------------------------------------+
| Status: em_atendimento                           |
| Prioridade: alta                                 |
| Solicitante: Erik                                |
| Técnico: Carlos Técnico                          |
| Categoria: Sistema                               |
+--------------------------------------------------+

Descrição:
Não consigo acessar o sistema desde hoje cedo.

Comentários:
- Carlos Técnico: Estou verificando o problema.

Histórico:
- Chamado criado
- Chamado assumido
- Comentário adicionado
```

Ações disponíveis:

```text
Adicionar comentário
Assumir chamado
Finalizar chamado
Cancelar chamado
```

---

### 4.4 Página de Categorias

Tela para listar, criar, editar e remover categorias.

Campos da categoria:

```text
Nome
Descrição
```

Exemplo:

```text
Sistema
Problemas relacionados aos sistemas internos

Rede
Problemas relacionados à internet e conexão
```

Endpoints usados:

```text
GET /api/categorias
POST /api/categorias
GET /api/categorias/{id}
PUT /api/categorias/{id}
DELETE /api/categorias/{id}
```

---

### 4.5 Página de Usuários

Inicialmente essa tela pode ser simples ou até ficar para depois.

Como ainda não foi feito CRUD completo de usuários no front, os usuários podem ser usados apenas para testes.

Futuramente a tela poderá listar:

```text
Nome
E-mail
Tipo
```

Tipos:

```text
solicitante
tecnico
admin
```

---

## 5. Componentes esperados

O front-end deverá ter componentes reutilizáveis.

### Componentes básicos

```text
Button
Input
Select
Textarea
Card
Table
BadgeStatus
BadgePrioridade
Loading
ErrorMessage
```

### Exemplo de uso dos componentes

```text
Button
→ usado em salvar, cancelar, assumir, finalizar

Input
→ usado em campos de texto

Select
→ usado em prioridade, categoria e usuário

Textarea
→ usado em descrição e comentário

BadgeStatus
→ mostra status com aparência visual diferente

BadgePrioridade
→ mostra prioridade com destaque
```

---

## 6. Estrutura de pastas planejada

A estrutura inicial do React será:

```text
src/
├── api/
│   └── api.js
│
├── services/
│   ├── chamadoService.js
│   └── categoriaService.js
│
├── pages/
│   ├── ChamadosPage.jsx
│   ├── ChamadoDetalhesPage.jsx
│   ├── CriarChamadoPage.jsx
│   └── CategoriasPage.jsx
│
├── components/
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Textarea.jsx
│   ├── Card.jsx
│   ├── Loading.jsx
│   └── ErrorMessage.jsx
│
├── styles/
│   └── global.css
│
├── App.jsx
├── index.css
└── main.jsx
```

---

## 7. Responsabilidades das pastas

### api

Responsável por guardar configurações da API.

Exemplo:

```js
const API_URL = 'http://127.0.0.1:8000/api'

export default API_URL
```

---

### services

Responsável por centralizar as chamadas HTTP.

Exemplo:

```text
listarChamados()
criarChamado()
assumirChamado()
adicionarComentario()
finalizarChamado()
cancelarChamado()
```

A tela não deve saber detalhes da URL. Ela deve chamar o service.

Exemplo:

```text
ChamadosPage
    ↓
chamadoService.listarChamados()
    ↓
GET /api/chamados
```

---

### pages

Responsável pelas telas principais.

Exemplo:

```text
ChamadosPage
→ lista chamados

CriarChamadoPage
→ formulário para abrir chamado

ChamadoDetalhesPage
→ detalhes, comentários e histórico

CategoriasPage
→ CRUD de categorias
```

---

### components

Responsável por partes visuais reutilizáveis.

Exemplo:

```text
Button
Input
Select
Card
Table
Loading
ErrorMessage
```

---

## 8. Fluxo principal do sistema

O fluxo principal no front será:

```text
Usuário acessa a tela de chamados
        ↓
React busca chamados na API
        ↓
Laravel retorna JSON
        ↓
React mostra a lista
        ↓
Usuário clica em um chamado
        ↓
React mostra detalhes
        ↓
Usuário pode comentar, assumir, finalizar ou cancelar
        ↓
React chama a API
        ↓
Laravel executa a regra de negócio
        ↓
React atualiza a tela
```

---

## 9. Endpoints que o front vai consumir

### Categorias

```text
GET    /api/categorias
POST   /api/categorias
GET    /api/categorias/{id}
PUT    /api/categorias/{id}
DELETE /api/categorias/{id}
```

### Chamados

```text
GET    /api/chamados
POST   /api/chamados
GET    /api/chamados/{id}
PUT    /api/chamados/{id}
DELETE /api/chamados/{id}
```

### Ações específicas de chamados

```text
POST /api/chamados/{id}/assumir
POST /api/chamados/{id}/comentarios
POST /api/chamados/{id}/finalizar
POST /api/chamados/{id}/cancelar
```

---

## 10. Requisitos funcionais do front-end

### RF01 — Listar chamados

O sistema deve exibir todos os chamados retornados pela API.

Deve mostrar:

```text
título
status
prioridade
categoria
solicitante
técnico
```

---

### RF02 — Criar chamado

O sistema deve permitir abrir um chamado através de formulário.

Campos obrigatórios:

```text
titulo
descricao
prioridade
usuario_id
categoria_id
```

---

### RF03 — Ver detalhes do chamado

O sistema deve permitir visualizar os detalhes de um chamado.

Deve exibir:

```text
dados do chamado
comentários
histórico
```

---

### RF04 — Assumir chamado

O sistema deve permitir que um técnico assuma um chamado aberto.

Deve enviar:

```json
{
  "tecnico_id": 2
}
```

---

### RF05 — Adicionar comentário

O sistema deve permitir adicionar comentários ao chamado.

Deve enviar:

```json
{
  "usuario_id": 2,
  "mensagem": "Estou verificando o problema."
}
```

---

### RF06 — Finalizar chamado

O sistema deve permitir finalizar um chamado em atendimento.

Deve enviar:

```json
{
  "tecnico_id": 2
}
```

---

### RF07 — Cancelar chamado

O sistema deve permitir cancelar um chamado que ainda não esteja finalizado.

Deve enviar:

```json
{
  "usuario_id": 1
}
```

---

### RF08 — Listar categorias

O sistema deve exibir as categorias cadastradas.

---

### RF09 — Criar categoria

O sistema deve permitir cadastrar uma nova categoria.

Campos:

```text
nome
descricao
```

---

## 11. Estados visuais necessários

Toda tela que chama API deve tratar:

```text
Carregando
Erro
Lista vazia
Dados carregados
```

Exemplo:

```text
Carregando chamados...
Erro ao buscar chamados.
Nenhum chamado encontrado.
Lista de chamados exibida.
```

---

## 12. Regras visuais para status

Os status dos chamados devem aparecer de forma clara.

Status possíveis:

```text
aberto
em_atendimento
aguardando_usuario
finalizado
cancelado
```

Sugestão visual:

```text
aberto              → azul
em_atendimento      → amarelo
aguardando_usuario  → roxo
finalizado          → verde
cancelado           → vermelho
```

---

## 13. Regras visuais para prioridade

Prioridades possíveis:

```text
baixa
media
alta
urgente
```

Sugestão visual:

```text
baixa    → cinza
media    → azul
alta     → laranja
urgente  → vermelho
```

---

## 14. MVP do front-end

Para considerar o front-end como MVP, ele precisa ter:

```text
Listagem de chamados
Criação de chamados
Tela de detalhes do chamado
Adicionar comentário
Assumir chamado
Finalizar chamado
Cancelar chamado
Listagem/criação de categorias
Tratamento de loading e erro
```

---

## 15. Fora do MVP inicial

Essas coisas podem ficar para depois:

```text
Login real
Autenticação com token
Permissões reais por usuário logado
Dashboard com gráficos
Notificações em tempo real
Upload de anexos
Tema claro/escuro
Testes automatizados no front
```

---

## 16. Ordem de desenvolvimento sugerida

```text
01. Criar projeto React com Vite
02. Limpar App.jsx
03. Criar estrutura de pastas
04. Criar api.js
05. Criar chamadoService.js
06. Listar chamados na tela
07. Melhorar visual da listagem
08. Criar categoriaService.js
09. Listar categorias
10. Criar formulário de novo chamado
11. Criar tela de detalhes do chamado
12. Adicionar comentário
13. Assumir chamado
14. Finalizar chamado
15. Cancelar chamado
16. Melhorar layout geral
17. Criar README do front
```

---

## 17. Commits sugeridos

```text
chore: criar projeto react com vite
chore: criar estrutura inicial do front
feat: listar chamados da api
feat: criar service de chamados
feat: implementar tela de categorias
feat: implementar criação de chamados
feat: implementar detalhes do chamado
feat: implementar comentários em chamados
feat: implementar ações de chamados
style: melhorar layout do helpdesk
docs: documentar front-end do helpdesk
```

---

## 18. Objetivo final

O objetivo final do front-end é permitir usar visualmente o fluxo principal da API:

```text
Criar chamado
    ↓
Assumir chamado
    ↓
Comentar chamado
    ↓
Finalizar ou cancelar chamado
```

A API Laravel continua responsável pelas regras de negócio.

O React será responsável por mostrar a interface, capturar ações do usuário e consumir os endpoints.
