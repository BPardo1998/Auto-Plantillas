# 🚀 WSGI Entry Point para Render.com
# ===================================================
# 
# 📋 DESCRIPCIÓN:
# Este archivo permite que gunicorn ejecute la aplicación Flask
# correctamente en Render.com
#
# 🔧 USO:
# gunicorn wsgi:app

# Importar la aplicación Flask desde app.py
from app import app

# Crear la variable app que gunicorn necesita
app = app

if __name__ == "__main__":
    app.run() 