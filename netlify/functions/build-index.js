// build-index.js — se ejecuta automáticamente en cada deploy de Netlify
// Lee todos los .json de /articulos y genera /articulos/index.json

const fs = require('fs');
const path = require('path');

const articulosDir = path.join(__dirname, '..', '..', 'articulos');
const files = fs.readdirSync(articulosDir)
  .filter(f => f.endsWith('.json') && f !== 'index.json')
  .sort()
  .reverse(); // más recientes primero (orden alfabético inverso por fecha en nombre)

const index = files.map(filename => {
  const raw = fs.readFileSync(path.join(articulosDir, filename), 'utf8');
  const art = JSON.parse(raw);
  // Solo guardamos metadatos en el índice, no el body completo
  return {
    id: art.id,
    cat: art.cat,
    date: art.date,
    author: art.author,
    readMin: art.readMin,
    gradient: art.gradient,
    filename: filename,
    es: { title: art.es.title, excerpt: art.es.excerpt },
    en: { title: art.en.title, excerpt: art.en.excerpt }
  };
});

fs.writeFileSync(
  path.join(articulosDir, 'index.json'),
  JSON.stringify(index, null, 2)
);

console.log(`✓ index.json generado con ${index.length} artículos`);
