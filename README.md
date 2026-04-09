# 📊 Portal de Índices de Materiales de Construcción (REST API INE)

Este proyecto es una aplicación web moderna desarrollada para la cátedra de **Administración de Tecnologías de Información** del 9no Semestre en la **Universidad Mariano Gálvez de Guatemala (UMG)**, sede Chiquimulilla, Santa Rosa.

La aplicación permite consultar en tiempo real los índices de precios de materiales de construcción consumiendo el servicio web REST público del **Instituto Nacional de Estadística (INE)** mediante el protocolo CKAN Datastore.

🚀 **Despliegue en Vivo:** [https://app-admontirest-pqrl.vercel.app/](https://app-admontirest-pqrl.vercel.app/)

---

## 🛠️ Tecnologías Utilizadas

- **React 19**: Biblioteca principal para la interfaz de usuario.
- **Vite**: Herramienta de construcción y entorno de desarrollo rápido.
- **TypeScript**: Tipado estático para mayor robustez del código.
- **Framer Motion**: Animaciones fluidas y micro-interacciones.
- **Lucide React**: Set de iconos elegantes y minimalistas.
- **CSS3 (Vanilla)**: Diseño personalizado con Glassmorphism y estética premium.
- **REST API**: Consumo de servicios gubernamentales (Open Data).

---

## 📋 Características Principales

1. **Consulta en Tiempo Real**: Búsqueda asíncrona de materiales directamente desde la base de datos del INE.
2. **Diseño Premium**: Interfaz profesional integrada con Glassmorphism y colores corporativos.
3. **Paginación Dinámica**: Navegación eficiente a través de miles de registros.
4. **Fallback de Datos**: Sistema de contingencia que muestra datos locales si la API del INE no responde.
5. **Layout Adaptable**: Totalmente responsivo para móviles y escritorio.
6. **Footer Compacto**: Información detallada del equipo y la institución en un formato minimalista y fijo.

---

## 🚀 Instalación y Configuración Local

Para clonar y ejecutar este proyecto en tu máquina local, sigue estos pasos:

### 1. Clonar el repositorio
```bash
git clone https://github.com/Alexmavl/app-admontirest.git
cd app-admontirest
```

### 2. Instalar dependencias
Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Luego ejecuta:
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

### 4. Construcción para producción
```bash
npm run build
```

---

## 👥 Equipo de Desarrollo

| Integrante | Carné |
| :--- | :--- |
| **Marvin Alexander Vásquez López** | 1790-22-12802 |
| **Teddy Leonardo Hernández Pérez** | 1790-22-2563 |
| **Wilson Eduardo Hernández López** | 1790-22-7315 |
| **Guillermo José Gómez Aguilera** | 1790-22-16429 |

---

## 🏛️ Institución

- **Universidad**: Mariano Gálvez de Guatemala
- **Facultad**: Ingeniería en Sistemas de Información y Ciencias de la Computación
- **Sede**: Chiquimulilla, Santa Rosa
- **Ciclo**: 2026

---

## 📄 Notas de Implementación (Proxy)

Para que el consumo de la API funcione sin errores de CORS en producción (Vercel), se ha configurado un archivo `vercel.json` que actúa como túnel hacia `https://datos.ine.gob.gt`.
