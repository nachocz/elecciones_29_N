/* Cotejo 29-N · Datos base: metadatos, partidos, comunidades y bloques temáticos.
   Fecha de corte de la investigación: 17-oct-2026. Ningún partido había publicado
   aún su programa oficial para el 29-N; ver metodología. */
window.COTEJO = window.COTEJO || {};

COTEJO.meta = {
  updated: '2026-10-17',
  election: '2026-11-29',
  version: '1.0',
  pollSource: 'ctx04',
  pollDate: '2026-10-15'
};

/* Escalas */
COTEJO.scale = [
  { v: -2, l: 'Muy en desacuerdo', s: '−−' },
  { v: -1, l: 'En desacuerdo', s: '−' },
  { v: 0, l: 'Neutral', s: '·' },
  { v: 1, l: 'De acuerdo', s: '+' },
  { v: 2, l: 'Muy de acuerdo', s: '++' }
];
COTEJO.importance = [
  { w: 0.5, l: 'Poco' },
  { w: 1, l: 'Normal' },
  { w: 2, l: 'Mucho' }
];
/* Peso de cada posición según la calidad de la evidencia */
COTEJO.confidence = {
  A: { w: 1, l: 'Alta', d: 'Voto parlamentario, ley aprobada o compromiso programático explícito.' },
  B: { w: 0.8, l: 'Media', d: 'Propuesta o declaración pública reciente de la dirección del partido.' },
  C: { w: 0.5, l: 'Baja', d: 'Inferida de su programa de 2023, de su ideología declarada o de votos indirectos.' }
};

COTEJO.categories = [
  { id: 'eco', name: 'Economía y fiscalidad' },
  { id: 'tra', name: 'Trabajo y pensiones' },
  { id: 'viv', name: 'Vivienda' },
  { id: 'inm', name: 'Inmigración' },
  { id: 'ter', name: 'Modelo territorial' },
  { id: 'ins', name: 'Instituciones y justicia' },
  { id: 'seg', name: 'Seguridad' },
  { id: 'igu', name: 'Igualdad y derechos' },
  { id: 'ext', name: 'Exterior y defensa' },
  { id: 'ene', name: 'Energía y clima' },
  { id: 'san', name: 'Sanidad y educación' }
];

COTEJO.axes = {
  e: { name: 'Eje económico', neg: 'Más Estado y redistribución', pos: 'Más mercado y menos impuestos' },
  t: { name: 'Eje territorial', neg: 'Más autogobierno', pos: 'Más centralización' },
  s: { name: 'Eje de valores e inmigración', neg: 'Progresista', pos: 'Conservador' }
};

COTEJO.regions = [
  { id: 'ES', name: 'Toda España (ver todos los partidos)' },
  { id: 'AN', name: 'Andalucía' },
  { id: 'AR', name: 'Aragón' },
  { id: 'AS', name: 'Asturias' },
  { id: 'IB', name: 'Illes Balears' },
  { id: 'CN', name: 'Canarias' },
  { id: 'CB', name: 'Cantabria' },
  { id: 'CL', name: 'Castilla y León' },
  { id: 'CM', name: 'Castilla-La Mancha' },
  { id: 'CT', name: 'Cataluña' },
  { id: 'VC', name: 'Comunitat Valenciana' },
  { id: 'EX', name: 'Extremadura' },
  { id: 'GA', name: 'Galicia' },
  { id: 'MD', name: 'Comunidad de Madrid' },
  { id: 'MC', name: 'Región de Murcia' },
  { id: 'NC', name: 'Navarra' },
  { id: 'PV', name: 'País Vasco' },
  { id: 'RI', name: 'La Rioja' },
  { id: 'CE', name: 'Ceuta' },
  { id: 'ML', name: 'Melilla' }
];

/* Orden: media de encuestas de 16 institutos (Demócrata, 15-oct-2026).
   poll.pct = % estimado; poll.seats = escaños medios proyectados (null si no se publica). */
COTEJO.parties = [
  {
    id: 'pp', short: 'PP', name: 'Partido Popular', cand: 'Alberto Núñez Feijóo',
    scope: 'estatal', regions: [], seats23: 137, poll: { pct: 31.7, seats: 138 },
    exp: 'Gobierno de España en 1996–2004 y 2011–2018. Gobierna la mayoría de comunidades autónomas; desde 2026, en coalición con Vox en Extremadura, Aragón y Castilla y León.',
    expSrc: ['ctx15', 'ctx16'],
    ballot: {},
    ties: [
      ['Sáhara: posición cambiante entre la «neutralidad activa» (moción de 2024) y el «respeto a las resoluciones de la ONU» (2025).', ['x06', 'pe01']],
      ['Venezuela: acusó al Gobierno de complacencia con el chavismo tras la captura de Maduro por EE.UU. (ene-2026).', ['x20']],
      ['Comercio: apoya el acuerdo UE-Mercosur y propone un tratado de libre comercio con EE.UU.', ['x22', 'pe01']]
    ]
  },
  {
    id: 'psoe', short: 'PSOE', name: 'Partido Socialista Obrero Español', cand: 'Pedro Sánchez',
    scope: 'estatal', regions: [], seats23: 121, poll: { pct: 26.8, seats: 105 },
    exp: 'Gobierno de España desde 2018 (antes 1982–1996 y 2004–2011) y varios gobiernos autonómicos. En Cataluña concurre como PSC (Jordi Hereu, nº 1 por Barcelona).',
    expSrc: ['ctx05'],
    ballot: { CT: 'En Cataluña: PSC' },
    ties: [
      ['Marruecos: giro de 2022 en favor del plan de autonomía para el Sáhara, sin votación parlamentaria; defiende una relación «pragmática».', ['x07', 'pe02']],
      ['Israel y Palestina: reconoció el Estado palestino (2024) y aprobó un embargo de armas (2025); el Centre Delàs denuncia contratos con empresas israelíes aún vigentes.', ['x10', 'v13', 'x14']],
      ['EE.UU.: choque con Trump por negarse al 5% en defensa; rechazó la intervención en Venezuela (ene-2026).', ['x01', 'x19']]
    ]
  },
  {
    id: 'vox', short: 'Vox', name: 'Vox', cand: 'Santiago Abascal',
    scope: 'estatal', regions: [], seats23: 33, poll: { pct: 18.6, seats: 66 },
    exp: 'Sin gobierno estatal. En gobiernos autonómicos con el PP en 2022/23–2024 (los abandonó en julio de 2024) y de nuevo desde 2026 en Extremadura, Aragón y Castilla y León.',
    expSrc: ['r01', 'ctx15', 'ctx16'],
    ballot: {},
    ties: [
      ['Abascal preside desde noviembre de 2024 el partido europeo Patriots for Europe, fundado por Viktor Orbán.', ['x36']],
      ['El Likud de Netanyahu fue admitido como observador en Patriots en la cumbre de Madrid (feb-2025); Abascal se reunió con Netanyahu en Jerusalén el día del reconocimiento de Palestina (may-2024).', ['x16', 'x15']],
      ['Alianza con Trump: no la revisó pese a los aranceles de 2025 y celebró la captura de Maduro (ene-2026).', ['x18', 'x21', 'x37']],
      ['Financió campañas de 2023 con un préstamo de 6,5 M€ del banco húngaro MBH; el Tribunal de Cuentas denunció falta de colaboración del banco y Anticorrupción investiga la financiación extranjera. El préstamo ya está devuelto.', ['c17', 'c18', 'c19', 'c30']]
    ]
  },
  {
    id: 'sumar', short: 'Sumar–FA', name: 'Sumar – Frente Amplio (IU, Movimiento Sumar, Más Madrid, Comuns y aliados)', cand: 'Ada Colau (propuesta el 12-oct)',
    scope: 'estatal', regions: [], seats23: 31, poll: { pct: 6.3, seats: 8 },
    exp: 'Socio del Gobierno de coalición 2023–2026 (Trabajo, Sanidad, Cultura, Consumo, Juventud). IU estuvo en el Gobierno 2020–2023 dentro de Unidas Podemos; los Comuns gobernaron Barcelona en 2015–2023. Yolanda Díaz renunció a ser candidata (feb-2026).',
    expSrc: ['ctx07', 'ctx08'],
    ballot: {
      AR: 'En Aragón: Chunta Aragonesista–Frente Amplio Aragón',
      IB: 'En Baleares: Ara Més–Front Ampli',
      CN: 'En Canarias: Unidad del Pueblo Canario (con NC-BC y Podemos)',
      VC: 'En la Comunitat Valenciana: Compromís–Front Valencià (con Podemos)',
      CT: 'En Cataluña: Comuns',
      AS: 'En Asturias: con Somos Asturies',
      NC: 'En Navarra: con Batzarre'
    },
    ties: [
      ['Sáhara: defiende la autodeterminación y llevó una iniciativa al Congreso contra la posición de su socio de Gobierno (nov-2025).', ['x08']],
      ['Defensa: se opuso al plan de 10.471 M€ (2025) y al objetivo del 5%.', ['x30']],
      ['Venezuela: condenó la intervención de EE.UU. como «violación flagrante de la soberanía».', ['x35']]
    ]
  },
  {
    id: 'podemos', short: 'Podemos', name: 'Podemos', cand: 'Irene Montero',
    scope: 'estatal', regions: [], seats23: 4, poll: { pct: 3.2, seats: 2 },
    exp: 'En el Gobierno de coalición 2020–2023 (Unidas Podemos). Desde diciembre de 2023, en el Grupo Mixto con apoyo externo intermitente. Sin acuerdo con el Frente Amplio salvo en Canarias y la Comunitat Valenciana; en Cataluña no compite (acuerdo con ERC).',
    expSrc: ['ctx05', 'ctx06', 'ctx09'],
    ballot: {
      CN: 'En Canarias: dentro de Unidad del Pueblo Canario (misma papeleta que Sumar–FA)',
      VC: 'En la Comunitat Valenciana: dentro de Compromís–Front Valencià (misma papeleta que Sumar–FA)',
      CT: 'En Cataluña no presenta lista propia (acuerdo con ERC)'
    },
    excludeIn: ['CT'],
    ties: [
      ['Rechaza el envío de armas y de tropas a Ucrania y el aumento del gasto militar.', ['x25']],
      ['Condicionó su voto al embargo de armas a Israel y terminó apoyándolo.', ['v13']]
    ]
  },
  {
    id: 'erc', short: 'ERC', name: 'Esquerra Republicana de Catalunya', cand: 'Gabriel Rufián',
    scope: 'territorial', regions: ['CT'], seats23: 7, poll: { pct: 2.2, seats: 8 },
    exp: 'Gobernó Cataluña (Pere Aragonès, 2021–2024). Socio de investidura de Sánchez (2023) y de Illa (2024). Para el 29-N, acuerdo con Podemos.',
    expSrc: ['t04', 'ctx05'],
    ballot: {},
    ties: []
  },
  {
    id: 'salf', short: 'SALF', name: 'Se Acabó La Fiesta', cand: 'Alvise Pérez',
    scope: 'estatal', regions: [], seats23: 0, poll: { pct: 1.7, seats: null },
    exp: 'Sin experiencia de gobierno. Fundado en 2024: obtuvo 3 eurodiputados, pero los otros dos abandonaron el partido en 2025. No entró en las Cortes de Castilla y León (1,4%, mar-2026).',
    expSrc: ['c26', 'c27'],
    ballot: {},
    ties: [
      ['Sus otros dos eurodiputados se integraron en el grupo de Meloni (ECR) tras romper con Alvise (2025).', ['c26']],
      ['Votó contra el plan europeo de rearme y contra una resolución de apoyo a Ucrania (mar-2025).', ['pe06']]
    ]
  },
  {
    id: 'junts', short: 'Junts', name: 'Junts per Catalunya', cand: 'Míriam Nogueras',
    scope: 'territorial', regions: ['CT'], seats23: 7, poll: { pct: 1.6, seats: 6 },
    exp: 'Gobernó Cataluña hasta 2022. Socio de investidura de Sánchez (2023) hasta su ruptura en octubre de 2025; descarta pactar un gobierno PP-Vox.',
    expSrc: ['pe08', 'ctx17'],
    ballot: {},
    ties: []
  },
  {
    id: 'bildu', short: 'EH Bildu', name: 'Euskal Herria Bildu', cand: 'Mertxe Aizpurua (previsiblemente)',
    scope: 'territorial', regions: ['PV', 'NC'], seats23: 6, poll: { pct: 1.4, seats: 7 },
    exp: 'Gobierna municipios y la alcaldía de Pamplona (desde dic-2023). Socio estable del Gobierno en la legislatura.',
    expSrc: ['p06', 'pe10'],
    ballot: {},
    ties: []
  },
  {
    id: 'pnv', short: 'PNV', name: 'Partido Nacionalista Vasco (EAJ-PNV)', cand: 'Por decidir (Maribel Vaquero entre las opciones)',
    scope: 'territorial', regions: ['PV'], seats23: 5, poll: { pct: 0.9, seats: 5 },
    exp: 'Gobierno Vasco durante casi toda la democracia. Ha sido socio clave de gobiernos de distinto signo (Rajoy en 2018, Sánchez desde 2018).',
    expSrc: ['t01', 'pe09'],
    ballot: {},
    ties: []
  },
  {
    id: 'bng', short: 'BNG', name: 'Bloque Nacionalista Galego', cand: 'Néstor Rego (previsiblemente)',
    scope: 'territorial', regions: ['GA'], seats23: 1, poll: { pct: 0.9, seats: 2 },
    exp: 'Principal fuerza de la oposición en Galicia. Un diputado en el Congreso; logró la ley de traspaso de la AP-9 (2026).',
    expSrc: ['pe11', 'v51'],
    ballot: {},
    ties: []
  },
  {
    id: 'adelante', short: 'Adelante', name: 'Adelante Andalucía', cand: 'Por anunciar',
    scope: 'territorial', regions: ['AN'], seats23: 0, poll: { pct: 0.8, seats: 1 },
    exp: 'Sin experiencia de gobierno. Pasó de 2 a 8 escaños en el Parlamento andaluz (may-2026). Concurre sola en las ocho provincias andaluzas. Formación andalucista de izquierda anticapitalista; datos programáticos limitados.',
    expSrc: ['ctx12', 'ctx13', 'ctx19'],
    ballot: {},
    ties: [],
    limited: true
  },
  {
    id: 'cc', short: 'CC', name: 'Coalición Canaria', cand: 'Cristina Valido (previsiblemente)',
    scope: 'territorial', regions: ['CN'], seats23: 1, poll: { pct: 0.4, seats: 1 },
    exp: 'Gobierna Canarias en coalición con el PP desde 2023. En 2023 apoyó la investidura de Feijóo y después la de Sánchez.',
    expSrc: ['t11', 't12'],
    ballot: {},
    ties: []
  },
  {
    id: 'upn', short: 'UPN', name: 'Unión del Pueblo Navarro', cand: 'Por anunciar',
    scope: 'territorial', regions: ['NC'], seats23: 1, poll: { pct: 0.2, seats: 1 },
    exp: 'Gobernó Navarra hasta 2015. Un diputado, aliado habitual del PP en el Congreso.',
    expSrc: ['pe13'],
    ballot: {},
    ties: []
  }
];

/* Formaciones que no se evalúan, con el motivo */
COTEJO.notEvaluated = [
  ['Aliança Catalana', 'No se presenta a las generales: su dirección lo descarta pese a liderar algunas encuestas catalanas.', ['ctx10']],
  ['Partido Regionalista de Cantabria (PRC)', 'No concurre a las generales del 29-N.', ['ctx05']],
  ['Otras candidaturas (PACMA, Teruel Existe, Geroa Bai, UPL, etc.)', 'Sin representación prevista en las encuestas o con datos insuficientes para una evaluación rigurosa.', ['ctx04']]
];
