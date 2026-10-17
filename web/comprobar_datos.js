/* Comprueba la integridad de los ficheros de datos: que cada posición y cada caso citen fuentes
   existentes, que los valores estén en su escala y que las preguntas de fondo tengan eje, sentido
   y etiqueta. Termina con error si algo falla (la publicación automática se detiene).
   Uso: node web/comprobar_datos.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const dir = process.argv[2] || __dirname;
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['partidos.js', 'preguntas.js', 'fiabilidad.js', 'ejes.js', 'fuentes.js']) {
  const code = fs.readFileSync(path.join(dir, 'datos', f), 'utf8');
  vm.runInContext(code.replace(/^window\.COTEJO = window\.COTEJO \|\| \{\};/m, 'window.COTEJO = window.COTEJO || {}; var COTEJO = window.COTEJO;'), ctx, { filename: f });
}
const D = ctx.window.COTEJO;
const errs = [];
const warn = [];
const pids = new Set(D.parties.map((p) => p.id));
const cats = new Set(D.categories.map((c) => c.id));
const areas = new Set(D.relAreas.map((a) => a.id));
const used = new Set();
const src = (id) => { if (!D.sources[id]) errs.push('Fuente inexistente: ' + id); used.add(id); };
const checkPos = (qid, pid, pos) => {
  if (!pids.has(pid)) errs.push(qid + ' partido desconocido ' + pid);
  if (!Array.isArray(pos) || pos.length !== 4) { errs.push(qid + '/' + pid + ' formato'); return; }
  const [v, c, n, s] = pos;
  if (![-2, -1, 0, 1, 2].includes(v)) errs.push(qid + '/' + pid + ' valor ' + v);
  if (!['A', 'B', 'C'].includes(c)) errs.push(qid + '/' + pid + ' evidencia ' + c);
  if (!n) warn.push(qid + '/' + pid + ' sin nota');
  if (!s || !s.length) errs.push(qid + '/' + pid + ' sin fuente');
  (s || []).forEach(src);
};

/* Preguntas sobre medidas */
const qids = new Set();
for (const q of D.questions) {
  if (qids.has(q.id)) errs.push('Pregunta duplicada ' + q.id);
  qids.add(q.id);
  if (!cats.has(q.cat)) errs.push(q.id + ' categoría ' + q.cat);
  (q.ctxSrc || []).forEach(src);
  for (const [pid, pos] of Object.entries(q.pos)) checkPos(q.id, pid, pos);
}

/* Partidos e historial */
for (const p of D.parties) {
  (p.expSrc || []).forEach(src);
  (p.ties || []).forEach((t) => (t[1] || []).forEach(src));
  if (!D.reliability[p.id]) errs.push('Sin bloque de historial: ' + p.id);
}
(D.notEvaluated || []).forEach((x) => (x[2] || []).forEach(src));
if (D.meta && D.meta.pollSource) src(D.meta.pollSource);
let ncases = 0;
for (const [pid, R] of Object.entries(D.reliability)) {
  if (!pids.has(pid)) errs.push('Historial de partido desconocido ' + pid);
  for (const c of R.cases) {
    ncases++;
    if (!areas.has(c.a)) errs.push(pid + ' área ' + c.a + ' en ' + c.t);
    if (!D.verdicts[c.v]) errs.push(pid + ' veredicto ' + c.v + ' en ' + c.t);
    if (![1, 2].includes(c.w)) errs.push(pid + ' peso ' + c.w);
    if (!c.s || !c.s.length) errs.push(pid + ' caso sin fuente: ' + c.t);
    (c.s || []).forEach(src);
  }
}

/* Ejes de fondo */
const axIds = new Set((D.deepAxes || []).map((a) => a.id));
const CHES = (D.ches && D.ches.scores) || {};
((D.ches && D.ches.sources) || []).forEach(src);
for (const a of D.deepAxes || []) {
  if (!a.labels || a.labels.length !== 5) errs.push('Eje ' + a.id + ' sin cinco tramos');
  for (const [v, d, w] of a.comps) {
    if (![1, -1].includes(d) || !(w > 0)) errs.push('Eje ' + a.id + ' componente ' + v);
    for (const pid of Object.keys(CHES)) if (typeof CHES[pid][v] !== 'number') errs.push('CHES ' + pid + ' sin ' + v);
  }
}
for (const p of D.parties) if (!CHES[p.id]) warn.push('Sin datos del CHES: ' + p.id);
const frames = new Set(Object.keys(D.islamFrames || {}));
const dqIds = new Set();
for (const q of D.deepQuestions || []) {
  if (dqIds.has(q.id) || qids.has(q.id)) errs.push('Pregunta de fondo duplicada ' + q.id);
  dqIds.add(q.id);
  if (!q.id.startsWith('d_')) errs.push(q.id + ' sin prefijo d_');
  if (q.axis !== null && !axIds.has(q.axis)) errs.push(q.id + ' eje ' + q.axis);
  if (q.frame && !frames.has(q.frame)) errs.push(q.id + ' óptica ' + q.frame);
  if (q.type === 'choice') {
    if (!q.options || q.options.length < 2 || q.options.length > 9) errs.push(q.id + ' opciones');
    (q.options || []).forEach((o) => { if (!(o.v >= -1 && o.v <= 1) || !o.l) errs.push(q.id + ' opción ' + o.l); });
  } else {
    if (q.axis !== null && ![1, -1].includes(q.dir)) errs.push(q.id + ' sentido');
    if (!q.pro || !q.con) errs.push(q.id + ' sin argumentos');
  }
  if (!q.text || !q.ctx) errs.push(q.id + ' sin texto o contexto');
  if (!D.deepShort || !D.deepShort[q.id]) errs.push(q.id + ' sin etiqueta corta');
  if (q.axis === null && !q.pos) errs.push(q.id + ' transversal sin posiciones');
  (q.ctxSrc || []).forEach(src);
  for (const [pid, pos] of Object.entries(q.pos || {})) checkPos(q.id, pid, pos);
}
for (const k of Object.keys(D.deepShort || {})) if (!dqIds.has(k)) errs.push('Etiqueta corta sin pregunta ' + k);

const unused = Object.keys(D.sources).filter((k) => !used.has(k));
console.log('Preguntas: ' + D.questions.length + ' sobre medidas (' + D.questions.filter((q) => q.core).length + ' en la versión rápida) y ' + (D.deepQuestions || []).length + ' de fondo');
console.log('Partidos: ' + D.parties.length + ' · casos de historial: ' + ncases + ' · fuentes: ' + Object.keys(D.sources).length);
if (unused.length) console.log('Fuentes registradas sin cita en los datos (pueden citarse desde app.js): ' + unused.join(', '));
if (warn.length) console.log('Avisos (' + warn.length + '): ' + warn.slice(0, 12).join(' · '));
if (errs.length) { console.log('ERRORES: ' + errs.length); errs.forEach((e) => console.log(' - ' + e)); process.exit(1); }
console.log('OK: sin errores');
