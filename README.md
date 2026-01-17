# 🎵 Music Generator - Generador de Música con IA

Aplicación web completa para generar música original usando **MusicGen** de Meta AI. Crea composiciones musicales únicas simplemente describiendo lo que quieres escuchar.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-green.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-black.svg)

## ✨ Características Principales

- 🎼 **Generación de música con IA** usando MusicGen de Meta
- 🎨 **Interfaz moderna y responsive** con diseño atractivo
- ⚙️ **Configuración flexible**: duración (5-30s) y selección de modelo
- 🎵 **Reproductor integrado** para escuchar tu música al instante
- 📥 **Descarga directa** de archivos WAV
- 🔒 **Seguro y validado**: protección contra ataques comunes
- 🧹 **Limpieza automática** de archivos antiguos
- 💡 **Ejemplos de prompts** para inspirarte

## 🎯 Descripción del Proyecto

Music Generator es una aplicación web que aprovecha el poder de MusicGen, el modelo de IA de Meta para generación de música, y lo hace accesible a través de una interfaz web intuitiva. Simplemente describe la música que deseas y la IA la creará para ti.

**Casos de uso:**
- Crear música de fondo para videos
- Generar ideas musicales para composiciones
- Experimentar con diferentes estilos musicales
- Producir música royalty-free para proyectos personales

## 📋 Requisitos del Sistema

### Requisitos Mínimos
- **Python**: 3.8 o superior
- **RAM**: 8GB mínimo (16GB recomendado)
- **Almacenamiento**: 10GB libres (para modelos de IA)
- **Sistema Operativo**: Windows, macOS o Linux

### Requisitos Opcionales
- **GPU con CUDA**: Altamente recomendado para generación más rápida
  - NVIDIA GPU con 4GB+ VRAM
  - CUDA 11.7 o superior

> **Nota**: Sin GPU, la generación puede tardar varios minutos. Con GPU, toma solo segundos.

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Mauricio84gv/music-generator.git
cd music-generator
```

### 2. Crear Entorno Virtual

**En Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**En macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

> **Importante**: La primera instalación puede tardar varios minutos debido al tamaño de PyTorch y otras dependencias.

### 4. Ejecutar la Aplicación

**Desarrollo (con debug activado):**
```bash
python app.py
```

**Producción (sin debug):**
```bash
export FLASK_DEBUG=False  # En Linux/macOS
# o
set FLASK_DEBUG=False  # En Windows
python app.py
```

La aplicación estará disponible en: `http://localhost:5000`

> **Nota de Seguridad**: En producción, siempre ejecuta con `FLASK_DEBUG=False` y considera usar un servidor WSGI como Gunicorn.

## 📖 Uso de la Aplicación

### Generar Música

1. **Abre tu navegador** y ve a `http://localhost:5000`
2. **Describe tu música** en el campo de texto (en inglés para mejores resultados)
3. **Ajusta la duración** entre 5 y 30 segundos
4. **Selecciona el modelo**:
   - **Small**: Rápido, buena calidad (300M parámetros)
   - **Medium**: Equilibrado (1.5B parámetros)
   - **Large**: Mejor calidad, más lento (3.3B parámetros)
5. **Haz click en "Generar Música"**
6. **Espera** a que se genere (primera vez puede tardar mientras descarga el modelo)
7. **Reproduce** y descarga tu música

### Ejemplos de Prompts

Aquí hay algunos ejemplos de prompts que puedes usar:

#### Música Electrónica
```
upbeat electronic dance music with synthesizers
energetic techno beat with deep bass
```

#### Música Relajante
```
calm piano melody for meditation
peaceful ambient soundscape with nature sounds
gentle acoustic guitar for relaxation
```

#### Música Épica
```
epic orchestral music with drums and strings
cinematic trailer music with powerful brass
```

#### Lo-Fi y Hip Hop
```
lo-fi hip hop beats for studying
chill jazz hip hop with vinyl crackle
```

#### Rock y Alternativo
```
energetic rock music with electric guitar
alternative indie rock with drums
```

#### Clásica
```
baroque classical music with harpsichord
romantic piano composition
```

> **Tip**: Los prompts en inglés funcionan mejor. Sé específico sobre el estilo, instrumentos, tempo y ambiente.

## 🎛️ Información sobre Modelos

MusicGen ofrece tres tamaños de modelo:

| Modelo | Parámetros | Velocidad | Calidad | Uso Recomendado |
|--------|-----------|-----------|---------|-----------------|
| **Small** | 300M | ⚡ Rápido | ⭐⭐⭐ Buena | Pruebas rápidas, experimentación |
| **Medium** | 1.5B | ⚡⚡ Medio | ⭐⭐⭐⭐ Muy buena | Uso general, balance perfecto |
| **Large** | 3.3B | ⚡⚡⚡ Lento | ⭐⭐⭐⭐⭐ Excelente | Producción final, máxima calidad |

**Primera ejecución**: El modelo se descargará automáticamente la primera vez que lo uses. Esto puede tardar varios minutos dependiendo de tu conexión.

## 🔐 Seguridad

La aplicación incluye múltiples capas de seguridad:

- ✅ **Validación de entrada**: Límites en longitud de prompts y duración
- ✅ **Sanitización de archivos**: Prevención de path traversal
- ✅ **Límites de rate**: Protección contra abuso
- ✅ **Limpieza automática**: Archivos antiguos se eliminan automáticamente

## 📁 Estructura del Proyecto

```
music-generator/
├── app.py                 # Backend Flask con MusicGen
├── requirements.txt       # Dependencias Python
├── README.md             # Este archivo
├── .gitignore            # Archivos ignorados por Git
├── templates/
│   └── index.html        # Interfaz web HTML5
├── static/
│   ├── style.css         # Estilos CSS3 modernos
│   └── script.js         # JavaScript interactivo
└── generated/
    └── .gitkeep          # Carpeta para música generada
```

## ⚖️ Derechos de Autor y Licencia

### Tu Música
**Eres dueño absoluto de toda la música que generes** con esta aplicación. Puedes:
- Usar la música para proyectos personales o comerciales
- Modificar y editar la música generada
- Distribuir la música sin restricciones
- No necesitas dar crédito (aunque se agradece)

### Esta Aplicación
- **Licencia**: MIT License
- **Código**: Libre para usar, modificar y distribuir

### MusicGen
- **Desarrollado por**: Meta AI (Facebook Research)
- **Licencia**: MIT License
- **Agradecimientos**: Esta aplicación usa [MusicGen](https://github.com/facebookresearch/audiocraft) de Meta AI

## 🐛 Troubleshooting (Solución de Problemas)

### La instalación falla

**Problema**: Error al instalar PyTorch o audiocraft

**Solución**:
```bash
# Instalar PyTorch primero (CPU)
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu

# Luego instalar audiocraft
pip install audiocraft
```

Para GPU con CUDA:
```bash
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### La generación es muy lenta

**Problema**: Tarda varios minutos en generar música

**Soluciones**:
1. Usa el modelo "Small" en lugar de "Large"
2. Reduce la duración a 5-10 segundos
3. Considera usar una GPU (mejora dramática de velocidad)

### Error "Out of Memory"

**Problema**: El programa se queda sin memoria

**Soluciones**:
1. Usa el modelo "Small"
2. Cierra otras aplicaciones
3. Reduce la duración de la música
4. Si usas GPU, intenta el modelo CPU

### El servidor no inicia

**Problema**: Error al ejecutar `python app.py`

**Soluciones**:
1. Verifica que el entorno virtual esté activado
2. Reinstala las dependencias: `pip install -r requirements.txt`
3. Verifica el puerto 5000 esté libre: `lsof -i :5000` (Mac/Linux)

### Primera generación muy lenta

**Problema**: La primera vez tarda mucho

**Explicación**: Esto es normal. La primera vez que usas un modelo:
1. Se descarga el modelo (2-5 GB dependiendo del tamaño)
2. Se carga en memoria
3. Las siguientes generaciones serán mucho más rápidas

### No se genera música

**Problema**: Error al generar música

**Verificaciones**:
1. Revisa que el prompt no esté vacío
2. Asegúrate de tener espacio en disco (10GB+)
3. Verifica los logs en la consola para ver el error específico

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Si deseas mejorar esta aplicación:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras problemas o tienes preguntas:

1. Revisa la sección de [Troubleshooting](#-troubleshooting-solución-de-problemas)
2. Busca en los [Issues](https://github.com/Mauricio84gv/music-generator/issues) existentes
3. Abre un nuevo Issue si no encuentras solución

## 🙏 Agradecimientos

- **Meta AI** por crear y liberar MusicGen
- **Facebook Research** por el proyecto AudioCraft
- La comunidad open source por las herramientas increíbles

## 📜 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Hecho con ❤️ usando MusicGen de Meta AI**

¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!