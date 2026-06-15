# 🏗️ Arquitectura del Proyecto - Drive Clone

## Descripción General

Este proyecto es un **clon de Google Drive** que demuestra la integración de:
- **Frontend**: React 19 con Vite
- **Backend**: Node.js/Express
- **Storage**: AWS S3 simulado con LocalStack
- **Infraestructura**: Terraform para IaC
- **Containerización**: Docker y Docker Compose

## 📐 Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                        │
│                   http://localhost:5173                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Frontend (React + Vite)                   │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │          App.jsx (Componente Principal)        │ │  │
│  │  │  - Gestiona estado (files, loading)            │ │  │
│  │  │  - Orquesta carga/descarga                     │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                      ↓                                │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │          Componentes Funcionales               │ │  │
│  │  │  ┌──────────────────┐  ┌──────────────────┐   │ │  │
│  │  │  │  FileUpload.jsx  │  │  FileList.jsx    │   │ │  │
│  │  │  │  - Drag & Drop   │  │  - Lista archivos│   │ │  │
│  │  │  │  - Validación    │  │  - Botones DL    │   │ │  │
│  │  │  └──────────────────┘  └──────────────────┘   │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│                 HTTP Requests (Axios)                       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                           ↕ (REST API)
                    http://localhost:3000
┌──────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js/Express)                   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Express Server (server.js)                │  │
│  │  - CORS configurado                                   │  │
│  │  - JSON body parser                                   │  │
│  │  - Error handling middleware                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              API Routes (fileRoutes.js)                │  │
│  │  POST   /api/files/upload         - Carga archivo    │  │
│  │  GET    /api/files                 - Lista últimos 3  │  │
│  │  GET    /api/files/download/:key   - Descarga archivo│  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           Controllers (fileController.js)              │  │
│  │  - Validación de requests                             │  │
│  │  - Manejo de errores                                  │  │
│  │  - Orquestación de servicios                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │            Services (s3Service.js)                     │  │
│  │  - Lógica de negocio                                  │  │
│  │  - Operaciones S3 (PUT, GET, LIST, DELETE)          │  │
│  │  - Manejo de streams/buffers                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              AWS SDK Config (s3Client.js)              │  │
│  │  - Endpoint: http://localstack:4566                   │  │
│  │  - Credenciales: test/test                            │  │
│  │  - Región: us-east-1                                  │  │
│  │  - forcePathStyle: true (para LocalStack)            │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
└──────────────────────────────────────────────────────────────┘
                           ↕ (AWS SDK)
              http://localstack:4566 (Puerto 4566)
┌──────────────────────────────────────────────────────────────┐
│                  LocalStack (Simulador AWS)                   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                  S3 Service                            │  │
│  │                                                        │  │
│  │  Bucket: drive-bucket                                │  │
│  │  ├─ Versioning: Habilitado                           │  │
│  │  ├─ Encryption: AES256                              │  │
│  │  ├─ Public Access: Bloqueado                         │  │
│  │  └─ Lifecycle: Elimina versiones a los 30 días     │  │
│  │                                                        │  │
│  │  Files (Objetos):                                    │  │
│  │  ├─ 1234567890-document.pdf                          │  │
│  │  ├─ 1234567891-image.jpg                             │  │
│  │  └─ 1234567892-video.mp4                             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### Subida de Archivo (Upload)

```
User selecciona archivo
    ↓
FileUpload.jsx (React Dropzone)
    ↓
Validación de tipo de archivo
    ↓
FormData + file
    ↓
POST /api/files/upload (Axios)
    ↓
Backend: fileController.uploadFile()
    ↓
Multer: procesa multipart/form-data
    ↓
s3Service.uploadFileToS3()
    ↓
AWS SDK: PutObjectCommand
    ↓
LocalStack S3: almacena objeto
    ↓
Retorna fileKey al cliente
    ↓
Suceso: UI se actualiza automáticamente
```

### Descarga de Archivo (Download)

```
User hace click en botón "Download"
    ↓
FileList.jsx captura evento
    ↓
GET /api/files/download/:key (Axios, responseType: blob)
    ↓
Backend: fileController.downloadFile()
    ↓
s3Service.downloadFileFromS3()
    ↓
AWS SDK: GetObjectCommand
    ↓
LocalStack S3: retorna stream de datos
    ↓
Convierte a Buffer
    ↓
Backend retorna blob con headers
    ↓
Frontend crea download link
    ↓
Browser: inicia descarga
```

### Listado de Archivos (List)

```
App.jsx: useEffect() al montar
    ↓
GET /api/files (Axios)
    ↓
Backend: fileController.getFiles()
    ↓
s3Service.getFilesFromS3(limit: 3)
    ↓
AWS SDK: ListObjectsV2Command
    ↓
LocalStack: retorna lista de objetos
    ↓
Sort: ordena por LastModified DESC
    ↓
Toma últimos 3
    ↓
Mapea a formato UI
    ↓
Backend retorna JSON array
    ↓
Frontend: setState(files)
    ↓
FileList.jsx: renderiza lista
```

## 📦 Componentes Principales

### Frontend Components

#### App.jsx
- **Responsabilidad**: Componente raíz
- **Estado**: `files[]`, `loading`
- **Funciones**: `fetchFiles()`, `handleUploadSuccess()`, `handleDownload()`
- **Ciclo de vida**: Fetch inicial en `useEffect[]`

#### FileUpload.jsx
- **Responsabilidad**: Manejo de carga de archivos
- **Hook**: `useDropzone` de react-dropzone
- **Eventos**: onDrop, validación de tipo
- **API**: POST /api/files/upload

#### FileList.jsx
- **Responsabilidad**: Visualización de archivos
- **Props**: `files`, `onDownload`
- **UI**: Cards con info de archivo
- **Utilidades**: `formatFileSize()`, `formatDate()`

### Backend Services

#### s3Service.js
```javascript
uploadFileToS3(fileName, fileBuffer, mimeType)
  - PutObjectCommand
  - Retorna: fileKey

getFilesFromS3(limit = 3)
  - ListObjectsV2Command
  - Sort + slice
  - Retorna: array de archivos

downloadFileFromS3(fileKey)
  - GetObjectCommand
  - Stream → Buffer
  - Retorna: {buffer, contentType, fileName}

deleteFileFromS3(fileKey)
  - DeleteObjectCommand
  - Retorna: boolean
```

#### fileController.js
```javascript
uploadFile(req, res)
  - Valida archivo existe
  - Llama s3Service.uploadFileToS3()
  - Retorna: {message, fileKey, fileName}

getFiles(req, res)
  - Llama s3Service.getFilesFromS3(3)
  - Retorna: array de últimos 3 archivos

downloadFile(req, res)
  - Valida fileKey existe
  - Llama s3Service.downloadFileFromS3()
  - Set headers: Content-Type, Content-Disposition
  - Envía buffer
```

## 🗄️ Modelos de Datos

### File Object (desde S3)
```typescript
interface S3File {
  key: string;              // "1234567890-filename.pdf"
  size: number;             // bytes
  lastModified: Date;       // ISO string
  name: string;             // "filename.pdf"
}
```

### Upload Response
```typescript
interface UploadResponse {
  message: string;          // "File uploaded successfully"
  fileKey: string;          // clave S3
  fileName: string;         // nombre original
}
```

### Download Response
```typescript
interface DownloadData {
  buffer: Buffer;           // contenido del archivo
  contentType: string;      // MIME type
  fileName: string;         // nombre para descarga
}
```

## 🔐 Seguridad

### Frontend
- Validación de tipos de archivo (accept en dropzone)
- Manejo de errores con try-catch
- Sanitización de nombres en respuestas

### Backend
- Validación de archivo en multer
- Error handling con try-catch
- Valida parámetros de request
- Set headers apropiados en descarga

### S3/LocalStack
- Acceso público bloqueado
- Encriptación server-side (AES256)
- Versionado habilitado
- Ciclo de vida: elimina versiones viejas

### Contenedores
- CORS configurado para localhost
- Credenciales en variables de entorno
- .dockerignore para no incluir node_modules
- Networks aisladas en Docker Compose

## 🚀 Deployment

### Desarrollo Local
```bash
docker-compose up
```
- LocalStack: 4566
- Backend: 3000
- Frontend: 5173

### Producción
```bash
# Cambiar a AWS real
# Cambiar NODE_ENV a production
# Usar credenciales reales de AWS
# Habilitar HTTPS
# Configurar CORS apropiadamente
```

## 📊 Complejidad

| Componente | Complejidad | Razón |
|-----------|-------------|-------|
| Frontend | O(n) | Mapea n archivos a JSX |
| Backend Upload | O(1) | Put object en S3 |
| Backend List | O(n log n) | Sort de n objetos |
| Backend Download | O(n) | Stream de n bytes |
| S3 Operations | O(1) | Operaciones nativas |

## 🎯 Decisiones de Diseño

1. **Multer Memory Storage**: Para simplificar, no usa disk temporal
2. **React Hooks**: Moderno y simple, sin clases
3. **Vite**: Rápido que webpack
4. **LocalStack**: Simula AWS sin costo
5. **Docker Compose**: Fácil para desarrollo
6. **Terraform**: Infrastructure as Code best practice

---

**Última actualización**: 2024-06-10
