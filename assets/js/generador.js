// ✅ GENERADOR DE PRESENTACIONES EDUCATIVAS CON DESCARGAS PDF Y PPTX
// 👉 Explicado paso a paso como si tuvieras 14 años

// 1. Cuando se hace clic en el botón "Generar presentación"
document.getElementById('formulario-generador').addEventListener('submit', async function (e) {
  e.preventDefault(); // Esto evita que la página se recargue al enviar el formulario

  const tituloGeneral = document.getElementById('tituloGeneral').value;
  const titulosSlides = document.getElementById('titulosSlides').value.split('\n').filter(t => t.trim() !== '');
  const plantillaSeleccionada = document.getElementById('plantillaSelect').value;

  console.log("Título general:", tituloGeneral);
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
            <img src="${slide.imagen}" alt="Imagen de ${slide.titulo}" />
          </div>
        </div>
      </div>
    `;
  }

  document.getElementById('preview-container').innerHTML = `
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

// 3. Función para obtener texto real desde OpenAI
async function obtenerTextoDesdeAPI(titulo) {
  const prompt = `Explica este tema en 3 frases claras: ${titulo}`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer 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`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    console.warn("⚠️ Error usando la API de OpenAI. Se usará texto simulado.");
    return `Este es un resumen educativo simulado sobre: ${titulo}`;
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 4. Función para obtener imagen desde Unsplash
async function obtenerImagenDesdeAPI(titulo) {
  const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(titulo)}&client_id=ucdSS1lEfdF6XuRPIHjX9x_DmFnAKMytVRaEZvXcQpE`);
  const data = await response.json();

  if (!data.urls?.regular) {
    console.warn("⚠️ No se encontró imagen. Se usará imagen local.");
    return './img/no-disponible.png';
  }

  return data.urls.regular;
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
function crearContenedorParaExportar(slides, plantilla) {
  const contenedor = document.createElement("div");
  contenedor.style.position = "absolute";
  contenedor.style.top = "-9999px";
  contenedor.style.left = "-9999px";
  contenedor.id = "contenedor-exportar";

slides.forEach(slide => {
  const div = document.createElement("div");
  div.className = `slide ${plantilla}`;
  div.style.pageBreakAfter = "always";

  // ✅ Solo si es plantilla1 (fondo oscuro), color blanco
  const colorTexto = plantilla === 'plantilla1' ? 'white' : '#1F2937';

  div.innerHTML = `
    <h2 style="color: ${colorTexto}; font-size: 28px;">${slide.titulo}</h2>
    <div class="slide-content" style="color: ${colorTexto}; font-size: 18px;">
      <p>${slide.texto}</p>
      <img src="${slide.imagen}" style="max-width: 90%; height: auto; display: block; margin: 1rem auto;">
    </div>
  `;

  contenedor.appendChild(div);
});

  document.body.appendChild(contenedor);
  return contenedor;
}

// 6. Exportar como PDF con html2pdf
let slidesActuales = [];
let plantillaActual = '';

// Cuando se hace clic en el botón de "Descargar PDF"
document.getElementById('descargarPDF').addEventListener('click', async () => {
  console.log("📥 Exportando como PDF...");

  const imagenes = await capturarFondosComoImagenes();
  console.log("📸 Total de imágenes capturadas:", imagenes.length);

  const contenedor = document.createElement('div');
  contenedor.style.position = 'fixed';
  contenedor.style.top = '0';
  contenedor.style.left = '0';
  contenedor.style.opacity = '0';
  contenedor.id = 'pdf-container';

  const promesasCarga = [];
  imagenes.forEach((imgBase64, index) => {
    console.log(`🧱 Añadiendo imagen ${index + 1} al contenedor...`);
    const slideDiv = document.createElement('div');
    slideDiv.style.pageBreakAfter = 'always';

    const img = new Image();
    img.src = imgBase64;
    img.style.width = '100%';
    img.style.height = 'auto';

    const promesa = new Promise(resolve => {
      img.onload = () => {
        console.log(`✅ Imagen ${index + 1} cargada en memoria`);
        resolve();
      };
      img.onerror = () => {
        console.warn(`❌ Error al cargar imagen ${index + 1}`);
        resolve();
      };
    });

    promesasCarga.push(promesa);
    slideDiv.appendChild(img);
    contenedor.appendChild(slideDiv);
  });

  document.body.appendChild(contenedor);

  console.log("🕒 Esperando que todas las imágenes terminen de cargar...");
  await Promise.all(promesasCarga);
  console.log("✅ Todas las imágenes listas. Generando PDF...");

  html2pdf().from(contenedor).set({
    margin: 0,
    filename: 'presentacion.pdf',
    image: { type: 'png', quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    },
    jsPDF: {
      unit: 'px',
      format: [1280, 720],
      orientation: 'landscape'
    }
  }).save().then(() => {
    contenedor.remove();
    console.log("✅ PDF generado con éxito y contenedor eliminado");
  }).catch(err => {
    console.error("❌ Error al generar PDF:", err);
  });
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

document.getElementById('descargarPPTX').addEventListener('click', async () => {
  console.log("📥 Exportando como PPTX...");
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
//Este condicional para que el titulo de la plantoiilla 2 este a la izquierda y de color blanco
    if (plantillaActual === 'plantilla2') {
  // 👉 Título a la izquierda y blanco
  slide.addText(contenido.titulo, {
    x: 0.5, y: 0.3, w: 9, fontSize: 24, bold: true,
    color: 'FFFFFF', align: 'left'
  });
} else {
  // 👉 Título centrado y color estándar
  slide.addText(contenido.titulo, {
    x: 0.5, y: 0.3, w: 9, fontSize: 24, bold: true,
    color: '000000', align: 'center'
  });
}


    // ✅ Define color del texto según la plantilla
    const colorTexto = plantillaActual === 'plantilla1' ? 'FFFFFF' : 'FFFFFF';

    // ✅ ESTILO PLANTILLA 3: texto izquierda, imagen derecha
    if (plantillaActual === 'plantilla3') {
      slide.addText(contenido.texto, {
        x: 0.5, y: 1.5, w: 4.5, h: 3.5,
        fontSize: 14, color: colorTexto,
        align: 'justify', wrap: true, lineSpacingMultiple: 1
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

      slide.addImage({
        data: imgBase64,
        x: 5.2, y: 1.5, w: 3.0, h: 3.5,
        sizing: { type: 'contain', w: 3.0, h: 3.5 }
      });

    // ✅ ESTILO PLANTILLA 2: imagen izquierda, texto derecha
    } else if (plantillaActual === 'plantilla2') {
      // Imagen a la izquierda
      let imgBase64 = contenido.imagen;
      if (!esBase64(imgBase64)) {
        try {
          imgBase64 = await convertirImagenABase64(contenido.imagen);
        } catch (e) {
          console.warn("⚠️ Imagen no válida:", contenido.imagen);
          continue;
        }
      }

      slide.addImage({
        data: imgBase64,
        x: 0.5, y: 1.5, w: 3.0, h: 3.8,
        sizing: { type: 'contain', w: 3.0, h: 3.8 }
      });

      // Texto a la derecha
      slide.addText(contenido.texto, {
        x: 4, y: 1.5, w: 5.4, h: 3.5,
        fontSize: 14, color: colorTexto,
        align: 'justify', wrap: true, lineSpacingMultiple: 1.2
      });

    // ✅ ESTILO GENERAL para plantilla1 u otras
    } else {
      slide.addText(contenido.texto, {
        x: 1, y: 0.3, w: 8.0, h: 2.5,
        fontSize: 14, color: colorTexto,
        align: 'justify', wrap: true, lineSpacingMultiple: 1
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

        slide.addImage({
          data: imgBase64,
          x: 2, y: 2.2, w: 6, h: 2.8,
          sizing: { type: 'contain', w: 6, h: 2.8 }
        });
      }
    }
  }

  pptx.writeFile({ fileName: 'presentacion.pptx' }).then(() => {
    console.log("✅ PPTX generado con éxito");
  });
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

  document.getElementById('preview-container').innerHTML = data.slides.join('');
}