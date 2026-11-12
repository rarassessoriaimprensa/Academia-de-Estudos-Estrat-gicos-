# Academia de Estudos Estratégicos — MVP 0.1

Starter de uma plataforma EAD PWA para formação individual em teoria militar, filosofia militar, história, geopolítica, filosofia política e ensaísmo.

## O que já está incluído

- Interface responsiva com identidade editorial própria.
- Navegação por Observatório, Escolas, Biblioteca, Caderno e Distinções.
- Seis escolas de conhecimento.
- Demonstração da carreira acadêmica de 15 níveis.
- Página de biblioteca com referências inaugurais.
- Caderno de estudos demonstrativo.
- Modal de acesso por link mágico (Supabase Auth) quando configurado.
- Manifest e configuração PWA.
- Migração SQL inicial com catálogo, cursos, módulos, aulas, matrículas, progresso, patentes, insígnias, avaliações, biblioteca, notas, ensaios e assinaturas.
- Políticas RLS iniciais.

## Requisitos

- Node.js 20+
- Projeto Supabase independente

## Executar localmente

```bash
npm install
cp .env.example .env
npm run dev
```

Crie um arquivo `.env` na raiz (copie `.env.example`) e preencha:
- `VITE_SUPABASE_URL` — Project URL do painel.
- `VITE_SUPABASE_PUBLISHABLE_KEY` — chave pública `sb_publishable_...`.

Em projetos antigos, `VITE_SUPABASE_ANON_KEY` continua aceito como alternativa. Nunca coloque `service_role` ou `sb_secret_...` no frontend.

## Configurar Supabase

1. Crie um projeto Supabase novo e independente.
2. Abra SQL Editor.
3. Execute `supabase/migrations/001_initial_schema.sql`.
4. Em **Settings → API Keys**, copie a **Project URL** (também aparece em Connect) e a **Publishable key** (`sb_publishable_...`) para `.env`. Se o projeto só mostrar a chave legada `anon`, ela também é aceita pelo código.
5. Em Authentication, configure URL local e URLs de produção.
6. Configure SMTP próprio antes de produção para entrega confiável dos links mágicos.

## Estado do MVP

A interface está em modo demonstrativo. Os dados da tela inicial são amostras estáticas. A autenticação por link mágico fica habilitada quando as variáveis Supabase estiverem configuradas.

A migração cria a base de dados e RLS inicial, mas não implementa ainda o fluxo transacional completo de XP, avaliação automática, pagamento, certificados ou painel administrativo. Esses fluxos devem ser implementados com Edge Functions e testes antes de produção.

## Próximas entregas recomendadas

1. Conectar perfil e sessão reais ao frontend.
2. Substituir conteúdo demonstrativo por consultas Supabase.
3. Criar Edge Function transacional para concluir aulas e atribuir XP.
4. Implementar avaliação com gabarito inacessível ao cliente.
5. Implementar gestão de cursos e conteúdos para administradores.
6. Adicionar integração de pagamento e webhooks para plano premium.
7. Implementar certificados verificáveis e trilha de auditoria.

## Princípios de segurança e conteúdo

- Dados pessoais, anotações e ensaios são privados por padrão.
- XP e nível não podem ser alterados diretamente pelo aluno.
- A chave `service_role` só pode existir em ambiente servidor.
- A plataforma é educacional e histórico-filosófica; a hierarquia é uma metáfora acadêmica, sem equivalência com patente real.
- Disponibilizar apenas materiais próprios, licenciados ou em domínio público.
