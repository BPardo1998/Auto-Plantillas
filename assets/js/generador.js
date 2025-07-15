// ✅ GENERADOR DE PRESENTACIONES EDUCATIVAS CON DESCARGAS PDF Y PPTX
// 👉 Explicado paso a paso como si tuvieras 14 años

// 1. Cuando se hace clic en el botón "Generar presentación"
document.getElementById('formulario-generador').addEventListener('submit', async function (e) {
  e.preventDefault(); // Esto evita que la página se recargue al enviar el formulario

  const titulosSlides = document.getElementById('titulos').value.split('\n').filter(t => t.trim() !== '');
  const plantillaSeleccionada = document.getElementById('plantilla-select').value;

  console.log("Títulos de las diapositivas:", titulosSlides);
  console.log("Plantilla seleccionada:", plantillaSeleccionada);

  const slides = [];
  for (let titulo of titulosSlides) {
    const texto = await obtenerTextoDesdeAPI(titulo); // Pide texto desde la API o simulado
    const imagen = await obtenerImagenDesdeAPI(titulo); // Pide imagen desde Unsplash o local
    slides.push({ titulo, texto, imagen });
    console.log("Diapositiva generada:", { titulo, texto, imagen });
  }

  // Muestra las diapositivas en pantalla
  renderizarDiapositivas(slides, plantillaSeleccionada);
});

// 2. Esta función crea el HTML de cada diapositiva y lo pone en el carrusel
function renderizarDiapositivas(slides, plantilla) {
  slidesActuales = slides;
  plantillaActual = plantilla;

    // ✅ Cargar dinámicamente el CSS correcto
const cssPrevio = document.getElementById('css-plantilla');
if (cssPrevio) cssPrevio.remove();

// ✅ Solo carga CSS si es plantilla1, plantilla2 o plantilla3
if (plantilla.startsWith('plantilla')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `../plantillas/${plantilla}/style.css`;
  link.id = 'css-plantilla';
  document.head.appendChild(link);
}

  let htmlSlides = '';
  for (let slide of slides) {
    htmlSlides += `
      <div class="swiper-slide">
        <div class="slide ${plantilla}">
          <h2>${slide.titulo}</h2>
          <div class="slide-content">
            <p>${slide.texto}</p>
            <img src="${slide.imagen}" alt="Imagen de ${slide.titulo}" loading="lazy" />
          </div>
        </div>
      </div>
    `;
  }

  document.getElementById('vista-previa').innerHTML = `
    <div class="swiper">
      <div class="swiper-wrapper">
        ${htmlSlides}
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  `;

  console.log("🎨 Diapositivas renderizadas en el carrusel Swiper");

  new Swiper('.swiper', {
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    pagination: { el: '.swiper-pagination', clickable: true },
  });
}

// 3. Función para obtener texto real desde OpenAI (a través del backend seguro)
async function obtenerTextoDesdeAPI(titulo) {
  try {
    console.log("🔄 Enviando petición a la API para:", titulo);
    const response = await fetch('http://localhost:5000/generar-contenido', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ titulo })
    });

    console.log("📡 Respuesta del servidor:", response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Texto recibido de la API:", data.texto.substring(0, 100) + "...");
      return data.texto;
    } else {
      const errorText = await response.text();
      console.warn("⚠️ Error del servidor:", response.status, errorText);
      console.warn("⚠️ Error usando la API de OpenAI. Se usará texto simulado.");
      return `Este es un resumen educativo simulado sobre: ${titulo}. La información incluye conceptos clave, ejemplos prácticos y aplicaciones reales del tema.`;
    }
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    console.warn("⚠️ Error de conexión. Se usará texto simulado.");
    return `Este es un resumen educativo simulado sobre: ${titulo}. La información incluye conceptos clave, ejemplos prácticos y aplicaciones reales del tema.`;
  }
}

// 4. Función para obtener imagen desde Unsplash (a través del backend seguro)
async function obtenerImagenDesdeAPI(titulo) {
  try {
    console.log("🖼️ Enviando petición de imagen para:", titulo);
    const response = await fetch('http://localhost:5000/obtener-imagen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: titulo })
    });

    console.log("📡 Respuesta de imagen del servidor:", response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Imagen recibida de la API:", data.imagen);
      return data.imagen;
    } else {
      const errorText = await response.text();
      console.warn("⚠️ Error del servidor de imagen:", response.status, errorText);
      console.warn("⚠️ Error usando la API de Unsplash. Se usará imagen local.");
      return './img/no-disponible.png';
    }
  } catch (error) {
    console.error("❌ Error de conexión de imagen:", error);
    console.warn("⚠️ Error de conexión. Se usará imagen local.");
    return './img/no-disponible.png';
  }
}

async function capturarFondosComoImagenes() {
  const slidesDOM = document.querySelectorAll('.swiper-slide');
  const imagenes = [];

  for (let i = 0; i < slidesDOM.length; i++) {

    const slideOriginal = slidesDOM[i].querySelector('.slide');
    const slideClonado = slideOriginal.cloneNode(true);
    // 🧹 Elimina el <h2> para que no se duplique en el fondo
    const titulo = slideClonado.querySelector('h2');
    if (titulo) titulo.remove();

    // ✅ Limpia el contenido para capturar solo el fondo visual
    const contenido = slideClonado.querySelector('.slide-content');
    if (contenido) contenido.innerHTML = '';

    // ✅ Fuerza tamaño y alineación
    slideClonado.style.width = "1280px";
    slideClonado.style.height = "720px";
    slideClonado.style.maxWidth = "1280px";
    slideClonado.style.maxHeight = "720px";
    slideClonado.style.display = "block";
    slideClonado.style.padding = "0";
    slideClonado.style.margin = "0";
    slideClonado.style.boxSizing = "border-box";
    slideClonado.style.overflow = "hidden";

    // ✅ Envolver en contenedor para captura
    const wrapper = document.createElement('div');
    wrapper.style.width = "1280px";
    wrapper.style.height = "720px";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.position = "fixed";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.zIndex = "-1";
    wrapper.style.opacity = "1";
    wrapper.style.pointerEvents = "none";
    wrapper.style.background = "white"; // opcional

    // ✅ Aplica estilo correcto si aún no está cargado
    const plantilla = plantillaActual;
    const yaEstaCargado = document.querySelector(`#css-${plantilla}`);
    if (!yaEstaCargado && plantilla.startsWith("plantilla")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `../plantillas/${plantilla}/style.css`;
      link.id = `css-${plantilla}`;
      document.head.appendChild(link);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    wrapper.appendChild(slideClonado);
    document.body.appendChild(wrapper);

    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#FFFFFF",
    });

    const imgBase64 = canvas.toDataURL("image/png");
    imagenes.push(imgBase64);
    wrapper.remove();

    console.log(`🖼️ Fondo ${i + 1} generado correctamente (base64):`, imgBase64.slice(0, 100) + "...");
  }

  return imagenes;
}
// 5. Clonamos las diapositivas para exportarlas sin afectar la vista
async function crearContenedorParaExportar(slides, plantilla) {
  const contenedor = document.createElement("div");
  contenedor.style.position = "absolute";
  contenedor.style.top = "-9999px";
  contenedor.style.left = "-9999px";
  contenedor.style.width = "800px";
  contenedor.style.backgroundColor = "white";
  contenedor.style.padding = "20px";
  contenedor.id = "contenedor-exportar";

  for (let slide of slides) {
    const div = document.createElement("div");
    div.style.borderRadius = "10px";
    div.style.padding = "30px";
    div.style.marginBottom = "30px";
    div.style.fontFamily = "Arial, sans-serif";
    div.style.border = "none";

    // Aplicar estilos según la plantilla
    let backgroundColor, textColor, titleColor;
    
    if (plantilla === 'plantilla1') {
      backgroundColor = "#1F2937"; // Fondo oscuro
      textColor = "#FFFFFF"; // Texto blanco
      titleColor = "#FFFFFF"; // Título blanco
    } else if (plantilla === 'plantilla2') {
      backgroundColor = "#4F46E5"; // Fondo azul
      textColor = "#FFFFFF"; // Texto blanco
      titleColor = "#FFFFFF"; // Título blanco
    } else if (plantilla === 'plantilla3') {
      backgroundColor = "#F3F4F6"; // Fondo gris claro
      textColor = "#1F2937"; // Texto oscuro
      titleColor = "#4F46E5"; // Título azul
    } else {
      backgroundColor = "#FFFFFF"; // Fondo blanco por defecto
      textColor = "#1F2937"; // Texto oscuro
      titleColor = "#4F46E5"; // Título azul
    }

    div.style.backgroundColor = backgroundColor;

    // Crear contenido HTML con estilos inline según la plantilla
    const contenidoHTML = `
      <h2 style="color: ${titleColor}; font-size: 28px; margin-bottom: 20px; text-align: center; font-weight: bold;">${slide.titulo}</h2>
      <div style="color: ${textColor}; font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
        <p>${slide.texto}</p>
      </div>
    `;

    div.innerHTML = contenidoHTML;

    // Agregar imagen si existe y no es la imagen por defecto
    if (slide.imagen && !slide.imagen.includes('no-disponible.png')) {
      const img = document.createElement('img');
      img.src = slide.imagen;
      img.style.maxWidth = "70%";
      img.style.height = "auto";
      img.style.display = "block";
      img.style.margin = "20px auto";
      img.style.borderRadius = "8px";
      img.style.border = "2px solid rgba(255,255,255,0.3)";
      img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
      
      // Esperar a que la imagen cargue
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
        setTimeout(resolve, 3000);
      });
      
      div.appendChild(img);
    }

    contenedor.appendChild(div);
  }

  document.body.appendChild(contenedor);
  return contenedor;
}

// 6. Exportar como PDF usando html2canvas + jsPDF
let slidesActuales = [];
let plantillaActual = '';

// Cuando se hace clic en el botón de "Descargar PDF"
document.getElementById('exportar-pdf').addEventListener('click', async () => {
  console.log("📥 Exportando como PDF...");
  
  // Mostrar loading
  const btn = document.getElementById('exportar-pdf');
  const originalText = btn.innerHTML;
  btn.innerHTML = '🔄 Generando PDF...';
  btn.disabled = true;

  try {
    // Crear contenedor con las diapositivas actuales
    const contenedor = await crearContenedorParaExportar(slidesActuales, plantillaActual);
    
    // Esperar a que todo se renderice
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generar PDF usando html2canvas + jsPDF
    const canvas = await html2canvas(contenedor, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: true,
      width: contenedor.scrollWidth,
      height: contenedor.scrollHeight
    });
    
    // Crear PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Si la imagen es más alta que una página, dividir en múltiples páginas
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    
    // Guardar PDF
    pdf.save('presentacion.pdf');
    console.log("✅ PDF generado con éxito");
    
  } catch (error) {
    console.error("❌ Error al generar PDF:", error);
    alert("Error al generar PDF. Intenta de nuevo.");
  } finally {
    // Restaurar botón
    btn.innerHTML = originalText;
    btn.disabled = false;
    
    // Limpiar contenedor
    const contenedor = document.getElementById('contenedor-exportar');
    if (contenedor) contenedor.remove();
  }
});

// 7. Exportar como PPTX
function esBase64(str) {
  return /^data:image\/(png|jpeg|jpg);base64,/.test(str);
}

async function convertirImagenABase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

document.getElementById('exportar-pptx').addEventListener('click', async () => {
  console.log("📥 Exportando como PPTX...");
  
  // Mostrar loading
  const btn = document.getElementById('exportar-pptx');
  const originalText = btn.innerHTML;
  btn.innerHTML = '🔄 Generando PPTX...';
  btn.disabled = true;

  try {
    const fondos = await capturarFondosComoImagenes(); // 🔁 Captura imagen de fondo para cada slide
    let pptx = new PptxGenJS();

    for (let i = 0; i < slidesActuales.length; i++) {
      const slide = pptx.addSlide();
      const contenido = slidesActuales[i];

      // ✅ Fondo de la plantilla renderizado como imagen
      slide.addImage({
        data: fondos[i],
        x: 0, y: 0,
        w: 10, h: 5.625,
        sizing: { type: 'cover', w: 10, h: 5.625 }
      });

      // LOG plantilla actual
      console.log(`\n--- Diapositiva ${i + 1} ---`);
      console.log('Plantilla actual:', plantillaActual);
      console.log('Título:', contenido.titulo);

      // ✅ TÍTULO: Configuración según plantilla
      if (plantillaActual === 'plantilla2') {
        // 👉 Título a la izquierda y blanco para plantilla2
        console.log('addText TÍTULO plantilla2', { x: 0.5, y: 0.3, w: 9, fontSize: 24, align: 'left' });
        slide.addText(contenido.titulo, {
          x: 0.5, y: 0.3, w: 9, fontSize: 24, bold: true,
          color: 'FFFFFF', align: 'left'
        });
      } else {
        // 👉 Título centrado para plantilla1 y plantilla3
        console.log('addText TÍTULO plantilla1/3', { x: 0.5, y: 0.3, w: 9, fontSize: 24, align: 'center' });
        slide.addText(contenido.titulo, {
          x: 0.5, y: 0.3, w: 9, fontSize: 24, bold: true,
          color: 'FFFFFF', align: 'center'
        });
      }

      // ✅ Define color del texto según la plantilla
      const colorTexto = plantillaActual === 'plantilla1' ? 'FFFFFF' : 'FFFFFF';

      // ✅ ESTILO PLANTILLA 3: texto izquierda, imagen derecha
      if (plantillaActual === 'plantilla3') {
        console.log('addText TEXTO plantilla3', { x: 0.5, y: 1.2, w: 4.2, h: 3.2, fontSize: 16, lineSpacingMultiple: 1.3 });
        slide.addText(contenido.texto, {
          x: 0.5, y: 1.2, w: 4.2, h: 3.2,
          fontSize: 16, color: colorTexto,
          align: 'justify', wrap: true, lineSpacingMultiple: 1.3
        });

        let imgBase64 = contenido.imagen;
        if (!esBase64(imgBase64)) {
          try {
            imgBase64 = await convertirImagenABase64(contenido.imagen);
          } catch (e) {
            console.warn("⚠️ Imagen no válida:", contenido.imagen);
            continue;
          }
        }
        console.log('addImage IMAGEN plantilla3', { x: 5.3, y: 1.2, w: 4, h: 3.2 });
        slide.addImage({
          data: imgBase64,
          x: 5.3, y: 1.2, w: 4, h: 3.2,
          sizing: { type: 'contain', w: 4, h: 3.2 }
        });

      // ✅ ESTILO PLANTILLA 2: imagen izquierda, texto derecha
      } else if (plantillaActual === 'plantilla2') {
        let imgBase64 = contenido.imagen;
        if (!esBase64(imgBase64)) {
          try {
            imgBase64 = await convertirImagenABase64(contenido.imagen);
          } catch (e) {
            console.warn("⚠️ Imagen no válida:", contenido.imagen);
            continue;
          }
        }
        console.log('addImage IMAGEN plantilla2', { x: 0.5, y: 1.2, w: 3.5, h: 3.2 });
        slide.addImage({
          data: imgBase64,
          x: 0.5, y: 1.2, w: 3.5, h: 3.2,
          sizing: { type: 'contain', w: 3.5, h: 3.2 }
        });
        console.log('addText TEXTO plantilla2', { x: 4.2, y: 1.2, w: 5.2, h: 3.2, fontSize: 16, lineSpacingMultiple: 1.3 });
        slide.addText(contenido.texto, {
          x: 4.2, y: 1.2, w: 5.2, h: 3.2,
          fontSize: 16, color: colorTexto,
          align: 'justify', wrap: true, lineSpacingMultiple: 1.3
        });

      // ✅ ESTILO GENERAL para plantilla1 u otras
      } else {
        console.log('addText TEXTO plantilla1', { x: 1, y: 1.2, w: 8.0, h: 3.2, fontSize: 16, lineSpacingMultiple: 1.3 });
        slide.addText(contenido.texto, {
          x: 1, y: 1.2, w: 8.0, h: 3.2,
          fontSize: 16, color: colorTexto,
          align: 'justify', wrap: true, lineSpacingMultiple: 1.3
        });

        if (contenido.imagen) {
          let imgBase64 = contenido.imagen;
          if (!esBase64(imgBase64)) {
            try {
              imgBase64 = await convertirImagenABase64(contenido.imagen);
            } catch (e) {
              console.warn("⚠️ Imagen no válida:", contenido.imagen);
              continue;
            }
          }
          console.log('addImage IMAGEN plantilla1', { x: 3, y: 4.6, w: 4, h: 1.2 });
          slide.addImage({
            data: imgBase64,
            x: 3, y: 4.6, w: 4, h: 1.2,
            sizing: { type: 'contain', w: 4, h: 1.2 }
          });
        }
      }
    }

    pptx.writeFile({ fileName: 'presentacion.pptx' }).then(() => {
      console.log("✅ PPTX generado con éxito");
    });
  } catch (error) {
    console.error("❌ Error al generar PPTX:", error);
    alert("Error al generar PPTX. Intenta de nuevo.");
  } finally {
    // Restaurar botón
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
});

async function subirPPTX() {
  const archivo = document.getElementById('pptxUpload').files[0];
  const formData = new FormData();
  formData.append('archivo', archivo);

  const response = await fetch('http://localhost:5000/subir-pptx', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (data.error) {
    alert("Error: " + data.error);
    return;
  }

  document.getElementById('vista-previa').innerHTML = data.slides.join('');
}