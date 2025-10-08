<h1>🛍️Fake Store API <span> <img src="https://img.shields.io/badge/Estado-En%20Desarrollo-yellow?style=flat-square" alt="Estado del proyecto" /> <span/> </h1>

**Fake Store API** es un proyecto de ecommerce completo desarrollado en **Node.js**, **TypeScript** y **MongoDB**, que implementa autenticación con JWT, manejo de roles, integración con **Stripe**, y validaciones robustas con **Zod**.  
El objetivo es ofrecer una API escalable y segura, con flujos de negocio reales y buenas prácticas de arquitectura backend.

<br />

## 🚀 Tecnologías principales
- **Node.js + Express** → Servidor backend y controladores RESTful.  
- **TypeScript** → Tipado estático y mantenimiento escalable.  
- **MongoDB + Mongoose / Typegoose** → Modelado flexible de datos.  
- **Zod** → Validación y parseo de datos con tipado fuerte.  
- **Stripe** → Pagos y gestión de órdenes mediante webhooks.  
- **Swagger (OpenAPI)** → Documentación interactiva de endpoints.  
- **Cloudflared** → Túnel seguro para testing de webhooks.

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/Zod-3066BE?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
</p>
<br />

## 🔐 Autenticación y Autorización
El sistema usa **JWT (Bearer Token)** para autenticar usuarios en endpoints protegidos.
- Los tokens se envían en el header `Authorization: Bearer <token>`.  
- Cada usuario tiene un **rol** (`admin`, `user`, `guest`, etc.), que determina los permisos de acceso.  
- Se incluyen **middlewares personalizados** para verificación de rol y propiedad de recursos.  

<br />

## 🧩 Modelos principales
| Entidad | Descripción |
|----------|--------------|
| **User** | Contiene roles, control de estado (soft delete), e historial de cambios mediante plugin `userChangeLogPlugin`. |
| **Product** | Define nombre, descripción, precio, stock, categoría, calificación promedio y sistema de reviews. |
| **Cart** | Gestiona productos seleccionados por usuario, recalcula precios dinámicamente y valida stock. |
| **Order** | Registra compras completadas mediante Stripe (usando webhooks). Incluye historial, productos y estado de pago. |

<br />

## 🔄 Flujos de negocio clave
### 🧾 Proceso de compra
1. El usuario añade productos al carrito.  
2. Se genera una sesión de **Stripe Checkout** (`stripe.checkout.sessions.create`).  
3. Stripe envía un **webhook** al endpoint `/stripe/webhook` al completarse el pago.  
4. El backend procesa el evento `checkout.session.completed`, expande los `line_items` y crea una **Order** en la base de datos.  
5. El usuario puede consultar sus órdenes y estados de pago.

### 🧍 Cambio de roles
1. Un usuario solicita un cambio de rol (por ejemplo, de `user` a `seller`).  
2. Se crea una petición pendiente en el sistema.  
3. Un admin puede **aceptar o rechazar** la solicitud.  
4. Al aprobarse, el rol del usuario se actualiza automáticamente.

<br />

## ⚙️ Middlewares y decisiones técnicas
- **roleVerify** → Restringe acceso a rutas según rol.  
- **softDelete** → Evita eliminación física de usuarios/productos, manteniendo consistencia.  
- **userChangeLogPlugin** → Registra cambios de usuario (nombre, email, rol, etc.).  
- **sanitizeQuery** → Protege contra inyección en filtros y queries.  
- **RateLimiter avanzado** → Controla exceso de peticiones para prevenir abuso.  
- **Validaciones con Zod** → Centralizadas para body, params y query, con trim y parseo seguro.  

<br />

## 🚨 Errores y convenciones
La API responde con un formato consistente:
```json
{
  "message": "Recurso no encontrado",
  "statusCode": 404
}
```

Códigos HTTP comunes:
```
400 → Datos inválidos.
401 → No autenticado.
403 → No autorizado.
404 → No encontrado.
409 → Conflicto o duplicado.
500 → Error interno del servidor.
```

<br />

## 📚 Documentación Swagger
Swagger está disponible en:
```
/api/docs
```
Desde ahí se pueden probar endpoints, revisar esquemas y ver ejemplos de request/response.

<br />

## 🧭 Roadmap
### ✅ Completado:
- Autenticación (login, registro, verificación de token).
- CRUD de productos con imágenes y calificaciones.
- Comentarios (crear, listar).
- Carrito con upsert y validaciones.
- Integración Stripe (checkout + webhook).
- Módulo de roles (solicitud, aprobación, rechazo).
- Gestión de usuarios (ver, editar, eliminar).

### 🧩 En progreso / futuros:
- Paginación global.
- Cacheo de respuestas.
- Notificaciones en tiempo real.
- Panel admin con dashboard de métricas.
- Testing automatizado.

<br />

## 🧱 Estructura del proyecto
```js
src/
├── config/
├── controllers/
├── db/
├── errors/
├── events/
├── lib/
├── middlewares/
├── models/
├── routes/
├── schema/
├── services/
├── types/
├── utils/
├── app.ts
├── index.ts
└── swagger.yaml
```
Cada módulo tiene separación clara entre controlador, servicio y modelo, priorizando la responsabilidad única y la testabilidad.

<br />

## 🧑‍💻 Autor
**Matías Tomás Gamez Candelas Desarrollador Fullstack** especializado en TypeScript, Node.js, React y MongoDB.
<br />
Siempre pensando en siguir buenas practicas, en la escalabilidad y el trabajo en equipo.
<br />
<br />
🧰 <a href="https://github.com/Toms-29">GitHub<a/>
<br />
💼 <a href="https://www.linkedin.com/in/tomasgamez">LinkedIn<a/>
<br />
📫 gamezmatiastomas@gmail.com

<br />

## 💾 Instalación y ejecución
### Clonar el repositorio
```
git clone https://github.com/Toms-29/fake-store.git
```
### Instalar dependencias
```
npm install
```
### Iniciar el servidor en desarrollo
```
npm run dev
```
<br />
✨ Fake Store API es un proyecto personal en constante evolución, pensado para demostrar buenas prácticas, arquitectura limpia y capacidad técnica en desarrollo backend profesional.
