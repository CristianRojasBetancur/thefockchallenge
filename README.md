# The Fock Challenge: Clon Full-Stack de X/Twitter

Este repositorio contiene la implementación full-stack de un clon de Twitter/X, que incluye un backend desarrollado con una API de Ruby on Rails y un frontend en React (TypeScript + Vite).

## 🚀 Instrucciones de Setup

El proyecto está diseñado para configurarse fácilmente con los mínimos pasos posibles. Necesitarás tener instalados **Ruby** (configurado mediante `.ruby-version`) y **Node.js** en tu sistema.

### Setup del Backend (API de Rails)
1. Navega al directorio del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias de Ruby:
   ```bash
   bundle install
   ```
3. Configura la base de datos (crea la base de datos, carga el esquema y pobla la base con datos semilla - *seeds*):
   ```bash
   rails db:setup
   ```
4. Inicia el servidor de Rails:
   ```bash
   rails s -p 3000
   ```

### Setup del Frontend (React + Vite)
1. Abre una nueva terminal y navega al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias de Javascript:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
El frontend generalmente se ejecutará en `http://localhost:5173` y se conectará automáticamente a la API de Rails en `http://localhost:3000`.

---

## 🏗️ Decisiones de Arquitectura

La aplicación fue construida con un fuerte enfoque en los principios **SOLID** y **DRY** (*Don't Repeat Yourself*).

### Frontend
- **Estructura de Componentes**: La interfaz de usuario (UI) se divide en `pages/` (manejadores de rutas) y `components/` (elementos de UI reutilizables). Esta separación de responsabilidades hace que los cambios de diseño y el enrutamiento sean predecibles.
- **Manejo de Estado**: Utilizamos **React Context** (`AuthContext`) combinado con hooks personalizados (`hooks/`) para gestionar el estado global de la aplicación, específicamente el estado de autenticación y los datos del usuario actual. Esto evita el *prop drilling* sin tener que recurrir a la sobrecarga que implica Redux para esta escala de proyecto.
- **Capa de Servicio de API**: Todas las peticiones HTTP están abstraídas en un directorio `api/` usando Axios/Fetch. Esto desacopla los componentes de interfaz de usuario de las llamadas de red directas y centraliza la inyección de JWT e intercepción de errores.
- **Estilos**: Se eligió **Tailwind CSS** por ser *utility-first* y permitir un desarrollo de UI rápido y *responsive* sin abandonar el árbol de componentes.

### Backend
- **Objetos de Servicio (*Service Objects* con `dry-transaction`)**: En lugar de usar controladores abultados (*"Fat Controllers"*) o modelos pesados (*"Fat Models"*), la lógica de negocio compleja (ej., seguir usuarios, crear publicaciones) se encapsula en Objetos de Servicio utilizando la gema `dry-transaction`. Esto nos permite definir transacciones de negocio paso a paso, con un manejo de fallos robusto y pruebas unitarias increíblemente fáciles de escribir.
- **Manejo Centralizado de Errores**: Se implementó un mecanismo personalizado de manejo de errores a nivel del `ApplicationController`. Al rescatar errores en límites estándar (errores de ActiveRecord, de Autorización o del Dominio Personalizado), la API devuelve consistentemente una respuesta de error JSON con formato predecible, integrándose de forma transparente con `I18n` de Rails para la internacionalización.
- **Autenticación**: Se utilizan **JWT (JSON Web Tokens)** para autenticar las peticiones a la API, proporcionando un mecanismo de autenticación sin estado (*stateless*) y escalable.
- **Persistencia de Imágenes**: Los avatares y *banners* utilizan **Active Storage**. Las URLs de las imágenes se procesan como *variants* y se serializan directamente en las respuestas JSON para asegurar la persistencia de las URLs incluso si el cliente recarga la página.

---

## ⚖️ Trade-offs (Concesiones) y Limitaciones Conocidas

- **Almacenamiento de JWT**: Actualmente, el enfoque basado en JWT proporciona una iteración rápida y escalabilidad sin estado. Sin embargo, almacenar JWTs en el `LocalStorage` del lado del cliente introduce un posible riesgo de XSS en comparación con las *cookies* seguras (`HttpOnly`).
- **Sobrecarga de Objetos de Servicio**: El uso de `dry-transaction` introduce una ligera curva de aprendizaje y *boilerplate* (código repetitivo) para operaciones CRUD simples, pero se aceptó este *trade-off* ya que mejora drásticamente el mantenimiento de flujos complejos (como el sistema de Seguir/Dejar de seguir).
- **Limitaciones de Tiempo Real**: Sin integración completa de WebSockets (ej., utilizando ActionCable), características como la actualización del *feed* o nuevos seguidores requieren que el usuario recargue manualmente la página o hacer *polling* del lado del cliente.
- **Distribución de Imágenes**: Active Storage sirve archivos eficazmente en el desarrollo local, pero en un entorno de producción, esto necesitaría estar mapeado a un *bucket* externo (como AWS S3) y a una CDN para una latencia óptima.

---

## 🤖 Uso de Herramientas de IA

Se utilizó el **Asistente de Codificación por IA (Antigravity/Gemini)** a lo largo de todo el ciclo de desarrollo actuando como un *pair programmer* colaborativo.

**Cómo se aprovechó:**
- **Scaffolding**: Generación rápida del código *boilerplate* de React (Vite) y las estructuras de la API en Rails.
- **Implementación de Arquitectura**: Guió en la configuración del patrón `dry-transaction` para objetos de servicio y en los mecanismos de manejo centralizado de errores, asegurando que se siguieran las mejores prácticas desde el principio.
- **Testing (Pruebas)**: Creación de bases para conjuntos de pruebas comprehensivos (RSpec para el backend y Jest/React Testing Library para el frontend) para mantener una alta cobertura de código y fiabilidad.
- **Debugging & Refactoring**: Ayudó en el diagnóstico de *bugs* complejos respecto a persistencia de estados (como el problema de regeneración de URLs de Active Storage) y en la identificación de áreas críticas para refactorizar en pos de una mayor adherencia a los principios SOLID.
