# 🛒 Fake Store API

API RESTful para un ecommerce, desarrollada con **Node.js, Express, TypeScript y MongoDB**.  
Incluye autenticación con JWT, gestión de usuarios, productos, carrito de compras, órdenes, integración con Stripe y sistema de roles.  

Este proyecto busca simular una **plataforma de venta online** completa, aplicando buenas prácticas de arquitectura, seguridad y escalabilidad.

---

## ✨ Features principales

- 🔐 **Autenticación con JWT** + sistema de roles (`admin`, `user`, `guest`).
- 👤 **Gestión de usuarios**: CRUD, soft delete, cambios de rol, historial de cambios.
- 🛍️ **Productos**: CRUD con imágenes, ratings, comentarios y control de stock.
- 🛒 **Carrito**: persistente por usuario, con validación de stock y cálculo de precios.
- 💳 **Órdenes y pagos con Stripe** (webhooks integrados).
- ⚡ **Middlewares de seguridad**: RateLimiter, sanitización de inputs, validaciones con Zod.
- 📦 **Módulos desacoplados y escalables**, listos para extender.

---

## 🛠️ Tecnologías utilizadas

- **Backend**: Node.js, Express, TypeScript  
- **Base de datos**: MongoDB con Mongoose/Typegoose  
- **Autenticación**: JWT (JSON Web Token)  
- **Pagos**: Stripe API + webhooks  
- **Validación**: Zod  
- **Testing**: Jest (pendiente)  
- **Documentación**: Swagger (pendiente)  

---

## 🚀 Instalación y uso
**Instalar dependencias**: npm install

**Variables de entorno**: 
Crear un archivo .env en la raíz con los siguientes valores:
- PORT=4000
- MONGO_URI=mongodb://localhost:27017/fake-store
- JWT_SECRET=supersecret
- STRIPE_SECRET_KEY=sk_test_123456789
- STRIPE_SUCCESS_URL=http://localhost:5173/success
- STRIPE_CANCEL_URL=http://localhost:5173/cancel

**Ejecutar en desarrollo**: npm run dev

La API estará disponible en:  
👉 http://localhost:4000/api

📑 Documentación de la API  
La documentación interactiva está disponible en Swagger:  
👉 http://localhost:4000/api-docs  
(En construcción, pronto disponible)

### Clonar el repositorio
git clone https://github.com/Toms-29/fake-store.git  
cd fake-store

---

## 🖼️ Frontend
Este proyecto cuenta con un frontend en desarrollo (React/Next.js recomendado).  
Próximamente se integrará con la API.  
(En construcción, pronto disponible)

---

## 🧑‍💻 Autor
Proyecto desarrollado por Tomás Gámez Candelas  
LinkedIn | GitHub
