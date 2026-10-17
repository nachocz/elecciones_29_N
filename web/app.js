/* Cotejo 29-N · Lógica de la aplicación (sin dependencias). */
(function () {
  'use strict';
  const D = window.COTEJO;
  const app = document.getElementById('app');
  if (!D || !D.questions || !D.sources || !D.reliability) {
    if (app) app.textContent = 'No se han podido cargar los ficheros de datos (carpeta «datos»). Comprueba que están junto a esta página.';
    return;
  }

  /* ───────── utilidades ───────── */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pct = (x) => Math.round(x * 100);
  const MIN_ANS = 6;
  const MIN_COV = 0.5;
  /* Contracción: con poca evidencia, la afinidad se acerca al 50%. Equivale a añadir
     K «preguntas virtuales» de peso 1 con coincidencia del 50%. */
  const SHRINK_K = 3;
  /* Pregunta respondida sin posición documentada del partido: coincidencia esperada del 50%
     con este peso relativo (no sabemos qué opina, así que no debe favorecerle ni hundirle). */
  const MISSING_W = 0.5;
  const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const byId = Object.fromEntries(D.parties.map((p) => [p.id, p]));
  const catById = Object.fromEntries(D.categories.map((c) => [c.id, c]));
  const areaById = Object.fromEntries(D.relAreas.map((a) => [a.id, a]));
  const CONF_W = Object.fromEntries(Object.entries(D.confidence).map(([k, v]) => [k, v.w]));
  const CAT_SHORT = { eco: 'Economía', tra: 'Trabajo', viv: 'Vivienda', inm: 'Inmigración', ter: 'Territorio', ins: 'Instituciones', seg: 'Seguridad', igu: 'Igualdad', ext: 'Exterior', ene: 'Energía', san: 'Sanidad y educ.', pac: 'Pactos' };
  const qshort = (q) => (q.deep ? (D.deepShort || {})[q.id] : (D.qshort || {})[q.id]) || q.text;

  /* Ejes de fondo: preguntas sobre grandes dimensiones ideológicas; posiciones de partidos según el CHES 2024 */
  const DQ = D.deepQuestions || [];
  const DAX = D.deepAxes || [];
  const CHES = (D.ches && D.ches.scores) || {};
  DQ.forEach((q) => { q.deep = true; });
  const daxById = Object.fromEntries(DAX.map((a) => [a.id, a]));
  const ALLQ = D.questions.concat(DQ);
  const qById = Object.fromEntries(ALLQ.map((q) => [q.id, q]));
  const MIN_DEEP = 6;
  const MODES = ['rapido', 'completo', 'fondo', 'todo'];

  function fmtDate(d) {
    const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(d || '');
    if (!m) return d || '';
    const mo = MONTHS[+m[2] - 1];
    return m[3] ? +m[3] + ' ' + mo + ' ' + m[1] : mo + ' ' + m[1];
  }
  function bin7(x) { return Math.max(0, Math.min(6, Math.floor(x * 7 - 1e-9))); }

  /* ───────── estado ───────── */
  const STORE_KEY = 'cotejo29n.v1';
  const PERSIST = ['answers', 'skipped', 'region', 'mode', 'idx', 'mapY', 'relWeighted', 'relParty', 'relDim', 'dmapX', 'dmapY'];
  const S = {
    answers: {}, skipped: {}, revealed: {}, region: 'ES', mode: 'rapido', idx: 0,
    view: 'cuestionario', example: false, deepExample: false, mapY: 't', relWeighted: true, relParty: null, relDim: 'all',
    relArea: 'all', detailCat: 'all', pasteOpen: false, focusId: null, dmapX: null, dmapY: null
  };
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const o = JSON.parse(raw);
      for (const k of PERSIST) if (o && o[k] !== undefined) S[k] = o[k];
      // limpiar respuestas de preguntas inexistentes o con un formato que ya no vale
      for (const k of Object.keys(S.answers)) {
        const q = qById[k], a = S.answers[k];
        const fine = q && a && [0.5, 1, 2].includes(a.w) &&
          (q.type === 'choice' ? Number.isInteger(a.o) && a.o >= 0 && a.o < q.options.length : [-2, -1, 0, 1, 2].includes(a.v));
        if (!fine) delete S.answers[k];
      }
      if (!MODES.includes(S.mode)) S.mode = 'rapido';
    } catch (e) { /* almacenamiento no disponible */ }
  }
  function save() {
    try {
      const o = {};
      for (const k of PERSIST) o[k] = S[k];
      localStorage.setItem(STORE_KEY, JSON.stringify(o));
    } catch (e) { /* almacenamiento no disponible */ }
  }

  /* Perfil de ejemplo (ficticio) para mostrar el informe sin respuestas propias */
  const EXAMPLE = {
    eco1: { v: -1, w: 1 }, eco2: { v: 1, w: 1 }, tra1: { v: 1, w: 1 }, tra2: { v: 1, w: 2 }, viv1: { v: 1, w: 2 },
    viv2: { v: 1, w: 1 }, viv3: { v: 1, w: 1 }, inm1: { v: 1, w: 1 }, inm2: { v: -1, w: 1 }, inm3: { v: 1, w: 1 },
    ter1: { v: -2, w: 1 }, ter2: { v: -2, w: 2 }, ter3: { v: -2, w: 1 }, ins1: { v: 1, w: 1 }, seg1: { v: 0, w: 0.5 },
    igu1: { v: 1, w: 1 }, igu2: { v: -2, w: 1 }, ext1: { v: 1, w: 1 }, ext3: { v: 1, w: 1 }, ext4: { v: -1, w: 0.5 },
    ene1: { v: 1, w: 1 }, san1: { v: 1, w: 1 }
  };
  const activeAnswers = () => (S.example ? EXAMPLE : S.answers);
  /* El ejemplo simula a un votante de Madrid: solo candidaturas de ámbito estatal */
  const resultParties = () => (S.example ? D.parties.filter((p) => p.scope === 'estatal' && !(p.excludeIn || []).includes('MD')) : visibleParties());
  const qList = () => (S.mode === 'rapido' ? D.questions.filter((q) => q.core) : S.mode === 'completo' ? D.questions : S.mode === 'fondo' ? DQ : ALLQ);
  const ownRegion = () => (D.regions.find((r) => r.id === S.region) || D.regions[0]).name;
  const regionName = () => (S.example ? 'Comunidad de Madrid (ejemplo)' : ownRegion());

  /* Perfil de ejemplo para los ejes de fondo (ficticio): izquierda laica y feminista, europeísta y atlantista */
  const EXAMPLE_DEEP = {
    d_sis0: { o: 2, w: 1 }, d_sis1: { v: 0, w: 1 }, d_sis2: { v: 1, w: 1 }, d_sis3: { v: 1, w: 0.5 }, d_sis4: { v: -2, w: 1 }, d_sis5: { v: 0, w: 1 },
    d_eco1: { v: -1, w: 1 }, d_eco2: { v: 1, w: 1 }, d_eco3: { v: 1, w: 0.5 },
    d_aut1: { v: -2, w: 1 }, d_aut2: { v: -1, w: 1 }, d_aut3: { v: 1, w: 0.5 }, d_aut4: { v: -2, w: 1 }, d_aut5: { v: 1, w: 1 },
    d_val1: { v: -2, w: 1 }, d_val2: { v: 2, w: 2 }, d_val3: { v: -2, w: 1 },
    d_rel1: { v: 2, w: 1 }, d_rel2: { v: -2, w: 1 }, d_rel3: { v: 2, w: 1 },
    d_isl1: { v: -1, w: 1 }, d_isl6: { v: -1, w: 1 }, d_isl2: { v: 2, w: 2 }, d_isl4: { v: 2, w: 1 }, d_isl3: { v: 1, w: 1 }, d_isl5: { v: 0, w: 1 },
    d_nac1: { v: -1, w: 1 }, d_nac2: { v: 1, w: 1 }, d_nac3: { v: 0, w: 0.5 }, d_nac4: { v: -1, w: 1 },
    d_sob1: { v: 2, w: 1 }, d_sob2: { v: -2, w: 1 },
    d_geo1: { v: -2, w: 1 }, d_geo2: { v: 1, w: 1 }, d_geo3: { v: -2, w: 1 },
    d_dem1: { v: 0, w: 1 }, d_dem2: { v: -1, w: 1 }, d_dem3: { v: 1, w: 1 },
    d_ter0: { o: 3, w: 1 }, d_ter1: { v: -1, w: 1 },
    d_tr1: { v: -1, w: 1 }, d_tr2: { v: -2, w: 1 }, d_tr3: { v: 1, w: 1 }
  };
  const countIn = (ans, list) => list.filter((q) => ans[q.id]).length;
  const countMain = (ans) => countIn(ans, D.questions);
  const countDeep = (ans) => countIn(ans, DQ);
  const deepAnswers = () => (S.deepExample ? EXAMPLE_DEEP : S.answers);

  function visibleParties() {
    return D.parties.filter((p) => {
      if (p.excludeIn && p.excludeIn.includes(S.region)) return false;
      if (p.scope === 'estatal') return true;
      return S.region === 'ES' || p.regions.includes(S.region);
    });
  }

  /* ───────── cálculo ───────── */
  function scoreParty(p, ans) {
    let num = 0, den = 0, ansW = 0, covW = 0, n = 0;
    const cat = {};
    const detail = [];
    for (const q of D.questions) {
      const a = ans[q.id];
      if (!a) continue;
      ansW += a.w;
      const pos = q.pos[p.id];
      if (!pos) { num += a.w * MISSING_W * 0.5; den += a.w * MISSING_W; continue; }
      const ww = a.w * CONF_W[pos[1]];
      const s = 1 - Math.abs(a.v - pos[0]) / 4;
      num += ww * s; den += ww; covW += a.w; n++;
      const c = cat[q.cat] || (cat[q.cat] = { num: 0, den: 0, n: 0 });
      c.num += ww * s; c.den += ww; c.n++;
      detail.push({ q, a, pos, s, ww });
    }
    for (const k in cat) cat[k].aff = cat[k].den ? cat[k].num / cat[k].den : null;
    const aff = den ? (num + SHRINK_K * 0.5) / (den + SHRINK_K) : null;
    const raw = den ? num / den : null;
    return { p, aff, raw, cov: ansW ? covW / ansW : 0, n, cat, detail, ok: aff !== null && (ansW ? covW / ansW : 0) >= MIN_COV };
  }
  function rankScores(ans, parties) {
    return parties.map((p) => scoreParty(p, ans)).sort((x, y) => (y.ok - x.ok) || ((y.aff || 0) - (x.aff || 0)));
  }
  function axisFor(getter) {
    const acc = { e: [0, 0, 0], t: [0, 0, 0], s: [0, 0, 0] };
    for (const q of D.questions) {
      if (!q.ax) continue;
      const g = getter(q);
      if (!g) continue;
      for (const k of Object.keys(q.ax)) { acc[k][0] += q.ax[k] * g.v * g.w; acc[k][1] += 2 * g.w; acc[k][2]++; }
    }
    const out = {};
    for (const k in acc) out[k] = { v: acc[k][1] ? acc[k][0] / acc[k][1] : null, n: acc[k][2] };
    return out;
  }
  const partyAxis = (p) => axisFor((q) => { const pos = q.pos[p.id]; return pos ? { v: pos[0], w: CONF_W[pos[1]] } : null; });
  const userAxis = (ans) => axisFor((q) => { const a = ans[q.id]; return a ? { v: a.v, w: a.w } : null; });

  /* ───────── cálculo: ejes de fondo ───────── */
  /* Variables CHES a −1…+1: escalas 0–10 con (x − 5) / 5; integración europea (1–7) con (x − 4) / 3 */
  const chesNorm = (v, x) => (v === 'eu_position' ? (x - 4) / 3 : (x - 5) / 5);
  const DPOS = {};
  function partyDeep(pid) {
    if (DPOS[pid] !== undefined) return DPOS[pid];
    const s = CHES[pid];
    if (!s) return (DPOS[pid] = null);
    const out = {};
    for (const ax of DAX) {
      let num = 0, den = 0;
      for (const [v, dir, w] of ax.comps) if (typeof s[v] === 'number') { num += dir * chesNorm(v, s[v]) * w; den += w; }
      out[ax.id] = den ? Math.max(-1, Math.min(1, num / den)) : null;
    }
    return (DPOS[pid] = out);
  }
  /* Valor de una respuesta en su eje, de −1 a +1 */
  const deepVal = (q, a) => (q.type === 'choice' ? (q.options[a.o] ? q.options[a.o].v : null) : q.dir * a.v / 2);
  function userDeep(ans) {
    const acc = {};
    for (const q of DQ) {
      const a = ans[q.id];
      if (!a || !q.axis) continue;
      const x = deepVal(q, a);
      if (x === null) continue;
      const c = acc[q.axis] || (acc[q.axis] = { num: 0, den: 0, n: 0 });
      c.num += x * a.w; c.den += a.w; c.n++;
    }
    const out = {};
    for (const ax of DAX) { const c = acc[ax.id]; out[ax.id] = c ? { v: c.num / c.den, n: c.n, w: c.den / c.n } : { v: null, n: 0, w: 0 }; }
    return out;
  }
  /* Afinidad por eje = 1 − |tú − partido| / 2; global = media ponderada por la importancia media de cada eje */
  function deepScores(ans, parties) {
    const u = userDeep(ans);
    return parties.map((p) => {
      const pp = partyDeep(p.id);
      if (!pp) return { p, aff: null, ax: {}, n: 0, ok: false };
      let num = 0, den = 0, n = 0;
      const ax = {};
      for (const a of DAX) {
        if (u[a.id].v === null || pp[a.id] === null) continue;
        const s = 1 - Math.abs(u[a.id].v - pp[a.id]) / 2;
        ax[a.id] = s; num += u[a.id].w * s; den += u[a.id].w; n++;
      }
      return { p, aff: den ? num / den : null, ax, n, ok: n >= 3 };
    }).sort((x, y) => (y.ok - x.ok) || ((y.aff || 0) - (x.aff || 0)));
  }
  const tramo = (ax, v) => ax.labels[Math.max(0, Math.min(4, Math.floor((v + 1) / 0.4)))];
  const fx = (v) => (v < -0.004 ? '−' : v > 0.004 ? '+' : '') + Math.abs(v).toFixed(2).replace('.', ',');
  const fd = (d) => d.toFixed(2).replace('.', ',');
  const SPECTRUM_MARGIN = 0.15, GAP_D = 0.3, PAIR_D = 0.45, PAIR_EXCESS = 0.2;
  /* Dónde queda una posición respecto a las candidaturas en un eje */
  /* Las comparaciones usan distancias redondeadas a dos decimales, las mismas que se muestran */
  const r2 = (x) => Math.round(x * 100) / 100;
  function axisStatus(ax, uv, parties) {
    const pts = parties.map((p) => ({ p, v: (partyDeep(p.id) || {})[ax.id] })).filter((x) => typeof x.v === 'number');
    if (uv === null || uv === undefined || !pts.length) return null;
    const byDist = pts.slice().sort((a, b) => Math.abs(a.v - uv) - Math.abs(b.v - uv));
    const near = byDist[0];
    const d = r2(Math.abs(near.v - uv));
    const vs = pts.map((x) => x.v);
    const min = Math.min.apply(null, vs), max = Math.max.apply(null, vs);
    let kind = 'ok';
    if (r2(min - uv) > SPECTRUM_MARGIN) kind = 'beyond-neg';
    else if (r2(uv - max) > SPECTRUM_MARGIN) kind = 'beyond-pos';
    else if (d > GAP_D) kind = 'gap';
    return { kind, near, d, close: byDist.filter((x) => r2(Math.abs(x.v - uv)) <= SPECTRUM_MARGIN), min, max };
  }
  /* Pares de ejes cuya combinación no representa ninguna candidatura, aunque cada eje por separado sí */
  function deepGaps(u, parties) {
    const axes = DAX.filter((a) => u[a.id].v !== null);
    const pts = parties.map((p) => ({ p, pos: partyDeep(p.id) })).filter((x) => x.pos);
    const out = [];
    if (!pts.length) return out;
    for (let i = 0; i < axes.length; i++) for (let j = i + 1; j < axes.length; j++) {
      const A = axes[i], B = axes[j], ua = u[A.id].v, ub = u[B.id].v;
      let best = null, d = Infinity, da = Infinity, db = Infinity, na = null, nb = null;
      for (const x of pts) {
        const pa = x.pos[A.id], pb = x.pos[B.id];
        const dd = Math.hypot(ua - pa, ub - pb);
        if (dd < d) { d = dd; best = x.p; }
        if (Math.abs(ua - pa) < da) { da = Math.abs(ua - pa); na = x.p; }
        if (Math.abs(ub - pb) < db) { db = Math.abs(ub - pb); nb = x.p; }
      }
      const excess = r2(d) - Math.max(r2(da), r2(db));
      if (r2(d) >= PAIR_D && r2(excess) >= PAIR_EXCESS) out.push({ A, B, best, d, da, db, na, nb, excess });
    }
    return out.sort((x, y) => y.excess - x.excess);
  }
  function pearson(xs, ys) {
    const n = xs.length;
    if (n < 3) return null;
    const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
    return sxx && syy ? sxy / Math.sqrt(sxx * syy) : null;
  }

  /* dim: 'all' | 'cum' (cumplimiento) | 'coh' (coherencia) */
  function relStats(pid, area, dim) {
    const R = D.reliability[pid];
    let num = 0, den = 0, n = 0, ctxN = 0;
    if (!R) return { idx: null, n: 0, ctxN: 0, w: 0 };
    for (const c of R.cases) {
      if (area && c.a !== area) continue;
      const v = D.verdicts[c.v];
      if (v.score === null) { ctxN++; continue; }
      if (dim && dim !== 'all' && v.dim !== dim) continue;
      num += v.score * c.w; den += c.w; n++;
    }
    return { idx: den ? num / den : null, n, ctxN, w: den };
  }
  function evidence(n, overall) {
    if (!n) return 'sin datos';
    if (overall) return n >= 10 ? 'alta' : n >= 5 ? 'media' : 'baja';
    return n >= 4 ? 'alta' : n >= 2 ? 'media' : 'baja';
  }
  const idxTxt = (st) => (st.idx === null ? '—' : pct(st.idx) + ' (' + st.n + (st.n === 1 ? ' caso' : ' casos') + ')');
  function relForUser(pid, ans, dim) {
    if (!S.relWeighted) return relStats(pid, null, dim).idx;
    const W = {};
    for (const q of D.questions) { const a = ans[q.id]; if (a) W[q.cat] = (W[q.cat] || 0) + a.w; }
    const vals = Object.values(W);
    W.pac = vals.length ? vals.reduce((x, y) => x + y, 0) / vals.length : 1;
    let num = 0, den = 0;
    for (const ar of D.relAreas) {
      const st = relStats(pid, ar.id, dim);
      if (st.idx === null || !W[ar.id]) continue;
      num += W[ar.id] * st.idx * st.w; den += W[ar.id] * st.w;
    }
    return den ? num / den : relStats(pid, null, dim).idx;
  }
  const shortName = (p) => p.name.replace(/\s*\(.*\)\s*$/, '');
  /* Experiencia de gobierno, en corto (para tablas) */
  const GOV = {
    psoe: 'Gobierno de España 2018–2026', pp: 'Gobierno de España 2011–2018 y CCAA', vox: 'Gobiernos autonómicos (2023–24 y desde 2026)',
    sumar: 'Socio del Gobierno 2023–2026', podemos: 'Socio del Gobierno 2020–2023', salf: 'Sin experiencia de gobierno',
    erc: 'Gobierno catalán 2021–2024', junts: 'Gobierno catalán hasta 2022', bildu: 'Gobiernos municipales', pnv: 'Gobierno vasco',
    bng: 'Oposición en Galicia', cc: 'Gobierno canario', upn: 'Gobierno navarro hasta 2015', adelante: 'Sin experiencia de gobierno'
  };

  /* ───────── piezas comunes ───────── */
  function srcLine(ids, compact) {
    if (!ids || !ids.length) return '';
    const links = ids.map((id) => {
      const s = D.sources[id];
      if (!s) return '';
      return '<a class="src" href="' + esc(s.u) + '" target="_blank" rel="noopener noreferrer" title="' + esc(s.t) + '">' + esc(s.o) + (s.d ? ', ' + esc(fmtDate(s.d)) : '') + '</a>';
    }).filter(Boolean).join('<span class="sep" aria-hidden="true">·</span>');
    return '<p class="srcs' + (compact ? ' compact' : '') + '"><span class="srcs-l">Fuentes</span> ' + links + '</p>';
  }
  function chip(p, conf, extra) {
    const c = conf ? ' conf-' + conf : '';
    return '<span class="chip' + c + (extra ? ' ' + extra : '') + '" title="' + esc(p.name + (conf ? ' · evidencia ' + D.confidence[conf].l.toLowerCase() : '')) + '">' + esc(p.short) + '</span>';
  }
  function pill(v) {
    const d = D.verdicts[v];
    return '<span class="pill ' + d.tone + '" title="' + esc(d.d) + '"><span aria-hidden="true">' + d.icon + '</span>' + esc(d.l) + '</span>';
  }

  /* Tooltip */
  const tip = document.getElementById('tip');
  function showTip(target, ev) {
    const text = target.getAttribute('data-tip');
    if (!text || !tip) return;
    tip.textContent = '';
    text.split('\n').forEach((line, i) => {
      const sp = document.createElement('span');
      sp.textContent = line;
      if (i === 0) sp.className = 'tip-strong';
      tip.appendChild(sp);
    });
    tip.hidden = false;
    let x, y;
    if (ev && ev.clientX !== undefined && ev.type !== 'focusin') { x = ev.clientX; y = ev.clientY; }
    else { const r = target.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top; }
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = x + 14, top = y - th - 12;
    if (left + tw > window.innerWidth - 8) left = x - tw - 14;
    if (left < 8) left = 8;
    if (top < 8) top = y + 18;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }
  function hideTip() { if (tip) tip.hidden = true; }

  /* ───────── navegación ───────── */
  const VIEWS = ['cuestionario', 'resultados', 'ejes', 'fiabilidad', 'partidos', 'metodo'];
  function setView(v, keepScroll) {
    if (!VIEWS.includes(v)) v = 'cuestionario';
    S.view = v;
    for (const b of $$('[role="tab"]')) {
      const on = b.dataset.view === v;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    }
    for (const sec of $$('.view')) sec.hidden = sec.id !== 'v-' + v;
    render();
    if (!keepScroll) window.scrollTo(0, 0);
  }

  /* Franjas y mapas de los ejes de fondo: se dibujan después de pintar la vista, con el ancho real
     de su contenedor, para que el texto conserve su tamaño en cualquier pantalla */
  let SLOTS = {};
  let slotSeq = 0;
  function slot(kind, cfg, cls) {
    const id = 'sl-' + (++slotSeq);
    SLOTS[id] = { kind, cfg };
    return '<div class="' + (cls || 'dstrip') + '" id="' + id + '"></div>';
  }
  function hydrate() {
    for (const [id, s] of Object.entries(SLOTS)) {
      const el = document.getElementById(id);
      if (!el) continue;
      const w = Math.floor(el.clientWidth);
      if (!w) continue;
      el.innerHTML = s.kind === 'strip' ? stripSvg(s.cfg, w) : deepMapSvg(s.cfg, w);
    }
  }

  function render() {
    renderCountdown();
    hideTip();
    SLOTS = {};
    slotSeq = 0;
    if (S.view === 'cuestionario') renderQuiz();
    else if (S.view === 'resultados') renderResults();
    else if (S.view === 'ejes') renderDeep();
    else if (S.view === 'fiabilidad') renderRel();
    else if (S.view === 'partidos') renderParties();
    else if (S.view === 'metodo') renderMethod();
    hydrate();
    save();
    if (S.focusId) {
      const el = document.getElementById(S.focusId);
      if (el) el.focus({ preventScroll: true });
      S.focusId = null;
    }
  }

  function renderCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const e = D.meta.election.split('-').map(Number);
    const days = Math.round((new Date(e[0], e[1] - 1, e[2]) - today) / 86400000);
    let txt;
    if (days > 1) txt = 'Faltan <strong>' + days + ' días</strong> · domingo 29 de noviembre';
    else if (days === 1) txt = '<strong>Mañana</strong> se vota';
    else if (days === 0) txt = '<strong>Hoy</strong> se vota';
    else txt = 'Elecciones celebradas el 29 de noviembre de 2026';
    el.innerHTML = txt;
  }

  /* ───────── vista: cuestionario ───────── */
  function renderQuiz() {
    const list = qList();
    if (S.idx >= list.length) S.idx = list.length - 1;
    if (S.idx < 0) S.idx = 0;
    const q = list[S.idx];
    const answered = list.filter((x) => S.answers[x.id]).length;
    $('#v-cuestionario').innerHTML =
      '<div class="quiz">' +
        '<aside class="side">' + settingsPanel(list, answered) + indexPanel(list) + '</aside>' +
        ballot(q, list) +
      '</div>';
  }

  function settingsPanel(list, answered) {
    const total = list.length;
    const opts = D.regions.map((r) => '<option value="' + r.id + '"' + (r.id === S.region ? ' selected' : '') + '>' + esc(r.name) + '</option>').join('');
    const np = visibleParties();
    const ballotNotes = np.map((p) => p.ballot && p.ballot[S.region]).filter(Boolean);
    const allAns = Object.keys(S.answers).length;
    return '<section class="panel settings" aria-label="Ajustes del cuestionario">' +
      '<p class="eyebrow">Tu papeleta</p>' +
      '<label class="lbl" for="sel-region">Dónde votas</label>' +
      '<select id="sel-region" data-change="region">' + opts + '</select>' +
      '<p class="hint">' + np.length + ' candidaturas comparables: ' + esc(np.map((p) => p.short).join(', ')) + '.</p>' +
      (ballotNotes.length ? '<ul class="ballot-notes">' + ballotNotes.map((n) => '<li>' + esc(n) + '</li>').join('') + '</ul>' : '') +
      '<p class="lbl" id="lbl-mode">Cuestionario</p>' +
      '<div class="seg seg-grid" role="radiogroup" aria-labelledby="lbl-mode">' +
        modeBtn('rapido', 'Rápido', D.questions.filter((x) => x.core).length) + modeBtn('completo', 'Completo', D.questions.length) +
        modeBtn('fondo', 'De fondo', DQ.length) + modeBtn('todo', 'Todo', ALLQ.length) +
      '</div>' +
      '<p class="hint">' + MODE_HINT[S.mode] + '</p>' +
      '<div class="prog">' +
        '<div class="prog-bar" role="progressbar" aria-label="Progreso" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + answered + '"><span style="width:' + (answered / total * 100).toFixed(1) + '%"></span></div>' +
        '<p class="prog-txt"><strong>' + answered + '</strong> de ' + total + ' respondidas' + (allAns > answered ? ' <span class="muted">(' + allAns + ' en total)</span>' : '') + '</p>' +
      '</div>' +
      (S.mode === 'fondo'
        ? '<button type="button" class="btn primary wide" data-action="go-deep">Ver mis ejes de fondo</button>'
        : '<button type="button" class="btn primary wide" data-action="go-results">Ver resultados</button>' +
          (S.mode === 'todo' || countDeep(S.answers) ? '<button type="button" class="btn wide small" data-action="go-deep">Ver mis ejes de fondo</button>' : '')) +
      ((S.mode === 'fondo' ? countDeep(S.answers) < MIN_DEEP : countMain(S.answers) < MIN_ANS) ? '<p class="hint">Con menos de ' + (S.mode === 'fondo' ? MIN_DEEP : MIN_ANS) + ' respuestas el informe muestra un perfil de ejemplo.</p>' : '') +
      (allAns ? '<button type="button" class="btn ghost wide small" data-action="reset">Borrar mis respuestas</button>' : '') +
    '</section>';
  }
  const MODE_HINT = {
    rapido: 'Las medidas concretas más debatidas en esta campaña.',
    completo: 'Todas las medidas concretas: economía, vivienda, territorio, exterior y más.',
    fondo: 'Grandes cuestiones ideológicas: sistema económico, religión, islam, nación, Europa, orden internacional y modelo de Estado.',
    todo: 'Las medidas concretas y, después, los ejes de fondo.'
  };
  function modeBtn(v, label, n) {
    return '<button type="button" role="radio" id="mode-' + v + '" aria-checked="' + (S.mode === v) + '" data-action="mode" data-v="' + v + '">' + esc(label) + ' · ' + n + '</button>';
  }

  function qGroupName(q) {
    if (!q.deep) return catById[q.cat].name;
    const n = q.axis ? daxById[q.axis].name : 'Temas transversales';
    return S.mode === 'todo' ? 'Fondo · ' + n : n;
  }
  function indexPanel(list) {
    const order = [];
    const groups = {};
    list.forEach((q, i) => {
      const key = q.deep ? 'd:' + (q.axis || 'tr') : q.cat;
      if (!groups[key]) { groups[key] = []; order.push({ id: key, name: qGroupName(q) }); }
      groups[key].push([q, i]);
    });
    const html = order.map((c) => {
      const items = groups[c.id].map(([q, i]) => {
        const a = S.answers[q.id];
        const cls = 'qi-dot' + (a ? ' is-done' : '') + (S.skipped[q.id] && !a ? ' is-skip' : '') + (i === S.idx ? ' is-cur' : '');
        return '<li><button type="button" class="' + cls + '" data-action="goto" data-i="' + i + '" aria-label="Pregunta ' + (i + 1) + ': ' + esc(qshort(q)) + (a ? ' (respondida)' : '') + '"' + (i === S.idx ? ' aria-current="step"' : '') + '>' + (i + 1) + '</button></li>';
      }).join('');
      return '<div class="qi-group"><p class="qi-cat">' + esc(c.name) + '</p><ol class="qi-list">' + items + '</ol></div>';
    }).join('');
    return '<nav class="panel qindex" aria-label="Índice de preguntas"><p class="eyebrow">Índice</p>' + html + '</nav>';
  }

  function ballot(q, list) {
    const a = S.answers[q.id];
    const i = S.idx;
    const isChoice = q.type === 'choice';
    const scale = isChoice
      ? q.options.map((o, k) => {
        const on = !!(a && a.o === k);
        return '<button type="button" role="radio" class="copt' + (on ? ' is-on' : '') + '" aria-checked="' + on + '" data-action="choose" data-o="' + k + '" id="copt-' + k + '">' +
          '<span class="copt-l">' + esc(o.l) + '</span><span class="copt-d">' + esc(o.d) + '</span><kbd aria-hidden="true">' + (k + 1) + '</kbd></button>';
      }).join('')
      : D.scale.map((s) => {
        const on = !!(a && a.v === s.v);
        return '<button type="button" role="radio" class="opt' + (on ? ' is-on' : '') + '" aria-checked="' + on + '" data-action="answer" data-v="' + s.v + '" id="opt-' + (s.v + 2) + '">' +
          '<span class="opt-sym" aria-hidden="true">' + s.s + '</span><span class="opt-lbl">' + esc(s.l) + '</span><kbd aria-hidden="true">' + (s.v + 3) + '</kbd></button>';
      }).join('');
    const frame = q.frame && D.islamFrames ? D.islamFrames[q.frame] : null;
    const headCat = q.deep ? 'Ejes de fondo · ' + (q.axis ? daxById[q.axis].name : 'Tema transversal') + (frame ? ' · ' + frame.l : '') : catById[q.cat].name;
    const last = i === list.length - 1;
    const curW = a ? a.w : 1;
    const imp = D.importance.map((m) => '<button type="button" role="radio" class="imp-opt' + (curW === m.w ? ' is-on' : '') + '" aria-checked="' + (curW === m.w) + '" data-action="imp" data-w="' + m.w + '" id="imp-' + String(m.w).replace('.', '') + '"' + (a ? '' : ' disabled') + '>' + esc(m.l) + '</button>').join('');
    const show = !!a || S.revealed[q.id];
    const skipped = S.skipped[q.id] && !a;
    return '<article class="ballot" aria-labelledby="q-text">' +
      '<header class="ballot-head"><span>Pregunta ' + String(i + 1).padStart(2, '0') + ' de ' + list.length + '</span><span>' + esc(headCat) + '</span><span class="mono">' + q.id + '</span></header>' +
      '<h2 class="q-text' + (isChoice ? ' is-choice' : '') + '" id="q-text">' + esc(q.text) + '</h2>' +
      '<div class="' + (isChoice ? 'choices' : 'scale') + '" role="radiogroup" aria-labelledby="q-text">' + scale + '</div>' +
      '<div class="ballot-sub">' +
        '<button type="button" class="btn ghost small" data-action="skip" id="btn-skip">' + (skipped ? 'Saltada · ' : '') + 'Sin opinión, saltar</button>' +
        '<div class="imp"><span class="lbl-inline" id="lbl-imp">Me importa</span><div class="seg small" role="radiogroup" aria-labelledby="lbl-imp">' + imp + '</div></div>' +
      '</div>' +
      '<div class="ballot-body">' +
        '<section class="ctx"><h3 class="h-min">Contexto</h3><p>' + esc(q.ctx) + '</p>' + srcLine(q.ctxSrc, true) + '</section>' +
        (q.pro || q.con ? '<section class="args">' +
          '<div class="arg"><h3 class="h-min">Argumentos a favor</h3><p>' + esc(q.pro) + '</p></div>' +
          '<div class="arg"><h3 class="h-min">Argumentos en contra</h3><p>' + esc(q.con) + '</p></div>' +
        '</section>' : '') +
        '<section class="pp" aria-live="polite">' + (show ? (q.deep ? deepPositions(q, a) : partyPositions(q, a, visibleParties())) :
          '<div class="pp-hidden"><p>Las posiciones de los partidos aparecen al responder, para no condicionar tu respuesta.</p><button type="button" class="btn ghost small" data-action="reveal">Ver posiciones ahora</button></div>') +
        '</section>' +
      '</div>' +
      '<footer class="ballot-nav">' +
        '<button type="button" class="btn" data-action="prev" id="btn-prev"' + (i === 0 ? ' disabled' : '') + '>← Anterior</button>' +
        '<span class="kbd-hint">Teclado: ' + (isChoice ? '1–' + q.options.length + ' elige' : '1–5 responde') + ' · ← → navega</span>' +
        '<button type="button" class="btn primary" data-action="next" id="btn-next">' + (last ? (S.mode === 'fondo' ? 'Ver mis ejes de fondo' : 'Ver resultados') : 'Siguiente →') + '</button>' +
      '</footer>' +
    '</article>';
  }

  /* Pregunta de fondo: posiciones documentadas (si las hay) y lugar de cada candidatura en el eje según el CHES */
  function deepPositions(q, a) {
    const parties = visibleParties();
    let html = '';
    if (q.pos) html += partyPositions(q, a, parties, false, true);
    if (q.axis) {
      const ax = daxById[q.axis];
      const u = userDeep(S.answers)[ax.id];
      const dp = parties.filter((p) => partyDeep(p.id));
      const out = parties.filter((p) => !partyDeep(p.id)).map((p) => p.short);
      html += '<div class="pp-axis"><h3 class="h-min">Eje «' + esc(ax.name) + '» según 609 politólogos (CHES 2024)</h3>' +
        '<div class="poles" aria-hidden="true"><span>← ' + esc(ax.neg) + '</span><span>' + esc(ax.pos) + ' →</span></div>' +
        slot('strip', { ax, parties: dp, user: u.v === null ? null : { v: u.v }, tops: new Set() }) +
        '<p class="hint">' + (u.v === null ? 'Tu marca aparecerá al responder.' : 'Tu marca resume tus ' + u.n + (u.n === 1 ? ' respuesta' : ' respuestas') + ' de este eje: ' + esc(tramo(ax, u.v)) + ' (' + fx(u.v) + ').') +
        ' Los expertos valoraron ' + esc(ax.chesTxt) + '.' + (out.length ? ' Sin datos del CHES: ' + esc(out.join(', ')) + '.' : '') + '</p></div>';
    }
    return html;
  }

  function partyPositions(q, a, parties, compact, deep) {
    const P = q.pos || {};
    const cols = D.scale.map((s) => {
      const chips = parties.filter((p) => P[p.id] && P[p.id][0] === s.v).map((p) => chip(p, P[p.id][1])).join('');
      const you = a && a.v === s.v;
      return '<div class="col' + (you ? ' is-you' : '') + '"><div class="col-h"><span>' + esc(s.l) + '</span>' + (you ? '<span class="you-tag">Tú</span>' : '') + '</div><div class="col-b">' + (chips || '<span class="empty" aria-label="Ninguno">—</span>') + '</div></div>';
    }).join('');
    const none = deep ? [] : parties.filter((p) => !P[p.id]).map((p) => p.short);
    const notes = parties.filter((p) => P[p.id]).map((p) => {
      const pos = P[p.id];
      return '<li><span class="note-head">' + chip(p, pos[1], 'sm') + '<span class="val">' + esc(D.scale[pos[0] + 2].l) + '</span><span class="conf-tag conf-' + pos[1] + '">Evidencia ' + esc(D.confidence[pos[1]].l.toLowerCase()) + '</span></span><span class="note">' + esc(pos[2]) + '</span>' + srcLine(pos[3], true) + '</li>';
    }).join('');
    return (compact ? '' : '<h3 class="h-min">' + (deep ? 'Posiciones documentadas en esta pregunta' : 'Cómo se posicionan') + '</h3>') +
      '<div class="strip">' + cols + '</div>' +
      (none.length ? '<p class="hint">Sin posición documentada: ' + esc(none.join(', ')) + '.</p>' : '') +
      (deep ? '<p class="hint">Solo figuran las candidaturas con votos, propuestas o declaraciones verificables sobre esta cuestión.</p>' : '') +
      '<details class="notes"><summary>Notas y fuentes de cada posición</summary><ul>' + notes + '</ul></details>';
  }

  /* ───────── vista: resultados ───────── */
  function renderResults() {
    const root = $('#v-resultados');
    const own = countMain(S.answers);
    if (own < MIN_ANS && !S.example) S.example = true;
    const ans = activeAnswers();
    const n = countMain(ans);
    const parties = resultParties();
    const scores = rankScores(ans, parties);
    const ok = scores.filter((r) => r.ok);
    const top = ok[0];
    root.innerHTML =
      '<div class="res">' +
        resultsHead(top, n, parties, own) +
        '<section class="panel" aria-labelledby="h-rank"><h2 class="h-l" id="h-rank">Afinidad global</h2>' +
          '<p class="sub">Cercanía media entre tus respuestas y las posiciones documentadas de cada partido, ponderada por la importancia que les das y por la calidad de la evidencia. 100% = coincidencia total.</p>' +
          rankList(scores, n) + '</section>' +
        deepTeaser() +
        highlightsPanel(ok.slice(0, 3)) +
        '<section class="panel" aria-labelledby="h-heat"><h2 class="h-l" id="h-heat">Afinidad por bloques</h2>' +
          '<p class="sub">Solo bloques en los que has respondido. Celdas vacías: el partido no tiene posición documentada en esas preguntas.</p>' + heatmap(ok, ans) + '</section>' +
        '<section class="panel" aria-labelledby="h-map"><div class="panel-head"><h2 class="h-l" id="h-map">Mapa político</h2>' + mapToggle() + '</div>' +
          '<p class="sub">Posición media en las preguntas de cada eje (de −1 a +1). Los partidos se sitúan con todas sus posiciones documentadas; tu punto, con tus respuestas.</p>' + mapSvg(scores, ans) + '</section>' +
        '<section class="panel" aria-labelledby="h-af"><div class="panel-head"><h2 class="h-l" id="h-af">Afinidad e historial</h2>' + relToggle() + '</div>' +
          '<p class="sub">Eje horizontal: tu afinidad. Eje vertical: su historial (0–100) en la medida elegida' + (S.relWeighted ? ', ponderado por los bloques que más te importan' : '') + '. «Cumplimiento» depende sobre todo de haber gobernado; «coherencia» se evalúa también en la oposición. Los puntos huecos tienen poca evidencia.</p>' + afSvg(ok, ans) + '</section>' +
        '<section class="panel" aria-labelledby="h-det"><h2 class="h-l" id="h-det">Pregunta a pregunta</h2>' + detailPanel(ans, parties) + '</section>' +
      '</div>';
  }

  function resultsHead(top, n, parties, own) {
    const banner = S.example
      ? '<div class="banner" role="note"><strong>Perfil de ejemplo ficticio</strong> (un votante de Madrid con posiciones mixtas). ' + (own < MIN_ANS ? 'Responde al menos ' + MIN_ANS + ' preguntas sobre medidas para ver tu propio informe.' + (countDeep(S.answers) ? ' Tus respuestas de fondo se analizan en «Ejes de fondo».' : '') : 'No son tus respuestas.') +
        (own >= MIN_ANS ? ' <button type="button" class="btn small" data-action="example-off">Ver mis resultados</button>' : ' <button type="button" class="btn small primary" data-action="to-quiz">Ir al cuestionario</button>') + '</div>'
      : '';
    const paste = S.pasteOpen
      ? '<form class="paste" data-form="paste"><label class="lbl" for="paste-code">Pega un código de respuestas</label><div class="paste-row"><input id="paste-code" name="code" autocomplete="off" spellcheck="false" placeholder="C2.ES.r.…"><button class="btn primary small" type="submit">Cargar</button><button class="btn ghost small" type="button" data-action="paste-close">Cancelar</button></div><p class="hint" id="paste-msg"></p></form>'
      : '';
    return '<section class="panel res-head">' + banner +
      '<div class="res-sum"><div class="res-title"><p class="eyebrow">' + (S.example ? 'Informe de ejemplo' : 'Tu informe') + '</p>' +
        '<h2 class="h-xl">' + (top ? 'Mayor afinidad: ' + esc(shortName(top.p)) + ' <span class="hl">' + pct(top.aff) + '%</span>' : 'Sin datos suficientes') + '</h2>' +
        '<p class="sub">' + n + ' respuestas · ' + esc(regionName()) + ' · ' + parties.length + ' candidaturas · datos a ' + esc(fmtDate(D.meta.updated)) + '</p></div>' +
        '<div class="res-actions">' +
          '<button type="button" class="btn small" data-action="copy-summary" id="btn-copy-sum">Copiar resumen</button>' +
          '<button type="button" class="btn small" data-action="copy-code" id="btn-copy-code"' + (S.example ? ' disabled' : '') + '>Copiar código de respuestas</button>' +
          '<button type="button" class="btn ghost small" data-action="paste-open">Cargar un código</button>' +
        '</div></div>' + paste +
      '<p class="caveat">A 17 de octubre de 2026 ningún partido había publicado su programa para el 29-N: las posiciones proceden de votaciones parlamentarias, propuestas de precampaña y programas de 2023. Afinidad no es recomendación de voto.</p>' +
    '</section>';
  }

  function rankList(scores, n) {
    const rows = scores.map((r, i) => {
      const cum = relStats(r.p.id, null, 'cum');
      const coh = relStats(r.p.id, null, 'coh');
      const w = r.ok ? pct(r.aff) : 0;
      const relTxt = (cum.idx !== null || coh.idx !== null) ? 'Historial: cumplimiento ' + idxTxt(cum) + ' · coherencia ' + idxTxt(coh) : 'Sin historial evaluable';
      return '<li class="rank-row' + (r.ok ? '' : ' is-insuf') + '">' +
        '<span class="rank-pos">' + (r.ok ? i + 1 : '–') + '</span>' +
        '<span class="rank-name">' + chip(r.p) + '<span class="rank-full">' + esc(r.p.name) + '</span></span>' +
        '<span class="rank-bar" aria-hidden="true"><span class="rank-fill" style="width:' + w + '%"></span></span>' +
        '<span class="rank-val">' + (r.ok ? w + '%' : 'Datos insuficientes') + '</span>' +
        '<span class="rank-meta">Comparado en ' + r.n + ' de ' + n + ' respuestas · ' + relTxt + (r.p.limited ? ' · evaluación con datos limitados' : '') + '</span>' +
      '</li>';
    }).join('');
    return '<ol class="rank">' + rows + '</ol><p class="hint">«Datos insuficientes»: el partido tiene posición documentada en menos del ' + (MIN_COV * 100) + '% de la importancia de tus respuestas.</p>';
  }

  function highlightsPanel(tops) {
    if (!tops.length) return '';
    const cards = tops.map((r) => {
      const agree = r.detail.filter((d) => d.s >= 0.75).sort((x, y) => (y.ww - x.ww) || (y.s - x.s)).slice(0, 3);
      const dis = r.detail.filter((d) => d.s <= 0.25).sort((x, y) => (y.ww - x.ww) || (x.s - y.s)).slice(0, 3);
      const li = (d) => '<li><span>' + esc(qshort(d.q)) + '</span><span class="muted"> · tú: ' + esc(D.scale[d.a.v + 2].l.toLowerCase()) + '; ' + esc(r.p.short) + ': ' + esc(D.scale[d.pos[0] + 2].l.toLowerCase()) + '</span></li>';
      return '<div class="hl-card"><p class="hl-name">' + chip(r.p) + ' <span>' + pct(r.aff) + '%</span></p>' +
        '<p class="hl-k">Coincides sobre todo en</p><ul>' + (agree.map(li).join('') || '<li class="muted">Ninguna coincidencia fuerte</li>') + '</ul>' +
        '<p class="hl-k">Discrepas sobre todo en</p><ul>' + (dis.map(li).join('') || '<li class="muted">Ninguna discrepancia fuerte</li>') + '</ul></div>';
    }).join('');
    return '<section class="panel" aria-labelledby="h-hl"><h2 class="h-l" id="h-hl">Dónde coincides y dónde no</h2><p class="sub">Con las tres candidaturas más afines, ordenado por la importancia que diste a cada pregunta.</p><div class="hl-grid">' + cards + '</div></section>';
  }

  function heatmap(scores, ans) {
    const cats = D.categories.filter((c) => D.questions.some((q) => q.cat === c.id && ans[q.id]));
    if (!scores.length || !cats.length) return '<p class="hint">Sin datos suficientes.</p>';
    const head = '<tr><th scope="col" class="th-p">Candidatura</th>' + cats.map((c) => '<th scope="col">' + esc(CAT_SHORT[c.id]) + '</th>').join('') + '<th scope="col" class="th-g">Global</th></tr>';
    const rows = scores.map((r) => {
      const cells = cats.map((c) => {
        const x = r.cat[c.id];
        if (!x || x.aff === null) return '<td class="hm-na" data-tip="' + esc(r.p.short + ' · ' + c.name + '\nSin posición documentada') + '" tabindex="0">—</td>';
        return '<td class="h' + bin7(x.aff) + '" tabindex="0" data-tip="' + esc(pct(x.aff) + '% · ' + r.p.short + '\n' + c.name + ' · ' + x.n + (x.n === 1 ? ' pregunta' : ' preguntas')) + '">' + pct(x.aff) + '</td>';
      }).join('');
      return '<tr><th scope="row" class="th-p">' + chip(r.p) + '</th>' + cells + '<td class="h' + bin7(r.aff) + ' td-g" tabindex="0" data-tip="' + esc(pct(r.aff) + '% · ' + r.p.short + '\nAfinidad global') + '">' + pct(r.aff) + '</td></tr>';
    }).join('');
    const legend = '<div class="ramp-legend" aria-hidden="true"><span>0%</span>' + [0, 1, 2, 3, 4, 5, 6].map((k) => '<i class="h' + k + '"></i>').join('') + '<span>100%</span></div>';
    return '<div class="table-scroll"><table class="heat"><caption class="sr-only">Afinidad por bloque temático y candidatura, en porcentaje</caption><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>' + legend;
  }

  /* Colocación de etiquetas sin solapes (voraz) */
  function placeLabels(points, box) {
    const placed = [];
    const offs = [[9, 4, 'start'], [-9, 4, 'end'], [0, -11, 'middle'], [0, 18, 'middle'], [9, -8, 'start'], [-9, -8, 'end'], [9, 15, 'start'], [-9, 15, 'end']];
    const boxes = points.map((p) => ({ x0: p.x - 6, y0: p.y - 6, x1: p.x + 6, y1: p.y + 6 }));
    const hit = (b) => boxes.concat(placed).some((o) => !(b.x1 < o.x0 || b.x0 > o.x1 || b.y1 < o.y0 || b.y0 > o.y1));
    for (const p of points) {
      const w = p.label.length * (p.bold ? 7.4 : 6.8) + 4, h = 13;
      let best = null;
      for (const [dx, dy, anchor] of offs) {
        const x = p.x + dx, y = p.y + dy;
        const x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
        const b = { x0, y0: y - h + 3, x1: x0 + w, y1: y + 3 };
        if (b.x0 < box.x0 || b.x1 > box.x1 || b.y0 < box.y0 || b.y1 > box.y1) continue;
        const cand = { x, y, anchor, b };
        if (!hit(b)) { best = cand; break; }
        if (!best) best = cand;
      }
      if (!best) best = { x: p.x + 9, y: p.y + 4, anchor: 'start', b: { x0: p.x, y0: p.y, x1: p.x, y1: p.y } };
      placed.push(best.b);
      p.lx = best.x; p.ly = best.y; p.anchor = best.anchor;
    }
    return points;
  }

  function mapToggle() {
    return '<div class="seg small" role="radiogroup" aria-label="Eje vertical del mapa">' +
      '<button type="button" role="radio" id="mapy-t" aria-checked="' + (S.mapY === 't') + '" data-action="mapy" data-v="t">Territorial</button>' +
      '<button type="button" role="radio" id="mapy-s" aria-checked="' + (S.mapY === 's') + '" data-action="mapy" data-v="s">Valores e inmigración</button></div>';
  }
  function relToggle() {
    return '<div class="ctrl-row"><div class="seg small" role="radiogroup" aria-label="Medida del historial">' +
      Object.entries(D.relDims).map(([k, v]) => '<button type="button" role="radio" id="reld-' + k + '" aria-checked="' + (S.relDim === k) + '" data-action="reldim" data-v="' + k + '" title="' + esc(v.d) + '">' + esc(v.l) + '</button>').join('') +
      '</div><label class="check" for="chk-relw"><input type="checkbox" id="chk-relw" data-change="relw"' + (S.relWeighted ? ' checked' : '') + '> Según mis prioridades</label></div>';
  }

  function mapSvg(scores, ans) {
    const W = 640, H = 470, m = { l: 34, r: 34, t: 30, b: 64 };
    const yk = S.mapY;
    const X = (v) => m.l + (v + 1) / 2 * (W - m.l - m.r);
    const Y = (v) => H - m.b - (v + 1) / 2 * (H - m.t - m.b);
    const ua = userAxis(ans);
    const tops = new Set(scores.filter((r) => r.ok).slice(0, 3).map((r) => r.p.id));
    const pts = [];
    const skipped = [];
    for (const r of scores) {
      const ax = partyAxis(r.p);
      if (ax.e.v === null || ax[yk].v === null || ax.e.n < 3 || ax[yk].n < 3) { skipped.push(r.p.short); continue; }
      pts.push({ x: X(ax.e.v), y: Y(ax[yk].v), label: r.p.short, bold: tops.has(r.p.id), top: tops.has(r.p.id),
        tip: r.p.name + '\nEconómico ' + ax.e.v.toFixed(2) + ' · ' + (yk === 't' ? 'territorial ' : 'valores ') + ax[yk].v.toFixed(2) + (r.ok ? '\nAfinidad ' + pct(r.aff) + '%' : '') });
    }
    let you = null;
    if (ua.e.v !== null && ua[yk].v !== null) {
      you = { x: X(ua.e.v), y: Y(ua[yk].v), label: 'Tú', bold: true, you: true, tip: 'Tu posición\nEconómico ' + ua.e.v.toFixed(2) + ' · ' + (yk === 't' ? 'territorial ' : 'valores ') + ua[yk].v.toFixed(2) + '\nBasado en ' + ua.e.n + ' y ' + ua[yk].n + ' respuestas' };
    }
    const all = you ? [you].concat(pts) : pts;
    placeLabels(all, { x0: 2, y0: m.t - 2, x1: W - 2, y1: H - m.b + 4 });
    const ax = D.axes;
    let g = '';
    for (const t of [-1, -0.5, 0, 0.5, 1]) {
      g += '<line class="' + (t === 0 ? 'axis0' : 'grid') + '" x1="' + X(t) + '" y1="' + m.t + '" x2="' + X(t) + '" y2="' + (H - m.b) + '"/>';
      g += '<line class="' + (t === 0 ? 'axis0' : 'grid') + '" x1="' + m.l + '" y1="' + Y(t) + '" x2="' + (W - m.r) + '" y2="' + Y(t) + '"/>';
    }
    g += '<text class="ax-lbl" x="' + m.l + '" y="' + (H - 10) + '" text-anchor="start">← ' + esc(ax.e.neg) + '</text>';
    g += '<text class="ax-lbl" x="' + (W - m.r) + '" y="' + (H - 10) + '" text-anchor="end">' + esc(ax.e.pos) + ' →</text>';
    g += '<text class="ax-lbl" x="' + m.l + '" y="' + (m.t - 12) + '" text-anchor="start">↑ ' + esc(ax[yk].pos) + '</text>';
    g += '<text class="ax-lbl" x="' + m.l + '" y="' + (H - m.b + 18) + '" text-anchor="start">↓ ' + esc(ax[yk].neg) + '</text>';
    const marks = all.map((p) => {
      const cls = p.you ? 'pt-you' : p.top ? 'pt-top' : 'pt';
      return '<g class="mk" tabindex="0" role="img" aria-label="' + esc(p.tip.replace(/\n/g, '. ')) + '" data-tip="' + esc(p.tip) + '">' +
        '<circle class="hit" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="13"/>' +
        '<circle class="' + cls + '" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + (p.you ? 7 : 5) + '"/>' +
        '<text class="pt-lbl' + (p.bold ? ' b' : '') + (p.you ? ' you' : '') + '" x="' + p.lx.toFixed(1) + '" y="' + p.ly.toFixed(1) + '" text-anchor="' + p.anchor + '">' + esc(p.label) + '</text></g>';
    }).join('');
    return '<div class="chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="Mapa político: eje económico y eje ' + (yk === 't' ? 'territorial' : 'de valores') + '">' + g + marks + '</svg></div>' +
      '<p class="hint">' + (you ? 'Las tres candidaturas más afines aparecen destacadas. ' : 'Responde preguntas de ambos ejes para ver tu punto. ') + (skipped.length ? 'Sin datos suficientes para situar: ' + esc(skipped.join(', ')) + '.' : '') + '</p>';
  }

  function afSvg(ok, ans) {
    if (!ok.length) return '<p class="hint">Sin datos suficientes.</p>';
    const W = 640, H = 400, m = { l: 46, r: 24, t: 20, b: 46 };
    const affs = ok.map((r) => pct(r.aff));
    let x0 = Math.max(0, Math.floor((Math.min.apply(null, affs) - 3) / 10) * 10);
    let x1 = Math.min(100, Math.ceil((Math.max.apply(null, affs) + 3) / 10) * 10);
    if (x1 - x0 < 30) { x0 = Math.max(0, x0 - 10); x1 = Math.min(100, x0 + 40); }
    const X = (v) => m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r);
    const Y = (v) => H - m.b - v / 100 * (H - m.t - m.b);
    let g = '';
    for (let t = x0; t <= x1; t += 10) {
      g += '<line class="grid" x1="' + X(t) + '" y1="' + m.t + '" x2="' + X(t) + '" y2="' + (H - m.b) + '"/>';
      g += '<text class="tick" x="' + X(t) + '" y="' + (H - m.b + 16) + '" text-anchor="middle">' + t + '%</text>';
    }
    for (const t of [0, 25, 50, 75, 100]) {
      g += '<line class="' + (t === 0 ? 'axis0' : 'grid') + '" x1="' + m.l + '" y1="' + Y(t) + '" x2="' + (W - m.r) + '" y2="' + Y(t) + '"/>';
      g += '<text class="tick" x="' + (m.l - 8) + '" y="' + (Y(t) + 4) + '" text-anchor="end">' + t + '</text>';
    }
    const dimL = D.relDims[S.relDim] ? D.relDims[S.relDim].l : 'Combinado';
    g += '<text class="ax-lbl" x="' + ((m.l + W - m.r) / 2) + '" y="' + (H - 8) + '" text-anchor="middle">Afinidad contigo →</text>';
    g += '<text class="ax-lbl" x="' + (m.l) + '" y="' + (m.t - 6) + '" text-anchor="start">↑ Historial: ' + esc(dimL.toLowerCase()) + ' (0–100)</text>';
    const noRel = [];
    const pts = [];
    for (const r of ok) {
      const st = relStats(r.p.id, null, S.relDim);
      const y = relForUser(r.p.id, ans, S.relDim);
      if (y === null) { noRel.push(r.p.short); continue; }
      const low = st.n < (S.relDim === 'all' ? 5 : 3);
      pts.push({ x: X(pct(r.aff)), y: Y(y * 100), label: r.p.short, bold: false, low,
        tip: shortName(r.p) + '\nAfinidad ' + pct(r.aff) + '% · ' + dimL.toLowerCase() + ' ' + pct(y) + '/100\n' + st.n + ' casos puntuados · evidencia ' + evidence(st.n, true) });
    }
    placeLabels(pts, { x0: m.l + 2, y0: m.t - 2, x1: W - 2, y1: H - m.b + 4 });
    const marks = pts.map((p) => '<g class="mk" tabindex="0" role="img" aria-label="' + esc(p.tip.replace(/\n/g, '. ')) + '" data-tip="' + esc(p.tip) + '">' +
      '<circle class="hit" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="13"/>' +
      '<circle class="' + (p.low ? 'pt-hollow' : 'pt-top') + '" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="5"/>' +
      '<text class="pt-lbl" x="' + p.lx.toFixed(1) + '" y="' + p.ly.toFixed(1) + '" text-anchor="' + p.anchor + '">' + esc(p.label) + '</text></g>').join('');
    return '<div class="chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="Afinidad frente a historial de cumplimiento">' + g + marks + '</svg></div>' +
      '<p class="hint">El historial mide compromisos cumplidos y coherencia entre discurso y voto en casos documentados; no es un juicio moral y depende de cuánto poder ha tenido cada partido. ' + (noRel.length ? 'Sin historial evaluable: ' + esc(noRel.join(', ')) + '.' : '') + '</p>';
  }

  function detailPanel(ans, parties) {
    const cats = D.categories.filter((c) => D.questions.some((q) => q.cat === c.id && ans[q.id]));
    if (S.detailCat !== 'all' && !cats.some((c) => c.id === S.detailCat)) S.detailCat = 'all';
    const filt = '<div class="chips-row" role="group" aria-label="Filtrar por bloque">' +
      '<button type="button" class="fchip' + (S.detailCat === 'all' ? ' is-on' : '') + '" aria-pressed="' + (S.detailCat === 'all') + '" data-action="dcat" data-v="all">Todas</button>' +
      cats.map((c) => '<button type="button" class="fchip' + (S.detailCat === c.id ? ' is-on' : '') + '" aria-pressed="' + (S.detailCat === c.id) + '" data-action="dcat" data-v="' + c.id + '">' + esc(c.name) + '</button>').join('') + '</div>';
    const qs = D.questions.filter((q) => ans[q.id] && (S.detailCat === 'all' || q.cat === S.detailCat));
    const items = qs.map((q) => {
      const a = ans[q.id];
      return '<div class="qrow"><p class="qrow-t"><span class="mono">' + q.id + '</span> ' + esc(q.text) + ' <span class="imp-tag">importancia ' + esc((D.importance.find((m) => m.w === a.w) || D.importance[1]).l.toLowerCase()) + '</span></p>' + partyPositions(q, a, parties, true) + '</div>';
    }).join('');
    return filt + '<div class="qrows">' + items + '</div>' +
      '<p class="hint legend-conf"><span class="chip conf-A">Sólido</span> voto o compromiso explícito · <span class="chip conf-B">Normal</span> propuesta o declaración · <span class="chip conf-C">Discontinuo</span> inferida (cuenta la mitad)</p>';
  }

  /* Acceso al módulo de fondo desde Resultados */
  function deepTeaser() {
    const nd = countDeep(S.answers);
    if (nd >= MIN_DEEP) {
      const top = deepScores(S.answers, deepParties()).filter((r) => r.ok).slice(0, 3);
      return '<section class="panel teaser" aria-labelledby="h-teaser"><div class="panel-head"><h2 class="h-l" id="h-teaser">Ejes de fondo</h2><button type="button" class="btn small" data-action="go-deep">Ver tus ejes de fondo</button></div>' +
        '<p class="sub">Con tus ' + nd + ' respuestas sobre grandes cuestiones ideológicas, las candidaturas más cercanas según el CHES 2024 son ' + esc(top.map((r) => shortName(r.p) + ' (' + pct(r.aff) + '%)').join(', ')) + '. Este cálculo es independiente del de arriba.</p></section>';
    }
    return '<section class="panel teaser" aria-labelledby="h-teaser"><h2 class="h-l" id="h-teaser">¿Y en las grandes cuestiones?</h2>' +
      '<p class="sub">Este informe compara medidas concretas de la campaña. El módulo «Ejes de fondo» pregunta por el sistema económico que prefieres, la religión, el islam, la nación, Europa o el orden internacional, y te sitúa frente a las candidaturas con datos de una encuesta independiente a politólogos (CHES 2024).</p>' +
      '<div class="ctrl-row"><button type="button" class="btn small primary" data-action="deep-start">Responder las ' + DQ.length + ' preguntas de fondo</button><button type="button" class="btn small" data-action="go-deep">Ver el módulo</button></div></section>';
  }

  /* ───────── vista: ejes de fondo ───────── */
  const deepParties = () => visibleParties().filter((p) => partyDeep(p.id));

  /* Franja de un eje: etiquetas de las candidaturas apiladas sin solaparse, banda de su rango y tu marca */
  function stripSvg(cfg, W) {
    const ax = cfg.ax, tops = cfg.tops || new Set();
    const pad = 8, ROW = 21, PH = 17;
    const X = (v) => pad + (v + 1) / 2 * (W - 2 * pad);
    const items = cfg.parties.map((p) => ({ p, v: (partyDeep(p.id) || {})[ax.id] })).filter((x) => typeof x.v === 'number').sort((a, b) => a.v - b.v);
    const up = [], dn = [];
    const free = (lane, x0, x1) => lane.every((r) => x1 + 5 < r[0] || x0 - 5 > r[1]);
    const placed = items.map((it) => {
      const w = Math.round(it.p.short.length * 6.6 + 14);
      const cx = X(it.v);
      const x0 = Math.max(1, Math.min(W - 1 - w, cx - w / 2));
      let lane = 0;
      for (let k = 0; k < 12 && !lane; k++) {
        if (!up[k]) up[k] = [];
        if (!dn[k]) dn[k] = [];
        if (free(up[k], x0, x0 + w)) { up[k].push([x0, x0 + w]); lane = -(k + 1); }
        else if (free(dn[k], x0, x0 + w)) { dn[k].push([x0, x0 + w]); lane = k + 1; }
      }
      return { it, w, cx, x0, lane: lane || 1 };
    });
    const nUp = placed.reduce((m, q) => Math.max(m, q.lane < 0 ? -q.lane : 0), 0);
    const nDn = placed.reduce((m, q) => Math.max(m, q.lane > 0 ? q.lane : 0), 0);
    const you = cfg.user && typeof cfg.user.v === 'number' ? cfg.user : null;
    const tickBand = cfg.ticks ? 14 : 0;
    const top0 = you ? 24 : 4;
    const ty = top0 + nUp * ROW + 8;
    const H = ty + 10 + tickBand + nDn * ROW + 4;
    const pillTop = (lane) => (lane < 0 ? ty - 10 - (-lane) * ROW + 4 : ty + 10 + tickBand + (lane - 1) * ROW);
    let g = '';
    if (items.length) {
      const x0 = X(items[0].v), x1 = X(items[items.length - 1].v);
      g += '<rect class="rng" x="' + (x0 - 3).toFixed(1) + '" y="' + (ty - 4) + '" width="' + Math.max(6, x1 - x0 + 6).toFixed(1) + '" height="8" rx="4"/>';
    }
    g += '<line class="trk" x1="' + X(-1) + '" y1="' + ty + '" x2="' + X(1) + '" y2="' + ty + '"/>';
    for (const t of [-1, -0.5, 0, 0.5, 1]) g += '<line class="tk" x1="' + X(t).toFixed(1) + '" y1="' + (ty - (t === 0 ? 7 : 4)) + '" x2="' + X(t).toFixed(1) + '" y2="' + (ty + (t === 0 ? 7 : 4)) + '"/>';
    if (cfg.ticks) for (const t of cfg.ticks) g += '<line class="tk" x1="' + X(t.v).toFixed(1) + '" y1="' + (ty + 3) + '" x2="' + X(t.v).toFixed(1) + '" y2="' + (ty + 8) + '"/><text class="tick-n" x="' + X(t.v).toFixed(1) + '" y="' + (ty + 19) + '" text-anchor="middle">' + esc(t.l) + '</text>';
    if (you) g += '<line class="you-ln" x1="' + X(you.v).toFixed(1) + '" y1="20" x2="' + X(you.v).toFixed(1) + '" y2="' + (ty + 6) + '"/>';
    for (const q of placed) {
      const top = tops.has(q.it.p.id);
      const y0 = pillTop(q.lane);
      const cxc = Math.max(q.x0 + 5, Math.min(q.x0 + q.w - 5, q.cx));
      const tip = q.it.p.name + '\n' + ax.name + ': ' + fx(q.it.v) + ' · ' + tramo(ax, q.it.v) + (you ? '\nA ' + fd(Math.abs(q.it.v - you.v)) + ' puntos de ' + (you.label ? 'tu ideal' : 'ti') : '');
      g += '<g class="mk" data-tip="' + esc(tip) + '">' +
        '<line class="con" x1="' + cxc.toFixed(1) + '" y1="' + (q.lane < 0 ? y0 + PH : y0) + '" x2="' + q.cx.toFixed(1) + '" y2="' + (q.lane < 0 ? ty - 4 : ty + 4) + '"/>' +
        '<circle class="pd' + (top ? ' top' : '') + '" cx="' + q.cx.toFixed(1) + '" cy="' + ty + '" r="3.5"/>' +
        '<rect class="pill-r' + (top ? ' top' : '') + '" x="' + q.x0.toFixed(1) + '" y="' + y0 + '" width="' + q.w + '" height="' + PH + '" rx="4"/>' +
        '<text class="pill-t' + (top ? ' top' : '') + '" x="' + (q.x0 + q.w / 2).toFixed(1) + '" y="' + (y0 + 12.5) + '" text-anchor="middle">' + esc(q.it.p.short) + '</text></g>';
    }
    if (you) {
      const ux = X(you.v), lbl = you.label || 'Tú';
      const w = Math.round(lbl.length * 7 + 14);
      const lx = Math.max(1, Math.min(W - 1 - w, ux - w / 2));
      g += '<rect class="you-mk" x="' + (ux - 5).toFixed(1) + '" y="' + (ty - 5) + '" width="10" height="10" transform="rotate(45 ' + ux.toFixed(1) + ' ' + ty + ')"/>' +
        '<g class="mk" data-tip="' + esc((you.label || 'Tu posición') + '\n' + ax.name + ': ' + fx(you.v) + ' · ' + tramo(ax, you.v)) + '"><rect class="you-r" x="' + lx.toFixed(1) + '" y="3" width="' + w + '" height="' + PH + '" rx="4"/>' +
        '<text class="you-t" x="' + (lx + w / 2).toFixed(1) + '" y="15.5" text-anchor="middle">' + esc(lbl) + '</text></g>';
    }
    const aria = ax.name + ': ' + items.map((it) => it.p.short + ' ' + fx(it.v)).join('; ') + (you ? '; ' + (you.label || 'tú') + ' ' + fx(you.v) : '');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + esc(aria) + '">' + g + '</svg>';
  }

  function statusText(ax, st) {
    const nm = (x) => esc(x.p.short) + ' (' + fx(x.v) + ')';
    if (st.kind === 'beyond-neg' || st.kind === 'beyond-pos') return '<strong>Fuera del espectro de las candidaturas.</strong> Estás más cerca del polo «' + esc(st.kind === 'beyond-neg' ? ax.neg : ax.pos) + '» que todas ellas; la más próxima es ' + nm(st.near) + ', a ' + fd(st.d) + ' puntos.';
    if (st.kind === 'gap') return '<strong>Ninguna candidatura cerca.</strong> Tu posición queda en un hueco entre ellas; la más próxima es ' + nm(st.near) + ', a ' + fd(st.d) + ' puntos.';
    return st.close.length > 1 ? 'Cerca de ti: ' + st.close.map(nm).join(', ') + '.' : 'La más cercana: ' + nm(st.near) + ', a ' + fd(st.d) + ' puntos.';
  }

  function renderDeep() {
    const root = $('#v-ejes');
    const own = countDeep(S.answers);
    if (own < MIN_DEEP && !S.deepExample) S.deepExample = true;
    const ans = deepAnswers();
    const parties = deepParties();
    const noChes = visibleParties().filter((p) => !partyDeep(p.id));
    const u = userDeep(ans);
    const nAx = DAX.filter((a) => u[a.id].v !== null).length;
    const scores = deepScores(ans, parties);
    const ok = scores.filter((r) => r.ok);
    const tops = new Set(ok.slice(0, 3).map((r) => r.p.id));
    const gaps = deepGaps(u, parties);
    root.innerHTML = '<div class="deep">' +
      deepHead(own, ans, ok, nAx, parties, noChes) +
      deepAxesPanel(u, parties, tops) +
      deepGapsPanel(u, parties, gaps) +
      econPanel(ans, u, parties, tops) +
      islamPanel(ans, u, parties) +
      deepRankPanel(scores, nAx) +
      deepHeatPanel(ok, u) +
      deepMapPanel(u, parties, tops, gaps) +
      deepDetailPanel(ans) +
    '</div>';
  }

  function deepHead(own, ans, ok, nAx, parties, noChes) {
    const banner = S.deepExample
      ? '<div class="banner" role="note"><strong>Perfil de ejemplo ficticio</strong> (una persona de izquierda laica y feminista, europeísta y atlantista). ' +
        (own ? 'Has respondido ' + own + ' de ' + DQ.length + ' preguntas de fondo; con ' + MIN_DEEP + ' verás las tuyas.' : 'Responde al menos ' + MIN_DEEP + ' preguntas de fondo para ver tu posición.') +
        ' <button type="button" class="btn small primary" data-action="deep-start">Responder las preguntas de fondo</button></div>'
      : '';
    const top = ok[0];
    return '<section class="panel res-head">' + banner +
      '<div class="res-sum"><div class="res-title"><p class="eyebrow">' + (S.deepExample ? 'Ejes de fondo · ejemplo' : 'Ejes de fondo · tu informe') + '</p>' +
        '<h2 class="h-xl">¿Dónde estás tú, más allá de la agenda de esta campaña?</h2>' +
        '<p class="sub">' + countDeep(ans) + ' respuestas · ' + nAx + ' de ' + DAX.length + ' ejes · ' + esc(ownRegion()) + ' · ' + parties.length + ' candidaturas situadas' + (top ? ' · más cercana en conjunto: <strong>' + esc(shortName(top.p)) + ' ' + pct(top.aff) + '%</strong>' : '') + '</p></div>' +
        '<div class="res-actions">' +
          '<button type="button" class="btn small" data-action="copy-deep" id="btn-copy-deep">Copiar resumen</button>' +
          '<button type="button" class="btn small" data-action="copy-code" id="btn-copy-code2"' + (S.deepExample ? ' disabled' : '') + '>Copiar código de respuestas</button>' +
        '</div></div>' +
      '<p class="lead">Once dimensiones ideológicas de largo alcance, del sistema económico al islam, la nación o el orden internacional. Las candidaturas se sitúan con una encuesta independiente a politólogos, el <em>Chapel Hill Expert Survey</em> 2024, y tú, con tus respuestas. Sirve para ver qué opciones comparten tus ideas de fondo y cuáles no representa ninguna.</p>' +
      '<p class="caveat">El CHES valora la posición de la dirección de cada partido en 2024 y tu posición sale de tu grado de acuerdo con afirmaciones: las escalas no son idénticas y las distancias son aproximadas.' + (noChes.length ? ' Sin datos del CHES: ' + esc(noChes.map((p) => p.name).join(', ')) + '.' : '') + ' Afinidad no es recomendación de voto.</p>' +
      srcLine(['ches24', 'ches24a'], true) +
    '</section>';
  }

  function deepAxesPanel(u, parties, tops) {
    const rows = DAX.map((ax) => {
      const uv = u[ax.id].v;
      const st = axisStatus(ax, uv, parties);
      const you = uv === null
        ? '<span class="muted drow-you">Sin respuestas en este eje</span>'
        : '<span class="drow-you"><strong>Tú: ' + esc(tramo(ax, uv)) + '</strong> <span class="mono">' + fx(uv) + '</span> <span class="muted">· ' + u[ax.id].n + (u[ax.id].n === 1 ? ' respuesta' : ' respuestas') + '</span></span>';
      return '<div class="drow">' +
        '<div class="drow-h"><h3 class="h-m">' + esc(ax.name) + '</h3>' + you + '</div>' +
        '<div class="poles" aria-hidden="true"><span>← ' + esc(ax.neg) + '</span><span>' + esc(ax.pos) + ' →</span></div>' +
        slot('strip', { ax, parties, user: uv === null ? null : { v: uv }, tops }) +
        (st ? '<p class="drow-note' + (st.kind !== 'ok' ? ' is-flag' : '') + '">' + statusText(ax, st) + '</p>' : '') +
      '</div>';
    }).join('');
    return '<section class="panel" aria-labelledby="h-dax"><h2 class="h-l" id="h-dax">Tu posición en cada eje</h2>' +
      '<p class="sub">Cada franja va de un polo (−1) al otro (+1). Las etiquetas son las candidaturas; la marca, tu posición media en las preguntas de ese eje; la banda gris, el tramo que ocupan las candidaturas. Las distancias se miden en puntos de esa escala. Destacadas, las tres más afines en conjunto.</p>' +
      '<div class="drows">' + rows + '</div>' + deepTable(u, parties) + '</section>';
  }

  function deepTable(u, parties) {
    const head = '<tr><th scope="col" class="th-p">Candidatura</th>' + DAX.map((a) => '<th scope="col" title="' + esc(a.name) + '">' + esc(a.short) + '</th>').join('') + '</tr>';
    const youRow = '<tr class="is-you"><th scope="row" class="th-p">Tú</th>' + DAX.map((a) => '<td>' + (u[a.id].v === null ? '—' : fx(u[a.id].v)) + '</td>').join('') + '</tr>';
    const rows = parties.map((p) => { const pp = partyDeep(p.id); return '<tr><th scope="row" class="th-p">' + chip(p) + '</th>' + DAX.map((a) => '<td>' + fx(pp[a.id]) + '</td>').join('') + '</tr>'; }).join('');
    return '<details class="dtable"><summary>Ver todos los valores en una tabla</summary><div class="table-scroll"><table class="vals"><caption class="sr-only">Posición de cada candidatura y la tuya en los once ejes, de −1 a +1</caption><thead>' + head + '</thead><tbody>' + youRow + rows + '</tbody></table></div>' +
      '<p class="hint">De −1 (polo izquierdo de cada franja) a +1 (polo derecho). Candidaturas: CHES 2024; tu fila: tus respuestas.</p></details>';
  }

  function deepGapsPanel(u, parties, gaps) {
    if (!DAX.some((a) => u[a.id].v !== null)) return '';
    const flags = DAX.map((ax) => ({ ax, st: axisStatus(ax, u[ax.id].v, parties) })).filter((x) => x.st && x.st.kind !== 'ok');
    const one = flags.map((x) => '<li><strong>' + esc(x.ax.name) + '.</strong> ' + statusText(x.ax, x.st) + '</li>').join('');
    const two = gaps.slice(0, 4).map((g) => '<li><strong>' + esc(g.A.name) + ' × ' + esc(g.B.name) + '.</strong> Por separado tienes candidaturas a ' + fd(g.da) + ' y ' + fd(g.db) + ' puntos (' +
      (g.na.id === g.nb.id ? esc(g.na.short) + ' en ambos ejes' : esc(g.na.short) + ' en el primero y ' + esc(g.nb.short) + ' en el segundo') + '), pero ninguna combina tus dos posiciones: la más cercana en conjunto, ' + esc(g.best.short) + ', está a ' + fd(g.d) + ' puntos. ' +
      '<button type="button" class="btn small ghost" data-action="dmap-pair" data-x="' + g.A.id + '" data-y="' + g.B.id + '">Ver en el mapa</button></li>').join('');
    const body = !flags.length && !gaps.length
      ? '<p class="sub">En todos los ejes que has respondido hay alguna candidatura a menos de ' + fd(GAP_D) + ' puntos de ti, y ninguna combinación de dos ejes te deja lejos de todas.</p>'
      : '<p class="sub">Ejes en los que tu posición queda fuera del tramo que ocupan las candidaturas o a más de ' + fd(GAP_D) + ' puntos de todas, y pares de ejes cuya combinación no representa ninguna aunque cada eje por separado sí.</p>' +
        (one ? '<h3 class="h-min">En un eje</h3><ul class="gaps">' + one + '</ul>' : '') +
        (two ? '<h3 class="h-min">En la combinación de dos ejes</h3><ul class="gaps">' + two + '</ul>' : '');
    return '<section class="panel" aria-labelledby="h-gaps"><h2 class="h-l" id="h-gaps">Lo que ninguna candidatura representa</h2>' + body + '</section>';
  }

  function econPanel(ans, u, parties, tops) {
    const q = qById.d_sis0, ax = daxById.sis;
    if (!q || !ax) return '';
    const a = ans.d_sis0;
    const ideal = a ? q.options[a.o] : null;
    const pts = parties.map((p) => ({ p, v: partyDeep(p.id).sis })).sort((x, y) => x.v - y.v);
    if (!pts.length) return '';
    /* Cada candidatura se asigna al modelo más próximo a su posición en el eje */
    const nearestOpt = (v) => q.options.reduce((b, o, k) => (Math.abs(o.v - v) < Math.abs(q.options[b].v - v) ? k : b), 0);
    const list = '<ol class="models">' + q.options.map((o, k) => {
      const near = pts.filter((x) => nearestOpt(x.v) === k);
      return '<li' + (a && a.o === k ? ' class="is-on"' : '') + '><span class="m-k mono">' + (k + 1) + '</span><span class="m-l"><strong>' + esc(o.l) + '</strong> <span class="mono muted">' + fx(o.v) + '</span>' + (a && a.o === k ? ' <span class="you-tag">Tu ideal</span>' : '') + '<br><span class="muted">' + esc(o.d) + '</span></span>' +
        '<span class="m-p">' + (near.length ? esc(near.map((x) => x.p.short).join(', ')) : '<span class="muted">Ninguna</span>') + '</span></li>';
    }).join('') + '</ol>';
    let txt = '';
    if (ideal) {
      const st = axisStatus(ax, ideal.v, parties);
      txt = '<p class="lead">Tu ideal: <strong>' + esc(ideal.l) + '</strong> (' + fx(ideal.v) + ' en el eje). ' +
        (st.kind === 'beyond-neg' || st.kind === 'beyond-pos' ? 'Ninguna candidatura llega a ese modelo: la más próxima es ' + esc(st.near.p.short) + ' (' + fx(st.near.v) + '), a ' + fd(st.d) + ' puntos.'
          : st.kind === 'gap' ? 'Ninguna candidatura está cerca de ese modelo: la más próxima es ' + esc(st.near.p.short) + ' (' + fx(st.near.v) + '), a ' + fd(st.d) + ' puntos.'
          : 'La más cercana es ' + esc(st.near.p.short) + ' (' + fx(st.near.v) + '), a ' + fd(st.d) + ' puntos.') +
        (u.sis.v !== null && u.sis.n > 1 ? ' Con todas tus respuestas de este bloque, tu posición en el eje es ' + fx(u.sis.v) + '.' : '') + '</p>';
    }
    return '<section class="panel" aria-labelledby="h-econ"><h2 class="h-l" id="h-econ">Modelo económico: tu ideal y el de las candidaturas</h2>' +
      (txt || '<p class="sub">Responde a la pregunta sobre tu modelo económico ideal para compararlo con las candidaturas.</p>') +
      '<div class="poles" aria-hidden="true"><span>← ' + esc(ax.neg) + '</span><span>' + esc(ax.pos) + ' →</span></div>' +
      slot('strip', { ax, parties, user: ideal ? { v: ideal.v, label: 'Tu ideal' } : null, tops, ticks: q.options.map((o, k) => ({ v: o.v, l: String(k + 1) })) }) +
      list +
      '<p class="hint">Los números de la franja corresponden a cada modelo; a la derecha de cada uno, las candidaturas cuya posición queda más cerca de él. Las candidaturas van de ' + esc(pts[0].p.short) + ' (' + fx(pts[0].v) + ') a ' + esc(pts[pts.length - 1].p.short) + ' (' + fx(pts[pts.length - 1].v) + '). Situar cada modelo en el eje es una convención de esta herramienta: el CHES no clasifica a los partidos por modelos.</p>' +
      '<p class="hint">Como referencia, la Constitución reconoce la libertad de empresa «en el marco de la economía de mercado» (art. 38). Ninguna de las propuestas de precampaña recopiladas para esta herramienta plantea sustituirla; IU, integrada en el Frente Amplio, declara en sus estatutos el objetivo de transformar el sistema capitalista en uno socialista.</p>' +
      srcLine(['e38', 'iu16', 'ches24c'], true) + '</section>';
  }

  function frameBar(v) {
    const left = ((v + 1) / 2 * 100).toFixed(1);
    return '<div class="fbar" role="img" aria-label="Posición ' + fx(v) + ' entre pluralismo (−1) y crítica o restricción (+1)"><i style="left:' + left + '%"></i></div><div class="fbar-l" aria-hidden="true"><span>Pluralismo</span><span>Crítica o restricción</span></div>';
  }
  function docPos(q, parties) {
    const P = q.pos || {};
    const list = parties.filter((p) => P[p.id]);
    if (!list.length) return '';
    const sym = (v) => (v === 0 ? '0' : D.scale[v + 2].s);
    return '<span class="dpos-row">' + list.map((p) => '<span class="dpos" title="' + esc(p.name + ': ' + D.scale[P[p.id][0] + 2].l.toLowerCase() + ' · ' + P[p.id][2]) + '">' + chip(p, P[p.id][1], 'sm') + '<span class="mono">' + sym(P[p.id][0]) + '</span></span>').join('') + '</span>';
  }
  function islamPanel(ans, u, parties) {
    const F = D.islamFrames || {};
    const qs = DQ.filter((q) => q.frame);
    if (!qs.length) return '';
    const vis = visibleParties();
    const sc = {};
    const cards = Object.entries(F).map(([k, f]) => {
      const items = qs.filter((q) => q.frame === k);
      const got = items.filter((q) => ans[q.id]);
      const den = got.reduce((s, q) => s + ans[q.id].w, 0);
      const v = den ? got.reduce((s, q) => s + deepVal(q, ans[q.id]) * ans[q.id].w, 0) / den : null;
      sc[k] = v;
      const li = items.map((q) => {
        const a = ans[q.id];
        return '<li><span>' + esc(qshort(q)) + ' <span class="muted">· ' + (a ? 'tú: ' + esc(D.scale[a.v + 2].l.toLowerCase()) : 'sin responder') + '</span></span>' + docPos(q, vis) + '</li>';
      }).join('');
      return '<div class="frame"><p class="frame-h">' + esc(f.l) + (v === null ? '' : ' <span class="mono muted">' + fx(v) + '</span>') + '</p><p class="hint">' + esc(f.d) + '</p>' + (v === null ? '' : frameBar(v)) + '<ul class="frame-q">' + li + '</ul></div>';
    }).join('');
    const notes = [];
    if (sc.laica !== null && sc.identitaria !== null) {
      if (sc.laica - sc.identitaria >= 0.5) notes.push('Tus respuestas más críticas con el islam son las de la óptica laica y feminista, no las de la identitaria.');
      else if (sc.identitaria - sc.laica >= 0.5) notes.push('Tus respuestas son más críticas desde la óptica identitaria que desde la laica y feminista.');
      else if (sc.laica >= 0.25 && sc.identitaria >= 0.25) notes.push('Respondes de forma crítica tanto desde la óptica identitaria como desde la laica y feminista.');
      else if (sc.laica <= -0.25 && sc.identitaria <= -0.25 && (sc.pluralista === null || sc.pluralista <= -0.25)) notes.push('Respondes desde una posición pluralista en las tres ópticas.');
    }
    const prog = [u.val.v, u.rel.v].filter((x) => x !== null);
    const ui = u.isl.v;
    if (prog.length && ui !== null) {
      const up = prog.reduce((a, b) => a + b, 0) / prog.length;
      const pts = parties.map((p) => { const d = partyDeep(p.id); return { p, a: (d.val + d.rel) / 2, b: d.isl }; });
      const r = pearson(pts.map((x) => x.a), pts.map((x) => x.b));
      const best = pts.slice().sort((x, y) => Math.hypot(x.a - up, x.b - ui) - Math.hypot(y.a - up, y.b - ui))[0];
      const dd = Math.hypot(best.a - up, best.b - ui);
      notes.push('Combinando tus posiciones en valores y laicidad (' + fx(up) + ') y en el islam (' + fx(ui) + '), la candidatura más cercana es ' + esc(best.p.short) + ', a ' + fd(dd) + ' puntos' + (r2(dd) >= PAIR_D ? ': ninguna combina de cerca las dos cosas.' : '.') +
        (r !== null ? ' Entre las candidaturas, el CHES muestra ambos ejes muy unidos (correlación de ' + r.toFixed(2).replace('.', ',') + '): las más progresistas y laicas son también las más pluralistas hacia el islam, y las más críticas con el islam, las más conservadoras.' : ''));
    }
    return '<section class="panel" aria-labelledby="h-isl"><h2 class="h-l" id="h-isl">Islam y convivencia: tres ópticas</h2>' +
      '<p class="sub">El debate sobre el islam no enfrenta solo a derecha e izquierda. Las preguntas de este eje se plantean desde tres ópticas distintas; cada barra resume tus respuestas a las de esa óptica, de −1 (pluralismo) a +1 (crítica o restricción). Junto a cada pregunta, las posiciones documentadas: ++ muy de acuerdo, + de acuerdo, 0 neutral, − en desacuerdo, −− muy en desacuerdo.</p>' +
      '<div class="frames">' + cards + '</div>' +
      (notes.length ? '<div class="deep-notes">' + notes.map((t) => '<p>' + t + '</p>').join('') + '</div>' : '') +
      '<p class="hint">En el CHES, el eje del islam combina cuánto pesa la retórica contra el islam en el discurso de cada partido (relevancia, no posición) y su preferencia por el multiculturalismo o la asimilación de los inmigrantes.</p></section>';
  }

  function deepRankPanel(scores, nAx) {
    const rows = scores.map((r, i) => {
      const w = r.ok ? pct(r.aff) : 0;
      return '<li class="rank-row' + (r.ok ? '' : ' is-insuf') + '">' +
        '<span class="rank-pos">' + (r.ok ? i + 1 : '–') + '</span>' +
        '<span class="rank-name">' + chip(r.p) + '<span class="rank-full">' + esc(r.p.name) + '</span></span>' +
        '<span class="rank-bar" aria-hidden="true"><span class="rank-fill" style="width:' + w + '%"></span></span>' +
        '<span class="rank-val">' + (r.ok ? w + '%' : 'Datos insuficientes') + '</span>' +
        '<span class="rank-meta">Comparado en ' + r.n + ' de ' + DAX.length + ' ejes</span></li>';
    }).join('');
    return '<section class="panel" aria-labelledby="h-drank"><h2 class="h-l" id="h-drank">Afinidad en los ejes de fondo</h2>' +
      '<p class="sub">Cercanía media entre tu posición y la de cada candidatura en los ejes que has respondido, ponderada por la importancia que les das: 100% sería coincidir en todos. Es independiente de la afinidad en medidas concretas de «Resultados».</p>' +
      (nAx < 3 ? '<p class="hint">Responde preguntas de al menos tres ejes para calcularla.</p>' : '<ol class="rank">' + rows + '</ol>') + '</section>';
  }

  function deepHeatPanel(ok, u) {
    const axes = DAX.filter((a) => u[a.id].v !== null);
    if (!ok.length || !axes.length) return '';
    const head = '<tr><th scope="col" class="th-p">Candidatura</th>' + axes.map((a) => '<th scope="col" title="' + esc(a.name) + '">' + esc(a.short) + '</th>').join('') + '<th scope="col" class="th-g">Global</th></tr>';
    const rows = ok.map((r) => '<tr><th scope="row" class="th-p">' + chip(r.p) + '</th>' + axes.map((a) => {
      const s = r.ax[a.id];
      return '<td class="h' + bin7(s) + '" tabindex="0" data-tip="' + esc(pct(s) + '% · ' + r.p.short + '\n' + a.name + ': ' + fx(partyDeep(r.p.id)[a.id]) + ' · tú ' + fx(u[a.id].v)) + '">' + pct(s) + '</td>';
    }).join('') + '<td class="h' + bin7(r.aff) + ' td-g" tabindex="0" data-tip="' + esc(pct(r.aff) + '% · ' + r.p.short + '\nAfinidad de fondo') + '">' + pct(r.aff) + '</td></tr>').join('');
    const legend = '<div class="ramp-legend" aria-hidden="true"><span>0%</span>' + [0, 1, 2, 3, 4, 5, 6].map((k) => '<i class="h' + k + '"></i>').join('') + '<span>100%</span></div>';
    return '<section class="panel" aria-labelledby="h-dheat"><h2 class="h-l" id="h-dheat">Afinidad por eje</h2><p class="sub">1 − distancia / 2 en cada eje, en porcentaje: 50% significa estar en polos opuestos a media escala; 100%, la misma posición.</p>' +
      '<div class="table-scroll"><table class="heat"><caption class="sr-only">Afinidad por eje de fondo y candidatura, en porcentaje</caption><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>' + legend + '</section>';
  }

  function deepMapPanel(u, parties, tops, gaps) {
    let xa = S.dmapX, ya = S.dmapY;
    if (!daxById[xa] || !daxById[ya] || xa === ya) {
      if (gaps.length) { xa = gaps[0].A.id; ya = gaps[0].B.id; } else { xa = 'sis'; ya = 'val'; }
    }
    const sel = (id, cur, other, lbl) => '<span class="map-pick"><label class="lbl-inline" for="' + id + '">' + lbl + '</label><select id="' + id + '" data-change="' + id + '">' +
      DAX.map((a) => '<option value="' + a.id + '"' + (a.id === cur ? ' selected' : '') + (a.id === other ? ' disabled' : '') + '>' + esc(a.name) + '</option>').join('') + '</select></span>';
    return '<section class="panel" id="dmap" aria-labelledby="h-dmap"><div class="panel-head"><h2 class="h-l" id="h-dmap">Mapa de fondo</h2><div class="ctrl-row map-sel">' + sel('dmapx', xa, ya, 'Horizontal') + sel('dmapy', ya, xa, 'Vertical') + '</div></div>' +
      '<p class="sub">Cruza dos ejes cualesquiera para ver qué candidaturas comparten tu combinación.' + (gaps.length && !(S.dmapX && S.dmapY) ? ' Se abre en el par de ejes que peor te representa.' : '') + ' Destacadas, las tres más afines en conjunto.</p>' +
      slot('map', { xa: daxById[xa], ya: daxById[ya], parties, u, tops }, 'dmap-slot') + '</section>';
  }

  function deepMapSvg(cfg, Wfull) {
    const W = Math.min(Wfull, 760), H = Math.round(Math.max(300, Math.min(W * 0.72, 520)));
    const narrow = W < 560;
    const m = { l: 30, r: 30, t: 30, b: narrow ? 70 : 56 };
    const X = (v) => m.l + (v + 1) / 2 * (W - m.l - m.r);
    const Y = (v) => H - m.b - (v + 1) / 2 * (H - m.t - m.b);
    const { xa, ya, parties, u, tops } = cfg;
    const pts = parties.map((p) => {
      const pp = partyDeep(p.id);
      return { x: X(pp[xa.id]), y: Y(pp[ya.id]), label: p.short, bold: tops.has(p.id), top: tops.has(p.id), tip: p.name + '\n' + xa.name + ': ' + fx(pp[xa.id]) + '\n' + ya.name + ': ' + fx(pp[ya.id]) };
    });
    let you = null;
    if (u[xa.id].v !== null && u[ya.id].v !== null) you = { x: X(u[xa.id].v), y: Y(u[ya.id].v), label: 'Tú', bold: true, you: true, tip: 'Tu posición\n' + xa.name + ': ' + fx(u[xa.id].v) + '\n' + ya.name + ': ' + fx(u[ya.id].v) };
    const all = you ? [you].concat(pts) : pts;
    placeLabels(all, { x0: 2, y0: m.t - 2, x1: W - 2, y1: H - m.b + 4 });
    let g = '';
    for (const t of [-1, -0.5, 0, 0.5, 1]) {
      g += '<line class="' + (t === 0 ? 'axis0' : 'grid') + '" x1="' + X(t) + '" y1="' + m.t + '" x2="' + X(t) + '" y2="' + (H - m.b) + '"/>';
      g += '<line class="' + (t === 0 ? 'axis0' : 'grid') + '" x1="' + m.l + '" y1="' + Y(t) + '" x2="' + (W - m.r) + '" y2="' + Y(t) + '"/>';
    }
    g += '<text class="ax-lbl" x="' + m.l + '" y="' + (narrow ? H - 26 : H - 10) + '" text-anchor="start">← ' + esc(xa.neg) + '</text>';
    g += '<text class="ax-lbl" x="' + (W - m.r) + '" y="' + (H - 10) + '" text-anchor="end">' + esc(xa.pos) + ' →</text>';
    g += '<text class="ax-lbl" x="' + m.l + '" y="' + (m.t - 12) + '" text-anchor="start">↑ ' + esc(ya.pos) + '</text>';
    g += '<text class="ax-lbl" x="' + m.l + '" y="' + (H - m.b + 18) + '" text-anchor="start">↓ ' + esc(ya.neg) + '</text>';
    const marks = all.map((p) => {
      const cls = p.you ? 'pt-you' : p.top ? 'pt-top' : 'pt';
      return '<g class="mk" tabindex="0" role="img" aria-label="' + esc(p.tip.replace(/\n/g, '. ')) + '" data-tip="' + esc(p.tip) + '">' +
        '<circle class="hit" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="13"/>' +
        '<circle class="' + cls + '" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + (p.you ? 7 : 5) + '"/>' +
        '<text class="pt-lbl' + (p.bold ? ' b' : '') + (p.you ? ' you' : '') + '" x="' + p.lx.toFixed(1) + '" y="' + p.ly.toFixed(1) + '" text-anchor="' + p.anchor + '">' + esc(p.label) + '</text></g>';
    }).join('');
    return '<div class="chart"><svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="group" aria-label="Mapa de fondo: ' + esc(xa.name) + ' y ' + esc(ya.name) + '">' + g + marks + '</svg></div>' +
      (you ? '' : '<p class="hint">Responde preguntas de ambos ejes para ver tu punto.</p>');
  }

  function deepDetailPanel(ans) {
    const parties = visibleParties();
    const qs = DQ.filter((q) => ans[q.id] && q.pos);
    const items = qs.map((q) => {
      const a = ans[q.id];
      return '<div class="qrow"><p class="qrow-t"><span class="mono">' + q.id + '</span> ' + esc(q.text) + ' <span class="imp-tag">' + esc(q.axis ? daxById[q.axis].name : 'Tema transversal') + ' · importancia ' + esc((D.importance.find((m) => m.w === a.w) || D.importance[1]).l.toLowerCase()) + '</span></p>' + partyPositions(q, a, parties, true, true) + '</div>';
    }).join('');
    return '<section class="panel" aria-labelledby="h-ddet"><h2 class="h-l" id="h-ddet">Posiciones documentadas, pregunta a pregunta</h2>' +
      '<p class="sub">Además de su lugar en cada eje, ' + DQ.filter((q) => q.pos).length + ' de las ' + DQ.length + ' preguntas de fondo tienen posiciones concretas de algunas candidaturas, con votos, propuestas o declaraciones enlazadas. No entran en el cálculo de la afinidad de fondo, que usa solo el CHES.</p>' +
      (items ? '<div class="qrows">' + items + '</div>' : '<p class="hint">Aún no has respondido ninguna de esas preguntas.</p>') + '</section>';
  }

  function deepSummaryText() {
    const ans = deepAnswers();
    const parties = deepParties();
    const u = userDeep(ans);
    const lines = ['Cotejo 29-N · ejes de fondo · ' + (S.deepExample ? 'perfil de ejemplo (ficticio)' : 'mis posiciones') + ' · candidaturas situadas con el CHES 2024', ''];
    DAX.forEach((ax) => {
      const v = u[ax.id].v;
      if (v === null) return;
      const st = axisStatus(ax, v, parties);
      lines.push(ax.name + ': ' + tramo(ax, v) + ' (' + fx(v) + ')' + (st ? ' · más cercana: ' + shortName(st.near.p) + ' (' + fx(st.near.v) + ')' + (st.kind === 'gap' ? ' · ninguna cerca' : st.kind !== 'ok' ? ' · fuera del espectro' : '') : ''));
    });
    const sc = deepScores(ans, parties).filter((r) => r.ok);
    if (sc.length) { lines.push('', 'Afinidad de fondo:'); sc.forEach((r, i) => lines.push((i + 1) + '. ' + shortName(r.p) + ': ' + pct(r.aff) + '%')); }
    lines.push('', 'Afinidad no es recomendación de voto.');
    return lines.join('\n');
  }

  /* ───────── vista: historial y fiabilidad ───────── */
  function renderRel() {
    const root = $('#v-fiabilidad');
    if (!S.relParty || !byId[S.relParty]) S.relParty = D.parties[0].id;
    const areas = D.relAreas;
    const head = '<tr><th scope="col" class="th-p">Partido</th>' + areas.map((a) => '<th scope="col">' + esc(CAT_SHORT[a.id] || a.name) + '</th>').join('') + '<th scope="col" class="th-g">Global</th></tr>';
    const rows = D.parties.map((p) => {
      const cells = areas.map((a) => {
        const st = relStats(p.id, a.id);
        if (st.idx === null) return '<td class="hm-na"><button type="button" class="cell-btn" data-action="rel-cell" data-p="' + p.id + '" data-a="' + a.id + '" data-tip="' + esc(p.short + ' · ' + a.name + '\n' + (st.ctxN ? st.ctxN + ' hechos de contexto, sin casos puntuables' : 'Sin casos documentados')) + '">—</button></td>';
        return '<td class="g' + bin7(st.idx) + '"><button type="button" class="cell-btn" data-action="rel-cell" data-p="' + p.id + '" data-a="' + a.id + '" data-tip="' + esc(pct(st.idx) + '/100 · ' + p.short + '\n' + a.name + ' · ' + st.n + (st.n === 1 ? ' caso' : ' casos') + ' (evidencia ' + evidence(st.n) + ')') + '">' + pct(st.idx) + '<small>' + st.n + '</small></button></td>';
      }).join('');
      const g = relStats(p.id);
      const gcell = g.idx === null ? '<td class="hm-na td-g">—</td>' : '<td class="g' + bin7(g.idx) + ' td-g"><button type="button" class="cell-btn" data-action="rel-cell" data-p="' + p.id + '" data-a="all" data-tip="' + esc(pct(g.idx) + '/100 · ' + p.short + '\nGlobal · ' + g.n + ' casos (evidencia ' + evidence(g.n, true) + ')') + '">' + pct(g.idx) + '<small>' + g.n + '</small></button></td>';
      return '<tr class="' + (p.id === S.relParty ? 'is-sel' : '') + '"><th scope="row" class="th-p"><button type="button" class="row-btn" data-action="rel-party" data-p="' + p.id + '">' + chip(p) + '</button></th>' + cells + gcell + '</tr>';
    }).join('');
    const legend = Object.entries(D.verdicts).map(([k, v]) => '<li>' + pill(k) + '<span>' + esc(v.d) + (v.score !== null ? ' <span class="muted">(' + Math.round(v.score * 100) + ' · ' + (v.dim === 'cum' ? 'cumplimiento' : 'coherencia') + ')</span>' : ' <span class="muted">(no puntúa)</span>') + '</span></li>').join('');
    const sumCell = (st, label, p) => st.idx === null
      ? '<td class="hm-na" tabindex="0" data-tip="' + esc(p.short + ' · ' + label + '\nSin casos puntuables') + '">—</td>'
      : '<td class="g' + bin7(st.idx) + '" tabindex="0" data-tip="' + esc(pct(st.idx) + '/100 · ' + p.short + '\n' + label + ' · ' + st.n + (st.n === 1 ? ' caso' : ' casos') + ' (evidencia ' + evidence(st.n, label === 'Combinado') + ')') + '">' + pct(st.idx) + '<small>' + st.n + '</small></td>';
    const sumRows = D.parties.map((p) => '<tr' + (p.id === S.relParty ? ' class="is-sel"' : '') + '><th scope="row" class="th-p"><button type="button" class="row-btn" data-action="rel-party" data-p="' + p.id + '">' + chip(p) + '</button></th>' +
      sumCell(relStats(p.id, null, 'cum'), 'Cumplimiento', p) + sumCell(relStats(p.id, null, 'coh'), 'Coherencia', p) + sumCell(relStats(p.id), 'Combinado', p) +
      '<td class="td-txt">' + esc(GOV[p.id] || '') + '</td></tr>').join('');
    const summary = '<section class="panel" aria-labelledby="h-relsum"><h2 class="h-l" id="h-relsum">Resumen: cumplimiento y coherencia</h2>' +
      '<p class="sub"><strong>Cumplimiento</strong>: ¿hizo lo que prometió? Depende sobre todo de haber gobernado. <strong>Coherencia</strong>: ¿sus votos y actos encajan con lo que dice? Se puede evaluar también en la oposición. El número pequeño es cuántos casos sustentan cada índice; compara siempre con la experiencia de gobierno.</p>' +
      '<div class="table-scroll"><table class="heat rel-sum"><caption class="sr-only">Índices de cumplimiento, coherencia y combinado por partido, de 0 a 100, con el número de casos</caption><thead><tr><th scope="col" class="th-p">Partido</th><th scope="col">Cumplimiento</th><th scope="col">Coherencia</th><th scope="col">Combinado</th><th scope="col" class="th-txt">Experiencia de gobierno</th></tr></thead><tbody>' + sumRows + '</tbody></table></div></section>';
    root.innerHTML =
      '<div class="rel">' +
        '<section class="panel rel-intro"><p class="eyebrow">Historial y fiabilidad</p><h2 class="h-xl">¿Cumplen lo que dicen?</h2>' +
          '<p class="lead">Para cada partido se han documentado compromisos y posiciones públicas verificables y se ha comprobado qué pasó después: si se cumplieron, si votó en coherencia o si hizo lo contrario. Cada caso enlaza a sus fuentes. Se resumen en dos índices de 0 a 100: <strong>cumplimiento</strong> de lo prometido y <strong>coherencia</strong> entre discurso y actos. El número pequeño de cada celda es cuántos casos sustentan el índice.</p>' +
          '<details class="legend"><summary>Cómo se puntúa cada caso</summary><ul class="verdicts">' + legend + '</ul><p class="hint">Peso doble para compromisos centrales o de alto impacto. Evidencia por área: baja (1 caso), media (2–3), alta (4 o más). Un partido sin gobierno tiene menos ocasiones de incumplir, pero también de cumplir: compara siempre el número de casos.</p></details>' +
        '</section>' +
        summary +
        '<section class="panel"><h2 class="h-l">Índice combinado por área</h2><p class="sub">Pulsa una celda para ver los casos de esa área.' + ' En tema claro, más oscuro significa más cumplimiento y coherencia; en tema oscuro, más claro.</p>' +
          '<div class="table-scroll"><table class="heat rel-table"><caption class="sr-only">Índice de cumplimiento y coherencia por partido y área, de 0 a 100, con el número de casos</caption><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>' +
          '<div class="ramp-legend g" aria-hidden="true"><span>0</span>' + [0, 1, 2, 3, 4, 5, 6].map((k) => '<i class="g' + k + '"></i>').join('') + '<span>100</span></div>' +
        '</section>' +
        relDetail(S.relParty) +
      '</div>';
  }

  function relDetail(pid) {
    const p = byId[pid];
    const R = D.reliability[pid] || { cases: [], power: '' };
    const g = relStats(pid);
    const used = new Set(R.cases.map((c) => c.a));
    const areas = D.relAreas.filter((a) => used.has(a.id));
    if (S.relArea !== 'all' && !used.has(S.relArea)) S.relArea = 'all';
    const filt = '<div class="chips-row" role="group" aria-label="Filtrar casos por área">' +
      '<button type="button" class="fchip' + (S.relArea === 'all' ? ' is-on' : '') + '" aria-pressed="' + (S.relArea === 'all') + '" data-action="rel-area" data-v="all">Todas (' + R.cases.length + ')</button>' +
      areas.map((a) => '<button type="button" class="fchip' + (S.relArea === a.id ? ' is-on' : '') + '" aria-pressed="' + (S.relArea === a.id) + '" data-action="rel-area" data-v="' + a.id + '">' + esc(a.name) + ' (' + R.cases.filter((c) => c.a === a.id).length + ')</button>').join('') + '</div>';
    const cases = R.cases.filter((c) => S.relArea === 'all' || c.a === S.relArea).map((c) =>
      '<li class="case"><div class="case-h">' + pill(c.v) + '<span class="case-area">' + esc(areaById[c.a].name) + '</span><span class="case-y mono">' + esc(c.y) + '</span>' + (c.w === 2 ? '<span class="case-w">Compromiso central</span>' : '') + '</div>' +
      '<h3 class="case-t">' + esc(c.t) + '</h3>' +
      '<dl class="case-dl">' + (c.p && c.p !== '—' ? '<dt>Lo prometido o afirmado</dt><dd>' + esc(c.p) + '</dd>' : '') + '<dt>Lo que ocurrió</dt><dd>' + esc(c.r) + '</dd></dl>' + srcLine(c.s, true) + '</li>').join('');
    const counts = {};
    R.cases.forEach((c) => { const tone = D.verdicts[c.v].tone; counts[tone] = (counts[tone] || 0) + 1; });
    const opts = D.parties.map((x) => '<option value="' + x.id + '"' + (x.id === pid ? ' selected' : '') + '>' + esc(x.short + ' · ' + x.name) + '</option>').join('');
    return '<section class="panel rel-detail" id="rel-detail" aria-labelledby="h-reld">' +
      '<div class="panel-head"><h2 class="h-l" id="h-reld">' + chip(p) + ' ' + esc(p.name) + '</h2>' +
        '<label class="sr-only" for="sel-relp">Elegir partido</label><select id="sel-relp" data-change="relp">' + opts + '</select></div>' +
      '<div class="kv-row">' +
        ['cum', 'coh'].map((d) => { const st = relStats(pid, null, d); return '<div class="kv"><span class="kv-k">' + esc(D.relDims[d].l) + '</span><span class="kv-v">' + (st.idx === null ? '—' : pct(st.idx) + '<small>/100 · ' + st.n + (st.n === 1 ? ' caso' : ' casos') + '</small>') + '</span></div>'; }).join('') +
        '<div class="kv"><span class="kv-k">Combinado</span><span class="kv-v">' + (g.idx === null ? '—' : pct(g.idx) + '<small>/100 · evidencia ' + evidence(g.n, true) + '</small>') + '</span></div>' +
        '<div class="kv"><span class="kv-k">Balance</span><span class="kv-v kv-tones"><span class="tone ok">' + (counts.ok || 0) + ' ✓</span><span class="tone mid">' + (counts.mid || 0) + ' ◐</span><span class="tone bad">' + (counts.bad || 0) + ' ✕</span>' + (counts.ctx ? '<span class="tone ctx">' + counts.ctx + ' •</span>' : '') + '</span></div>' +
      '</div>' +
      '<p class="power">' + esc(R.power) + '</p>' +
      (R.cases.length ? filt + '<ol class="cases">' + cases + '</ol>' : '<p class="empty-state">No hay casos documentados suficientes para este partido. Su ausencia no implica fiabilidad alta ni baja.</p>') +
    '</section>';
  }

  /* ───────── vista: partidos ───────── */
  function renderParties() {
    const vis = new Set(visibleParties().map((p) => p.id));
    const cards = D.parties.map((p) => {
      const g = relStats(p.id);
      const R = D.reliability[p.id];
      const areaBits = D.relAreas.map((a) => ({ a, st: relStats(p.id, a.id) })).filter((x) => x.st.idx !== null);
      const best = areaBits.slice().sort((x, y) => y.st.idx - x.st.idx || y.st.n - x.st.n).slice(0, 2);
      const worst = areaBits.slice().sort((x, y) => x.st.idx - y.st.idx || y.st.n - x.st.n).slice(0, 2);
      const scope = p.scope === 'estatal' ? 'Ámbito estatal' : 'Se presenta en: ' + p.regions.map((r) => (D.regions.find((x) => x.id === r) || {}).name).join(', ');
      const ballots = Object.values(p.ballot || {});
      const ties = (p.ties || []).map((t) => '<li>' + esc(t[0]) + srcLine(t[1], true) + '</li>').join('');
      return '<article class="pcard' + (vis.has(p.id) ? '' : ' is-out') + '" aria-labelledby="pc-' + p.id + '">' +
        '<header class="pcard-h"><h2 class="h-m" id="pc-' + p.id + '">' + chip(p) + ' ' + esc(p.name) + '</h2><p class="muted">' + esc(scope) + (vis.has(p.id) ? '' : ' · no figura en tu selección') + '</p></header>' +
        '<dl class="pfacts">' +
          '<div><dt>Candidatura</dt><dd>' + esc(p.cand) + '</dd></div>' +
          '<div><dt>Encuestas (media)</dt><dd>' + p.poll.pct.toLocaleString('es-ES') + '%' + (p.poll.seats != null ? ' · ' + p.poll.seats + ' escaños' : '') + '</dd></div>' +
          '<div><dt>Escaños en 2023</dt><dd>' + (p.seats23 || 0) + (p.id === 'podemos' ? ' (elegidos en las listas de Sumar)' : p.id === 'sumar' ? ' (incluía a Podemos)' : '') + '</dd></div>' +
          '<div><dt>Experiencia</dt><dd>' + esc(GOV[p.id] || '—') + '</dd></div>' +
          '<div><dt>Cumplimiento</dt><dd>' + idxTxt(relStats(p.id, null, 'cum')) + '</dd></div>' +
          '<div><dt>Coherencia</dt><dd>' + idxTxt(relStats(p.id, null, 'coh')) + '</dd></div>' +
          '<div><dt>Casos documentados</dt><dd>' + (R ? R.cases.length : 0) + (g.n ? ' (' + g.n + ' puntuables)' : '') + '</dd></div>' +
        '</dl>' +
        '<p class="pexp">' + esc(p.exp) + '</p>' + srcLine(p.expSrc, true) +
        (ballots.length ? '<ul class="ballot-notes">' + ballots.map((b) => '<li>' + esc(b) + '</li>').join('') + '</ul>' : '') +
        (ties ? '<h3 class="h-min">Relaciones y vínculos destacados</h3><ul class="ties">' + ties + '</ul>' : '') +
        (areaBits.length >= 2 ? '<p class="pbest"><span class="muted">Mejor historial en</span> ' + esc(best.map((x) => x.a.name).join(' y ')) + ' · <span class="muted">peor en</span> ' + esc(worst.map((x) => x.a.name).join(' y ')) + '</p>' : '') +
        (p.limited ? '<p class="warn-note">Evaluación con datos limitados: todas sus posiciones son inferidas.</p>' : '') +
        (partyDeep(p.id)
          ? '<details class="pdeep"><summary>Perfil en los ejes de fondo (CHES 2024)</summary><ul class="pdeep-l">' + DAX.map((a) => { const v = partyDeep(p.id)[a.id]; return '<li><span>' + esc(a.name) + '</span><span><strong>' + esc(tramo(a, v)) + '</strong> <span class="mono muted">' + fx(v) + '</span></span></li>'; }).join('') + '</ul></details>'
          : '<p class="hint">No figura en el CHES 2024: sin perfil en los ejes de fondo.</p>') +
        '<div class="pcard-actions"><button type="button" class="btn small" data-action="rel-party-go" data-p="' + p.id + '"' + (R && R.cases.length ? '' : ' disabled') + '>Ver su historial</button></div>' +
      '</article>';
    }).join('');
    const ne = (D.notEvaluated || []).map((x) => '<li><strong>' + esc(x[0]) + '.</strong> ' + esc(x[1]) + srcLine(x[2], true) + '</li>').join('');
    $('#v-partidos').innerHTML =
      '<section class="panel"><p class="eyebrow">Partidos</p><h2 class="h-xl">Candidaturas evaluadas</h2><p class="lead">Ordenadas por la media de encuestas de 16 institutos publicada el ' + esc(fmtDate(D.meta.pollDate)) + ' (' + esc(D.sources[D.meta.pollSource].o) + '). Las encuestas son estimaciones, no resultados.</p>' + srcLine([D.meta.pollSource], true) + '</section>' +
      '<div class="pgrid">' + cards + '</div>' +
      '<section class="panel"><h2 class="h-l">Formaciones no evaluadas</h2><ul class="ne-list">' + ne + '</ul></section>';
  }

  /* ───────── vista: método y fuentes ───────── */
  function renderMethod() {
    const kinds = { verificador: 'Verificadores de datos', oficial: 'Fuentes oficiales', juridico: 'Textos y análisis jurídicos', analisis: 'Análisis y estudios', prensa: 'Prensa', agregador: 'Agregadores y recopilaciones', programa: 'Programas electorales' };
    const groups = {};
    Object.entries(D.sources).forEach(([id, s]) => { (groups[s.k] = groups[s.k] || []).push([id, s]); });
    const srcHtml = Object.keys(kinds).filter((k) => groups[k]).map((k) => {
      const items = groups[k].slice().sort((a, b) => (b[1].d || '').localeCompare(a[1].d || '')).map(([id, s]) => '<li><a href="' + esc(s.u) + '" target="_blank" rel="noopener noreferrer">' + esc(s.t) + '</a> <span class="muted">— ' + esc(s.o) + (s.d ? ', ' + esc(fmtDate(s.d)) : '') + '</span> <span class="mono id">' + id + '</span></li>').join('');
      return '<details class="src-group"><summary>' + esc(kinds[k]) + ' <span class="muted">(' + groups[k].length + ')</span></summary><ul class="src-list">' + items + '</ul></details>';
    }).join('');
    const nq = D.questions.length, nc = Object.values(D.reliability).reduce((a, r) => a + r.cases.length, 0), ns = Object.keys(D.sources).length;
    const iu = partyDeep('iu'), su = partyDeep('sumar');
    const iuDiff = iu && su ? DAX.reduce((s, a) => s + Math.abs(iu[a.id] - su[a.id]), 0) / DAX.length : null;
    const nPos = DQ.reduce((s, q) => s + Object.keys(q.pos || {}).length, 0);
    const axRows = DAX.map((a) => '<tr><td><strong>' + esc(a.name) + '</strong></td><td>' + esc(a.neg) + ' (−1) · ' + esc(a.pos) + ' (+1)</td><td>' + esc(a.chesTxt) + ' <span class="mono muted">' + a.comps.map((c) => c[0]).join(', ') + '</span></td><td class="num">' + DQ.filter((q) => q.axis === a.id).length + '</td></tr>').join('');
    const vrows = Object.entries(D.verdicts).map(([k, v]) => '<tr><td>' + pill(k) + '</td><td>' + esc(v.d) + '</td><td>' + (v.dim === 'cum' ? 'Cumplimiento' : v.dim === 'coh' ? 'Coherencia' : '—') + '</td><td class="num">' + (v.score === null ? '—' : Math.round(v.score * 100)) + '</td></tr>').join('');
    $('#v-metodo').innerHTML =
      '<article class="panel method">' +
        '<p class="eyebrow">Método y fuentes</p><h2 class="h-xl">Cómo está hecho</h2>' +
        '<p class="lead">Cotejo 29-N es una herramienta independiente, sin vínculo con ningún partido, para comparar tus opiniones con las de las candidaturas a las elecciones generales del 29 de noviembre de 2026 y consultar su historial. Contiene ' + nq + ' preguntas sobre medidas concretas, ' + DQ.length + ' sobre ejes ideológicos de fondo, ' + D.parties.length + ' candidaturas, ' + nc + ' casos de historial y ' + ns + ' fuentes enlazadas. Datos cerrados el ' + esc(fmtDate(D.meta.updated)) + '.</p>' +
        '<h3 class="h-m">1. De dónde salen las posiciones</h3>' +
        '<p>El adelanto electoral se anunció el 5 de octubre de 2026 y, a la fecha de cierre, ningún partido había publicado su programa. Cada posición se codifica en la misma escala que tus respuestas (de «muy en desacuerdo» a «muy de acuerdo») a partir, por este orden de preferencia, de: votaciones en el Congreso y leyes aprobadas; propuestas y documentos recientes de la dirección del partido; y programas de 2023 o su ideología declarada. Cada posición indica su nivel de evidencia:</p>' +
        '<ul class="conf-list">' + Object.entries(D.confidence).map(([k, v]) => '<li><span class="chip conf-' + k + '">' + k + '</span> <strong>' + esc(v.l) + '</strong> (peso ' + v.w + '): ' + esc(v.d) + '</li>').join('') + '</ul>' +
        '<p>Las posiciones de precampaña se apoyan en parte en <em>Política Electoral</em>, una recopilación no oficial; los datos clave se han contrastado con prensa de distinta línea editorial, verificadores (Maldita.es, Newtral) y fuentes oficiales. Cuando falta evidencia, la casilla queda vacía y no puntúa.</p>' +
        '<h3 class="h-m">2. Cómo se calcula la afinidad</h3>' +
        '<p>Para cada pregunta, la coincidencia es 1 − |tu respuesta − posición del partido| / 4 (1 si coincidís, 0 si estáis en extremos opuestos). La afinidad es la media de esas coincidencias, ponderada por la importancia que das a la pregunta (poco 0,5 · normal 1 · mucho 2) y por el peso de la evidencia. Para no premiar a los partidos con pocos datos, la media global se «contrae» hacia el 50% como si se añadieran ' + SHRINK_K + ' preguntas neutras: con mucha evidencia el ajuste es mínimo; con poca, el resultado se acerca al 50%. Cuando respondes una pregunta en la que un partido no tiene posición documentada, cuenta como una coincidencia esperada del 50% con la mitad de peso: así la falta de datos no le favorece. Si un partido no tiene posición en al menos el ' + (MIN_COV * 100) + '% de la importancia de tus respuestas, se marca como «datos insuficientes». Las preguntas saltadas no cuentan. La tabla por bloques muestra la coincidencia sin ajustar y el número de preguntas de cada celda.</p>' +
        '<p>Cuando no hay una posición documentada se deja la casilla vacía, en lugar de asignar un valor neutral: un «0» significa una posición intermedia o mixta verificada (por ejemplo, apoyar una medida y rechazar otra del mismo paquete, o abstenerse), no ausencia de datos.</p>' +
        '<p>El mapa sitúa a cada partido en tres ejes (económico, territorial y de valores e inmigración) con las preguntas marcadas para cada eje, en un rango de −1 a +1. Los ejes simplifican: dos partidos cercanos en el mapa pueden discrepar en preguntas concretas.</p>' +
        '<h3 class="h-m">3. Cómo se evalúa el historial</h3>' +
        '<p>Cada caso recoge un compromiso o una posición pública verificable, lo que ocurrió después y un veredicto. Los veredictos se agrupan en dos dimensiones que se muestran por separado, porque no son comparables entre partidos con distinto poder: <strong>cumplimiento</strong> (¿hizo lo que prometió?, algo que depende de haber gobernado) y <strong>coherencia</strong> (¿sus votos, pactos y actos encajan con lo que dice?, evaluable también en la oposición). Cada índice es la media de sus casos, con peso doble para los compromisos centrales; el combinado mezcla ambos.</p>' +
        '<div class="table-scroll"><table class="vtable"><thead><tr><th>Veredicto</th><th>Significado</th><th>Dimensión</th><th class="num">Puntos</th></tr></thead><tbody>' + vrows + '</tbody></table></div>' +
        '<p>La selección no es exhaustiva: prioriza compromisos de alto perfil y verificables, e incluye para cada partido aciertos e incumplimientos. Los partidos que han gobernado acumulan más casos, en ambos sentidos; los que no, se evalúan sobre todo por la coherencia entre discurso y voto. Las causas judiciales abiertas se muestran como contexto y no puntúan. Como referencia externa, un estudio académico estimó en un 19,6% el cumplimiento del acuerdo PSOE-Unidas Podemos en su primer año (Newtral calculó un 21% y el propio Gobierno un 20%); los informes de autoevaluación del Gobierno («Cumpliendo») dan cifras más altas para periodos posteriores.</p>' +
        srcLine(['p20', 'p21', 'p19'], true) +
        '<h3 class="h-m">4. Ejes de fondo</h3>' +
        '<p>Las preguntas sobre medidas se limitan a lo que hoy está en la agenda, que ya viene acotado por lo que proponen los partidos principales. El módulo «Ejes de fondo» añade ' + DQ.length + ' preguntas sobre once dimensiones ideológicas de largo alcance y tres temas transversales, para que puedas situarte también donde no llega ninguna candidatura: por ejemplo, en el sistema económico que prefieres o en tu posición sobre el islam, preguntada desde una óptica identitaria, otra laica y feminista y otra pluralista.</p>' +
        '<p>Para no depender de una codificación propia, la posición de cada candidatura en esos ejes procede del <em>Chapel Hill Expert Survey</em> (CHES) 2024: 609 politólogos especializados valoraron entre octubre y diciembre de 2024 a 279 partidos de 31 países, 14 de ellos españoles, en escalas de 0 a 10 (la integración europea, de 1 a 7). Cada eje usa una o dos de sus variables:</p>' +
        '<div class="table-scroll"><table class="vtable"><thead><tr><th>Eje</th><th>Polos</th><th>Qué valoraron los expertos</th><th class="num">Preguntas</th></tr></thead><tbody>' + axRows + '</tbody></table></div>' +
        '<p>Cada variable se lleva a una escala de −1 a +1 con (x − 5) / 5, o (x − 4) / 3 para la integración europea, y cuando un eje combina dos variables se promedian (en «Autoridad y libertades», la de libertades civiles pesa el doble). Tu posición en un eje es la media de tus respuestas a sus preguntas: «muy de acuerdo» vale ±1 según el sentido de la afirmación, «de acuerdo» ±0,5 y «neutral» 0, ponderadas por la importancia que les das. En las dos preguntas de elección (modelo económico y modelo territorial), cada opción tiene un valor fijo en el eje, que es una convención de esta herramienta. La afinidad en un eje es 1 − |tu posición − la de la candidatura| / 2, y la afinidad de fondo, la media de los ejes que has respondido ponderada por la importancia media que das a cada uno; hacen falta al menos tres ejes.</p>' +
        '<p>«Fuera del espectro» significa que tu posición supera en más de ' + fd(SPECTRUM_MARGIN) + ' puntos a la candidatura más extrema de ese eje; «ninguna cerca», que la más próxima está a más de ' + fd(GAP_D) + '. Una combinación de dos ejes se señala cuando la candidatura más cercana en el plano está a ' + fd(PAIR_D) + ' puntos o más y al menos ' + fd(PAIR_EXCESS) + ' más lejos que la más cercana en cada eje por separado. Además, ' + DQ.filter((q) => q.pos).length + ' preguntas de fondo recogen ' + nPos + ' posiciones documentadas con votos, propuestas o declaraciones; se muestran con sus fuentes, pero no entran en la afinidad de fondo.</p>' +
        '<p>Limitaciones propias de este módulo: el CHES mide la posición de la dirección de cada partido en 2024, no la de sus votantes ni la de sus listas de 2026. Sumar – Frente Amplio usa la fila de Sumar' + (iuDiff !== null ? '; IU, integrada en el Frente Amplio, tiene fila propia y difiere de ella en una media de ' + fd(iuDiff) + ' puntos por eje' : '') + '. Adelante Andalucía no figura en el CHES. En el eje del islam, una de las dos variables mide cuánto pesa la retórica contra el islam en el discurso del partido, no su posición; en el territorial, el CHES no distingue entre más autogobierno e independencia, por lo que todos los partidos nacionalistas aparecen juntos en el extremo. Tus posiciones salen de tu grado de acuerdo con afirmaciones y las de los partidos, de valoraciones de expertos: las escalas no son idénticas y las distancias son aproximadas.</p>' +
        srcLine(['ches24', 'ches24a', 'ches24d', 'ches24c'], true) +
        '<h3 class="h-m">5. Medidas contra el sesgo</h3>' +
        '<ul class="plain">' +
          '<li>Las afirmaciones están equilibradas: aproximadamente la mitad se formulan desde posiciones de izquierda y la otra mitad desde la derecha, para neutralizar la tendencia a responder «de acuerdo».</li>' +
          '<li>Cada pregunta ofrece contexto factual y un argumento a favor y otro en contra, redactados por igual.</li>' +
          '<li>Las posiciones de los partidos se ocultan hasta que respondes.</li>' +
          '<li>Los partidos se ordenan por encuestas o por afinidad, nunca por preferencia editorial; no se usan los colores de los partidos.</li>' +
          '<li>Las fuentes proceden de medios de distinta orientación, verificadores y documentos oficiales; los medios de parte se citan junto a otros cuando el dato es discutido.</li>' +
          '<li>En los ejes de fondo, las posiciones de las candidaturas no las codifica esta herramienta: proceden de una encuesta académica independiente (CHES 2024) y se usan sin retoques.</li>' +
        '</ul>' +
        '<h3 class="h-m">6. Limitaciones</h3>' +
        '<ul class="plain">' +
          '<li>Los programas para el 29-N se publicarán durante la campaña (del 13 al 27 de noviembre): algunas posiciones pueden cambiar.</li>' +
          '<li>Las coaliciones territoriales (por ejemplo, Compromís–Front Valencià o Unidad del Pueblo Canario) se evalúan con las posiciones de sus socios estatales.</li>' +
          '<li>Las posiciones inferidas (evidencia baja) cuentan la mitad, pero pueden contener errores de interpretación.</li>' +
          '<li>El historial depende de los casos seleccionados; consulta siempre el número de casos que sustenta cada índice.</li>' +
          '<li>Afinidad no es recomendación de voto: el voto depende también de candidatos, gestión, voto útil y otros factores.</li>' +
        '</ul>' +
        '<h3 class="h-m">7. Actualizar los datos</h3>' +
        '<p>La herramienta lee cinco ficheros de la carpeta <span class="mono">datos/</span>: <span class="mono">partidos.js</span> (candidaturas y ámbitos), <span class="mono">preguntas.js</span> (preguntas, contexto y posiciones), <span class="mono">ejes.js</span> (ejes de fondo, sus preguntas y las medias del CHES), <span class="mono">fiabilidad.js</span> (casos de historial y veredictos) y <span class="mono">fuentes.js</span> (registro de fuentes). Cada posición y cada caso citan fuentes por su identificador, así que basta con añadir la fuente y actualizar la entrada cuando se publiquen los programas.</p>' +
        '<h3 class="h-m">Todas las fuentes</h3>' + srcHtml +
      '</article>';
  }

  /* ───────── código de respuestas ───────── */
  /* C2.<región>.<versión>.<47 dígitos hex: medidas>.<dígitos base 36: ejes de fondo>. Se aceptan también los códigos C1 (solo medidas). */
  const B36 = '0123456789abcdefghijklmnopqrstuvwxyz';
  const MODE_CODE = { rapido: 'r', completo: 'c', fondo: 'f', todo: 't' };
  function encodeAnswers() {
    const digits = D.questions.map((q) => {
      const a = S.answers[q.id];
      if (!a) return '0';
      const base = a.v + 3; // 1..5
      const off = a.w === 1 ? 0 : a.w === 0.5 ? 5 : 10;
      return (base + off).toString(16);
    }).join('');
    const deep = DQ.map((q) => {
      const a = S.answers[q.id];
      if (!a) return '0';
      const off = a.w === 1 ? 0 : a.w === 0.5 ? 1 : 2;
      return B36[1 + (q.type === 'choice' ? a.o : a.v + 2) * 3 + off];
    }).join('');
    return 'C2.' + S.region + '.' + MODE_CODE[S.mode] + '.' + digits + '.' + deep;
  }
  function decodeAnswers(code) {
    const m = /^C([12])\.([A-Z]{2})\.([rcft])\.([0-9a-f]+)(?:\.([0-9a-z]+))?$/i.exec((code || '').trim());
    if (!m || m[4].length !== D.questions.length) return null;
    if (m[1] === '2' ? !m[5] || m[5].length !== DQ.length : m[5]) return null;
    const answers = {};
    D.questions.forEach((q, i) => {
      const d = parseInt(m[4][i], 16);
      if (!d) return;
      const off = d > 10 ? 10 : d > 5 ? 5 : 0;
      answers[q.id] = { v: d - off - 3, w: off === 0 ? 1 : off === 5 ? 0.5 : 2 };
    });
    if (m[5]) DQ.forEach((q, i) => {
      const d = B36.indexOf(m[5][i].toLowerCase());
      if (d <= 0) return;
      const off = (d - 1) % 3, base = Math.floor((d - 1) / 3);
      const w = off === 0 ? 1 : off === 1 ? 0.5 : 2;
      if (q.type === 'choice') { if (base < q.options.length) answers[q.id] = { o: base, w }; }
      else if (base <= 4) answers[q.id] = { v: base - 2, w };
    });
    const ml = m[3].toLowerCase();
    return { region: D.regions.some((r) => r.id === m[2].toUpperCase()) ? m[2].toUpperCase() : 'ES', mode: Object.keys(MODE_CODE).find((k) => MODE_CODE[k] === ml) || 'rapido', answers };
  }
  function summaryText() {
    const ans = activeAnswers();
    const scores = rankScores(ans, resultParties()).filter((r) => r.ok);
    const lines = ['Cotejo 29-N · ' + (S.example ? 'informe de ejemplo (perfil ficticio)' : 'mis resultados') + ' · datos a ' + fmtDate(D.meta.updated), countMain(ans) + ' respuestas · ' + regionName(), ''];
    scores.forEach((r, i) => {
      const cum = relStats(r.p.id, null, 'cum'), coh = relStats(r.p.id, null, 'coh');
      lines.push((i + 1) + '. ' + shortName(r.p) + ': ' + pct(r.aff) + '% de afinidad · cumplimiento ' + idxTxt(cum) + ' · coherencia ' + idxTxt(coh));
    });
    if (!S.example && countDeep(S.answers) >= MIN_DEEP) {
      const dsc = deepScores(S.answers, deepParties()).filter((r) => r.ok).slice(0, 3);
      if (dsc.length) lines.push('', 'Ejes de fondo (CHES 2024), más cercanas: ' + dsc.map((r) => shortName(r.p) + ' ' + pct(r.aff) + '%').join(', ') + '.');
    }
    lines.push('', 'Afinidad no es recomendación de voto. Posiciones basadas en votaciones, precampaña y programas de 2023.');
    return lines.join('\n');
  }
  function copyText(text, btn) {
    const done = (ok) => {
      if (!btn) return;
      const old = btn.textContent;
      btn.textContent = ok ? 'Copiado' : 'No se pudo copiar';
      setTimeout(() => { btn.textContent = old; }, 1600);
    };
    try {
      navigator.clipboard.writeText(text).then(() => done(true), () => { fallbackCopy(text); done(false); });
    } catch (e) { fallbackCopy(text); done(false); }
  }
  function fallbackCopy(text) {
    let box = document.getElementById('copy-fallback');
    if (!box) {
      box = document.createElement('textarea');
      box.id = 'copy-fallback';
      box.className = 'copy-fallback';
      box.setAttribute('aria-label', 'Texto para copiar');
      box.readOnly = true;
      const host = document.querySelector('.res-head') || app;
      host.appendChild(box);
    }
    box.value = text;
    box.hidden = false;
    box.focus();
    box.select();
  }

  /* ───────── eventos ───────── */
  document.addEventListener('click', (ev) => {
    const tab = ev.target.closest('[role="tab"][data-view]');
    if (tab) { setView(tab.dataset.view); return; }
    const vlink = ev.target.closest('[data-view-link]');
    if (vlink) { ev.preventDefault(); setView(vlink.dataset.viewLink); return; }
    const t = ev.target.closest('[data-action]');
    if (!t || t.disabled) return;
    const act = t.dataset.action;
    const list = qList();
    const q = list[S.idx];
    switch (act) {
      case 'answer': {
        const v = +t.dataset.v;
        const prev = S.answers[q.id];
        S.answers[q.id] = { v, w: prev ? prev.w : 1 };
        delete S.skipped[q.id];
        if (q.deep) S.deepExample = false; else S.example = false;
        S.focusId = 'opt-' + (v + 2);
        render();
        break;
      }
      case 'choose': {
        const o = +t.dataset.o;
        const prev = S.answers[q.id];
        S.answers[q.id] = { o, w: prev ? prev.w : 1 };
        delete S.skipped[q.id];
        S.deepExample = false;
        S.focusId = 'copt-' + o;
        render();
        break;
      }
      case 'imp':
        if (S.answers[q.id]) { S.answers[q.id].w = +t.dataset.w; S.focusId = t.id; render(); }
        break;
      case 'skip':
        delete S.answers[q.id];
        S.skipped[q.id] = true;
        if (S.idx < list.length - 1) S.idx++;
        S.focusId = 'btn-next';
        render();
        break;
      case 'reveal': S.revealed[q.id] = true; render(); break;
      case 'prev': if (S.idx > 0) { S.idx--; S.focusId = 'btn-prev'; render(); } break;
      case 'next':
        if (S.idx < list.length - 1) { S.idx++; S.focusId = 'btn-next'; render(); scrollBallot(); }
        else setView(S.mode === 'fondo' ? 'ejes' : 'resultados');
        break;
      case 'goto': S.idx = +t.dataset.i; render(); scrollBallot(); break;
      case 'mode': {
        const cur = q && q.id;
        S.mode = MODES.includes(t.dataset.v) ? t.dataset.v : 'rapido';
        const nl = qList();
        const pos = nl.findIndex((x) => x.id === cur);
        S.idx = pos >= 0 ? pos : Math.max(0, nl.findIndex((x) => !S.answers[x.id]));
        S.focusId = t.id;
        render();
        break;
      }
      case 'go-results': setView('resultados'); break;
      case 'go-deep': setView('ejes'); break;
      case 'deep-start': {
        S.mode = 'fondo';
        S.idx = Math.max(0, DQ.findIndex((x) => !S.answers[x.id]));
        setView('cuestionario');
        break;
      }
      case 'copy-deep': copyText(deepSummaryText(), t); break;
      case 'dmap-pair': S.dmapX = t.dataset.x; S.dmapY = t.dataset.y; render(); scrollToId('dmap'); break;
      case 'to-quiz': setView('cuestionario'); break;
      case 'reset':
        if (t.dataset.confirm === '1') { S.answers = {}; S.skipped = {}; S.revealed = {}; S.idx = 0; render(); }
        else { t.dataset.confirm = '1'; t.textContent = 'Pulsa de nuevo para borrar'; setTimeout(() => { if (t.isConnected) { t.dataset.confirm = ''; t.textContent = 'Borrar mis respuestas'; } }, 3000); }
        break;
      case 'example-off': S.example = false; render(); break;
      case 'mapy': S.mapY = t.dataset.v; S.focusId = t.id; render(); break;
      case 'reldim': S.relDim = t.dataset.v; S.focusId = t.id; render(); break;
      case 'dcat': S.detailCat = t.dataset.v; render(); break;
      case 'copy-summary': copyText(summaryText(), t); break;
      case 'copy-code': copyText(encodeAnswers(), t); break;
      case 'paste-open': S.pasteOpen = true; S.focusId = 'paste-code'; render(); break;
      case 'paste-close': S.pasteOpen = false; render(); break;
      case 'rel-cell': S.relParty = t.dataset.p; S.relArea = t.dataset.a; render(); scrollToId('rel-detail'); break;
      case 'rel-party': S.relParty = t.dataset.p; S.relArea = 'all'; render(); scrollToId('rel-detail'); break;
      case 'rel-area': S.relArea = t.dataset.v; render(); break;
      case 'rel-party-go': S.relParty = t.dataset.p; S.relArea = 'all'; setView('fiabilidad'); scrollToId('rel-detail'); break;
      default: break;
    }
  });

  document.addEventListener('change', (ev) => {
    const t = ev.target;
    if (!t.dataset || !t.dataset.change) return;
    if (t.dataset.change === 'region') { S.region = t.value; S.focusId = 'sel-region'; render(); }
    if (t.dataset.change === 'relp') { S.relParty = t.value; S.relArea = 'all'; S.focusId = 'sel-relp'; render(); }
    if (t.dataset.change === 'relw') { S.relWeighted = t.checked; S.focusId = 'chk-relw'; render(); }
    if (t.dataset.change === 'dmapx' || t.dataset.change === 'dmapy') {
      const cur = $('#dmapx'), other = $('#dmapy');
      S.dmapX = cur ? cur.value : S.dmapX;
      S.dmapY = other ? other.value : S.dmapY;
      S.focusId = t.id;
      render();
    }
  });

  document.addEventListener('submit', (ev) => {
    const f = ev.target.closest('[data-form="paste"]');
    if (!f) return;
    ev.preventDefault();
    const res = decodeAnswers($('#paste-code').value);
    if (!res) { const msg = $('#paste-msg'); if (msg) msg.textContent = 'El código no es válido. Debe empezar por «C2.» (o «C1.» si es anterior) y copiarse entero, sin espacios.'; return; }
    S.answers = res.answers; S.region = res.region; S.mode = res.mode; S.skipped = {}; S.example = false; S.deepExample = false; S.pasteOpen = false;
    render();
  });

  /* Grupos de opciones (role=radio): las flechas mueven y seleccionan */
  document.addEventListener('keydown', (ev) => {
    const r = ev.target.closest && ev.target.closest('[role="radio"]');
    if (!r || !['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(ev.key)) return;
    const group = r.closest('[role="radiogroup"]');
    if (!group) return;
    const radios = $$('[role="radio"]:not(:disabled)', group);
    const i = radios.indexOf(r);
    if (i < 0) return;
    const fwd = ev.key === 'ArrowRight' || ev.key === 'ArrowDown';
    const next = radios[(i + (fwd ? 1 : radios.length - 1)) % radios.length];
    ev.preventDefault();
    ev.stopImmediatePropagation();
    next.click();
  }, true);

  document.addEventListener('keydown', (ev) => {
    if (S.view !== 'cuestionario') {
      if (ev.key === 'Escape') hideTip();
      return;
    }
    const tag = (ev.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea' || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    const list = qList();
    const q = list[S.idx];
    if (q.type === 'choice' && /^[1-9]$/.test(ev.key) && +ev.key <= q.options.length) {
      const o = +ev.key - 1;
      const prev = S.answers[q.id];
      S.answers[q.id] = { o, w: prev ? prev.w : 1 };
      delete S.skipped[q.id];
      S.deepExample = false;
      S.focusId = 'copt-' + o;
      render();
      ev.preventDefault();
    } else if (q.type !== 'choice' && /^[1-5]$/.test(ev.key)) {
      const v = +ev.key - 3;
      const prev = S.answers[q.id];
      S.answers[q.id] = { v, w: prev ? prev.w : 1 };
      delete S.skipped[q.id];
      if (q.deep) S.deepExample = false; else S.example = false;
      S.focusId = 'opt-' + (v + 2);
      render();
      ev.preventDefault();
    } else if (ev.key === 'ArrowRight' && !ev.target.closest('[role="radiogroup"]')) {
      if (S.idx < list.length - 1) { S.idx++; S.focusId = 'btn-next'; render(); }
      ev.preventDefault();
    } else if (ev.key === 'ArrowLeft' && !ev.target.closest('[role="radiogroup"]')) {
      if (S.idx > 0) { S.idx--; S.focusId = 'btn-prev'; render(); }
      ev.preventDefault();
    }
  });

  /* Pestañas: navegación con flechas */
  const tablist = $('[role="tablist"]');
  if (tablist) {
    tablist.addEventListener('keydown', (ev) => {
      if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
      ev.stopPropagation();
      const tabs = $$('[role="tab"]', tablist);
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const n = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      n.focus();
      setView(n.dataset.view, true);
      ev.preventDefault();
    });
  }

  /* Tooltips */
  document.addEventListener('pointerover', (ev) => { const t = ev.target.closest('[data-tip]'); if (t) showTip(t, ev); });
  document.addEventListener('pointermove', (ev) => { const t = ev.target.closest('[data-tip]'); if (t) showTip(t, ev); });
  document.addEventListener('pointerout', (ev) => { const t = ev.target.closest('[data-tip]'); if (t && !t.contains(ev.relatedTarget)) hideTip(); });
  document.addEventListener('focusin', (ev) => { const t = ev.target.closest('[data-tip]'); if (t) showTip(t, ev); else hideTip(); });
  window.addEventListener('scroll', hideTip, { passive: true });
  /* Al cambiar el ancho, se vuelven a dibujar las franjas de los ejes con el nuevo tamaño */
  let resizeT = null, lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (Math.abs(window.innerWidth - lastW) < 8) return;
    lastW = window.innerWidth;
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { hideTip(); hydrate(); }, 120);
  });

  function scrollBallot() {
    const b = $('.ballot');
    if (!b) return;
    const r = b.getBoundingClientRect();
    if (r.top < 0 || r.top > window.innerHeight * 0.6) b.scrollIntoView({ block: 'start', behavior: 'auto' });
  }
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ block: 'start', behavior: 'auto' });
  }

  /* ───────── arranque ───────── */
  try { document.documentElement.lang = 'es'; } catch (e) { /* sin efecto */ }
  load();
  const h = (location.hash || '').replace('#', '');
  setView(VIEWS.includes(h) ? h : 'cuestionario', true);
})();
