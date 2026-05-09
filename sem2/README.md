# 🛒 TechRetail – Docker Swarm Deployment

> **Trabajo Práctico N°1 | Docker Swarm: Despliegue de Aplicaciones con Orquestación de Contenedores**

---

## 📋 Descripción del Proyecto

TechRetail es una empresa peruana de comercio electrónico que presentaba problemas de escalabilidad en su infraestructura. Este proyecto implementa una solución basada en **Docker Swarm** para orquestar múltiples microservicios, garantizando alta disponibilidad, escalado dinámico y balanceo de carga automático.

**Entorno utilizado:** Docker Desktop en Windows 10

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│              DOCKER SWARM CLUSTER                   │
│                                                     │
│         ┌─────────────────────────┐                 │
│         │     Manager Node        │                 │
│         │   (Docker Desktop)      │                 │
│         └────────────┬────────────┘                 │
│                      │                              │
│   ┌──────────────────▼──────────────────────┐       │
│   │        Red Overlay (techretail_net)     │       │
│   └──┬──────────┬──────────┬──────────┬─────┘       │
│      │          │          │          │             │
│  [frontend]  [backend]  [database]  [cache]         │
│  3 réplicas  2 réplicas  1 réplica  1 réplica       │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Microservicios

| Servicio | Imagen | Puerto | Réplicas | Descripción |
|---|---|---|---|---|
| `frontend` | `nginx:alpine` | 80 | 3 | Tienda en línea (servidor web) |
| `backend` | `python:3.11-slim` | — | 2 | Servicio de procesamiento |
| `database` | `mysql:8` | interno | 1 | Base de datos principal |
| `cache` | `redis:7-alpine` | interno | 1 | Caché de consultas |
| `visualizer` | `dockersamples/visualizer` | 8080 | 1 | Monitor visual del clúster |

---

## ⚙️ Requisitos Previos

- Windows 10/11
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución
- Git instalado

---

## 🚀 Guía de Despliegue Paso a Paso

### Paso 1: Inicializar el clúster Swarm

```cmd
docker swarm init
```

### Paso 2: Crear el Docker Secret

```cmd
echo "MiPasswordSegura123" | docker secret create db_password -
docker secret ls
```

### Paso 3: Desplegar el Stack

```cmd
docker stack deploy -c docker-compose.yml techretail
docker stack services techretail
```

### Paso 4: Ver el Visualizer

Abrir navegador en 👉 **http://localhost:8080**

### Paso 5: Escalar el Frontend

```cmd
docker service scale techretail_frontend=5
docker service ps techretail_frontend
```

---

## 📁 Estructura del Repositorio

```
techretail-docker-swarm/
├── docker-compose.yml
├── README.md
└── capturas/
```

---

## 🔧 Comandos Útiles

```cmd
docker stack services techretail
docker service ps techretail_frontend
docker service logs techretail_backend
docker service scale techretail_frontend=5
docker node ls
docker secret ls
docker stack rm techretail
docker swarm leave --force
```

---

## 🔐 Seguridad

- Credenciales gestionadas con **Docker Secrets** (nunca en texto plano).
- Red `techretail_net` con driver **overlay**.
- Base de datos restringida al nodo Manager con `placement constraints`.

---

## 📊 Resultados Obtenidos

- ✅ Clúster Swarm operativo con Docker Desktop en Windows
- ✅ 5 microservicios desplegados simultáneamente
- ✅ Frontend escalado dinámicamente de 3 a 5 réplicas
- ✅ Backend con 2 réplicas activas con logs visibles
- ✅ Base de datos MySQL con persistencia en volumen
- ✅ Caché Redis operativo
- ✅ Visualizer en puerto 8080
- ✅ Docker Secrets para credenciales seguras

---

## 📝 Nota sobre el Entorno

El despliegue fue realizado sobre **Docker Desktop en Windows 10**, el cual actúa como nodo único con rol de Manager. En producción real se añadirían Workers en máquinas separadas mediante `docker swarm join`. Docker Swarm demuestra el comportamiento completo de orquestación incluso en nodo único.

---

## 📚 Referencias

- [Documentación oficial Docker Swarm](https://docs.docker.com/engine/swarm/)
- [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/)
- [Docker Hub](https://hub.docker.com/)

---

## 👥 Integrantes 

| Nombre | Rol |
|---|---|
|                     
| Infraestructura y clúster |
| [Jhamile Macavilca] | Configuración de servicios |
|                     | Documentación e informe |

---

*Trabajo Práctico N°1 — Infraestructura Cloud / Sistemas Distribuidos — 2025*