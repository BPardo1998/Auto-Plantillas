# ✅ BACKEND PARA LEER PPTX Y CONVERTIRLO A HTML (Explicado para un niño de 14 años)

# 📌 Este programa en Python va a:
# 1. Crear un servidor web con Flask.
# 2. Recibir un archivo .pptx desde tu página web (HTML).
# 3. Leer cada diapositiva y extraer sus textos.
# 4. Enviarlos de regreso en formato HTML como respuesta.

# 🛠️ IMPORTANTE: Este archivo necesita instalar primero las dependencias:
# Ejecuta esto una vez en la terminal antes de correr app.py:
# pip install flask flask-cors python-pptx

from flask import Flask, request, jsonify
from flask_cors import CORS

try:
    from pptx import Presentation
except ModuleNotFoundError:
    raise ImportError("🚨 Necesitas instalar 'python-pptx'. Usa: pip install python-pptx")

app = Flask(__name__)
CORS(app)  # 🔓 Permite que el frontend pueda hablar con este backend sin errores CORS

@app.route('/subir-pptx', methods=['POST'])
def subir_pptx():
    file = request.files.get('archivo')

    if not file or not file.filename.endswith('.pptx'):
        return jsonify({'error': 'Archivo .pptx no válido o no proporcionado'}), 400

    try:
        prs = Presentation(file)  # 📖 Abre el PowerPoint que el usuario subió
    except Exception as e:
        return jsonify({'error': f'Error al leer el archivo: {str(e)}'}), 500

    slides_html = []

    for idx, slide in enumerate(prs.slides):
        contenido = ''
        for shape in slide.shapes:
            if hasattr(shape, "text") and shape.has_text_frame:
                contenido += f"<p>{shape.text}</p>"

        # 🧱 Crea una diapositiva en HTML con el texto que encontró
        slide_html = f"""
        <div class='slide'>
            <h2>Diapositiva {idx + 1}</h2>
            <div class='slide-content'>
                {contenido if contenido else '<em>(sin texto)</em>'}
            </div>
        </div>"""

        slides_html.append(slide_html)

    return jsonify({"slides": slides_html})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
