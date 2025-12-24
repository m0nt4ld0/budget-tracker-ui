
<div align="center">

# Budget Tracker UI

Interfaz en Vue 3 para gestionar gastos personales, crear categorías y visualizar movimientos de manera simple.

</div>

## 🚀 Descripción

Este proyecto es una SPA construida con **Vite + Vue 3 + TypeScript** que consume una API REST (por defecto en `http://localhost:8080/api`). Permite:

1. Registrar gastos con fecha, concepto, importe y categoría.
2. Listar gastos paginados con formateo de fecha e importe.
3. Crear y visualizar categorías disponibles.

## ✨ Características principales

- Gestión de estado con **Pinia**.
- Componentes reutilizables (`CustomTable`, `Pagination`).
- Formatos utilitarios para fechas y moneda (`useUtils`).
- Estilos base apoyados en utilidades tipo Tailwind.
- Tipado de DTOs para mantener contratos con la API (`src/types/types.ts`).

## 🧱 Stack

- Vue 3 + Composition API
- TypeScript
- Pinia
- Vue Router
- Axios
- Vite

## 📦 Requisitos previos

- Node.js ^20.19.0 (o >=22.12.0)
- npm 10+
- Backend disponible en `http://localhost:8080/api` con endpoints:
  - `GET /categorias/`
  - `POST /categorias/crear`
  - `GET /gastos/` (admite `page`, `size`, `fechaDesde`, `fechaHasta`)
  - `POST /gastos/crear`

## ⚙️ Instalación y ejecución

```bash
git clone https://github.com/m0nt4ld0/budget-tracker-ui.git
cd budget-tracker-ui
npm install

# Desarrollo
npm run dev

# Compilación para producción
npm run build

# Vista previa de build
npm run preview

# Chequeo de tipos
npm run type-check
```

## 🗂️ Estructura relevante

```
src/
├── api/              # Clientes Axios para gastos y categorías
├── components/       # CustomTable, Pagination y otros componentes UI
├── composables/      # useUtils con helpers (formatDate, formatARS)
├── stores/           # Pinia stores (gastoStore, categoriaStore)
├── types/            # Definiciones de DTOs
├── views/            # Vistas Gastos y Categorías
└── App.vue           # Layout principal con router-view
```

## 🔧 Configuración adicional

- Edita `src/api/api.ts` si necesitas apuntar a un backend distinto.
- `tailwind.config.js` y `postcss.config.js` ya están listos para utilidades tipo Tailwind 4.
- Para añadir nuevas vistas, registra rutas en `src/router` (si aplica) y reutiliza los componentes existentes.

## 🤝 Contribuciones

1. Crea un fork
2. Crea una rama (`git checkout -b feature/nombre`)
3. Realiza tus cambios y pruebas
4. Envía un PR describiendo el cambio

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 🎨 Estilos

El proyecto utiliza Tailwind CSS para los estilos. Se han definido variables de tema personalizadas en `src/index.css`:
- `--color-primary`: Azul por defecto (#3b82f6)
- `--color-secondary`: Verde por defecto (#10b981)
- `--color-danger`: Rojo por defecto (#ef4444)
- `--color-a`: Gris por defecto (#6b7280)
- Estos colores se aplican a través de utilidades CSS personalizadas en el proyecto.
- Se pueden sobrescribir en cualquier componente usando `style="--color-primary: #otrocolor;"` o en el root para todo el app.
