---
name: RPSoft Supabase
description: Estándares y mejores prácticas para Base de Datos y Seguridad en Supabase.
---

# Estándares de Supabase y Base de Datos (RPSoft)

Esta skill define cómo diseñar esquemas de base de datos, implementar seguridad RLS y gestionar interacciones con Supabase.

## 1. Convenciones de Naming

-   **Tablas**: `snake_case` y en **plural** (ej. `users`, `work_sessions`, `order_items`).
-   **Columnas**: `snake_case` (ej. `created_at`, `user_id`, `first_name`).
-   **Foreign Keys**: `{singular_table_name}_id` (ej. `user_id` referencia a `users.id`).
-   **Índices**: `idx_{table}_{column}`.

## 2. Definición del Esquema (DDL)

### Campos Obligatorios
Todas las tablas deben tener:
-   `id`: `uuid` con `default gen_random_uuid()` (Primary Key).
-   `created_at`: `timestamp with time zone` con `default now()`.
-   `updated_at`: `timestamp with time zone` (opcional, pero recomendado si la data es mutable).

### Tipos de Datos
-   Usar `text` en lugar de `varchar(n)` a menos que haya una restricción strica.
-   Usar `timestamp with time zone` (timestamptz) para todas las fechas.
-   Usar `jsonb` para datos semi-estructurados, nunca `json`.

## 3. Seguridad (RLS)

**REGLA DE ORO: RLS (Row Level Security) DEBE ESTAR HABILITADO EN TODAS LAS TABLAS PÚBLICAS.**

### Checklist de Seguridad
1.  [ ] `alter table public.table_name enable row level security;` ejecutado.
2.  [ ] Políticas definidas para SELECT (quién puede ver).
3.  [ ] Políticas definidas para INSERT (quién puede crear).
4.  [ ] Políticas definidas para UPDATE/DELETE (quién puede modificar).
5.  [ ] **NUNCA** usar claves `service_role` en el cliente (frontend). Solo `anon_key`.

### Políticas Base (Templates)

#### Solo el dueño puede ver/editar
```sql
-- Select
create policy "Users can view own data" on public.table_name
for select using (auth.uid() = user_id);

-- Insert
create policy "Users can insert own data" on public.table_name
for insert with check (auth.uid() = user_id);

-- Update
create policy "Users can update own data" on public.table_name
for update using (auth.uid() = user_id);
```

#### Lectura pública, escritura autenticada
```sql
-- Public Read
create policy "Public read access" on public.table_name
for select using (true);
```

## 4. Uso en Código (Cliente)

-   Usar el cliente tipado generado por Supabase.
-   Manejar errores explícitamente.

```typescript
const { data, error } = await supabase
  .from('work_sessions')
  .select('*')
  .eq('user_id', userId);

if (error) {
  console.error('Error fetching sessions:', error);
  // Manejar error UI
}
```

## 5. Definition of Done (DoD) - DB
Antes de considerar una tarea de DB completa:
- [ ] Migración SQL creada y probada.
- [ ] RLS habilitado y verificado (intentar acceder con otro usuario).
- [ ] Tipos de TypeScript actualizados/generados.
