---
name: supabase-strategy
description: Lógica para conectar, guardar y leer datos de Supabase de forma segura.
---

# Supabase Data Strategy
Esta habilidad define cómo interactuamos con la base de datos.

## 1. Seguridad (Zero-Trust)
- NUNCA escribas las `SUPABASE_URL` o `SUPABASE_ANON_KEY` directamente en el código de los componentes.
- Usa siempre variables de entorno: `process.env.NEXT_PUBLIC_SUPABASE_URL`.
- Crea un archivo de utilidad `utils/supabaseClient.js` para inicializar el cliente una sola vez.

## 2. Estructura de Datos
Para el proyecto "Comunidad", asume esta tabla simple:
- Tabla: `messages`
- Columnas:
  - `id` (int8, primary key)
  - `created_at` (timestamptz)
  - `user_name` (text)
  - `user_code` (text)
  - `message_text` (text)

## 3. Manejo de Errores
- Al guardar (Insert): Si falla, muestra un `alert` o notificación visual al usuario ("Error al guardar").
- Al leer (Select): Si no hay datos, muestra un estado vacío elegante ("Sé el primero en comentar"), no un error.
