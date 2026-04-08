# Prompt Manager

Gerenciador de prompts com interface moderna e tema escuro. Projeto de estudo desenvolvido durante a formação da Rocketseat.

## Tecnologias

- **[Next.js 16](https://nextjs.org/)** — framework React com App Router
- **[React 19](https://react.dev/)** — com Server e Client Components
- **[TypeScript 5](https://www.typescriptlang.org/)** — tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** — estilização utility-first
- **[Prisma 6](https://www.prisma.io/)** — ORM para acesso ao banco de dados
- **[PostgreSQL 17](https://www.postgresql.org/)** — banco de dados relacional
- **[Radix UI](https://www.radix-ui.com/)** — primitivos de UI acessíveis
- **[Lucide React](https://lucide.dev/)** — ícones
- **[Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)** — testes de componentes

## Funcionalidades

- Listagem de prompts na sidebar
- Busca de prompts por título
- Sidebar colapsável (expandir/minimizar)
- Navegação para criar novo prompt
- Tema escuro com variáveis CSS customizadas

## Estrutura do projeto

```
src/
├── app/
│   ├── layout.tsx        # Layout raiz com sidebar
│   └── page.tsx          # Página inicial
├── components/
│   ├── logo/             # Componente de logo
│   ├── sidebar/          # Sidebar com lista de prompts
│   └── ui/               # Componentes base (Button, Input)
├── lib/
│   ├── prisma.ts         # Singleton do Prisma Client
│   ├── utils.ts          # Utilitário cn() para classes
│   └── test-utils.tsx    # Utilitários para testes
├── styles/
│   └── globals.css       # CSS global e variáveis de tema
└── tests/
    └── components/       # Testes de componentes
prisma/
├── schema.prisma         # Modelo de dados (Prompt)
└── migrations/           # Histórico de migrações
```

## Modelo de dados

```prisma
model Prompt {
  id        String   @id @default(cuid())
  title     String   @unique
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- [Docker](https://www.docker.com/) (para o banco de dados)

## Instalação e execução

**1. Instale as dependências**

```bash
pnpm install
```

**2. Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

O arquivo `.env` deve conter:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/rocketseat_prompt_manager"
```

**3. Suba o banco de dados**

```bash
docker compose up -d
```

**4. Execute as migrações**

```bash
pnpm prisma migrate dev
```

**5. Inicie o servidor de desenvolvimento**

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Gera o build de produção |
| `pnpm start` | Inicia o servidor em produção |
| `pnpm test` | Executa os testes |
| `pnpm test:watch` | Executa os testes em modo watch |
| `pnpm test:coverage` | Executa os testes com cobertura |
| `pnpm lint` | Verifica problemas de lint |
| `pnpm format` | Formata os arquivos com Prettier |
| `pnpm typecheck` | Verifica os tipos TypeScript |

## Git hooks (Lefthook)

- **pre-commit** — formata os arquivos staged com Prettier
- **pre-push** — executa typecheck, lint e testes com cobertura
