/* Genera «abrir_en_local.html», una copia de index.html con la cabecera HTML completa
   para abrirla directamente en el navegador (doble clic). index.html se publica sin
   cabecera porque la plataforma la añade al publicar.
   Uso: node generar_version_local.js */
const fs = require('fs');
const path = require('path');
const { paginaCompleta } = require('./construir_sitio.js');
const dir = __dirname;
const html = paginaCompleta(fs.readFileSync(path.join(dir, 'index.html'), 'utf8'));
fs.writeFileSync(path.join(dir, 'abrir_en_local.html'), html, 'utf8');
console.log('Generado: ' + path.join(dir, 'abrir_en_local.html'));
