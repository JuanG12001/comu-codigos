---
name: nextjs-architect
description: Estándares de arquitectura para aplicaciones Next.js y React con diseño Dark Mode.
---

# Next.js & UI Architecture Standards
Usa estas reglas siempre que generes componentes, páginas o estilos.

## 1. Diseño Visual (Dark Mode Obligatorio)
El usuario requiere una estética "Sencilla con Fondo Negro".
- **Global CSS**: El `body` siempre debe tener `background-color: #000000` (negro puro) y texto blanco/gris claro.
- **Minimalismo**: Evita sombras complejas o gradientes innecesarios. Usa bordes finos (1px) con colores gris oscuro para separar secciones.
- **Inputs**: Los campos de entrada deben tener fondo transparente o gris muy oscuro, borde visible y texto claro.

## 2. Estructura de Componentes
- **Atomicidad**: Separa la lógica.
    - `InputForm.jsx`: Solo para capturar Nombre/Código/Mensaje.
    - `CodesList.jsx`: Solo para mostrar la lista de mensajes (map).
- **Client vs Server**:
    - Usa `"use client"` solo en componentes que requieran interactividad (hooks, onClicks).
    - Intenta mantener las páginas (`page.js`) como Server Components si es posible.

## 3. Stack Tecnológico
- Framework: Next.js (App Router).
- Estilos: Tailwind CSS (preferible) o CSS Modules. Si usas Tailwind, usa clases como `bg-black`, `text-white`, `border-gray-800`.
