# Drive Clone - Taller 3

Aplicación web tipo Google Drive que permite cargar, listar y descargar archivos utilizando almacenamiento S3 simulado mediante LocalStack.

## Tecnologías Utilizadas

### Frontend
- React
- Vite
- Axios
- React Dropzone

### Backend
- Node.js
- Express
- AWS SDK v3
- Multer

### Infraestructura
- Docker
- Docker Compose
- Terraform
- LocalStack (AWS S3)

---

# Requisitos

Instalar previamente:

- Docker Desktop
- Docker Compose
- Terraform 1.0 o superior
- Git

---

# Estructura del Proyecto

```text
CloudDrive/
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   └── backend.tf
│
├── docker/
│   └── localstack-init.sh
│
├── docker-compose.yml
│
└── README.md
```

---

# Variables de Entorno

## Backend

Crear archivo:

```text
backend/.env
```

Contenido:

```env
NODE_ENV=development
PORT=3000

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

LOCALSTACK_ENDPOINT=http://localstack:4566

S3_BUCKET_NAME=drive-bucket
```

---

## Frontend

Crear archivo:

```text
frontend/.env
```

Contenido:

```env
VITE_API_URL=http://localhost:3000/api
```

---

# Levantar LocalStack

Desde la raíz del proyecto:

```bash
docker compose up -d localstack
```

Verificar:

```bash
docker ps
```

Debe aparecer:

```text
localstack-s3
```

Verificar salud:

```bash
http://localhost:4566/_localstack/health
```

---

# Crear Infraestructura con Terraform

Entrar a la carpeta:

```bash
cd terraform
```

Inicializar:

```bash
terraform init
```

Validar:

```bash
terraform validate
```

Aplicar:

```bash
terraform apply -auto-approve
```

Terraform crea:

- Bucket S3 `drive-bucket`
- Versionado del bucket
- Encriptación AES256
- Bloqueo de acceso público

Verificar recursos:

```bash
terraform state list
```

Resultado esperado:

```text
aws_s3_bucket.drive_bucket
aws_s3_bucket_public_access_block.drive_bucket_pab
aws_s3_bucket_server_side_encryption_configuration.drive_bucket_encryption
aws_s3_bucket_versioning.drive_bucket_versioning
```

---

# Levantar Aplicación

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Verificar:

```bash
docker compose ps
```

Deben aparecer:

```text
drive-backend
drive-frontend
localstack-s3
```

---

# Acceso a la Aplicación

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```

---

# Verificación del Bucket

Listar buckets:

```bash
docker exec localstack-s3 awslocal s3 ls
```

Resultado esperado:

```text
drive-bucket
```

---

# Verificar Archivos Subidos

Listar objetos:

```bash
docker exec localstack-s3 awslocal s3 ls s3://drive-bucket --recursive
```

---

# Verificar Versionado

Mostrar versiones almacenadas:

```bash
docker exec localstack-s3 awslocal s3api list-object-versions --bucket drive-bucket
```

---

# Funcionalidades Implementadas

- Carga de archivos mediante Drag & Drop
- Almacenamiento en bucket S3 (LocalStack)
- Descarga de archivos
- Listado de archivos almacenados
- Versionado de objetos
- Encriptación AES256
- Infraestructura como código con Terraform
- Contenerización mediante Docker

---

# Comandos Útiles

Ver logs del backend:

```bash
docker compose logs backend
```

Ver logs del frontend:

```bash
docker compose logs frontend
```

Ver logs de LocalStack:

```bash
docker compose logs localstack
```

Detener servicios:

```bash
docker compose down
```

Eliminar infraestructura Terraform:

```bash
terraform destroy -auto-approve
```

---

# Autor
Ignacio Andres Rodriguez Bruna 
20.543.006-7
Proyecto desarrollado para el Taller 3 utilizando React, Express, Docker, Terraform y LocalStack.