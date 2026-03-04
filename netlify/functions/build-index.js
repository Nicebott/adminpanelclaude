// build-index.js — se ejecuta automáticamente en cada deploy de Netlify
// Lee todos los .json de /articulos y genera /articulos/index.json
// Ordena por campo "date" dentro del JSON (más reciente primero)

const fs = require('fs');
const path = require('path');

const articulosDir = path.join(__dirname, '..', '..', 'articulos');
const files = fs.readdirSync(articulosDir)
  .filter(f => f.endsWith('.json') && f !== 'index.json');

const index = files.map(filename => {
  const raw = fs.readFileSync(path.join(articulosDir, filename), 'utf8');
  const art = JSON.parse(raw);
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

// Sort by date field inside JSON, newest first
index.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(
  path.join(articulosDir, 'index.json'),
  JSON.stringify(index, null, 2)
);

console.log(`✓ index.json generado con ${index.length} artículos:`);
index.forEach((a, i) => console.log(`  ${i+1}. [${a.date}] ${a.id}`));
