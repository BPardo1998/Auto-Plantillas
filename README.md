# 🚀 Generador de Presentaciones Educativas

> **Crea presentaciones impactantes con inteligencia artificial**

Una aplicación web moderna que genera presentaciones educativas usando IA, con exportación a PDF y PPTX, y soporte para plantillas personalizadas.

## ✨ Características

- 🤖 **Generación con IA**: Contenido educativo automático usando OpenAI
- 🖼️ **Imágenes automáticas**: Imágenes relacionadas desde Unsplash
- 📄 **Exportación múltiple**: PDF y PPTX con un clic
- 📁 **Plantillas personalizadas**: Sube tus propios archivos PPTX
- 📱 **Diseño responsivo**: Funciona en todos los dispositivos
- ⚡ **Interfaz moderna**: UX/UI optimizada y accesible

## 🛠️ Tecnologías

### Frontend
- HTML5, CSS3, JavaScript ES6+
- Librerías: jsPDF, PptxGenJS
- Diseño responsivo y accesible

### Backend
- **Flask**: Framework web de Python
- **OpenAI API**: Generación de contenido educativo
- **Unsplash API**: Imágenes de alta calidad
- **python-pptx**: Procesamiento de archivos PowerPoint

## 🚀 Despliegue en Render.com

### Paso 1: Preparar el repositorio

Asegúrate de que tu repositorio esté limpio y actualizado:

```bash
git add .
git commit -m "Preparar para despliegue en Render"
git push origin main
```

### Paso 2: Crear cuenta en Render

1. Ve a [render.com](https://render.com)
2. Crea una cuenta gratuita
3. Conecta tu cuenta de GitHub

### Paso 3: Crear nuevo servicio web

1. En el dashboard de Render, haz clic en **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Configura el servicio:

#### Configuración básica:
- **Name**: `generador-presentaciones-backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn backend.app:app`

### Paso 4: Configurar variables de entorno

En la sección "Environment Variables" de tu servicio, agrega:

```
OPENAI_API_KEY=tu_api_key_de_openai
UNSPLASH_API_KEY=tu_api_key_de_unsplash
```

### Paso 5: Desplegar el frontend

Para el frontend, puedes usar **GitHub Pages**:

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: `main` → `/ (root)`
5. Save

### Paso 6: Actualizar URLs

Una vez desplegado, actualiza la URL del backend en `script.js`:

```javascript
const BACKEND_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://tu-app-name.onrender.com'; // Tu URL de Render
```

## 🔧 Instalación local

### Prerrequisitos
- Python 3.8+
- pip
- Git

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/generador-presentaciones.git
cd generador-presentaciones
```

2. **Configurar entorno virtual**
```bash
python -m venv env
source env/bin/activate  # En Windows: env\Scripts\activate
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno**
```bash
cp env.example .env
# Edita .env con tus API keys
```

5. **Ejecutar el backend**
```bash
cd backend
python app.py
```

6. **Abrir el frontend**
- Abre `index.html` en tu navegador
- O usa un servidor local: `python -m http.server 8000`

## 🔑 Configuración de API Keys

### OpenAI API
1. Ve a [platform.openai.com](https://platform.openai.com)
2. Crea una cuenta y obtén tu API key
3. Agrega la key a tu archivo `.env`:
```
OPENAI_API_KEY=sk-tu-api-key-aqui
```

### Unsplash API
1. Ve a [unsplash.com/developers](https://unsplash.com/developers)
2. Crea una aplicación y obtén tu API key
3. Agrega la key a tu archivo `.env`:
```
UNSPLASH_API_KEY=tu-unsplash-access-key
```

## 📁 Estructura del proyecto

```
generador-presentaciones/
├── backend/
│   └── app.py              # Servidor Flask
├── index.html              # Página principal
├── style.css               # Estilos CSS
├── script.js               # Lógica del frontend
├── requirements.txt        # Dependencias Python
├── render.yaml            # Configuración Render
├── build.sh              # Script de construcción
├── .env                  # Variables de entorno (local)
├── env.example           # Ejemplo de variables
└── README.md             # Este archivo
```

## 🎯 Uso

1. **Generar contenido**: Escribe un título y haz clic en "Generar con IA"
2. **Subir plantilla**: Opcionalmente sube un archivo PPTX como base
3. **Vista previa**: Revisa las diapositivas generadas
4. **Exportar**: Descarga en PDF o PPTX

## 🔧 Desarrollo

### Backend (Flask)
```bash
cd backend
python app.py
```
Servidor disponible en: http://localhost:5000

### Frontend
```bash
python -m http.server 8000
```
Aplicación disponible en: http://localhost:8000

## 📊 Endpoints del API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/generar-contenido` | POST | Genera texto educativo con OpenAI |
| `/obtener-imagen` | POST | Obtiene imagen de Unsplash |
| `/subir-pptx` | POST | Procesa archivo PowerPoint |

## 🚨 Solución de problemas

### Error: "API key no configurada"
- Verifica que las variables de entorno estén configuradas
- En local: revisa el archivo `.env`
- En Render: revisa las Environment Variables

### Error: "CORS policy"
- El backend debe estar ejecutándose
- Verifica que la URL del backend sea correcta

### Error: "Module not found"
- Instala las dependencias: `pip install -r requirements.txt`
- Verifica que estés en el entorno virtual

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Brandon Pardo** - [GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- [Swiper.js](https://swiperjs.com/) por el carrusel
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) por la exportación PDF
- [PptxGenJS](https://github.com/gitbrent/PptxGenJS) por la exportación PPTX
- [Unsplash](https://unsplash.com/) por las imágenes de stock
- [OpenAI](https://openai.com/) por la generación de contenido

---

⭐ **¡Dale una estrella si te gustó el proyecto!** 