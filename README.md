# Control Horario MVP

Aplicación web simple de control horario y asistencia.

## Stack
- Next.js (App Router)
- React
- Tailwind CSS
- Supabase (Auth + Database)

## Configuración de Supabase

El proyecto está preparado para conectarse a Supabase. Actualmente usa placeholders.

### 1. Variables de Entorno
Crea o edita el archivo `.env.local` en la raíz del proyecto y agrega tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-publica
```

### 2. Base de Datos
Debes crear la siguiente tabla en tu proyecto de Supabase (SQL Editor):

```sql
create type work_status as enum ('working', 'paused', 'finished');

create table public.work_sessions (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null default auth.uid (),
  start_time timestamp with time zone not null default now(),
  pause_time timestamp with time zone null,
  end_time timestamp with time zone null,
  status text not null default 'working', -- o usa el enum work_status
  created_at timestamp with time zone not null default now(),
  constraint work_sessions_pkey primary key (id),
  constraint work_sessions_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

-- Políticas de Seguridad (RLS)
alter table public.work_sessions enable row level security;

create policy "Users can view their own sessions"
on public.work_sessions
for select using (auth.uid() = user_id);

create policy "Users can insert their own sessions"
on public.work_sessions
for insert with check (auth.uid() = user_id);

create policy "Users can update their own sessions"
on public.work_sessions
for update using (auth.uid() = user_id);
```

## Ejecución Local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Correr el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abrir [http://localhost:3000](http://localhost:3000)

## Funcionalidades
- **Registro/Login**: Gestión de usuarios con Supabase Auth.
- **Dashboard**: Iniciar, Pausar y Finalizar jornada. 
- **Historial**: Ver lista de jornadas pasadas.

## Desarrollo y Estándares de UI

Este proyecto cuenta con una **Skill de IA** para garantizar la consistencia en el diseño y código.

- **Definición**: `.agent/skills/rpsoft-ui/SKILL.md`
- **Uso**: Al solicitar nuevas funcionalidades o componentes de UI, referencia la skill para obtener mejores resultados.

**Ejemplo de Prompt:**
> "Crea un componente de tabla para el historial, siguiendo los estándares de **RPSoft UI**."

Esto asegura:
- Uso correcto de Tailwind CSS.
- Estructura de componentes (Atomic Design).
- Cumplimiento del DoD (Accesibilidad, Responsive, TypeScript).
