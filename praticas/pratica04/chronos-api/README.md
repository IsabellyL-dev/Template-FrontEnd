# Chronos Pomodoro API

API REST para o projeto Chronos Pomodoro, desenvolvida com Express, Prisma e MySQL.

## Tecnologias

- Node.js + TypeScript
- Express
- Prisma ORM
- MySQL

## Como rodar

### Pré-requisitos

- Node.js 18+
- MySQL 8.0 rodando localmente

### Instalação

```bash
cd chronos-api
npm install
```

### Configurar o banco

Edite o arquivo `.env` com suas credenciais:

```env
DATABASE_URL="mysql://root:123456@localhost:3306/pomodoro_db"
PORT=3333
```

### Criar o banco e rodar migrations

```bash
npx prisma migrate dev --name init
```

### Iniciar a API

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333`.

---

## Endpoints

### Health Check

```
GET /health
```

**Resposta:**
```json
{ "ok": true }
```

---

### Settings

#### Buscar configurações

```
GET /settings
```

**Resposta:**
```json
{
  "id": 1,
  "workTime": 25,
  "shortBreakTime": 5,
  "longBreakTime": 15,
  "updatedAt": "2026-05-25T00:00:00.000Z"
}
```

---

#### Atualizar configurações

```
PUT /settings
```

**Body:**
```json
{
  "workTime": 30,
  "shortBreakTime": 10,
  "longBreakTime": 20
}
```

**Resposta:** objeto com os novos valores salvos.

**Erros:**
- `400` — valores inválidos (não inteiros)

---

### Tasks

#### Listar tarefas

```
GET /tasks
```

**Resposta:** lista de tasks ordenadas por `startDate` decrescente.

```json
[
  {
    "id": "1716900000000",
    "name": "Estudar React",
    "duration": 25,
    "type": "workTime",
    "startDate": "1716900000000",
    "completeDate": "1716900999000",
    "interruptDate": null,
    "createdAt": "2026-05-25T00:00:00.000Z"
  }
]
```

---

#### Criar tarefa

```
POST /tasks
```

**Body:**
```json
{
  "id": "1716900000000",
  "name": "Estudar React",
  "duration": 25,
  "type": "workTime",
  "startDate": 1716900000000
}
```

**Resposta:** `201` com a task criada.

**Erros:**
- `400` — campos obrigatórios faltando

---

#### Marcar tarefa como concluída

```
PATCH /tasks/:id/complete
```

**Body:**
```json
{
  "completeDate": 1716900999000
}
```

**Resposta:** task atualizada com `completeDate` preenchido.

**Erros:**
- `400` — `completeDate` ausente

---

#### Marcar tarefa como interrompida

```
PATCH /tasks/:id/interrupt
```

**Body:**
```json
{
  "interruptDate": 1716900999000
}
```

**Resposta:** task atualizada com `interruptDate` preenchido.

**Erros:**
- `400` — `interruptDate` ausente

---

#### Limpar histórico

```
DELETE /tasks
```

**Resposta:** `204 No Content`

---

## Tipos de tarefa

| Tipo | Descrição |
|---|---|
| `workTime` | Foco |
| `shortBreakTime` | Descanso curto |
| `longBreakTime` | Descanso longo |
