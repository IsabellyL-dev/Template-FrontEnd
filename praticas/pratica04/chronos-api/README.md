# Chronos API — Backend Pomodoro

API REST construída com **Express + Prisma + MySQL + TypeScript**.

---

## Estrutura de Pastas

```
chronos-api/
├── prisma/
│   └── schema.prisma        # modelos do banco de dados
├── src/
│   ├── lib/
│   │   └── prisma.ts        # instância única do Prisma Client
│   ├── routes/
│   │   ├── settings.routes.ts
│   │   └── tasks.routes.ts
│   ├── app.ts               # configuração do Express
│   └── server.ts            # ponto de entrada / listen
├── .env                     # variáveis de ambiente (não sobe pro Git)
├── .env.example             # modelo do .env para o time
├── package.json
└── tsconfig.json
```

---

## Pré-requisitos

- Node.js 18+
- MySQL rodando localmente (porta 3306)
- Um banco criado — ex: `chronos_db`

---

## Passo a Passo para Subir o Projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Abra o arquivo `.env` e ajuste as credenciais do MySQL:

```env
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/chronos_db"
PORT=3333
```

> **Dica:** o banco `chronos_db` precisa existir antes da migration.
> Crie pelo MySQL Workbench ou pelo terminal:
> ```sql
> CREATE DATABASE chronos_db;
> ```

### 3. Rodar a migration (cria as tabelas no banco)

```bash
npm run prisma:migrate
```

Quando pedir um nome para a migration, digite: `init`

### 4. Iniciar a API em modo desenvolvimento

```bash
npm run dev
```

Saída esperada:
```
✅ API rodando em http://localhost:3333
```

---

## Endpoints

| Método | Rota                       | Descrição                         |
|--------|----------------------------|------------------------------------|
| GET    | /health                    | Verifica se a API está no ar       |
| GET    | /settings                  | Busca configurações do Pomodoro    |
| PUT    | /settings                  | Atualiza configurações             |
| GET    | /tasks                     | Lista histórico de tasks           |
| POST   | /tasks                     | Cria uma nova task                 |
| PATCH  | /tasks/:id/complete        | Marca task como concluída          |
| PATCH  | /tasks/:id/interrupt       | Marca task como interrompida       |
| DELETE | /tasks                     | Apaga todo o histórico             |

---

## Exemplos de Requisição

### GET /health
```
GET http://localhost:3333/health
```
Resposta:
```json
{ "ok": true }
```

### GET /settings
```
GET http://localhost:3333/settings
```
Resposta:
```json
{
  "id": 1,
  "workTime": 25,
  "shortBreakTime": 5,
  "longBreakTime": 15,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /settings
```
PUT http://localhost:3333/settings
Content-Type: application/json

{
  "workTime": 30,
  "shortBreakTime": 10,
  "longBreakTime": 20
}
```

### POST /tasks
```
POST http://localhost:3333/tasks
Content-Type: application/json

{
  "id": "1717000000000",
  "name": "Estudar TypeScript",
  "duration": 25,
  "type": "workTime",
  "startDate": 1717000000000
}
```
Resposta: status **201**

### PATCH /tasks/:id/complete
```
PATCH http://localhost:3333/tasks/1717000000000/complete
Content-Type: application/json

{
  "completeDate": 1717001500000
}
```

### PATCH /tasks/:id/interrupt
```
PATCH http://localhost:3333/tasks/1717000000000/interrupt
Content-Type: application/json

{
  "interruptDate": 1717001000000
}
```

### DELETE /tasks
```
DELETE http://localhost:3333/tasks
```
Resposta: status **204 No Content**

---

## Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `ECONNREFUSED` | API não está rodando | Execute `npm run dev` |
| `400` em PUT/POST/PATCH | Payload inválido | Verifique os campos e tipos |
| `404` em PATCH task | ID inexistente no banco | Verifique se a task foi criada |
| `Can't reach database` | MySQL offline ou .env errado | Verifique MySQL + DATABASE_URL |

---

## Scripts Disponíveis

```bash
npm run dev           # Inicia com hot-reload (tsx watch)
npm run build         # Compila TypeScript para dist/
npm run start         # Inicia a versão compilada
npm run prisma:migrate # Cria/aplica migrations
npm run prisma:studio  # Abre interface visual do banco
```
