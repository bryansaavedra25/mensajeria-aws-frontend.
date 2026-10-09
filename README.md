# 💻 Frontend: Sistema de Gestión de Órdenes y Monitoreo (React + Vite)

Este repositorio contiene la interfaz de usuario interactiva del sistema de gestión de órdenes. Permite simular el envío de peticiones síncronas y asíncronas a la arquitectura en la nube (AWS SQS/SNS) y consultar en tiempo real el estado de los mensajes en las colas de mensajería (incluyendo la Dead Letter Queue).

---

## 🛠️ Tecnologías Utilizadas

- **Framework Web:** React 18
- **Tooling / Bundler:** Vite
- **Estilos:** CSS3 / Flexbox
- **Consumo de API:** Fetch API
- **Entorno de Ejecución:** Node.js (v18+)

---

## 🖥️ Características de la Aplicación

- **Simulación de Envíos Síncronos y Asíncronos:** Formularios dedicados para enviar órdenes directamente o hacia la cola principal de SQS.
- **Monitoreo en Tiempo Real:** Panel visual que muestra el estado de:
  - Mensajes Principales (`ordenes-q`).
  - Mensajes en Vuelo (In-Flight).
  - Mensajes en Dead Letter Queue (`ordenes-dlq`).
- **Pruebas de Fallas e Integración:** Permite enviar montos negativos o clientes específicos para validar el enrutamiento a la DLQ y la posterior activación de alarmas en AWS CloudWatch.

---

## 🔗 Integración con Backend

La aplicación se comunica con el backend desarrollado en Spring Boot a través de los siguientes endpoints configurados en `http://localhost:8080`:

| Acción | Endpoint Backend | Descripción |
| :--- | :--- | :--- |
| **Enviar Asíncrono** | `POST /ordenes` | Publica la orden en la cola AWS SQS |
| **Enviar Síncrono** | `POST /ordenes/sync` | Procesa la orden de forma inmediata |
| **Consultar Estado** | `GET /estado` | Obtiene el conteo de mensajes en las colas AWS SQS |

---

## 🚀 Puesta en Marcha en Local

### Prerrequisitos
- Tener instalado Node.js (v18 o superior) y npm.
- Tener el servicio Backend (`mensajeria-aws-backend`) corriendo en `http://localhost:8080`.

### Pasos para Ejecutar

1. Clonar el repositorio:
   git clone https://github.com/bryansaavedra25/mensajeria-aws-frontend..git
   cd mensajeria-aws-frontend

   Instalar las dependencias del proyecto
# npm install
Iniciar el servidor de desarrollo:
# npm run dev
Abrir la aplicación en el navegador ingresando a http://localhost:5173.

👤 Autor
Nombre: Bryan Saavedra
        Elena Espinoza
Sección: 001D



