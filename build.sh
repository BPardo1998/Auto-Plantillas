#!/usr/bin/env bash
# Script de construcción para Render.com
# Instala dependencias y configura el entorno

echo "🚀 Iniciando construcción del proyecto..."

# Cambiar al directorio backend
cd backend

# Instalar dependencias de Python
pip install -r requirements.txt

echo "✅ Construcción completada" 