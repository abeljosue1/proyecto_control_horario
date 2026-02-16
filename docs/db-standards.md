# Estándares de Base de Datos - RPSoft

Este documento sirve como referencia rápida para el equipo sobre cómo trabajamos con la base de datos y Supabase.

> **Nota**: Para reglas detalladas y uso con el Agente AI, ver `.agent/skills/rpsoft-supabase/SKILL.md`.

## Resumen de Convenciones

| Concepto | Regla | Ejemplo |
| :--- | :--- | :--- |
| **Tablas** | Plural, snake_case | `user_profiles`, `logs` |
| **PK** | UUID v4 | `id uuid default gen_random_uuid()` |
| **FK** | Singular + `_id` | `user_id` |
| **Fechas** | TIMESTAMPTZ | `created_at timestamp with time zone` |

## Proceso de Migración

1.  Escribir el SQL en un archivo `.sql` o en el editor de Supabase.
2.  Aplicar cambios.
3.  Actualizar tipos en el frontend (`npm run update-types` si existe script, o manual).

## Seguridad Crítica

-   **RLS Activo**: Nunca dejar una tabla sin `enable row level security`.
-   **Policies**: Definir explícitamente. Por defecto Supabase niega todo si RLS está activo y no hay policies.
-   **Service Role**: Prohibido en el frontend.

## Snippets Comunes

### Crear Tabla Base
```sql
create table public.items (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  name text not null
);
alter table public.items enable row level security;
```
