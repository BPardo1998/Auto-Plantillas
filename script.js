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
// 6. Manejo de plantillas predefinidas
// 7. Generación de múltiples diapositivas

console.log('🚀 Iniciando script.js - Generador de Presentaciones Educativas');

// ===================================================
// ⚙️ CONFIGURACIÓN INICIAL
// ===================================================

// 🌐 URL del backend - Cambia según el entorno
const BACKEND_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://auto-plantillas.onrender.com';

console.log('📍 Backend URL configurada:', BACKEND_URL);

// 📊 Variables globales para el estado de la aplicación
let presentacionActual = [];        // Array que almacena todas las diapositivas generadas
let plantillaActual = null;         // Plantilla PPTX personalizada si se sube
let plantillaSeleccionada = 'plantilla1'; // Plantilla activa por defecto

console.log('✅ Variables globales inicializadas');

// 📋 Configuración de plantillas disponibles con sus estilos y rutas
const PLANTILLAS = {
    plantilla1: {
        nombre: 'Plantilla 1 - Clásica Azul',
        html: '../plantillas/plantilla1/index.html',
        css: '../plantillas/plantilla1/style.css'
    },
    plantilla2: {
        nombre: 'Plantilla 2 - Oscura Moderna',
        html: '../plantillas/plantilla2/index.html',
        css: '../plantillas/plantilla2/style.css'
    },
    plantilla3: {
        nombre: 'Plantilla 3 - Elegante Clara',
        html: '../plantillas/plantilla3/index.html',
        css: '../plantillas/plantilla3/style.css'
    }
};

console.log('🎨 Plantillas configuradas:', Object.keys(PLANTILLAS));

// ===================================================
// 🌐 FUNCIONES DE COMUNICACIÓN CON BACKEND
// ===================================================

/**
 * 🤖 Genera contenido educativo usando OpenAI
 * @param {string} titulo - Título del tema a explicar
 * @returns {Promise<string>} - Texto generado por IA
 */
async function generarContenido(titulo) {
    console.log('🤖 Iniciando generación de contenido para:', titulo);
    
    try {
        const response = await fetch(`${BACKEND_URL}/generar-contenido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo })
        });

        if (!response.ok) {
            throw new Error('Error al generar contenido');
        }

        const data = await response.json();
        console.log('✅ Contenido generado exitosamente');
        return data.texto;
    } catch (error) {
        console.error('❌ Error al generar contenido:', error);
        throw new Error('Error al generar contenido: ' + error.message);
    }
}

/**
 * 🖼️ Obtiene imagen relacionada desde Unsplash
 * @param {string} query - Palabra clave para buscar
 * @returns {Promise<string>} - URL de la imagen
 */
async function obtenerImagen(query) {
    console.log('🖼️ Buscando imagen para:', query);
    
    try {
        const response = await fetch(`${BACKEND_URL}/obtener-imagen`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error('Error al obtener imagen');
        }

        const data = await response.json();
        console.log('✅ Imagen obtenida exitosamente');
        return data.imagen;
    } catch (error) {
        console.warn('⚠️ No se pudo obtener imagen para:', query);
        return null;
    }
}

/**
 * 📄 Procesa archivo PPTX subido por el usuario
 * @param {File} archivo - Archivo .pptx
 * @returns {Promise<Array>} - Array de diapositivas en HTML
 */
async function procesarPPTX(archivo) {
    console.log('📄 Procesando archivo PPTX:', archivo.name);
    
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
        console.log('✅ PPTX procesado exitosamente');
        return data.slides;
    } catch (error) {
        ocultarCargando();
        console.error('❌ Error al procesar PPTX:', error);
        mostrarError('Error al procesar PPTX: ' + error.message);
        return null;
    }
}

// ===================================================
// 🎨 FUNCIONES DE MANEJO DE PLANTILLAS
// ===================================================

/**
 * 🎨 Carga los estilos de una plantilla específica
 * @param {string} plantillaId - ID de la plantilla
 */
async function cargarEstilosPlantilla(plantillaId) {
    console.log('🎨 Cargando estilos de plantilla:', plantillaId);
    
    if (plantillaId === 'personalizada') {
        console.log('📁 Plantilla personalizada seleccionada');
        return;
    }
    
    const plantilla = PLANTILLAS[plantillaId];
    if (!plantilla) {
        console.warn('⚠️ Plantilla no encontrada:', plantillaId);
        return;
    }
    
    try {
        // Cargar CSS de la plantilla dinámicamente
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = plantilla.css;
        link.id = `css-${plantillaId}`;
        
        // Remover CSS anterior si existe para evitar conflictos
        const cssAnterior = document.getElementById(`css-${plantillaSeleccionada}`);
        if (cssAnterior) {
            cssAnterior.remove();
            console.log('🗑️ CSS anterior removido');
        }
        
        document.head.appendChild(link);
        plantillaSeleccionada = plantillaId;
        console.log('✅ Estilos de plantilla cargados:', plantillaId);
    } catch (error) {
        console.error('❌ Error al cargar estilos de plantilla:', error);
    }
}

/**
 * 📝 Crea una nueva diapositiva con la plantilla seleccionada
 * @param {string} titulo - Título de la diapositiva
 * @param {string} contenido - Contenido de la diapositiva
 * @param {string} imagen - URL de la imagen (opcional)
 */
function crearDiapositiva(titulo, contenido, imagen = null) {
    console.log('📝 Creando diapositiva:', titulo);
    
    const slide = {
        id: Date.now() + Math.random(), // ID único para cada diapositiva
        titulo,
        contenido,
        imagen,
        plantilla: plantillaSeleccionada
    };

    presentacionActual.push(slide);
    console.log('✅ Diapositiva creada. Total:', presentacionActual.length);
}

/**
 * 👁️ Actualiza la vista previa de la presentación en tiempo real
 */
function actualizarVistaPrevia() {
    console.log('👁️ Actualizando vista previa...');
    
    const contenedor = document.getElementById('vista-previa');
    if (!contenedor) {
        console.warn('⚠️ Contenedor de vista previa no encontrado');
        return;
    }

    if (presentacionActual.length === 0) {
        contenedor.innerHTML = '<p class="empty-state">📝 No hay diapositivas aún. ¡Genera tu presentación completa!</p>';
        console.log('📝 Vista previa vacía mostrada');
        return;
    }

    // Generar HTML para cada diapositiva con sus estilos específicos
    contenedor.innerHTML = presentacionActual.map((slide, index) => {
        const plantillaClass = slide.plantilla || 'plantilla1';
        const imagenHtml = slide.imagen ? `<img src="${slide.imagen}" alt="Imagen" style="max-width: 200px;">` : '';
        
        return `
            <div class="slide-preview ${plantillaClass}" data-slide-id="${slide.id}">
                <div class="slide ${plantillaClass}">
                    <h2>Diapositiva ${index + 1}: ${slide.titulo}</h2>
                    <div class="slide-content">
                        <p>${slide.contenido}</p>
                        ${imagenHtml}
                    </div>
                </div>
                <button onclick="eliminarDiapositiva(${slide.id})" class="btn-eliminar">🗑️ Eliminar</button>
            </div>
        `;
    }).join('');
    
    console.log('✅ Vista previa actualizada con', presentacionActual.length, 'diapositivas');
}

/**
 * 🗑️ Elimina una diapositiva específica de la presentación
 * @param {number} id - ID de la diapositiva a eliminar
 */
function eliminarDiapositiva(id) {
    console.log('🗑️ Eliminando diapositiva con ID:', id);
    
    const diapositivaOriginal = presentacionActual.length;
    presentacionActual = presentacionActual.filter(slide => slide.id !== id);
    
    if (presentacionActual.length < diapositivaOriginal) {
        actualizarVistaPrevia();
        mostrarExito('Diapositiva eliminada');
        console.log('✅ Diapositiva eliminada. Restantes:', presentacionActual.length);
    } else {
        console.warn('⚠️ No se encontró la diapositiva para eliminar');
    }
}

/**
 * 📊 Actualiza el contador de diapositivas en tiempo real
 */
function actualizarContador() {
    console.log('📊 Actualizando contador de diapositivas...');
    
    const textarea = document.getElementById('titulos');
    const contador = document.getElementById('contador-diapositivas');
    
    if (textarea && contador) {
        // Contar líneas no vacías
        const lineas = textarea.value.split('\n').filter(linea => linea.trim() !== '');
        const cantidad = Math.min(lineas.length, 10);
        contador.textContent = cantidad;
        
        // Cambiar color si excede el límite
        if (lineas.length > 10) {
            contador.style.color = 'var(--error-color)';
            console.warn('⚠️ Excedido límite de 10 diapositivas');
        } else {
            contador.style.color = 'var(--text-secondary)';
        }
        
        console.log('✅ Contador actualizado:', cantidad, 'diapositivas');
    }
}

// ===================================================
// 📤 FUNCIONES DE EXPORTACIÓN AVANZADA
// ===================================================

// =========================
// 📄 Exportar a PDF (restaurado)
// =========================
async function exportarPDF() {
    try {
        if (presentacionActual.length === 0) {
            mostrarError('No hay diapositivas para exportar');
            return;
        }
        mostrarCargando('Generando PDF...');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '800px';
        tempContainer.style.height = '600px';
        document.body.appendChild(tempContainer);
        try {
            for (let i = 0; i < presentacionActual.length; i++) {
                const slide = presentacionActual[i];
                const plantillaClass = slide.plantilla || 'plantilla1';
                const slideElement = document.createElement('div');
                slideElement.className = `slide ${plantillaClass}`;
                slideElement.style.width = '800px';
                slideElement.style.height = '600px';
                slideElement.style.padding = '40px';
                slideElement.style.boxSizing = 'border-box';
                slideElement.style.display = 'flex';
                slideElement.style.flexDirection = 'column';
                slideElement.style.alignItems = 'center';
                slideElement.style.justifyContent = 'flex-start';
                slideElement.style.background = plantillaClass === 'plantilla1' ? 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' : plantillaClass === 'plantilla2' ? 'linear-gradient(135deg, #1e3c72, #2a5298)' : '#fff';
                slideElement.style.color = plantillaClass === 'plantilla3' ? '#333' : '#fff';
                slideElement.style.fontFamily = plantillaClass === 'plantilla3' ? 'Poppins, sans-serif' : 'Segoe UI, sans-serif';
                slideElement.innerHTML = `
                    <h2 style="font-size: 32px; margin-bottom: 30px; text-align: center; color: ${plantillaClass === 'plantilla1' ? '#00f0ff' : plantillaClass === 'plantilla2' ? '#fff' : '#3a3a3a'}; text-shadow: ${plantillaClass === 'plantilla1' ? '0 0 8px #00f0ff88' : plantillaClass === 'plantilla2' ? '1px 1px 3px rgba(0,0,0,0.3)' : 'none'};">${slide.titulo}</h2>
                    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%;">
                        <p style="font-size: 18px; line-height: 1.6; text-align: center; max-width: 600px; color: ${plantillaClass === 'plantilla1' ? '#fff' : plantillaClass === 'plantilla2' ? '#e0e0e0' : '#333'};">${slide.contenido}</p>
                        ${slide.imagen ? `<img src="${slide.imagen}" alt="Imagen" style="max-width: 300px; max-height: 200px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.3); margin-top: 20px;">` : ''}
                    </div>
                `;
                tempContainer.appendChild(slideElement);
                if (slide.imagen) {
                    await new Promise((resolve) => {
                        const img = slideElement.querySelector('img');
                        if (img) { img.onload = resolve; img.onerror = resolve; } else { resolve(); }
                    });
                }
                const canvas = await html2canvas(slideElement, { width: 800, height: 600, scale: 2, useCORS: true, allowTaint: true, backgroundColor: null });
                const imgData = canvas.toDataURL('image/png');
                if (i > 0) pdf.addPage();
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pdfWidth - 20;
                const imgHeight = (imgWidth * 600) / 800;
                const x = 10;
                const y = (pdfHeight - imgHeight) / 2;
                pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
                tempContainer.removeChild(slideElement);
            }
            pdf.save('presentacion-educativa.pdf');
            ocultarCargando();
            mostrarExito('PDF generado exitosamente');
        } finally {
            if (tempContainer.parentNode) tempContainer.parentNode.removeChild(tempContainer);
        }
    } catch (error) {
        ocultarCargando();
        mostrarError('Error al generar PDF: ' + error.message);
    }
}

// =========================
// 📊 Exportar a PPTX (restaurado)
// =========================
async function exportarPPTX() {
    try {
        if (presentacionActual.length === 0) {
            mostrarError('No hay diapositivas para exportar');
            return;
        }
        mostrarCargando('Generando PPTX...');
        const pptx = new PptxGenJS();
        presentacionActual.forEach((slide) => {
            const pptxSlide = pptx.addSlide();
            const plantillaClass = slide.plantilla || 'plantilla1';
            let backgroundColor, titleColor, textColor, fontSize;
            if (plantillaClass === 'plantilla1') {
                backgroundColor = { color: '0f2027' };
                titleColor = '00f0ff';
                textColor = 'ffffff';
                fontSize = 24;
            } else if (plantillaClass === 'plantilla2') {
                backgroundColor = { color: '1e3c72' };
                titleColor = 'ffffff';
                textColor = 'e0e0e0';
                fontSize = 26;
            } else if (plantillaClass === 'plantilla3') {
                backgroundColor = { color: 'ffffff' };
                titleColor = '3a3a3a';
                textColor = '333333';
                fontSize = 22;
            }
            pptxSlide.background = backgroundColor;
            // Título arriba
            pptxSlide.addText(slide.titulo, {
                x: 0.5, y: 0.3, w: 9, h: 1,
                fontSize: fontSize,
                bold: true,
                color: titleColor,
                align: 'center',
                fontFace: 'Arial'
            });
            // Texto justificado, interlineado 1, bien centrado
            pptxSlide.addText(slide.contenido, {
                x: 1, y: 1.5, w: 8, h: 3.5,
                fontSize: 16,
                color: textColor,
                align: 'justify',
                fontFace: 'Arial',
                lineSpacing: 1
            });
            // Imagen centrada abajo
            if (slide.imagen) {
                pptxSlide.addImage({
                    path: slide.imagen,
                    x: 2.5, y: 5.2, w: 5, h: 2.5,
                    sizing: { type: 'contain', w: 5, h: 2.5 }
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
// 🎯 MANEJADORES DE EVENTOS PRINCIPALES
// ===================================================

/**
 * 📝 Maneja el envío del formulario de generación de presentación completa
 * @param {Event} event - Evento del formulario
 */
async function manejarEnvioFormulario(event) {
    console.log('📝 Iniciando manejo de envío de formulario...');
    
    event.preventDefault();
    
    const titulosText = document.getElementById('titulos').value.trim();
    const plantilla = document.getElementById('plantilla-select').value;
    
    console.log('📋 Datos del formulario:', { titulos: titulosText, plantilla });
    
    if (!titulosText) {
        console.warn('⚠️ No se ingresó ningún título');
        mostrarError('Por favor ingresa al menos un título');
        return;
    }
    
    if (!plantilla) {
        console.warn('⚠️ No se seleccionó plantilla');
        mostrarError('Por favor selecciona una plantilla');
        return;
    }
    
    // Separar títulos por líneas y filtrar vacíos
    const titulos = titulosText.split('\n')
        .map(titulo => titulo.trim())
        .filter(titulo => titulo !== '');
    
    console.log('📝 Títulos procesados:', titulos);
    
    if (titulos.length === 0) {
        console.warn('⚠️ No hay títulos válidos');
        mostrarError('Por favor ingresa al menos un título válido');
        return;
    }
    
    if (titulos.length > 10) {
        console.warn('⚠️ Excedido límite de 10 diapositivas');
        mostrarError('Máximo 10 diapositivas permitidas');
        return;
    }
    
    // Cargar estilos de la plantilla seleccionada
    console.log('🎨 Cargando estilos de plantilla:', plantilla);
    await cargarEstilosPlantilla(plantilla);
    
    // Limpiar presentación actual
    presentacionActual = [];
    console.log('🗑️ Presentación anterior limpiada');
    
    // Mostrar progreso
    mostrarCargando(`Generando ${titulos.length} diapositivas...`);
    
    try {
        // Generar todas las diapositivas secuencialmente
        for (let i = 0; i < titulos.length; i++) {
            const titulo = titulos[i];
            
            console.log(`🔄 Procesando diapositiva ${i + 1}/${titulos.length}:`, titulo);
            
            // Actualizar mensaje de carga
            mostrarCargando(`Generando diapositiva ${i + 1} de ${titulos.length}: ${titulo}`);
            
            // Generar contenido con IA
            console.log('🤖 Generando contenido con IA...');
            const contenido = await generarContenido(titulo);
            if (!contenido) {
                console.warn('⚠️ No se pudo generar contenido para:', titulo);
                continue;
            }
            
            // Obtener imagen relacionada
            console.log('🖼️ Obteniendo imagen relacionada...');
            const imagen = await obtenerImagen(titulo);
            
            // Crear diapositiva
            crearDiapositiva(titulo, contenido, imagen);
            
            // Actualizar vista previa en tiempo real
            actualizarVistaPrevia();
            
            console.log(`✅ Diapositiva ${i + 1} completada`);
        }
        
        ocultarCargando();
        console.log('🎉 Presentación generada exitosamente:', presentacionActual.length, 'diapositivas');
        mostrarExito(`¡Presentación generada exitosamente! ${presentacionActual.length} diapositivas creadas.`);
        
        // Limpiar formulario
        document.getElementById('titulos').value = '';
        actualizarContador();
        console.log('🧹 Formulario limpiado');
        
    } catch (error) {
        ocultarCargando();
        console.error('❌ Error al generar la presentación:', error);
        mostrarError('Error al generar la presentación: ' + error.message);
    }
}

/**
 * 📁 Maneja la subida de archivos PPTX personalizados
 * @param {Event} event - Evento del input file
 */
async function manejarSubidaPPTX(event) {
    console.log('📁 Iniciando manejo de subida de PPTX...');
    
    const archivo = event.target.files[0];
    if (!archivo) {
        console.warn('⚠️ No se seleccionó archivo');
        return;
    }
    
    console.log('📄 Archivo seleccionado:', archivo.name);
    
    if (!archivo.name.endsWith('.pptx')) {
        console.warn('⚠️ Archivo no es PPTX');
        mostrarError('Por favor selecciona un archivo .pptx');
        return;
    }
    
    const slides = await procesarPPTX(archivo);
    if (slides) {
        plantillaActual = slides;
        console.log('✅ Plantilla PPTX cargada exitosamente');
        mostrarExito('Plantilla PPTX cargada exitosamente');
    }
}

/**
 * 🎨 Maneja el cambio de plantilla en el selector
 * @param {Event} event - Evento del select
 */
function manejarCambioPlantilla(event) {
    const plantilla = event.target.value;
    console.log('🎨 Cambio de plantilla seleccionada:', plantilla);
    
    const panelPersonalizada = document.getElementById('panel-personalizada');
    
    if (plantilla === 'personalizada') {
        panelPersonalizada.style.display = 'block';
        console.log('📁 Panel de plantilla personalizada mostrado');
    } else {
        panelPersonalizada.style.display = 'none';
        console.log('📁 Panel de plantilla personalizada ocultado');
    }
}

// ===================================================
// 🎨 FUNCIONES DE INTERFAZ DE USUARIO
// ===================================================

/**
 * ⏳ Muestra el indicador de carga con mensaje personalizado
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarCargando(mensaje) {
    console.log('⏳ Mostrando cargador:', mensaje);
    
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    
    if (loader && loaderText) {
        loaderText.textContent = mensaje;
        loader.style.display = 'flex';
    } else {
        console.warn('⚠️ Elementos de loader no encontrados');
    }
}

/**
 * ✅ Oculta el indicador de carga
 */
function ocultarCargando() {
    console.log('✅ Ocultando cargador');
    
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    } else {
        console.warn('⚠️ Elemento de loader no encontrado');
    }
}

/**
 * ✅ Muestra notificación de éxito
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarExito(mensaje) {
    console.log('✅ Mostrando notificación de éxito:', mensaje);
    mostrarNotificacion(mensaje, 'exito');
}

/**
 * ❌ Muestra notificación de error
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarError(mensaje) {
    console.error('❌ Mostrando notificación de error:', mensaje);
    mostrarNotificacion(mensaje, 'error');
}

/**
 * 📢 Muestra una notificación genérica con auto-eliminación
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de notificación ('exito' o 'error')
 */
function mostrarNotificacion(mensaje, tipo) {
    console.log(`📢 Mostrando notificación (${tipo}):`, mensaje);
    
    const notifications = document.getElementById('notifications');
    if (!notifications) {
        console.warn('⚠️ Contenedor de notificaciones no encontrado');
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = `notificacion ${tipo}`;
    notification.textContent = mensaje;
    
    notifications.appendChild(notification);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
            console.log('🗑️ Notificación auto-eliminada');
        }
    }, 5000);
}

// ===================================================
// 🚀 INICIALIZACIÓN DE LA APLICACIÓN
// ===================================================

/**
 * 🎯 Inicializa la aplicación según el contexto (landing page o generador)
 */
function inicializarApp() {
    console.log('🚀 Inicializando aplicación...');
    
    // Detectar si estamos en la landing page o en el generador
    const isLandingPage = !window.location.pathname.includes('generador');
    
    console.log('📍 Contexto detectado:', isLandingPage ? 'Landing Page' : 'Generador');
    
    if (isLandingPage) {
        // 🎨 Animaciones para la landing page
        console.log('🎨 Inicializando landing page...');
        inicializarLandingPage();
    } else {
        // 🤖 Funcionalidad del generador
        console.log('🤖 Inicializando generador...');
        inicializarGenerador();
    }
}

/**
 * 🎨 Inicializa las animaciones y funcionalidades de la landing page
 */
function inicializarLandingPage() {
    console.log('🎨 Configurando animaciones de landing page...');
    
    // Animaciones de scroll suave para los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                console.log('📜 Scroll suave ejecutado');
            }
        });
    });
    
    // Configurar animación de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                console.log('✨ Elemento animado:', entry.target.className);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación de entrada
    const elementosAnimables = document.querySelectorAll('.feature-card, .benefit-item, .step-item');
    elementosAnimables.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    console.log('✅ Animaciones de landing page configuradas para', elementosAnimables.length, 'elementos');
}

/**
 * 🤖 Inicializa todas las funcionalidades del generador de presentaciones
 */
function inicializarGenerador() {
    console.log('🤖 Configurando funcionalidades del generador...');
    
    // 📝 Configurar formulario de generación
    const formulario = document.getElementById('formulario-generador');
    if (formulario) {
        formulario.addEventListener('submit', manejarEnvioFormulario);
        console.log('✅ Formulario de generación configurado');
    } else {
        console.warn('⚠️ Formulario de generación no encontrado');
    }
    
    // 🎨 Configurar selector de plantillas
    const selectorPlantilla = document.getElementById('plantilla-select');
    if (selectorPlantilla) {
        selectorPlantilla.addEventListener('change', manejarCambioPlantilla);
        console.log('✅ Selector de plantillas configurado');
    } else {
        console.warn('⚠️ Selector de plantillas no encontrado');
    }
    
    // 📝 Configurar contador de diapositivas
    const textareaTitulos = document.getElementById('titulos');
    if (textareaTitulos) {
        textareaTitulos.addEventListener('input', actualizarContador);
        actualizarContador(); // Inicializar contador
        console.log('✅ Contador de diapositivas configurado');
    } else {
        console.warn('⚠️ Textarea de títulos no encontrado');
    }
    
    // 📁 Configurar subida de archivos PPTX
    const inputPPTX = document.getElementById('archivo-pptx');
    if (inputPPTX) {
        inputPPTX.addEventListener('change', manejarSubidaPPTX);
        console.log('✅ Input de PPTX configurado');
    } else {
        console.warn('⚠️ Input de PPTX no encontrado');
    }
    
    // 📤 Configurar botones de exportación
    const btnPDF = document.getElementById('exportar-pdf');
    if (btnPDF) {
        btnPDF.addEventListener('click', exportarPDF);
        console.log('✅ Botón PDF configurado');
    } else {
        console.warn('⚠️ Botón PDF no encontrado');
    }
    
    const btnPPTX = document.getElementById('exportar-pptx');
    if (btnPPTX) {
        btnPPTX.addEventListener('click', exportarPPTX);
        console.log('✅ Botón PPTX configurado');
    } else {
        console.warn('⚠️ Botón PPTX no encontrado');
    }
    
    // 🎯 Inicializar vista previa
    actualizarVistaPrevia();
    
    // 🎨 Cargar plantilla por defecto
    cargarEstilosPlantilla('plantilla1');
    
    console.log('✅ Generador completamente inicializado');
}

// 🚀 Inicializar cuando el DOM esté completamente cargado
console.log('📋 Esperando carga del DOM...');
document.addEventListener('DOMContentLoaded', inicializarApp);
