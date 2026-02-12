---
activation:
  type: glob
  pattern: "**/*.{js,jsx,ts,tsx,css}"
---
# Reglas de Desarrollo: Next.js & Supabase

Estas reglas aplican a todos los archivos de código fuente.

## 1. Stack Tecnológico
- **Framework:** Next.js (App Router). Usa la carpeta `app/`.
- **Estilos:** Tailwind CSS. Prioriza clases de utilidad.
- **Base de Datos:** Supabase.

## 2. Convenciones de Código
- **Componentes:** Usa `const Component = () => {}` (Arrow Functions).
- **Directivas:** Usa `'use client'` al inicio del archivo SOLO si usas hooks (`useState`, `useEffect`) o eventos (`onClick`). Si es solo visualización estática, mantenlo como Server Component.
- **Supabase:**
  - Nunca expongas `service_role_key` en el frontend.
  - Usa `createClientComponentClient` para componentes de cliente.

## 3. Manejo de Datos
- Tabla objetivo: `community_codes` (o similar).
- Columnas esperadas: `id`, `created_at`, `user_name`, `code_snippet`, `message`.
