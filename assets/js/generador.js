// ✅ GENERADOR DE PRESENTACIONES EDUCATIVAS (Con acceso a APIs habilitado)

// 👉 Este bloque escucha el envío del formulario principal donde el usuario escribe el título general
//    y los títulos de las diapositivas. Se activa cuando el usuario presiona el botón 'Generar'.
document.getElementById('formulario-generador').addEventListener('submit', async function (e) {
  e.preventDefault();

  const tituloGeneral = document.getElementById('tituloGeneral').value;
  const titulosSlides = document.getElementById('titulosSlides').value.split('\n').filter(t => t.trim() !== '');
  const plantillaSeleccionada = document.getElementById('plantillaSelect').value;

  console.log("Titulo generado:", tituloGeneral);
  console.log("TituloSlides:", titulosSlides);
  console.log("Plantilla seleccionada:", plantillaSeleccionada);

  const slides = [];
  for (let titulo of titulosSlides) {
    const textoBruto = await obtenerTextoDesdeAPI(titulo);
    const texto = limitarPalabras(textoBruto);
    const imagen = await obtenerImagenDesdeAPI(titulo);
    slides.push({ titulo, texto, imagen });
  }

  cargarPlantilla(plantillaSeleccionada, slides);
});

function limitarPalabras(texto, maxPalabras = 70) {
  const palabras = texto.split(/\s+/);
  return palabras.slice(0, maxPalabras).join(" ") + (palabras.length > maxPalabras ? "..." : "");
}

// 🔹 Función para generar texto real usando OpenAI
async function obtenerTextoDesdeAPI(titulo) {

  /*console.warn("⚠️ Simulación activada: OpenAI sin crédito.");
  return `Este es un resumen simulado para: ${titulo}`;

  /*
  // 🔻 COMENTARIO IMPORTANTE:
  // Esta parte está lista para funcionar con la API de OpenAI. Solo debes descomentarla
  // cuando tengas tu clave API funcional y quieras usar texto real generado por IA.
  */
    // 🔻 COMENTADO: VERSIÓN REAL CON OPENAI (no borrar)
  const prompt = `Escribe un resumen educativo de no más de 5 líneas sobre: ${titulo}`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Explica este tema en 3 frases claras: ${titulo}` }]
    })
  });

  if (!response.ok) {
    console.warn("⚠️ Error al usar la API. Usando texto simulado.");
    return `Este es un resumen simulado para: ${titulo}`;
  }

  const data = await response.json();
  return data.choices[0].message.content;

    /*solo debo reemplazar  console.warn("⚠️ Simulación activada: OpenAI sin crédito.");
  return `Este es un resumen simulado para: ${titulo}`; pór lo de arriba
  */
}

// 🔹 Función para obtener imagen desde Unsplash API
async function obtenerImagenDesdeAPI(titulo) {

   /*return './img/no-disponible.png';

  /*
  // 🔻 COMENTARIO IMPORTANTE:
  // Esta parte está lista para usar Unsplash. Si la imagen no se encuentra, usa una local.
  */
    // 🔻 COMENTADO: VERSIÓN REAL CON UNSPLASH (no borrar)
  
  const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(titulo)}&client_id=ucdSS1lEfdF6XuRPIHjX9x_DmFnAKMytVRaEZvXcQpE`);
  const data = await response.json();

  if (!data.urls?.regular) {
    console.warn("⚠️ No se encontró imagen en Unsplash. Usando imagen local.");
    return './img/no-disponible.png';
  }

  return data.urls.regular;
}
 /* quitamos el return de arriba y dejamos este codigo
  */

async function cargarPlantilla(nombrePlantilla, slides) {
  const response = await fetch(`./plantillas/${nombrePlantilla}/index.html`);
  const htmlBase = await response.text();

  const estiloPrevio = document.getElementById('css-plantilla');
  if (estiloPrevio) estiloPrevio.remove();

  const linkCSS = document.createElement('link');
  linkCSS.rel = 'stylesheet';
  linkCSS.href = `./plantillas/${nombrePlantilla}/style.css`;
  linkCSS.id = 'css-plantilla';
  document.head.appendChild(linkCSS);

  let previewHTML = '';
  slides.forEach((slide) => {
    let contenido = htmlBase
      .replace('<div class="slide"', `<div class="slide ${nombrePlantilla}"`)
      .replace('{{titulo}}', slide.titulo)
      .replace('{{texto}}', `<div class="slide-content"><p>${slide.texto}</p>`)
      .replace('{{imagen}}', `${slide.imagen}</div>`);

    previewHTML += `<div class="swiper-slide">${contenido}</div>`;
  });

  document.getElementById('preview-container').innerHTML = `
    <div class="swiper">
      <div class="swiper-wrapper">${previewHTML}</div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>`;

  new Swiper('.swiper', {
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    pagination: { el: '.swiper-pagination', clickable: true },
  });
}

function crearContenedorPlanoParaPDF(slides, plantilla) {
  const contenedorPDF = document.createElement("div");
  contenedorPDF.style.position = "absolute";
  contenedorPDF.style.top = "-9999px";
  contenedorPDF.style.left = "-9999px";
  contenedorPDF.id = "contenedor-pdf";

  slides.forEach(slide => {
    const div = document.createElement("div");
    div.className = `slide ${plantilla}`;
    div.style.pageBreakAfter = "always";
    div.innerHTML = `
      <h2>${slide.titulo}</h2>
      <div class="slide-content">
        <p>${slide.texto}</p>
        <img src="${slide.imagen}" style="max-width:100%; max-height:300px;">
      </div>
    `;
    contenedorPDF.appendChild(div);
  });

  document.body.appendChild(contenedorPDF);
  return contenedorPDF;
}

// 🔹 Descargar como PDF
document.getElementById('descargarPDF').addEventListener('click', async () => {
  console.log("Exportar presentacion PDF");

  const slides = [];
  document.querySelectorAll('.swiper-slide').forEach(slide => {
    slides.push({
      titulo: slide.querySelector("h2")?.innerText || "",
      texto: slide.querySelector("p")?.innerText || "",
      imagen: slide.querySelector("img")?.src || "./img/no-disponible.png"
    });
  });

  const plantilla = document.getElementById('plantillaSelect').value;
  const contenedorPlano = crearContenedorPlanoParaPDF(slides, plantilla);

  setTimeout(() => {
    html2pdf().from(contenedorPlano).set({
      margin: 0.5,
      filename: 'presentacion.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save().then(() => contenedorPlano.remove());
  }, 500);
});

// 🔹 Verifica si una imagen ya es base64
function esBase64(str) {
  return /^data:image\/(png|jpeg|jpg);base64,/.test(str);
}

// 🔹 Convierte imagen a base64 para el PPTX
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

// 🔹 Descargar presentación como archivo PPTX
document.getElementById('descargarPPTX').addEventListener('click', async () => {
  console.log("✅ Botón PPTX clickeado");
  let pptx = new PptxGenJS();
  const slidesDOM = document.querySelectorAll('.swiper-slide');

  for (let slide of slidesDOM) {
    const titulo = slide.querySelector('h2')?.innerText || '';
    const texto = slide.querySelector('p')?.innerText || '';
    const imagen = slide.querySelector('img')?.src || '';

    const slidePpt = pptx.addSlide();
    slidePpt.background = { fill: "FFFFFF" };

    // 📝 Título
    slidePpt.addText(titulo, {
      x: 0.5, y: 0.3, fontSize: 20, bold: true, color: '000000'
    });

    // 📝 Texto (si existe)
    if (texto) {
      slidePpt.addText(texto, {
        x: 0.5, y: 1.2, w: 8.0, h: 2.0, fontSize: 14,
        color: '333333', align: 'center', wrap: true
      });
    }

    // 🖼️ Imagen (si existe)
    if (imagen) {
      let base64 = imagen;
      if (!esBase64(imagen)) {
        try {
          base64 = await convertirImagenABase64(imagen);
        } catch (e) {
          console.warn("⚠️ Imagen no válida:", imagen);
          continue;
        }
      }

      slidePpt.addImage({
        data: base64,
        x: 1.0,
        y: 4.2,
        w: 6.0,
        h: 3.0,
        sizing: { type: 'contain', w: 6.0, h: 3.0 }
      });
    }
  }

  pptx.writeFile({ fileName: 'presentacion.pptx' });
});
