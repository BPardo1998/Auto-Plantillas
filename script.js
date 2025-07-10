// 🚀 GENERADOR DE PRESENTACIONES EDUCATIVAS - FRONTEND
// ===================================================
// 
// 📋 DESCRIPCIÓN:
// Este archivo contiene toda la lógica del frontend para el generador de presentaciones.
// Maneja la interacción con el backend, generación de contenido y exportación.
//
// 🔧 FUNCIONALIDADES:
// 1. Generar contenido educativo con IA
// 2. Obtener imágenes relacionadas
// 3. Crear presentaciones dinámicas
// 4. Exportar a PDF y PPTX
// 5. Subir y procesar plantillas PPTX

// ===================================================
// ⚙️ CONFIGURACIÓN
// ===================================================

// 🌐 URL del backend - Cambia según el entorno
const BACKEND_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://auto-plantillas.onrender.com'; // Reemplaza con tu URL real de Render

// 📊 Variables globales
let presentacionActual = [];
let plantillaActual = null;

// ===================================================
// 🎯 FUNCIONES PRINCIPALES
// ===================================================

/**
 * 🤖 Genera contenido educativo usando OpenAI
 * @param {string} titulo - Título del tema a explicar
 * @returns {Promise<string>} - Texto generado por IA
 */
async function generarContenido(titulo) {
    try {
        mostrarCargando('Generando contenido educativo...');
        
        const response = await fetch(`${BACKEND_URL}/generar-contenido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo })
        });

        if (!response.ok) {
            throw new Error('Error al generar contenido');
        }

        const data = await response.json();
        ocultarCargando();
        return data.texto;
    } catch (error) {
        ocultarCargando();
        mostrarError('Error al generar contenido: ' + error.message);
        return null;
    }
}

/**
 * 🖼️ Obtiene imagen relacionada desde Unsplash
 * @param {string} query - Palabra clave para buscar
 * @returns {Promise<string>} - URL de la imagen
 */
async function obtenerImagen(query) {
    try {
        mostrarCargando('Obteniendo imagen relacionada...');
        
        const response = await fetch(`${BACKEND_URL}/obtener-imagen`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error('Error al obtener imagen');
        }

        const data = await response.json();
        ocultarCargando();
        return data.imagen;
    } catch (error) {
        ocultarCargando();
        mostrarError('Error al obtener imagen: ' + error.message);
        return null;
    }
}

/**
 * 📄 Procesa archivo PPTX subido por el usuario
 * @param {File} archivo - Archivo .pptx
 * @returns {Promise<Array>} - Array de diapositivas en HTML
 */
async function procesarPPTX(archivo) {
    try {
        mostrarCargando('Procesando plantilla PPTX...');
        
        const formData = new FormData();
        formData.append('archivo', archivo);

        const response = await fetch(`${BACKEND_URL}/subir-pptx`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al procesar archivo PPTX');
        }

        const data = await response.json();
        ocultarCargando();
        return data.slides;
    } catch (error) {
        ocultarCargando();
        mostrarError('Error al procesar PPTX: ' + error.message);
        return null;
    }
}

// ===================================================
// 🎨 FUNCIONES DE INTERFAZ
// ===================================================

/**
 * 📝 Crea una nueva diapositiva en la presentación
 * @param {string} titulo - Título de la diapositiva
 * @param {string} contenido - Contenido de la diapositiva
 * @param {string} imagen - URL de la imagen (opcional)
 */
function crearDiapositiva(titulo, contenido, imagen = null) {
    const slide = {
        id: Date.now(),
        titulo,
        contenido,
        imagen
    };

    presentacionActual.push(slide);
    actualizarVistaPrevia();
    mostrarExito('Diapositiva agregada exitosamente');
}

/**
 * 👁️ Actualiza la vista previa de la presentación
 */
function actualizarVistaPrevia() {
    const contenedor = document.getElementById('vista-previa');
    if (!contenedor) return;

    contenedor.innerHTML = presentacionActual.map((slide, index) => `
        <div class="slide-preview" data-slide-id="${slide.id}">
            <h3>Diapositiva ${index + 1}: ${slide.titulo}</h3>
            <p>${slide.contenido}</p>
            ${slide.imagen ? `<img src="${slide.imagen}" alt="Imagen" style="max-width: 200px;">` : ''}
            <button onclick="eliminarDiapositiva(${slide.id})" class="btn-eliminar">🗑️ Eliminar</button>
        </div>
    `).join('');
}

/**
 * 🗑️ Elimina una diapositiva de la presentación
 * @param {number} id - ID de la diapositiva a eliminar
 */
function eliminarDiapositiva(id) {
    presentacionActual = presentacionActual.filter(slide => slide.id !== id);
    actualizarVistaPrevia();
    mostrarExito('Diapositiva eliminada');
}

// ===================================================
// 📤 FUNCIONES DE EXPORTACIÓN
// ===================================================

/**
 * 📄 Exporta la presentación a PDF
 */
async function exportarPDF() {
    try {
        mostrarCargando('Generando PDF...');
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        presentacionActual.forEach((slide, index) => {
            if (index > 0) pdf.addPage();
            
            pdf.setFontSize(20);
            pdf.text(slide.titulo, 20, 30);
            
            pdf.setFontSize(12);
            const lineas = pdf.splitTextToSize(slide.contenido, 170);
            pdf.text(lineas, 20, 50);
        });
        
        pdf.save('presentacion-educativa.pdf');
        ocultarCargando();
        mostrarExito('PDF generado exitosamente');
    } catch (error) {
        ocultarCargando();
        mostrarError('Error al generar PDF: ' + error.message);
    }
}

/**
 * 📊 Exporta la presentación a PPTX
 */
async function exportarPPTX() {
    try {
        mostrarCargando('Generando PPTX...');
        
        // Usar la librería PptxGenJS para crear el archivo
        const pptx = new PptxGenJS();
        
        presentacionActual.forEach((slide, index) => {
            const pptxSlide = pptx.addSlide();
            
            pptxSlide.addText(slide.titulo, {
                x: 0.5, y: 0.5, w: 9, h: 1,
                fontSize: 24, bold: true
            });
            
            pptxSlide.addText(slide.contenido, {
                x: 0.5, y: 1.8, w: 9, h: 4,
                fontSize: 14
            });
            
            if (slide.imagen) {
                pptxSlide.addImage({
                    path: slide.imagen,
                    x: 6, y: 1.8, w: 3, h: 2
                });
            }
        });
        
        pptx.writeFile({ fileName: 'presentacion-educativa.pptx' });
        ocultarCargando();
        mostrarExito('PPTX generado exitosamente');
    } catch (error) {
        ocultarCargando();
        mostrarError('Error al generar PPTX: ' + error.message);
    }
}

// ===================================================
// 🎮 MANEJADORES DE EVENTOS
// ===================================================

/**
 * 🎯 Maneja el envío del formulario principal
 */
async function manejarEnvioFormulario(event) {
    event.preventDefault();
    
    const titulo = document.getElementById('titulo').value.trim();
    if (!titulo) {
        mostrarError('Por favor ingresa un título');
        return;
    }

    try {
        // Generar contenido con IA
        const contenido = await generarContenido(titulo);
        if (!contenido) return;

        // Obtener imagen relacionada
        const imagen = await obtenerImagen(titulo);
        
        // Crear diapositiva
        crearDiapositiva(titulo, contenido, imagen);
        
        // Limpiar formulario
        document.getElementById('titulo').value = '';
        
    } catch (error) {
        mostrarError('Error al procesar la solicitud: ' + error.message);
    }
}

/**
 * 📁 Maneja la subida de archivos PPTX
 */
async function manejarSubidaPPTX(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    if (!archivo.name.endsWith('.pptx')) {
        mostrarError('Por favor selecciona un archivo .pptx válido');
        return;
    }

    const slides = await procesarPPTX(archivo);
    if (slides) {
        // Mostrar las diapositivas procesadas
        mostrarPlantillaProcesada(slides);
    }
}

// ===================================================
// 🎨 FUNCIONES DE UTILIDAD
// ===================================================

/**
 * ⏳ Muestra indicador de carga
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarCargando(mensaje) {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.textContent = mensaje;
        loader.style.display = 'block';
    }
}

/**
 * ✅ Oculta indicador de carga
 */
function ocultarCargando() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

/**
 * ✅ Muestra mensaje de éxito
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarExito(mensaje) {
    mostrarNotificacion(mensaje, 'exito');
}

/**
 * ❌ Muestra mensaje de error
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarError(mensaje) {
    mostrarNotificacion(mensaje, 'error');
}

/**
 * 📢 Muestra notificación genérica
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de notificación (exito/error)
 */
function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// ===================================================
// 🚀 INICIALIZACIÓN
// ===================================================

/**
 * 🎯 Inicializa la aplicación cuando se carga la página
 */
function inicializarApp() {
    console.log('🚀 Iniciando Generador de Presentaciones...');
    
    // Configurar manejadores de eventos
    const formulario = document.getElementById('formulario-generador');
    if (formulario) {
        formulario.addEventListener('submit', manejarEnvioFormulario);
    }
    
    const inputPPTX = document.getElementById('archivo-pptx');
    if (inputPPTX) {
        inputPPTX.addEventListener('change', manejarSubidaPPTX);
    }
    
    // Configurar botones de exportación
    const btnPDF = document.getElementById('exportar-pdf');
    if (btnPDF) {
        btnPDF.addEventListener('click', exportarPDF);
    }
    
    const btnPPTX = document.getElementById('exportar-pptx');
    if (btnPPTX) {
        btnPPTX.addEventListener('click', exportarPPTX);
    }
    
    console.log('✅ Aplicación inicializada correctamente');
}

// 🚀 Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarApp);
