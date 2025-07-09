# 🎯 Generador de Presentaciones Educativas

Una aplicación web moderna para crear presentaciones educativas de forma rápida y fácil, con exportación a PDF y PPTX.

## ✨ Características

- 🎨 **3 plantillas predefinidas** (Clásica, Oscura Moderna, Elegante Clara)
- 📤 **Subir plantillas personalizadas** (.pptx)
- 📄 **Exportar a PDF y PPTX**
- 🖼️ **Generación automática de contenido** (simulado)
- 📱 **Diseño responsive** para todos los dispositivos
- ⚡ **Vista previa en tiempo real** con Swiper

## 🚀 Instalación

### Prerrequisitos
- Python 3.7+
- Navegador web moderno

### Pasos de instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/tu-usuario/generador_presentaciones.git
cd generador_presentaciones
```

2. **Instala las dependencias del backend:**
```bash
pip install flask flask-cors python-pptx
```

3. **Configura las variables de entorno (opcional):**
```bash
# Crea un archivo .env en la raíz del proyecto
OPENAI_API_KEY=tu_api_key_de_openai
UNSPLASH_API_KEY=tu_api_key_de_unsplash
```

4. **Ejecuta el backend:**
```bash
cd backend
python app.py
```

5. **Abre la aplicación:**
- Abre `index.html` en tu navegador
- O ejecuta un servidor local: `python -m http.server 8000`

## 📁 Estructura del Proyecto

```
generador_presentaciones/
├── index.html              # Landing page
├── style.css               # Estilos de la landing page
├── generador/
│   └── index.html          # Aplicación principal
├── backend/
│   └── app.py              # Servidor Flask
├── assets/
│   ├── css/                # Estilos de la aplicación
│   └── js/
│       └── generador.js    # Lógica principal
├── plantillas/             # Plantillas predefinidas
│   ├── plantilla1/
│   ├── plantilla2/
│   └── plantilla3/
└── img/                    # Imágenes del proyecto
```

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Python Flask
- **Librerías:**
  - Swiper.js (carrusel)
  - html2pdf.js (exportación PDF)
  - PptxGenJS (exportación PPTX)
  - html2canvas (captura de pantalla)
  - python-pptx (lectura de archivos PPTX)

## 📖 Uso

1. **Crear una presentación:**
   - Ingresa el título general
   - Escribe los títulos de las diapositivas (uno por línea)
   - Selecciona una plantilla
   - Haz clic en "Generar Presentación"

2. **Subir plantilla personalizada:**
   - Selecciona "Ninguna de las anteriores"
   - Sube tu archivo .pptx
   - Haz clic en "Subir y Mostrar"

3. **Exportar:**
   - Usa "Descargar PDF" para exportar como PDF
   - Usa "Descargar PPTX" para exportar como PowerPoint

## 🔧 Configuración de APIs (Opcional)

Para usar contenido generado por IA:

1. **OpenAI API:**
   - Regístrate en [OpenAI](https://openai.com)
   - Obtén tu API key
   - Configúrala en las variables de entorno

2. **Unsplash API:**
   - Regístrate en [Unsplash](https://unsplash.com/developers)
   - Obtén tu API key
   - Configúrala en las variables de entorno

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Brandon Pardo** - [GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- [Swiper.js](https://swiperjs.com/) por el carrusel
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) por la exportación PDF
- [PptxGenJS](https://github.com/gitbrent/PptxGenJS) por la exportación PPTX
- [Unsplash](https://unsplash.com/) por las imágenes de stock
- [OpenAI](https://openai.com/) por la generación de contenido

---

⭐ Si te gusta este proyecto, ¡dale una estrella! 