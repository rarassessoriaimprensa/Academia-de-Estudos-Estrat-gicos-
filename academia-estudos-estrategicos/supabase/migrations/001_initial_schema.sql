-- Academia de Estudos Estratégicos
-- Execute no SQL Editor do projeto Supabase independente.

create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'instructor', 'admin');
create type public.enrollment_status as enum ('active', 'completed', 'cancelled');
create type public.lesson_status as enum ('not_started', 'in_progress', 'completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  slug text unique not null,
  title text not null,
  summary text,
  description text,
  access_tier text not null default 'free' check (access_tier in ('free','premium')),
  level text not null default 'introductory',
  estimated_minutes integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  lesson_type text not null default 'text',
  content jsonb not null default '{}'::jsonb,
  duration_minutes integer not null default 0,
  sort_order integer not null default 0,
  is_published boolean not null default false
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status public.enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(user_id, course_id)
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status public.lesson_status not null default 'not_started',
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create table public.rank_levels (
  level integer primary key check (level between 1 and 15),
  title text unique not null,
  xp_required integer not null unique check (xp_required >= 0),
  insignia_key text not null unique
);

create table public.student_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp_total integer not null default 0 check (xp_total >= 0),
  current_level integer not null default 1 references public.rank_levels(level),
  updated_at timestamptz not null default now()
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  category text not null,
  insignia_key text not null,
  criteria jsonb not null default '{}'::jsonb,
  is_active boolean not null default true
);

create table public.student_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key(user_id, badge_id)
);

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  instructions text,
  passing_score integer not null default 70 check (passing_score between 0 and 100),
  is_published boolean not null default false
);

create table public.assessment_questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  prompt text not null,
  question_type text not null default 'single_choice',
  options jsonb not null default '[]'::jsonb,
  explanation text,
  sort_order integer not null default 0
);

-- Correct answers are kept in a server-only table and are never exposed by
-- the student-facing assessment_questions select policy.
create table public.assessment_answer_keys (
  question_id uuid primary key references public.assessment_questions(id) on delete cascade,
  answer_key jsonb not null
);

create table public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer check (score between 0 and 100),
  passed boolean not null default false,
  submitted_at timestamptz not null default now()
);

create table public.library_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  description text,
  item_type text not null default 'book',
  publication_year integer,
  source_url text,
  storage_path text,
  access_tier text not null default 'free' check (access_tier in ('free','premium')),
  is_public_domain boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.study_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Anotação sem título',
  body text not null default '',
  linked_lesson_id uuid references public.lessons(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.essays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  abstract text,
  body text not null default '',
  status text not null default 'draft' check (status in ('draft','submitted','reviewed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create index idx_courses_school on public.courses(school_id);
create index idx_modules_course on public.modules(course_id);
create index idx_lessons_module on public.lessons(module_id);
create index idx_enrollments_user on public.enrollments(user_id);
create index idx_progress_user on public.lesson_progress(user_id);
create index idx_notes_user on public.study_notes(user_id);
create index idx_essays_user on public.essays(user_id);

-- Profile created automatically for every new auth user.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles(id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  insert into public.student_progress(user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Prevent users from promoting their own profile by editing the role column.
create or replace function public.prevent_self_role_change()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Profile role can only be changed by a trusted server process';
  end if;
  return new;
end;
$$;

create trigger protect_profile_role
before update on public.profiles
for each row execute procedure public.prevent_self_role_change();

-- Helper: role check is evaluated server-side under the caller's auth context.
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','instructor')
  );
$$;

-- Enable RLS on all application tables.
alter table public.profiles enable row level security;
alter table public.schools enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.rank_levels enable row level security;
alter table public.student_progress enable row level security;
alter table public.badges enable row level security;
alter table public.student_badges enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.assessment_answer_keys enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.library_items enable row level security;
alter table public.study_notes enable row level security;
alter table public.essays enable row level security;
alter table public.subscriptions enable row level security;

-- Publicly readable published catalog.
create policy "published schools readable" on public.schools for select using (is_published or public.is_staff());
create policy "published courses readable" on public.courses for select using (is_published or public.is_staff());
create policy "published modules readable" on public.modules for select using (
  public.is_staff() or exists(select 1 from public.courses c where c.id=course_id and c.is_published)
);
create policy "published lessons readable" on public.lessons for select using (
  public.is_staff() or (is_published and exists(
    select 1 from public.modules m join public.courses c on c.id=m.course_id
    where m.id=module_id and c.is_published
  ))
);
create policy "rank levels readable" on public.rank_levels for select using (true);
create policy "active badges readable" on public.badges for select using (is_active or public.is_staff());
create policy "published library readable" on public.library_items for select using (is_published or public.is_staff());

-- Staff can manage curriculum and catalog. Do not grant student write access to XP or ranks.
create policy "staff manage schools" on public.schools for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage courses" on public.courses for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage modules" on public.modules for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage lessons" on public.lessons for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage library" on public.library_items for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage badges" on public.badges for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage rank levels" on public.rank_levels for all using (public.is_staff()) with check (public.is_staff());

-- Private student records.
create policy "profile own read" on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy "profile own update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "progress own read" on public.student_progress for select using (user_id = auth.uid() or public.is_staff());
create policy "progress staff update" on public.student_progress for update using (public.is_staff()) with check (public.is_staff());
create policy "enrollment own read" on public.enrollments for select using (user_id = auth.uid() or public.is_staff());
create policy "enrollment own create" on public.enrollments for insert with check (user_id = auth.uid());
create policy "lesson progress own read" on public.lesson_progress for select using (user_id = auth.uid() or public.is_staff());
create policy "lesson progress own write" on public.lesson_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "student badges own read" on public.student_badges for select using (user_id = auth.uid() or public.is_staff());
create policy "staff award badges" on public.student_badges for insert with check (public.is_staff());
create policy "assessment published read" on public.assessments for select using (is_published or public.is_staff());
create policy "questions published read" on public.assessment_questions for select using (
  public.is_staff() or exists(select 1 from public.assessments a where a.id=assessment_id and a.is_published)
);
-- No student-facing policy is intentionally created for assessment_answer_keys.
-- Edge Functions using the server-side service role may read answer keys.
create policy "attempts own read" on public.assessment_attempts for select using (user_id=auth.uid() or public.is_staff());
create policy "attempts own submit" on public.assessment_attempts for insert with check (user_id=auth.uid());
create policy "notes own access" on public.study_notes for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "essays own access" on public.essays for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "subscriptions own read" on public.subscriptions for select using (user_id=auth.uid() or public.is_staff());

-- Starter rank ladder. XP values are thresholds, not direct rank grants.
insert into public.rank_levels(level,title,xp_required,insignia_key) values
(1,'Recruta',0,'recruta'),(2,'Soldado',500,'soldado'),(3,'Cabo',1200,'cabo'),
(4,'3º Sargento',2200,'sargento_3'),(5,'2º Sargento',3500,'sargento_2'),
(6,'1º Sargento',5000,'sargento_1'),(7,'Subtenente',7000,'subtenente'),
(8,'Aspirante',9500,'aspirante'),(9,'2º Tenente',12500,'tenente_2'),
(10,'1º Tenente',16000,'tenente_1'),(11,'Capitão',20000,'capitao'),
(12,'Major',25000,'major'),(13,'Tenente-Coronel',31000,'tenente_coronel'),
(14,'Coronel',38000,'coronel'),(15,'General',46000,'general');

insert into public.schools(slug,title,subtitle,description,sort_order,is_published) values
('teoria-militar','Teoria Militar','Fundamentos, doutrina e pensamento estratégico','Estudo acadêmico da teoria da guerra, estratégia, instituições e pensamento militar.',1,true),
('filosofia-militar','Filosofia Militar','Guerra, ética, poder e condição humana','Investigação filosófica da guerra, violência, responsabilidade, autoridade e ética.',2,true),
('historia-militar','História Militar','Transformações, conflitos e instituições','Análise histórica de conflitos, instituições e transformações militares.',3,true),
('geopolitica-estrategia','Geopolítica e Estratégia','Território, poder e relações internacionais','Estudo de geografia política, relações internacionais e pensamento estratégico.',4,true),
('filosofia-politica','Filosofia Política','Estado, soberania, liberdade e legitimidade','Estudo dos fundamentos filosóficos das instituições e da vida coletiva.',5,true),
('pensamento-ensaistico','Pensamento e Ensaísmo','Leitura crítica e produção intelectual','Teoria do ensaio, leitura de autores e produção de textos autorais.',6,true);

insert into public.badges(slug,title,description,category,insignia_key) values
('primeira-leitura','Leitor Inaugural','Concluiu a primeira leitura orientada.','leitura','book_award'),
('pensamento-critico','Pensamento Crítico','Concluiu uma avaliação de análise conceitual.','filosofia','laurel'),
('ensaista','Ensaísta','Entregou o primeiro ensaio autoral.','escrita','quill'),
('historiador-militar','História Militar','Concluiu uma trilha de história militar.','historia','chronicle'),
('filosofo-da-guerra','Filosofia da Guerra','Concluiu uma trilha de filosofia militar.','filosofia','owl');
