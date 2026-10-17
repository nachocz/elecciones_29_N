/* Construye la versión publicable del sitio en «_site» (raíz del proyecto) para GitHub Pages:
   index.html con la cabecera HTML completa, app.js y la carpeta datos.
   index.html se guarda sin cabecera porque el artefacto de Claude la añade al publicar;
   aquí se añade la misma cabecera para servirlo como página normal.
   Uso: node web/construir_sitio.js */
const fs = require('fs');
const path = require('path');

/* Mueve título, metadatos y estilos a <head> y añade lo que pone la plataforma de artefactos:
   charset, viewport y el margen superior e inferior de las zonas seguras del móvil. */
function paginaCompleta(src) {
  const cut = src.indexOf('</style>');
  if (cut < 0) throw new Error('index.html no tiene bloque <style>');
  const head = src.slice(0, cut + '</style>'.length).trim();
  const body = src.slice(cut + '</style>'.length).trim();
  const desc = (/<meta name="description" content="([^"]*)"/.exec(head) || [])[1] || '';
  return '<!doctype html>\n<html lang="es">\n<head>\n' +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
    '<style>:root { padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }</style>\n' +
    head + '\n' +
    '<meta property="og:title" content="Cotejo 29-N">\n' +
    '<meta property="og:type" content="website">\n' +
    (desc ? '<meta property="og:description" content="' + desc + '">\n' : '') +
    '</head>\n<body>\n' + body + '\n</body>\n</html>\n';
}

function construir() {
  const web = __dirname;
  const out = path.join(web, '..', '_site');
  const html = paginaCompleta(fs.readFileSync(path.join(web, 'index.html'), 'utf8'));
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(path.join(out, 'datos'), { recursive: true });
  fs.writeFileSync(path.join(out, 'index.html'), html, 'utf8');
  fs.copyFileSync(path.join(web, 'app.js'), path.join(out, 'app.js'));
  const datos = fs.readdirSync(path.join(web, 'datos')).filter((f) => f.endsWith('.js'));
  for (const f of datos) fs.copyFileSync(path.join(web, 'datos', f), path.join(out, 'datos', f));
  fs.writeFileSync(path.join(out, '.nojekyll'), '', 'utf8');
  console.log('Sitio construido en ' + out + ' (index.html, app.js y ' + datos.length + ' ficheros de datos)');
}

module.exports = { paginaCompleta };
if (require.main === module) construir();
