
# ReservaPro UI Guide

Esta guía define el sistema de diseño del producto SaaS.

## 1. Tokens Semánticos (CSS Variables)

Utilizamos variables CSS para garantizar consistencia entre temas claro y oscuro.

| Token | Propósito | Claro | Oscuro |
|-------|-----------|--------|--------|
| `--bg-main` | Fondo de la aplicación | #f8fafc | #020617 |
| `--bg-surface` | Fondo de tarjetas/modales | #ffffff | #0f172a |
| `--border-subtle`| Bordes ligeros | #e2e8f0 | #1e293b |
| `--text-main` | Texto principal | #0f172a | #f8fafc |
| `--text-muted` | Texto secundario | #64748b | #94a3b8 |
| `--accent` | Color de marca (Indigo) | #4f46e5 | #6366f1 |

## 2. Componentes UI

### Botones (Clases de utilidad)
- **Primary**: `bg-indigo-600 text-white font-bold rounded-xl`
- **Secondary**: `bg-white dark:bg-slate-900 border border-slate-200`
- **Danger**: `bg-rose-500 text-white`

### Card / Superficie
Utilizar la clase `.ui-card` en lugar de `bg-white`. Esta clase ya gestiona bordes, sombras y el fondo adaptativo del tema.

### Tablas
- Contenedor: `overflow-hidden rounded-[2rem] border border-slate-200`
- Cabecera: Aplicar clase `.ui-table-header` a los `th`.

## 3. Estados de Modo Oscuro
Nunca utilizar colores fijos como `bg-white` o `text-black`. Siempre utilizar las clases de Tailwind con prefijo `dark:` o las variables semánticas.

**Ejemplo correcto:**
```html
<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
  <p class="text-slate-900 dark:text-slate-100">Contenido</p>
</div>
```

## 4. Responsividad
- El Sidebar se oculta automáticamente por debajo de `1024px` (lg).
- El Header muestra un botón "hamburger" en mobile para abrir el Sidebar.
- Las tablas deben estar envueltas en un div con `overflow-x-auto`.
