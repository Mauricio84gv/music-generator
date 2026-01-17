/**
 * Music Generator - Frontend JavaScript
 * Manejo de eventos, llamadas API y estados de UI
 */

// Estado de la aplicación
let currentFilename = null;

// Elementos del DOM
const generatorForm = document.getElementById('generatorForm');
const promptInput = document.getElementById('prompt');
const durationInput = document.getElementById('duration');
const durationValue = document.getElementById('durationValue');
const modelSelect = document.getElementById('model');
const generateBtn = document.getElementById('generateBtn');
const btnText = generateBtn.querySelector('.btn-text');
const btnLoading = generateBtn.querySelector('.btn-loading');

const resultsSection = document.getElementById('resultsSection');
const successState = document.getElementById('successState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');

const audioPlayer = document.getElementById('audioPlayer');
const downloadBtn = document.getElementById('downloadBtn');
const newGenerationBtn = document.getElementById('newGenerationBtn');
const retryBtn = document.getElementById('retryBtn');

const exampleItems = document.querySelectorAll('.example-item');

// ===================================
// Event Listeners
// ===================================

// Actualizar valor del slider de duración
durationInput.addEventListener('input', (e) => {
  durationValue.textContent = `${e.target.value}s`;
});

// Enviar formulario
generatorForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  await generateMusic();
});

// Botón de nueva generación
newGenerationBtn.addEventListener('click', () => {
  hideResults();
  promptInput.focus();
});

// Botón de reintentar
retryBtn.addEventListener('click', async () => {
  await generateMusic();
});

// Botón de descarga
downloadBtn.addEventListener('click', () => {
  if (currentFilename) {
    downloadFile(currentFilename);
  }
});

// Ejemplos de prompts
exampleItems.forEach(item => {
  item.addEventListener('click', () => {
    const examplePrompt = item.dataset.prompt;
    promptInput.value = examplePrompt;
    promptInput.focus();
    
    // Scroll suave al formulario
    generatorForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===================================
// Funciones principales
// ===================================

/**
 * Generar música llamando al backend
 */
async function generateMusic() {
  try {
    // Obtener valores del formulario
    const prompt = promptInput.value.trim();
    const duration = parseInt(durationInput.value);
    const model = modelSelect.value;
    
    // Validación básica
    if (!prompt) {
      showError('Por favor, describe la música que deseas generar.');
      return;
    }
    
    if (prompt.length > 500) {
      showError('El prompt es demasiado largo. Máximo 500 caracteres.');
      return;
    }
    
    // Mostrar estado de carga
    setLoadingState(true);
    hideResults();
    
    // Llamada al backend
    const response = await fetch('/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        duration: duration,
        model: model
      })
    });
    
    const data = await response.json();
    
    // Ocultar estado de carga
    setLoadingState(false);
    
    // Manejar respuesta
    if (response.ok && data.success) {
      // Éxito - mostrar reproductor
      currentFilename = data.filename;
      showSuccess(data.filename);
    } else {
      // Error del servidor
      const errorMsg = data.error || 'Error desconocido al generar música';
      showError(errorMsg);
    }
    
  } catch (error) {
    console.error('Error:', error);
    setLoadingState(false);
    showError('Error de conexión. Por favor, verifica que el servidor esté activo.');
  }
}

/**
 * Descargar archivo de audio
 */
function downloadFile(filename) {
  const downloadUrl = `/download/${encodeURIComponent(filename)}`;
  
  // Crear enlace temporal y hacer click
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ===================================
// Funciones de UI
// ===================================

/**
 * Establecer estado de carga del botón
 */
function setLoadingState(isLoading) {
  if (isLoading) {
    generateBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
  } else {
    generateBtn.disabled = false;
    btnText.style.display = 'flex';
    btnLoading.style.display = 'none';
  }
}

/**
 * Mostrar resultado exitoso con reproductor
 */
function showSuccess(filename) {
  // Configurar reproductor de audio
  const audioUrl = `/download/${encodeURIComponent(filename)}`;
  audioPlayer.src = audioUrl;
  
  // Mostrar sección de resultados
  resultsSection.style.display = 'block';
  successState.style.display = 'block';
  errorState.style.display = 'none';
  
  // Scroll suave a los resultados
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  // Reproducir automáticamente (algunos navegadores pueden bloquear esto)
  audioPlayer.play().catch(err => {
    console.log('Autoplay bloqueado:', err);
  });
}

/**
 * Mostrar error
 */
function showError(message) {
  errorMessage.textContent = message;
  
  resultsSection.style.display = 'block';
  successState.style.display = 'none';
  errorState.style.display = 'block';
  
  // Scroll suave a los resultados
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Ocultar sección de resultados
 */
function hideResults() {
  resultsSection.style.display = 'none';
  successState.style.display = 'none';
  errorState.style.display = 'none';
  
  // Limpiar reproductor
  audioPlayer.pause();
  audioPlayer.src = '';
  currentFilename = null;
}

// ===================================
// Utilidades
// ===================================

/**
 * Validar formulario antes de enviar
 */
function validateForm() {
  const prompt = promptInput.value.trim();
  
  if (!prompt) {
    return { valid: false, message: 'El prompt no puede estar vacío' };
  }
  
  if (prompt.length > 500) {
    return { valid: false, message: 'El prompt es demasiado largo (máximo 500 caracteres)' };
  }
  
  return { valid: true };
}

// ===================================
// Inicialización
// ===================================

/**
 * Inicializar la aplicación
 */
function init() {
  console.log('🎵 Music Generator inicializado');
  
  // Configurar valor inicial del slider
  durationValue.textContent = `${durationInput.value}s`;
  
  // Focus en el textarea
  promptInput.focus();
}

// Ejecutar inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ===================================
// Prevenir comportamientos por defecto
// ===================================

// Prevenir recarga accidental durante generación
// Error messages are in Spanish to match the UI language
window.addEventListener('beforeunload', (e) => {
  if (generateBtn.disabled) {
    e.preventDefault();
    e.returnValue = '¿Estás seguro? La generación de música está en progreso.';
    return e.returnValue;
  }
});
