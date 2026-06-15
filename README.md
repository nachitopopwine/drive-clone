# 📁 Drive Clone - Taller 3

Un clon de Google Drive que permite cargar, gestionar y descargar archivos usando **LocalStack S3**, **Docker**, **Terraform** e infraestructura containerizada.

## 📋 Requisitos

### Software Requerido

- **Docker Desktop** (versión 20.10 o superior)
- **Docker Compose** (versión 1.29 o superior)
- **Terraform** (versión 1.0 o superior) - solo para provisionar infraestructura
- **Node.js** (versión 20 LTS) - si deseas ejecutar localmente sin Docker
- **npm** (versión 10 o superior)
- **Git**

### Herramientas Instaladas

- Backend: Express.js, AWS SDK v3, Multer
- Frontend: React 19, Vite, Axios, React Dropzone
- Infraestructura: LocalStack S3, Terraform
- Containerización: Docker, Docker Compose

## 🚀 Inicio Rápido con Docker

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/drive-clone.git
cd drive-clone
```

### 2. Crear archivos de variables de entorno

#### Backend (.env.backend)

```bash
cd backend
cat > .env << EOF
NODE_ENV=development
PORT=3000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
LOCALSTACK_ENDPOINT=http://localstack:4566
S3_BUCKET_NAME=drive-bucket
EOF
```

#### Frontend (.env.frontend)

```bash
cd ../frontend
cat > .env << EOF
VITE_API_URL=http://localhost:3000/api
EOF
```

### 3. Ejecutar con Docker Compose

```bash
cd ..
docker-compose up -d
```

Esto ejecutará:
- **LocalStack** en puerto `4566` (S3 simulado)
- **Backend** en puerto `3000`
- **Frontend** en puerto `5173`

### 4. Verificar que todo esté funcionando

```bash
# Ver logs
docker-compose logs -f

# Verificar servicios
docker-compose ps

# Acceder a la aplicación
# Frontend: http://localhost:5173
# Backend: http://localhost:3000/api/files
# LocalStack: http://localhost:4566
```

## 🖥️ Ejecución Local sin Docker

### 1. Setup Backend

```bash
cd backend
npm install
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### 2. Setup Frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 3. Levantar LocalStack (en otra terminal)

```bash
docker run -it \
  -p 4566:4566 \
  -p 4571:4571 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  localstack/localstack
```

## 🏗️ Infraestructura con Terraform

### 1. Inicializar Terraform

```bash
cd terraform
terraform init
```

### 2. Revisar el plan (opcional)

```bash
terraform plan
```

### 3. Aplicar la configuración

```bash
terraform apply
```

Esto creará:
- Bucket S3 `drive-bucket`
- Configuración de versionado
- Encriptación server-side (AES256)
- Políticas de ciclo de vida
- Bloqueo de acceso público

### 4. Ver outputs

```bash
terraform output
```

## 📁 Estructura del Proyecto

```
drive-clone/
├── backend/                    # API Node.js/Express
│   ├── src/
│   │   ├── server.js          # Punto de entrada
│   │   ├── config/
│   │   │   └── s3Client.js    # Configuración AWS SDK
│   │   ├── controllers/
│   │   │   └── fileController.js
│   │   ├── services/
│   │   │   └── s3Service.js   # Lógica S3
│   │   └── routes/
│   │       └── fileRoutes.js  # Rutas API
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/                   # Aplicación React/Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   └── FileList.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   ├── Dockerfile
│   ├── vite.config.js
│   ├── package.json
│   └── .env
├── terraform/                  # Infraestructura IaC
│   ├── main.tf                # Definición de recursos
│   ├── variables.tf           # Variables
│   └── backend.tf             # Configuración de estado
├── docker/
│   └── localstack-init.sh     # Script de inicialización
├── docker-compose.yml          # Orquestación de servicios
├── README.md                   # Este archivo
└── .gitignore
```

## 🔌 API Endpoints

### GET `/api/files`
Obtiene los últimos 3 archivos cargados

**Response:**
```json
[
  {
    "key": "1234567890-nombre-archivo.pdf",
    "name": "nombre-archivo.pdf",
    "size": 1024,
    "lastModified": "2024-06-10T14:30:00Z"
  }
]
```

### POST `/api/files/upload`
Carga un archivo

**Body:** `multipart/form-data`
- `file`: Archivo a cargar

**Response:**
```json
{
  "message": "File uploaded successfully",
  "fileKey": "1234567890-nombre.pdf",
  "fileName": "nombre.pdf"
}
```

### GET `/api/files/download/:key`
Descarga un archivo específico

**Parameters:**
- `key`: Clave del archivo en S3

## ⚙️ Variables de Entorno

### Backend

| Variable | Valor Default | Descripción |
|----------|----------------|-------------|
| `NODE_ENV` | `development` | Ambiente de ejecución |
| `PORT` | `3000` | Puerto del servidor |
| `AWS_REGION` | `us-east-1` | Región AWS |
| `AWS_ACCESS_KEY_ID` | `test` | Clave de acceso (LocalStack) |
| `AWS_SECRET_ACCESS_KEY` | `test` | Clave secreta (LocalStack) |
| `LOCALSTACK_ENDPOINT` | `http://localhost:4566` | Endpoint de LocalStack |
| `S3_BUCKET_NAME` | `drive-bucket` | Nombre del bucket |

### Frontend

| Variable | Valor Default | Descripción |
|----------|----------------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api` | URL del API backend |

## 📋 Características

✅ **Drag & Drop**: Arrastra archivos directamente desde el explorador
✅ **Últimos 3 archivos**: Muestra siempre los 3 más recientes
✅ **Descargas**: Descarga cualquier archivo en cualquier momento
✅ **Soporte de tipos**: Documentos, imágenes, videos, PDFs, texto
✅ **Almacenamiento persistente**: LocalStack S3 con versionado
✅ **Encriptación**: Server-side encryption AES256
✅ **Interfaz limpia**: Diseño simple y responsivo

## 🔄 Flujo de Ejecución

1. **Usuario abre la web** → Frontend carga desde `http://localhost:5173`
2. **Arrastra y sube archivo(s)** → Multipart upload al backend
3. **Backend procesa** → Valida y sube a S3
4. **UI se actualiza** → Muestra el archivo recién cargado
5. **Opción de descarga habilitada** → Usuario descarga cuando desee

## 🐛 Troubleshooting

### Error: "Cannot connect to LocalStack"

```bash
# Verifica que LocalStack esté corriendo
docker ps | grep localstack

# Si no está, inicia los servicios
docker-compose up localstack
```

### Error: "EADDRINUSE: address already in use"

```bash
# Mata los procesos que usan los puertos
# Linux/Mac:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Error: "S3 bucket not found"

```bash
# Ejecuta Terraform para crear el bucket
cd terraform
terraform apply
```

## 📊 Monitoreo

### Ver logs de LocalStack

```bash
docker-compose logs localstack
```

### Ver logs del Backend

```bash
docker-compose logs backend
```

### Ver logs del Frontend

```bash
docker-compose logs frontend
```

### Acceder a LocalStack UI

```
http://localhost:4566
```

## 🔐 Seguridad

- Credenciales de LocalStack son placeholders (`test:test`)
- Acceso público al bucket está bloqueado
- Encriptación server-side habilitada
- CORS configurado para desarrollo local
- Variables sensibles en archivos `.env` (incluidos en `.gitignore`)

## 📝 Conventional Commits

Este proyecto usa **Conventional Commits**:

```bash
# Características
git commit -m "feat: agregar funcionalidad de drag & drop"

# Bug fixes
git commit -m "fix: corregir error de carga de archivos"

# Documentación
git commit -m "docs: actualizar README con ejemplos"

# Refactoring
git commit -m "refactor: reorganizar estructura de servicios"

# Tests
git commit -m "test: agregar tests para S3Service"

# Cambios de configuración
git commit -m "chore: actualizar dependencias"
```

## 🚢 Despliegue a Producción

Para desplegar a producción:

1. Cambiar `NODE_ENV` a `production`
2. Usar un bucket S3 real en AWS (no LocalStack)
3. Configurar variables de entorno reales
4. Habilitar HTTPS
5. Configurar CORS apropiadamente
6. Usar certificados SSL/TLS válidos

## 📚 Recursos Adicionales

- [LocalStack Docs](https://docs.localstack.cloud/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Docker Compose](https://docs.docker.com/compose/)
- [React Documentation](https://react.dev/)
- [Express.js](https://expressjs.com/)

## 👥 Contribuciones

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama: `git checkout -b feat/nueva-caracteristica`
3. Commit con conventional commits: `git commit -m "feat: descripción"`
4. Push a la rama: `git push origin feat/nueva-caracteristica`
5. Abre un Pull Request

## 👨‍🏫 Entrega

- 📹 **Video**: Explicación de arquitectura, código y demo funcional
- 💾 **GitHub**: Proyecto completo con profesor como colaborador
- 📄 **README**: Este archivo con todas las instrucciones
- 📅 **Fecha**: 18 de junio de 2026 a las 23:59

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

## 📧 Contacto

Para preguntas o sugerencias, contacta al profesor o abre un issue en el repositorio.

---

**Hecho con ❤️ para Taller 3**
