"""
Music Generator Web Application
Backend Flask con integración MusicGen de Meta
"""

from flask import Flask, render_template, request, jsonify, send_file
from audiocraft.models import MusicGen
import scipy.io.wavfile
import torch
import os
import time
from datetime import datetime, timedelta
import re
import secrets

app = Flask(__name__)

# Configuración
GENERATED_FOLDER = 'generated'
MAX_DURATION = 30
MIN_DURATION = 5
CLEANUP_AGE_HOURS = 1

# Asegurar que existe la carpeta generated
os.makedirs(GENERATED_FOLDER, exist_ok=True)

# Variable global para cachear el modelo
_cached_model = None
_cached_model_size = None


def get_model(model_size='small'):
    """Obtener o cachear el modelo MusicGen"""
    global _cached_model, _cached_model_size
    
    if _cached_model is None or _cached_model_size != model_size:
        print(f"Cargando modelo MusicGen '{model_size}'...")
        _cached_model = MusicGen.get_pretrained(f'facebook/musicgen-{model_size}')
        _cached_model_size = model_size
        print("Modelo cargado exitosamente")
    
    return _cached_model


def sanitize_filename(text):
    """Sanitizar nombre de archivo para prevenir path traversal"""
    # Remover caracteres no seguros
    safe_text = re.sub(r'[^\w\s-]', '', text)
    safe_text = re.sub(r'[-\s]+', '_', safe_text)
    return safe_text[:50]  # Limitar longitud


def cleanup_old_files():
    """Limpiar archivos generados hace más de CLEANUP_AGE_HOURS"""
    try:
        current_time = time.time()
        cutoff_time = current_time - (CLEANUP_AGE_HOURS * 3600)
        
        for filename in os.listdir(GENERATED_FOLDER):
            if filename == '.gitkeep':
                continue
            
            filepath = os.path.join(GENERATED_FOLDER, filename)
            if os.path.isfile(filepath):
                file_time = os.path.getmtime(filepath)
                if file_time < cutoff_time:
                    os.remove(filepath)
                    print(f"Archivo antiguo eliminado: {filename}")
    except Exception as e:
        print(f"Error en limpieza de archivos: {e}")


@app.route('/')
def index():
    """Servir la interfaz principal"""
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate_music():
    """Endpoint para generar música"""
    try:
        # Obtener parámetros
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No se recibieron datos'}), 400
        
        prompt = data.get('prompt', '').strip()
        duration = data.get('duration', 10)
        model_size = data.get('model', 'small')
        
        # Validaciones
        if not prompt:
            return jsonify({'error': 'El prompt no puede estar vacío'}), 400
        
        if len(prompt) > 500:
            return jsonify({'error': 'El prompt es demasiado largo (máximo 500 caracteres)'}), 400
        
        try:
            duration = int(duration)
        except ValueError:
            return jsonify({'error': 'Duración inválida'}), 400
        
        if duration < MIN_DURATION or duration > MAX_DURATION:
            return jsonify({'error': f'La duración debe estar entre {MIN_DURATION} y {MAX_DURATION} segundos'}), 400
        
        if model_size not in ['small', 'medium', 'large']:
            return jsonify({'error': 'Modelo inválido'}), 400
        
        # Limpiar archivos antiguos
        cleanup_old_files()
        
        # Generar música
        print(f"Generando música: '{prompt}' ({duration}s, modelo: {model_size})")
        
        model = get_model(model_size)
        model.set_generation_params(duration=duration)
        
        # Generar audio
        wav = model.generate([prompt])
        
        # Generar nombre de archivo único
        safe_prompt = sanitize_filename(prompt)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        random_token = secrets.token_hex(4)
        filename = f"{timestamp}_{random_token}_{safe_prompt}.wav"
        filepath = os.path.join(GENERATED_FOLDER, filename)
        
        # Guardar archivo WAV
        sample_rate = model.sample_rate
        audio_data = wav[0].cpu().numpy()
        
        # Normalizar audio
        audio_data = audio_data.squeeze()
        max_val = max(abs(audio_data.max()), abs(audio_data.min()))
        if max_val > 0:
            audio_data = audio_data / max_val
        
        # Convertir a int16
        audio_data = (audio_data * 32767).astype('int16')
        
        scipy.io.wavfile.write(filepath, rate=sample_rate, data=audio_data)
        
        print(f"Música generada exitosamente: {filename}")
        
        return jsonify({
            'success': True,
            'filename': filename,
            'message': 'Música generada exitosamente'
        })
        
    except Exception as e:
        print(f"Error generando música: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Error al generar música: {str(e)}'}), 500


@app.route('/download/<filename>')
def download_file(filename):
    """Endpoint para descargar archivos generados"""
    try:
        # Sanitizar filename para prevenir path traversal
        safe_filename = os.path.basename(filename)
        filepath = os.path.join(GENERATED_FOLDER, safe_filename)
        
        # Verificar que el archivo existe y está en la carpeta correcta
        if not os.path.exists(filepath):
            return jsonify({'error': 'Archivo no encontrado'}), 404
        
        # Verificar que no hay path traversal
        if not os.path.abspath(filepath).startswith(os.path.abspath(GENERATED_FOLDER)):
            return jsonify({'error': 'Acceso denegado'}), 403
        
        return send_file(
            filepath,
            mimetype='audio/wav',
            as_attachment=True,
            download_name=safe_filename
        )
        
    except Exception as e:
        print(f"Error descargando archivo: {str(e)}")
        return jsonify({'error': 'Error al descargar archivo'}), 500


@app.errorhandler(404)
def not_found(e):
    """Manejo de error 404"""
    return jsonify({'error': 'Recurso no encontrado'}), 404


@app.errorhandler(500)
def internal_error(e):
    """Manejo de error 500"""
    return jsonify({'error': 'Error interno del servidor'}), 500


if __name__ == '__main__':
    print("=" * 60)
    print("🎵 Music Generator con IA - MusicGen")
    print("=" * 60)
    print(f"Carpeta de archivos generados: {GENERATED_FOLDER}")
    print(f"Duración permitida: {MIN_DURATION}-{MAX_DURATION} segundos")
    print(f"Limpieza automática: archivos > {CLEANUP_AGE_HOURS} hora(s)")
    print("=" * 60)
    
    # Verificar CUDA
    if torch.cuda.is_available():
        print(f"✓ GPU disponible: {torch.cuda.get_device_name(0)}")
    else:
        print("⚠ GPU no disponible, usando CPU (será más lento)")
    
    print("=" * 60)
    print("Iniciando servidor...")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
