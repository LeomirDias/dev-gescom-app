# GESCOM - Frontend (Next.js)

Projeto frontend em Next.js com `fetch`, `zod` e TanStack Query para integração com API Express.

## Variaveis de ambiente

Crie seu `.env.local` com base no `.env.example`.

```bash
cp .env.example .env.local
```

Variaveis:

- `NEXT_PUBLIC_API_URL`: URL base da API Express (ex.: `http://localhost:3001/api`)
- `API_TIMEOUT_MS`: timeout padrao das requisicoes HTTP em milissegundos

## Desenvolvimento

```bash
npm install
npm run dev
```
