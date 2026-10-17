# Cotejo 29-N

Herramienta web independiente para comparar tus opiniones con las candidaturas a las elecciones generales del 29 de noviembre de 2026. Tiene dos cuestionarios y un historial:

- **Medidas concretas** (47 preguntas, 22 en la versión rápida): lo que se discute en esta campaña, con la posición documentada de cada partido.
- **Ejes de fondo** (43 preguntas): once dimensiones ideológicas de largo alcance (sistema económico, ecología, autoridad, valores, religión, islam en tres ópticas, nación, Europa, orden internacional, democracia y modelo de Estado) y tres temas transversales. Las candidaturas se sitúan con el Chapel Hill Expert Survey 2024, una encuesta independiente a 609 politólogos, y el informe señala dónde no te representa ninguna.
- **Historial y fiabilidad**: 113 casos documentados de cumplimiento y coherencia.

Cada dato enlaza a su fuente (288 fuentes). Datos cerrados el 17 de octubre de 2026.

## Dónde verla

- GitHub Pages: https://nachocz.github.io/elecciones_29_N/ (la cuenta redirige a su dominio propio, https://ignaciocuiral.com/elecciones_29_N/)
- Artefacto de Claude: https://claude.ai/artifact/YGgMSihnJaYcML1PZDmueZ
- En local: ejecuta `node web/generar_version_local.js` y abre `web/abrir_en_local.html` con doble clic.

## Estructura

| Ruta | Contenido |
|---|---|
| `web/index.html` | Página y estilos. Se guarda sin cabecera HTML porque el artefacto la añade al publicar |
| `web/app.js` | Lógica: cuestionarios, cálculo de afinidad, ejes de fondo, gráficos, historial, fichas y método |
| `web/datos/partidos.js` | Candidaturas, ámbitos, encuestas, papeletas por comunidad y vínculos destacados |
| `web/datos/preguntas.js` | 47 preguntas sobre medidas con contexto, argumentos y posición de cada partido |
| `web/datos/ejes.js` | Ejes de fondo: medias del CHES 2024 por partido, definición de los 11 ejes y 43 preguntas |
| `web/datos/fiabilidad.js` | 113 casos de historial con veredicto (cumplimiento o coherencia) y fuentes |
| `web/datos/fuentes.js` | Registro de fuentes citadas por identificador |
| `web/comprobar_datos.js` | Verifica que cada posición y cada caso citen fuentes existentes y estén en su escala |
| `web/construir_sitio.js` | Genera `_site/` (página con cabecera completa, código y datos) para GitHub Pages |
| `web/generar_version_local.js` | Genera `web/abrir_en_local.html` para abrirla sin servidor |
| `.github/workflows/publicar-pages.yml` | Publicación automática: en cada subida a `main` comprueba los datos, construye `_site/` y lo publica en la rama `gh-pages` |
| `investigacion/` | Notas de investigación con las fuentes consultadas |

## Publicar cambios

1. Edita los datos o la página.
2. Comprueba los datos: `node web/comprobar_datos.js`.
3. Sube los cambios a `main` (`git push`). El flujo de GitHub Actions publica la nueva versión en `gh-pages` en uno o dos minutos.

GitHub Pages debe servir la rama `gh-pages` (Settings → Pages → Build and deployment → Deploy from a branch → `gh-pages` / `(root)`).

## Actualizar cuando se publiquen los programas (campaña: 13–27 de noviembre)

1. Añade la fuente en `web/datos/fuentes.js` (por ejemplo `prog_pp26`).
2. En `web/datos/preguntas.js` o `web/datos/ejes.js`, cambia la posición del partido: `[valor -2..2, 'A'|'B'|'C', 'nota', ['prog_pp26']]`. Un programa explícito es evidencia `A`.
3. Comprueba los datos y sube los cambios.

Las posiciones de los ejes de fondo proceden del CHES 2024 y no deben retocarse a mano; si se publica una nueva oleada, sustituye las medias de `COTEJO.ches.scores` en `web/datos/ejes.js`.

Formato de posición, escalas, pesos y veredictos: pestaña «Método y fuentes» de la herramienta.
