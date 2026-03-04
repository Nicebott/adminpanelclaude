# VÉRTICE — Portal de Noticias

## Archivos del proyecto

```
vertice-site/
├── index.html              ← Portal público
├── admin.html              ← Panel de administración con IA
├── netlify.toml            ← Configuración de Netlify
└── netlify/
    └── functions/
        └── claude.js       ← Proxy para la API de IA
```

## Pasos para publicar en Netlify

### 1. Sube los archivos a Netlify
- Ve a https://netlify.com
- Arrastra la carpeta `vertice-site` completa a Netlify Drop
- O conéctalo a GitHub para actualizaciones automáticas

### 2. Configura tu API Key de Anthropic
- En Netlify → Site settings → Environment variables
- Agrega: `GEMINI_API_KEY` = tu clave de https://aistudio.google.com
- Haz redeploy del sitio

### 3. Listo
- Tu portal: https://tu-sitio.netlify.app
- Tu admin: https://tu-sitio.netlify.app/admin.html

## Cómo agregar artículos

1. Ve al admin → escribe el tema → genera con IA
2. Copia el JSON generado
3. Pégalo al inicio del array `ARTICLES` en `index.html`
4. Sube el archivo actualizado a Netlify

## Obtener API Key gratuita

1. Ve a https://console.anthropic.com
2. Crea una cuenta (gratis)
3. API Keys → Create Key
4. Copia la clave y pégala en Netlify como variable de entorno
