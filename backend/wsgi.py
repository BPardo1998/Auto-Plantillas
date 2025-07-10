# 🚀 WSGI Entry Point para Render.com
# ===================================================
# 
# 📋 DESCRIPCIÓN:
# Este archivo permite que gunicorn ejecute la aplicación Flask
# correctamente en Render.com
#
# 🔧 USO:
# gunicorn wsgi:app

from app import app

if __name__ == "__main__":
    app.run() 