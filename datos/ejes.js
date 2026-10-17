/* Cotejo 29-N · Módulo «Ejes de fondo».
   Preguntas sobre grandes dimensiones ideológicas, más allá de las medidas que se discuten hoy.
   Las posiciones de los partidos en cada eje proceden del Chapel Hill Expert Survey 2024
   (609 politólogos, 279 partidos de 31 países, encuesta de octubre a diciembre de 2024).
   Algunas preguntas incluyen además posiciones documentadas con fuentes (campo pos, mismo formato que preguntas.js). */
window.COTEJO = window.COTEJO || {};

/* Medias de expertos del CHES 2024 (fichero CHES_2024_final_v2). Escalas 0–10, salvo eu_position (1–7).
   id: identificador del partido en el CHES. Sumar – Frente Amplio usa la fila «Sumar»; IU, integrada en el
   Frente Amplio, tiene fila propia y se guarda solo como referencia. Adelante Andalucía no figura en el CHES. */
COTEJO.ches = {
  sources: ['ches24', 'ches24a', 'ches24d', 'ches24c'],
  scores: {
    pp: { id: 502, lrecon: 7.25, environment: 5.71, climate_change: 6.38, civlib_laworder: 7.14, executive_power: 4.2, womens_rights: 5.5, lgbtq_rights: 5.5, religious_principles: 6, anti_islam: 3.5, multiculturalism: 7.47, nationalism: 6.38, eu_position: 6.44, eu_russia: 3.2, people_v_elite: 2.6, regions: 7, galtan: 7, redistribution: 6.63 },
    psoe: { id: 501, lrecon: 3.94, environment: 2.57, climate_change: 3.13, civlib_laworder: 3.29, executive_power: 4.5, womens_rights: 2.38, lgbtq_rights: 1.25, religious_principles: 2.43, anti_islam: 1, multiculturalism: 4.2, nationalism: 4.13, eu_position: 6.94, eu_russia: 4.4, people_v_elite: 3.4, regions: 3.6, galtan: 2.94, redistribution: 3.19 },
    vox: { id: 527, lrecon: 9, environment: 9.29, climate_change: 9, civlib_laworder: 9.86, executive_power: 6, womens_rights: 8.63, lgbtq_rights: 7.5, religious_principles: 8.29, anti_islam: 8.83, multiculturalism: 9.93, nationalism: 9.63, eu_position: 3.06, eu_russia: 2.4, people_v_elite: 4.8, regions: 10, galtan: 9.5, redistribution: 8.56 },
    sumar: { id: 551, lrecon: 2.27, environment: 1.71, climate_change: 1.5, civlib_laworder: 2, executive_power: 4.17, womens_rights: 2.13, lgbtq_rights: 0.25, religious_principles: 0.71, anti_islam: 0.17, multiculturalism: 2.6, nationalism: 2.13, eu_position: 5.38, eu_russia: 6.6, people_v_elite: 7.6, regions: 3.6, galtan: 1.2, redistribution: 2.06 },
    podemos: { id: 525, lrecon: 1.63, environment: 2, climate_change: 2.38, civlib_laworder: 1.57, executive_power: 4.33, womens_rights: 2, lgbtq_rights: 0.25, religious_principles: 0.57, anti_islam: 0.17, multiculturalism: 2.33, nationalism: 2.38, eu_position: 4.69, eu_russia: 8, people_v_elite: 8.2, regions: 3, galtan: 1.44, redistribution: 1.69 },
    erc: { id: 511, lrecon: 2.86, environment: 2.57, climate_change: 3.4, civlib_laworder: 2.67, executive_power: 5, womens_rights: 2.57, lgbtq_rights: 2, religious_principles: 1.29, anti_islam: 1.2, multiculturalism: 4.64, nationalism: 5.14, eu_position: 5.71, eu_russia: 5.67, people_v_elite: 6, regions: 0, galtan: 2.57, redistribution: 3.33 },
    salf: { id: 552, lrecon: 8.43, environment: 9, climate_change: 8.5, civlib_laworder: 8.6, executive_power: 6, womens_rights: 7.83, lgbtq_rights: 6.67, religious_principles: 9.33, anti_islam: 7.67, multiculturalism: 9.62, nationalism: 9, eu_position: 2.8, eu_russia: 3, people_v_elite: 9, regions: 8, galtan: 8.43, redistribution: 8.31 },
    junts: { id: 550, lrecon: 6.33, environment: 4.29, climate_change: 5.8, civlib_laworder: 5.83, executive_power: 6.2, womens_rights: 4.14, lgbtq_rights: 4.67, religious_principles: 4.67, anti_islam: 4.2, multiculturalism: 7.62, nationalism: 6.57, eu_position: 5.64, eu_russia: 4.67, people_v_elite: 6, regions: 0, galtan: 5.93, redistribution: 6.27 },
    bildu: { id: 524, lrecon: 2.5, environment: 2.57, climate_change: 2.57, civlib_laworder: 2.43, executive_power: 4, womens_rights: 2.43, lgbtq_rights: 2.25, religious_principles: 0.67, anti_islam: 0.2, multiculturalism: 4, nationalism: 5, eu_position: 5.07, eu_russia: 7, people_v_elite: 6.75, regions: 0, galtan: 2.2, redistribution: 2.44 },
    pnv: { id: 506, lrecon: 6.2, environment: 4.43, climate_change: 5.5, civlib_laworder: 4.86, executive_power: 3.8, womens_rights: 4, lgbtq_rights: 4, religious_principles: 6.5, anti_islam: 2.6, multiculturalism: 6.5, nationalism: 5.71, eu_position: 6.07, eu_russia: 3.75, people_v_elite: 4.33, regions: 0, galtan: 6.2, redistribution: 5.5 },
    bng: { id: 513, lrecon: 2.73, environment: 2.86, climate_change: 3.29, civlib_laworder: 2.14, executive_power: 3.2, womens_rights: 2.57, lgbtq_rights: 2.5, religious_principles: 0.67, anti_islam: 0.4, multiculturalism: 3.9, nationalism: 4.86, eu_position: 5.33, eu_russia: 6.5, people_v_elite: 6.75, regions: 0, galtan: 2.53, redistribution: 2.69 },
    cc: { id: 517, lrecon: 5.87, environment: 4.25, climate_change: 4.8, civlib_laworder: 3.5, executive_power: 4.4, womens_rights: 5, lgbtq_rights: 4.33, religious_principles: 4.6, anti_islam: 4.25, multiculturalism: 6.11, nationalism: 5.4, eu_position: 5.86, eu_russia: 4.5, people_v_elite: 5, regions: 0.75, galtan: 6.17, redistribution: 5.29 },
    upn: { id: 553, lrecon: 7.07, environment: 6, climate_change: 5.4, civlib_laworder: 7.6, executive_power: 3, womens_rights: 6.14, lgbtq_rights: 5, religious_principles: 7.83, anti_islam: 5.6, multiculturalism: 7.36, nationalism: 7.14, eu_position: 5.92, eu_russia: 4.25, people_v_elite: 2, regions: 3.25, galtan: 7.23, redistribution: 6.6 },
    iu: { id: 504, lrecon: 1.6, environment: 2.29, climate_change: 2.86, civlib_laworder: 1.83, executive_power: 4.6, womens_rights: 2.75, lgbtq_rights: 2, religious_principles: 0.57, anti_islam: 0.33, multiculturalism: 2.75, nationalism: 2.25, eu_position: 4.6, eu_russia: 6.75, people_v_elite: 6.5, regions: 3.8, galtan: 2.27, redistribution: 1.6 }
  }
};

/* Ejes. comps = [variable CHES, dirección, peso]; posición = media ponderada de (x − 5) / 5 (eu_position: (x − 4) / 3),
   multiplicada por la dirección, de −1 (polo neg) a +1 (polo pos). labels: cinco tramos del eje, de −1 a +1. */
COTEJO.deepAxes = [
  { id: 'sis', name: 'Sistema económico', short: 'Economía', neg: 'Propiedad colectiva y planificación', pos: 'Libre mercado y Estado mínimo',
    comps: [['lrecon', 1, 1]],
    chesTxt: 'posición económica general: papel activo del Estado en la economía (0, extrema izquierda) o reducido (10, extrema derecha)',
    labels: ['Máximo papel del Estado', 'Más Estado', 'Equilibrio entre Estado y mercado', 'Más mercado', 'Máximo papel del mercado'] },
  { id: 'eco', name: 'Ecología y crecimiento', short: 'Ecología', neg: 'Protección ambiental ante todo', pos: 'Crecimiento ante todo',
    comps: [['environment', 1, 1], ['climate_change', 1, 1]],
    chesTxt: 'sostenibilidad ambiental y políticas climáticas, aun a costa del crecimiento (0), o crecimiento aun a su costa (10)',
    labels: ['Prioridad ecológica fuerte', 'Prioridad ecológica', 'Equilibrio', 'Prioridad al crecimiento', 'Prioridad fuerte al crecimiento'] },
  { id: 'aut', name: 'Autoridad y libertades', short: 'Autoridad', neg: 'Libertades civiles', pos: 'Orden y autoridad',
    comps: [['civlib_laworder', 1, 2], ['executive_power', 1, 1]],
    chesTxt: 'libertades civiles (0) o mano dura contra el delito (10), con peso doble, y poder ejecutivo limitado (0) o sin límites (10)',
    labels: ['Libertades civiles ante todo', 'Más libertades', 'Intermedio', 'Más orden y autoridad', 'Orden y autoridad ante todo'] },
  { id: 'val', name: 'Familia, género y moral', short: 'Valores', neg: 'Progresismo', pos: 'Tradicionalismo',
    comps: [['womens_rights', 1, 1], ['lgbtq_rights', 1, 1]],
    chesTxt: 'apoyo (0) u oposición (10) a las políticas de derechos de las mujeres y de las personas LGTBI',
    labels: ['Muy progresista', 'Progresista', 'Intermedio', 'Conservador', 'Muy conservador'] },
  { id: 'rel', name: 'Religión y Estado', short: 'Religión', neg: 'Laicidad estricta', pos: 'Religión en la vida pública',
    comps: [['religious_principles', 1, 1]],
    chesTxt: 'oposición (0) o apoyo (10) a que los principios religiosos guíen la política',
    labels: ['Laicismo estricto', 'Laico', 'Intermedio', 'Más presencia religiosa', 'Fuerte presencia religiosa'] },
  { id: 'isl', name: 'Islam y convivencia', short: 'Islam', neg: 'Pluralismo religioso', pos: 'Crítica y restricción del islam',
    comps: [['anti_islam', 1, 1], ['multiculturalism', 1, 1]],
    chesTxt: 'importancia de la retórica contra el islam en el discurso de la dirección (0 nula, 10 máxima: mide relevancia, no posición) e integración de inmigrantes por multiculturalismo (0) o asimilación (10)',
    labels: ['Pluralista', 'Más bien pluralista', 'Intermedio', 'Crítico', 'Muy crítico o restrictivo'] },
  { id: 'nac', name: 'Nación e identidad', short: 'Nación', neg: 'Cosmopolitismo', pos: 'Nacionalismo',
    comps: [['nationalism', 1, 1]],
    chesTxt: 'concepciones cosmopolitas (0) o nacionalistas (10) de la sociedad, sea cual sea la nación de referencia',
    labels: ['Cosmopolita', 'Más cosmopolita', 'Intermedio', 'Más nacionalista', 'Nacionalista'] },
  { id: 'sob', name: 'Europa y soberanía', short: 'Europa', neg: 'Más integración europea', pos: 'Más soberanía nacional',
    comps: [['eu_position', -1, 1]],
    chesTxt: 'posición general sobre la integración europea, de 1 (muy en contra) a 7 (muy a favor), invertida',
    labels: ['Muy proeuropeo', 'Proeuropeo', 'Intermedio', 'Euroescéptico', 'Muy euroescéptico'] },
  { id: 'geo', name: 'Orden internacional', short: 'Geopolítica', neg: 'Disuasión y bloque occidental', pos: 'Distensión y no alineamiento',
    comps: [['eu_russia', 1, 1]],
    chesTxt: 'relación de Europa con Rusia: más defensa frente a su agresión (0) o más comercio y diplomacia (10)',
    labels: ['Atlantista firme', 'Atlantista', 'Intermedio', 'Partidario de la distensión', 'No alineado'] },
  { id: 'dem', name: 'Democracia y élites', short: 'Democracia', neg: 'Democracia representativa', pos: 'Decisión directa del pueblo',
    comps: [['people_v_elite', 1, 1]],
    chesTxt: 'deciden los representantes elegidos (0) o «el pueblo» directamente, por ejemplo en referéndum (10)',
    labels: ['Representativo', 'Más representativo', 'Intermedio', 'Más democracia directa', 'Democracia directa ante todo'] },
  { id: 'ter', name: 'Modelo de Estado', short: 'Territorio', neg: 'Autogobierno y soberanía territorial', pos: 'Centralización',
    comps: [['regions', 1, 1]],
    chesTxt: 'apoyo (0) u oposición (10) a la descentralización política hacia regiones y municipios; no distingue entre más autogobierno e independencia',
    labels: ['Máximo autogobierno o soberanía', 'Más autogobierno', 'Modelo actual', 'Freno a la descentralización', 'Centralista'] }
];

/* Ópticas desde las que se pregunta por el islam */
COTEJO.islamFrames = {
  identitaria: { l: 'Óptica identitaria', d: 'Defensa de la identidad cultural y de la seguridad frente al islam. Suele asociarse a la derecha conservadora.' },
  laica: { l: 'Óptica laica y feminista', d: 'Igualdad entre mujeres y hombres y separación entre religión y Estado. La comparten parte de la izquierda laicista y del feminismo.' },
  pluralista: { l: 'Óptica pluralista', d: 'Libertad religiosa e igualdad de trato para las personas musulmanas. Frente al veto de Jumilla la defendieron, por ejemplo, el Gobierno y la Conferencia Episcopal.' }
};

/* Preguntas. dir: +1 si estar de acuerdo acerca al polo «pos» del eje; −1 si al polo «neg».
   axis: null = tema transversal (no encaja en un solo eje: solo cuenta con posiciones documentadas).
   type 'choice': opciones con su valor en el eje (convención de esta herramienta). frame: óptica (islam). */
COTEJO.deepQuestions = [
  /* ───── Sistema económico ───── */
  {
    id: 'd_sis0', axis: 'sis', type: 'choice',
    text: '¿Qué modelo económico se acerca más a tu ideal, al margen de lo que hoy parezca viable?',
    ctx: 'La Constitución reconoce la libertad de empresa «en el marco de la economía de mercado» (art. 38) y las candidaturas difieren en cuánto Estado, cuánta redistribución y quién controla los sectores clave. Aquí se pregunta por tu ideal: el informe te dirá qué candidaturas se acercan a él y si alguna lo representa.',
    ctxSrc: ['e38', 'ches24'],
    options: [
      { v: -1, l: 'Socialismo', d: 'Propiedad colectiva de los grandes medios de producción y planificación democrática de la economía.' },
      { v: -0.65, l: 'Socialismo democrático o ecosocialismo', d: 'Economía mixta con un gran sector público, cooperativas y democracia en la empresa.' },
      { v: -0.3, l: 'Socialdemocracia', d: 'Economía de mercado con un Estado del bienestar amplio e impuestos altos y progresivos.' },
      { v: 0.3, l: 'Economía social de mercado', d: 'Mercado con una red de protección social e impuestos moderados.' },
      { v: 0.65, l: 'Liberalismo económico', d: 'Estado reducido, impuestos bajos y poca regulación.' },
      { v: 1, l: 'Libertarismo', d: 'Estado mínimo o inexistente; casi todos los servicios en manos privadas.' }
    ]
  },
  {
    id: 'd_sis1', axis: 'sis', dir: 1,
    text: 'El capitalismo, con sus defectos, es el sistema que más prosperidad ha generado y debe seguir siendo la base de la economía.',
    ctx: 'Defensores y críticos discuten si la reducción de la pobreza mundial de las últimas décadas se debe al mercado o se produjo a pesar de él, y si el sistema es compatible con la igualdad y con los límites ecológicos.',
    pro: 'Los mercados asignan recursos con eficiencia e incentivan la innovación; sus defensores le atribuyen la salida de la pobreza de cientos de millones de personas.',
    con: 'Genera desigualdades y crisis recurrentes, concentra el poder económico y trata el trabajo y la naturaleza como mercancías.'
  },
  {
    id: 'd_sis2', axis: 'sis', dir: -1,
    text: 'Los grandes sectores estratégicos (energía, banca, grandes empresas) deberían ser de propiedad pública o colectiva.',
    ctx: 'En España la propiedad de estos sectores es mayoritariamente privada, con algunas participaciones públicas. Izquierda Unida, integrada en el Frente Amplio, se define en sus estatutos como anticapitalista y aspira a transformar el sistema capitalista en uno socialista.',
    ctxSrc: ['iu16'],
    pro: 'Los beneficios de servicios esenciales revertirían en la sociedad y su gestión respondería al interés general, no al de los accionistas.',
    con: 'Las empresas públicas tienden a ser menos eficientes, pueden usarse con fines partidistas y nacionalizarlas sería muy costoso.',
    pos: {
      sumar: [1, 'C', 'IU, que forma parte del Frente Amplio, declara en sus estatutos el objetivo de un sistema socialista; la coalición aún no ha publicado su programa.', ['iu16']]
    }
  },
  {
    id: 'd_sis3', axis: 'sis', dir: -1,
    text: 'Debería existir un límite máximo a la riqueza o a la herencia que puede acumular una persona.',
    ctx: 'Ningún país democrático fija hoy un techo de riqueza; algunos economistas proponen impuestos muy elevados sobre los grandes patrimonios o herencias.',
    pro: 'La concentración extrema de riqueza se convierte en poder político y perpetúa desigualdades entre generaciones.',
    con: 'Desincentiva el esfuerzo y la inversión, favorece la fuga de capitales y choca con el derecho de propiedad.'
  },
  {
    id: 'd_sis4', axis: 'sis', dir: 1,
    text: 'El Estado debería limitarse a la seguridad, la justicia y la defensa, y dejar casi todo lo demás —sanidad, educación, pensiones— a la iniciativa privada.',
    ctx: 'Es la tesis del «Estado mínimo» del liberalismo radical o libertarismo. En España la sanidad, la educación y las pensiones son mayoritariamente públicas.',
    pro: 'La competencia privada sería más eficiente, permitiría bajar mucho los impuestos y daría más libertad de elección a cada persona.',
    con: 'Dejaría sin protección a quien no puede pagar y dispararía la desigualdad en salud, educación y vejez.'
  },
  {
    id: 'd_sis5', axis: 'sis', dir: -1,
    text: 'Todas las personas residentes deberían recibir una renta básica universal e incondicional, trabajen o no.',
    ctx: 'España tiene desde 2020 una renta mínima condicionada a la falta de ingresos (el ingreso mínimo vital, regulado por la Ley 19/2021), no una renta básica universal.',
    ctxSrc: ['e43'],
    pro: 'Garantiza un suelo de dignidad, simplifica la burocracia y protege frente a la automatización del empleo.',
    con: 'Su coste sería enorme, podría desincentivar el trabajo y beneficia también a quien no lo necesita.'
  },

  /* ───── Ecología y crecimiento ───── */
  {
    id: 'd_eco1', axis: 'eco', dir: -1,
    text: 'En los países ricos habría que producir y consumir menos (decrecimiento) para no superar los límites del planeta.',
    ctx: 'El decrecimiento es una corriente académica y activista que duda de que el crecimiento del PIB sea compatible con los límites ecológicos; sus críticos defienden un «crecimiento verde» basado en la tecnología.',
    pro: 'Sus defensores sostienen que ninguna economía ha reducido emisiones y consumo de materiales al ritmo necesario mientras crecía, y proponen repartir mejor en lugar de producir más.',
    con: 'Sin crecimiento sería más difícil financiar el Estado del bienestar y reducir la pobreza; la tecnología puede desacoplar crecimiento y emisiones.'
  },
  {
    id: 'd_eco2', axis: 'eco', dir: 1,
    text: 'El crecimiento económico y la innovación tecnológica resolverán los problemas ambientales sin necesidad de renunciar a nuestro nivel de vida.',
    ctx: 'Es la visión del «tecnooptimismo»: confiar en la innovación (renovables, nuclear, captura de carbono) más que en cambiar los hábitos de consumo.',
    pro: 'La tecnología ha resuelto problemas que parecían insolubles y la prosperidad facilita invertir en protección ambiental.',
    con: 'Fiarlo todo a tecnologías futuras retrasa medidas urgentes, y las mejoras de eficiencia suelen compensarse con más consumo.'
  },
  {
    id: 'd_eco3', axis: 'eco', dir: -1,
    text: 'Los animales deberían tener derechos que impidan su uso en espectáculos como los toros y limiten la ganadería intensiva.',
    ctx: 'La Ley 18/2013 protege la tauromaquia como patrimonio cultural, y la ganadería intensiva es un sector económico relevante; el animalismo pide extender derechos a los animales.',
    ctxSrc: ['e44'],
    pro: 'Los animales sienten dolor; una sociedad avanzada no debería convertir su sufrimiento en espectáculo ni en industria sin límites.',
    con: 'Son tradiciones y sectores que dan empleo y forman parte de la cultura rural; los derechos son de las personas, no de los animales.'
  },

  /* ───── Autoridad y libertades ───── */
  {
    id: 'd_aut1', axis: 'aut', dir: 1,
    text: 'En tiempos de crisis, un gobierno fuerte que pudiera actuar sin tantos controles del Parlamento y de los jueces sería más eficaz.',
    ctx: 'Es un debate clásico de la democracia: la eficacia de un poder ejecutivo con las manos libres frente a los contrapesos que limitan el abuso de poder.',
    pro: 'Las emergencias exigen decisiones rápidas que los procedimientos parlamentarios y judiciales pueden bloquear.',
    con: 'Los contrapesos existen precisamente para las crisis: sin ellos, el poder tiende a abusar y a perpetuarse.'
  },
  {
    id: 'd_aut2', axis: 'aut', dir: 1,
    text: 'Para combatir el delito y el terrorismo es aceptable recortar la privacidad: videovigilancia masiva, reconocimiento facial o acceso a las comunicaciones.',
    ctx: 'El reglamento europeo de inteligencia artificial (2024) prohíbe, salvo excepciones tasadas, la identificación biométrica remota en tiempo real en espacios públicos con fines policiales.',
    ctxSrc: ['e41'],
    pro: 'La seguridad es la primera libertad; quien no tiene nada que ocultar no tiene nada que temer.',
    con: 'La vigilancia masiva se presta al abuso, cambia el comportamiento de los ciudadanos y rara vez se revierte.'
  },
  {
    id: 'd_aut3', axis: 'aut', dir: -1,
    text: 'El consumo de drogas por adultos, como el cannabis, debería ser legal y regulado en lugar de perseguido.',
    ctx: 'El Congreso rechazó tramitar la regulación del cannabis para uso adulto en 2021 (propuesta de Más País) y en 2023 (de ERC), con los votos en contra de PSOE, PP y Vox; el PSOE defiende solo el uso medicinal.',
    ctxSrc: ['e01', 'e02', 'e03'],
    pro: 'Quita el negocio a las mafias, permite controlar la calidad y respeta la libertad de cada adulto sobre su cuerpo.',
    con: 'Normaliza el consumo, en especial entre los jóvenes, y aumenta los riesgos para la salud mental.',
    pos: {
      psoe: [-1, 'A', 'Votó contra tramitar la regulación del uso adulto (2021 y 2023); defiende solo el uso medicinal.', ['e01', 'e03']],
      pp: [-1, 'A', 'Votó en contra (2021 y 2023).', ['e01', 'e03']],
      vox: [-2, 'A', 'Votó en contra (2021 y 2023).', ['e01', 'e03']],
      sumar: [2, 'B', 'Más País, hoy en el Frente Amplio, presentó la ley de 2021.', ['e01', 'e02']],
      podemos: [2, 'B', 'Unidas Podemos votó a favor de tramitar la ley de 2021.', ['e01']],
      erc: [2, 'A', 'Presentó la proposición de 2023.', ['e03']]
    }
  },
  {
    id: 'd_aut4', axis: 'aut', dir: 1,
    text: 'La pena de muerte debería poder aplicarse a los delitos más graves.',
    ctx: 'La Constitución abolió la pena de muerte «salvo lo que puedan disponer las leyes penales militares para tiempos de guerra» (art. 15), y la Ley Orgánica 11/1995 suprimió también esa excepción. No consta que ninguna de las candidaturas evaluadas proponga recuperarla.',
    ctxSrc: ['e38', 'e39'],
    pro: 'Sus partidarios la ven como un castigo proporcionado para crímenes atroces y una forma de disuasión.',
    con: 'Es irreversible ante errores judiciales, no hay evidencia sólida de que disuada más que otras penas y vulnera el derecho a la vida.'
  },
  {
    id: 'd_aut5', axis: 'aut', dir: -1,
    text: 'La libertad de expresión debería amparar también las opiniones que ofenden, como las burlas a la religión, a la Corona o a los símbolos de España.',
    ctx: 'El Código Penal castiga las ofensas a los sentimientos religiosos (art. 525), las injurias a la Corona (arts. 490 y 491) y los ultrajes a España y sus símbolos (art. 543). En junio de 2026, PSOE y Sumar anunciaron un acuerdo para suprimir esos delitos en una proposición de ley que Sumar había registrado a finales de 2023.',
    ctxSrc: ['e46', 'e36', 'e37'],
    pro: 'La libertad de expresión que importa es la que protege lo que molesta; castigar las ofensas permite perseguir la sátira y la crítica.',
    con: 'Burlarse de creencias o símbolos compartidos puede herir gravemente a muchas personas y alimentar el odio; la ley debe poner límites.',
    pos: {
      sumar: [2, 'A', 'Registró en 2023 la proposición para suprimir los delitos de ofensas religiosas, injurias a la Corona y ultrajes a España.', ['e36', 'e37']],
      psoe: [1, 'B', 'Pactó con Sumar en junio de 2026 suprimir esos delitos, tras casi tres años de prórrogas en el Congreso.', ['e36', 'e37']]
    }
  },

  /* ───── Familia, género y moral ───── */
  {
    id: 'd_val1', axis: 'val', dir: 1,
    text: 'La familia formada por un padre, una madre y sus hijos debería ser el modelo que el Estado proteja y promueva de forma preferente.',
    ctx: 'España reconoce el matrimonio entre personas del mismo sexo desde 2005. El conservadurismo social defiende dar prioridad a la familia formada por un padre y una madre; sus críticos, que el Estado proteja por igual a todas.',
    ctxSrc: ['e42'],
    pro: 'Es la base de la natalidad y de la transmisión de valores; protegerla beneficia a toda la sociedad.',
    con: 'El Estado debe tratar por igual a todas las familias; priorizar una discrimina a las demás y a sus hijos.'
  },
  {
    id: 'd_val2', axis: 'val', dir: -1,
    text: 'La escuela debe educar activamente en igualdad de género y diversidad sexual, aunque algunas familias no estén de acuerdo.',
    ctx: 'En 2020, Vox exigió en la Región de Murcia el «pin parental» —que las familias autoricen antes las charlas sobre cuestiones morales o afectivo-sexuales— y el Gobierno de España lo llevó a los tribunales.',
    ctxSrc: ['e34', 'e35'],
    pro: 'Previene el acoso y la violencia y prepara al alumnado para convivir en una sociedad diversa.',
    con: 'La educación moral y sexual corresponde en primer lugar a las familias, no al Estado.',
    pos: {
      vox: [-2, 'B', 'Exigió en 2020 el «pin parental» en Murcia para que las familias autoricen antes esas charlas.', ['e34', 'e35']],
      psoe: [2, 'B', 'Su Gobierno recurrió el «pin parental» de Murcia ante los tribunales (2020).', ['e34']]
    }
  },
  {
    id: 'd_val3', axis: 'val', dir: 1,
    text: 'Las diferencias entre hombres y mujeres en sus papeles sociales responden sobre todo a la naturaleza, no a la cultura.',
    ctx: 'Es uno de los debates de fondo entre el feminismo, que subraya el peso de la educación y las normas sociales, y el conservadurismo, que destaca las diferencias biológicas.',
    pro: 'Sus defensores señalan diferencias biológicas que se observan en todas las culturas.',
    con: 'Sus críticos recuerdan que esos papeles han cambiado mucho en pocas décadas, lo que muestra su origen cultural.'
  },

  /* ───── Religión y Estado ───── */
  {
    id: 'd_rel1', axis: 'rel', dir: -1,
    text: 'La Iglesia católica debería perder sus privilegios: los acuerdos con la Santa Sede, la casilla del IRPF y la religión confesional en la escuela.',
    ctx: 'Los acuerdos de 1979 con la Santa Sede regulan, entre otras cosas, la financiación de la Iglesia y la enseñanza de la religión. Podemos pidió en 2022 denunciarlos; en 2012 el PSOE se planteó revisarlos en su congreso y el PP lo rechazó.',
    ctxSrc: ['e12', 'e14'],
    pro: 'Un Estado aconfesional no debería financiar ni dar un estatus especial a una confesión concreta.',
    con: 'La Iglesia presta servicios sociales y educativos y forma parte de la tradición mayoritaria; los acuerdos tienen rango de tratado internacional.',
    pos: {
      podemos: [2, 'B', 'Pidió en el Congreso denunciar y derogar los acuerdos con la Santa Sede (proposición no de ley, 2022).', ['e12']],
      sumar: [2, 'C', 'IU, hoy en el Frente Amplio, pidió denunciar los acuerdos en 2012, y Yolanda Díaz firmó en 2017 la propuesta de Unidos Podemos para acabar con los privilegios de la Iglesia.', ['e14', 'e13']],
      psoe: [0, 'C', 'Su congreso de 2012 se planteó revisar los acuerdos, pero no lo ha hecho en el Gobierno.', ['e14']],
      pp: [-2, 'C', 'Rechazó en 2012 revisar los acuerdos: «no genera empleo, pero sí puede generar conflictos».', ['e14']]
    }
  },
  {
    id: 'd_rel2', axis: 'rel', dir: 1,
    text: 'Las raíces y los valores cristianos deberían inspirar las leyes y la vida pública de España.',
    ctx: 'La Constitución establece que «ninguna confesión tendrá carácter estatal» y que los poderes públicos cooperarán con la Iglesia católica y las demás confesiones (art. 16).',
    ctxSrc: ['e38'],
    pro: 'La tradición cristiana está en la base de los valores europeos de dignidad y solidaridad.',
    con: 'En una sociedad plural las leyes deben basarse en principios compartidos por creyentes y no creyentes.'
  },
  {
    id: 'd_rel3', axis: 'rel', dir: -1,
    text: 'Los símbolos religiosos de cualquier confesión deberían retirarse de las instituciones públicas, como escuelas, hospitales o actos oficiales.',
    ctx: 'Francia aplica una laicidad estricta que excluye los símbolos religiosos de la escuela pública y de la administración; en España la cuestión no tiene una regulación general.',
    pro: 'La neutralidad del Estado exige que nadie se sienta excluido en las instituciones que son de todos.',
    con: 'Los símbolos tradicionales forman parte de la cultura y retirarlos es una forma de hostilidad hacia la religión.',
    pos: {
      sumar: [2, 'C', 'IU, hoy en el Frente Amplio, pidió en 2012 retirar los símbolos religiosos de los actos oficiales.', ['e14']]
    }
  },

  /* ───── Islam y convivencia (tres ópticas) ───── */
  {
    id: 'd_isl1', axis: 'isl', dir: 1, frame: 'identitaria',
    text: 'La expansión del islam es una amenaza para la identidad y los valores de España y de Europa.',
    ctx: 'En 2025, PP y Vox aprobaron en Jumilla (Murcia) vetar celebraciones religiosas como la Fiesta del Cordero en las instalaciones deportivas municipales; la Conferencia Episcopal lo criticó y el Gobierno lo impugnó.',
    ctxSrc: ['e15', 'e18', 'e17'],
    pro: 'Sus defensores ven en el islam político valores incompatibles con la democracia liberal y temen la formación de sociedades paralelas.',
    con: 'Atribuir a todos los musulmanes las ideas de una minoría radical alimenta el racismo y vulnera la libertad religiosa.',
    pos: {
      vox: [2, 'B', '«Menos fiestas del cordero, menos mezquitas» (Abascal, 2024); en Sevilla rechazó una mezquita: «No queremos un centro de islamización» (2026).', ['e25', 'e26']],
      pp: [0, 'C', 'Defendió el veto de Jumilla (2025), pero Feijóo rechaza prohibir el velo y su Gobierno municipal en Sevilla tramitó la licencia de una mezquita (2026).', ['e15', 'e19', 'e26']]
    }
  },
  {
    id: 'd_isl6', axis: 'isl', dir: 1, frame: 'identitaria',
    text: 'Las mezquitas deberían estar sometidas a una vigilancia especial del Estado, distinta de la de otros lugares de culto.',
    ctx: 'La vigilancia de la radicalización yihadista corresponde hoy a las fuerzas de seguridad, como la de cualquier otro delito. En 2023, Vox propuso en el Congreso investigar y, en su caso, cerrar las mezquitas donde se propague la radicalización islamista.',
    ctxSrc: ['e27'],
    pro: 'La radicalización yihadista se difunde a menudo en centros y redes concretos; vigilarlos protege a todos, también a los musulmanes.',
    con: 'Someter a una sola confesión a vigilancia especial la estigmatiza y vulnera la igualdad; los delitos ya se persiguen con las leyes comunes.',
    pos: {
      vox: [2, 'B', 'Propuso investigar y, en su caso, cerrar las mezquitas donde se propague la radicalización islamista (2023).', ['e27']]
    }
  },
  {
    id: 'd_isl2', axis: 'isl', dir: 1, frame: 'laica',
    text: 'El velo islámico (hiyab) debería restringirse en las escuelas y en la función pública porque choca con la igualdad entre mujeres y hombres.',
    ctx: 'No hay una norma estatal y cada vez más centros lo vetan en sus reglamentos. Feijóo apoya prohibir el burka y el niqab en espacios públicos, pero no el velo; Abascal pide prohibirlo en espacios públicos, y Junts, en la enseñanza obligatoria. Parte del feminismo laico lo ve como un símbolo de desigualdad; otras feministas y muchas mujeres que lo llevan lo defienden como libertad religiosa.',
    ctxSrc: ['e24', 'e19', 'e20', 'e22'],
    pro: 'La escuela y la administración deben ser espacios neutrales y proteger a las niñas de presiones familiares o comunitarias.',
    con: 'Prohibirlo castiga a las propias mujeres, las aparta de la escuela y del empleo y vulnera su libertad religiosa.',
    pos: {
      vox: [2, 'B', 'Abascal pidió prohibir el velo en espacios públicos (2025) y Vox defendió vetarlo en el Parlament; su proposición de ley de 2026 se limita al burka y el niqab.', ['e20', 'e23', 'e21']],
      pp: [-1, 'B', 'Feijóo apoya prohibir el burka y el niqab en espacios públicos, no el velo (2025).', ['e19']],
      junts: [1, 'B', 'Propone prohibir el velo en la enseñanza obligatoria por considerarlo discriminatorio para la mujer (2025).', ['e22']],
      psoe: [-1, 'C', 'La consellera catalana de Educación, del PSC, defendió que el velo está amparado por la normativa y que vetarlo en la escuela no encaja con ella (2025).', ['e23']]
    }
  },
  {
    id: 'd_isl4', axis: 'isl', dir: 1, frame: 'laica',
    text: 'Criticar el islam por su trato a las mujeres o a las personas homosexuales es legítimo y no debería tacharse de islamofobia.',
    ctx: 'La frontera entre la crítica a una religión y el rechazo a sus fieles divide tanto a la derecha como a la izquierda: hay laicistas y feministas que reivindican esa crítica y colectivos antirracistas que alertan de su uso para estigmatizar.',
    pro: 'Ninguna religión debe quedar a salvo de la crítica en una democracia, y menos en la defensa de la igualdad.',
    con: 'En la práctica, esa crítica se dirige casi siempre contra una minoría ya discriminada y alimenta prejuicios.'
  },
  {
    id: 'd_isl3', axis: 'isl', dir: -1, frame: 'pluralista',
    text: 'Las personas musulmanas deberían tener en España los mismos derechos religiosos que las católicas: lugares de culto, enseñanza religiosa y celebraciones en espacios públicos.',
    ctx: 'La Ley 26/1992 aprobó el acuerdo de cooperación del Estado con la Comisión Islámica de España, que reconoce, entre otros, derechos sobre lugares de culto, enseñanza religiosa islámica y matrimonio.',
    ctxSrc: ['e40'],
    pro: 'La libertad religiosa es un derecho fundamental y la igualdad de trato favorece la integración.',
    con: 'Sus críticos sostienen que la expansión de mezquitas y de celebraciones en espacios públicos favorece la segregación.',
    pos: {
      vox: [-2, 'B', 'Promovió el veto a celebraciones islámicas en las instalaciones municipales de Jumilla (2025).', ['e15', 'e16']],
      pp: [-1, 'B', 'Apoyó el veto de Jumilla con una enmienda y lo defendió a escala nacional (2025).', ['e15', 'e16']],
      psoe: [1, 'B', 'El Gobierno impugnó el veto de Jumilla (2025).', ['e17']]
    }
  },
  {
    id: 'd_isl5', axis: 'isl', dir: -1, frame: 'pluralista',
    text: 'La islamofobia es hoy una forma de discriminación extendida en España que las instituciones deben combatir activamente.',
    ctx: 'Organizaciones musulmanas y antirracistas denuncian un aumento de la islamofobia, por ejemplo en los vetos al hiyab en centros escolares; otros sostienen que el término se usa a veces para silenciar críticas legítimas a la religión.',
    ctxSrc: ['e24'],
    pro: 'Las personas musulmanas sufren discriminación y un discurso público hostil que las instituciones deben combatir como cualquier otra forma de racismo.',
    con: 'El concepto es impreciso y puede usarse para frenar críticas legítimas a una religión o a prácticas contrarias a la igualdad.'
  },

  /* ───── Nación e identidad ───── */
  {
    id: 'd_nac1', axis: 'nac', dir: 1,
    text: 'Mi identidad nacional —española, catalana, vasca, gallega u otra— es una parte esencial de quién soy y debe protegerse frente a la globalización.',
    ctx: 'La pregunta no distingue de qué nación se trata: mide el peso que das a la identidad nacional, sea la española o la de otra nación con la que te identifiques.',
    pro: 'La nación da sentido de pertenencia, solidaridad entre ciudadanos y una cultura compartida que merece protegerse.',
    con: 'Las identidades nacionales son construcciones históricas que pueden excluir y enfrentar a quienes no encajan en ellas.'
  },
  {
    id: 'd_nac2', axis: 'nac', dir: -1,
    text: 'Me siento más ciudadano del mundo, o europeo, que de cualquier nación; las fronteras deberían importar cada vez menos.',
    ctx: 'El cosmopolitismo prioriza los derechos y los problemas comunes de la humanidad (clima, migraciones, pandemias) sobre las pertenencias nacionales.',
    pro: 'Los grandes problemas son globales y las identidades nacionales cerradas dificultan resolverlos.',
    con: 'La democracia y la solidaridad funcionan mejor en comunidades nacionales concretas con las que la gente se identifica.'
  },
  {
    id: 'd_nac3', axis: 'nac', dir: -1,
    text: 'España debería pedir perdón por los abusos cometidos durante la conquista y la colonización de América.',
    ctx: 'En 2019 el presidente de México pidió al Rey una disculpa por los abusos de la conquista. El Gobierno la rechazó «con toda firmeza», igual que PP, Vox y Ciudadanos; Podemos la apoyó.',
    ctxSrc: ['e30', 'e32', 'e31'],
    pro: 'Reconocer los abusos del pasado repara a los pueblos indígenas y mejora las relaciones con América Latina.',
    con: 'No tiene sentido juzgar hechos de hace cinco siglos con criterios actuales; la herencia hispana también es mestiza y compartida.',
    pos: {
      podemos: [2, 'B', 'Ione Belarra: «Tiene mucha razón en exigirle al Rey que pida perdón por los abusos» (2019).', ['e31', 'e32']],
      psoe: [-2, 'A', 'El Gobierno rechazó la carta «con toda firmeza» (2019).', ['e30']],
      pp: [-2, 'B', 'Pablo Casado calificó la petición de «inadmisible» y de «afrenta contra España» (2019).', ['e32']],
      vox: [-2, 'B', 'Abascal acusó a López Obrador de estar «contagiado de socialismo indigenista» (2019).', ['e32']]
    }
  },
  {
    id: 'd_nac4', axis: 'nac', dir: -1,
    text: 'Cualquier persona debería poder venir a vivir y trabajar libremente en España: fronteras abiertas.',
    ctx: 'La libre circulación ya existe dentro de la UE; extenderla a todo el mundo es una propuesta de algunos economistas y movimientos, pero ningún país la aplica.',
    pro: 'Moverse para buscar una vida mejor es un derecho humano y la migración libre aumentaría la riqueza mundial.',
    con: 'Desbordaría los servicios públicos y los mercados de vivienda y trabajo, y haría imposible decidir democráticamente la política migratoria.'
  },

  /* ───── Europa y soberanía ───── */
  {
    id: 'd_sob1', axis: 'sob', dir: -1,
    text: 'La Unión Europea debería convertirse en una federación —unos Estados Unidos de Europa— con gobierno y ejército comunes.',
    ctx: 'La UE combina hoy competencias comunes (moneda, comercio) con decisiones que exigen la unanimidad de los Estados (política exterior, fiscalidad).',
    pro: 'Solo una Europa unida puede pesar frente a EE. UU., China o Rusia y proteger su modelo social.',
    con: 'Alejaría el poder de los ciudadanos y diluiría la soberanía y la identidad de cada país.'
  },
  {
    id: 'd_sob2', axis: 'sob', dir: 1,
    text: 'España debería recuperar soberanía frente a la UE, aunque eso suponga salir del euro o de la Unión.',
    ctx: 'SALF plantea un referéndum de permanencia si no se renegocia la relación con la UE; Vox pide un nuevo tratado que devuelva poder a los Estados, sin proponer la salida.',
    ctxSrc: ['pe06', 'pe03'],
    pro: 'Las grandes decisiones económicas y migratorias se toman hoy en Bruselas, lejos del control de los votantes españoles.',
    con: 'Salir del euro o de la UE tendría un coste económico enorme y dejaría a España más aislada.',
    pos: {
      salf: [1, 'B', 'Propone un referéndum de permanencia si no se renegocia la relación con la UE.', ['pe06']],
      vox: [0, 'B', 'Pide devolver poder a los Estados, sin proponer la salida.', ['pe03']]
    }
  },

  /* ───── Orden internacional ───── */
  {
    id: 'd_geo1', axis: 'geo', dir: 1,
    text: 'España debería salir de la OTAN.',
    ctx: 'España entró en la OTAN en 1982 y lo ratificó en referéndum en 1986. En abril de 2026 el Congreso rechazó la moción de Podemos para convocar un nuevo referéndum de salida: la apoyaron ERC, EH Bildu y BNG; se abstuvieron Sumar y Coalición Canaria, y votaron en contra PP, PSOE, Vox, PNV, Junts y UPN.',
    ctxSrc: ['e28', 'e29'],
    pro: 'Recuperaría una política exterior propia, alejada de las guerras y del gasto militar que impulsa EE. UU.',
    con: 'Dejaría a España sin la garantía de defensa colectiva ante amenazas como Rusia o el terrorismo.',
    pos: {
      podemos: [2, 'A', 'Propuso el referéndum de salida (2026).', ['e28', 'e29']],
      erc: [1, 'A', 'Votó a favor del referéndum de salida (2026).', ['e28']],
      bildu: [1, 'A', 'Votó a favor del referéndum de salida (2026).', ['e28']],
      bng: [1, 'A', 'Votó a favor del referéndum de salida (2026).', ['e28']],
      sumar: [0, 'A', 'Se abstuvo (2026).', ['e28']],
      cc: [0, 'A', 'Se abstuvo (2026).', ['e28']],
      psoe: [-2, 'A', 'Votó en contra (2026).', ['e28']],
      pp: [-2, 'A', 'Votó en contra (2026).', ['e28']],
      vox: [-2, 'A', 'Votó en contra (2026).', ['e28']],
      pnv: [-2, 'A', 'Votó en contra (2026).', ['e28']],
      junts: [-2, 'A', 'Votó en contra (2026).', ['e28']],
      upn: [-2, 'A', 'Votó en contra (2026).', ['e28']]
    }
  },
  {
    id: 'd_geo2', axis: 'geo', dir: -1,
    text: 'Las democracias occidentales, con EE. UU. a la cabeza, son la mejor garantía de paz y libertad en el mundo.',
    ctx: 'La pregunta enfrenta la visión atlantista con la de quienes ven en la política exterior de EE. UU. una fuente de conflictos y defienden un mundo multipolar.',
    pro: 'Las alianzas democráticas han garantizado décadas de paz en Europa y frenan a regímenes autoritarios.',
    con: 'Occidente también ha promovido guerras e intervenciones, y su hegemonía no equivale a la paz ni a la libertad de otros pueblos.'
  },
  {
    id: 'd_geo3', axis: 'geo', dir: 1,
    text: 'Europa debería buscar la cooperación y el comercio con Rusia en lugar de rearmarse frente a ella.',
    ctx: 'Es la disyuntiva que el CHES 2024 planteó a los expertos para situar a cada partido: más defensa frente a Rusia o más comercio y diplomacia.',
    ctxSrc: ['ches24c'],
    pro: 'La seguridad europea es imposible sin Rusia; la escalada militar empobrece y aumenta el riesgo de guerra.',
    con: 'Tras la invasión de Ucrania, apaciguar a Rusia invitaría a nuevas agresiones; la disuasión es la mejor garantía de paz.'
  },

  /* ───── Democracia y élites ───── */
  {
    id: 'd_dem1', axis: 'dem', dir: 1,
    text: 'Las decisiones más importantes deberían tomarlas directamente los ciudadanos en referéndum, no los políticos.',
    ctx: 'Suiza celebra varios referendos vinculantes cada año; en España son excepcionales y, para las grandes decisiones políticas, consultivos (art. 92 de la Constitución).',
    ctxSrc: ['e38'],
    pro: 'Daría a los ciudadanos control real sobre las grandes decisiones y reduciría el poder de las cúpulas de los partidos.',
    con: 'Los asuntos complejos se reducen a un sí o un no, son vulnerables a la desinformación y pueden atropellar a las minorías.'
  },
  {
    id: 'd_dem2', axis: 'dem', dir: 1,
    text: 'España está gobernada por una élite —políticos, grandes empresas y medios— que no representa a la gente corriente.',
    ctx: 'Es la tesis central del populismo, tanto de izquierda («la casta») como de derecha («las élites globalistas»).',
    pro: 'Sus defensores señalan las puertas giratorias, la corrupción y la desconexión de los partidos con los problemas cotidianos.',
    con: 'Sus críticos responden que las instituciones se eligen en las urnas y que ese discurso erosiona la confianza en la democracia.'
  },
  {
    id: 'd_dem3', axis: 'dem', dir: -1,
    text: 'Los partidos y el Parlamento, con todos sus defectos, son la mejor forma de representar a la ciudadanía.',
    ctx: 'La Constitución define a los partidos como «instrumento fundamental para la participación política» (art. 6).',
    ctxSrc: ['e38'],
    pro: 'Permiten agregar intereses diversos, negociar compromisos y exigir responsabilidades en las urnas.',
    con: 'Las cúpulas de los partidos concentran demasiado poder y se alejan de lo que piensan sus votantes.'
  },

  /* ───── Modelo de Estado ───── */
  {
    id: 'd_ter0', axis: 'ter', type: 'choice',
    text: '¿Qué organización territorial prefieres para España?',
    ctx: 'La Constitución de 1978 creó el Estado autonómico. Hoy conviven candidaturas que quieren devolver competencias al Estado, mantener el modelo, federalizarlo, reconocer un Estado plurinacional o la independencia de su territorio.',
    ctxSrc: ['e38', 'pe03', 'pe02', 'pe04', 'pe07'],
    options: [
      { v: 1, l: 'Estado unitario', d: 'Suprimir las comunidades autónomas.' },
      { v: 0.5, l: 'Menos autonomía', d: 'Mantener las autonomías con menos competencias que ahora.' },
      { v: 0, l: 'Estado autonómico actual', d: 'Mantener el reparto de competencias actual.' },
      { v: -0.4, l: 'Estado federal', d: 'Más autogobierno y un Senado como cámara territorial.' },
      { v: -0.75, l: 'Estado plurinacional o confederal', d: 'Reconocer varias naciones con derecho a decidir su relación con España.' },
      { v: -1, l: 'Independencia', d: 'Que mi comunidad se convierta en un Estado independiente.' }
    ]
  },
  {
    id: 'd_ter1', axis: 'ter', dir: -1,
    text: 'Las naciones que forman parte de España, como Cataluña, el País Vasco o Galicia, deberían poder separarse si su población lo decide.',
    ctx: 'Es una formulación más amplia que la del referéndum pactado: plantea si existe un derecho a la secesión.',
    pro: 'Ningún pueblo debería permanecer en un Estado contra la voluntad mayoritaria de sus ciudadanos.',
    con: 'La soberanía corresponde al conjunto de los españoles y una secesión unilateral rompería la igualdad y la solidaridad.'
  },

  /* ───── Temas transversales (no encajan en un solo eje) ───── */
  {
    id: 'd_tr1', axis: null,
    text: 'La gestación subrogada (vientres de alquiler) debería ser legal en España, con garantías para la gestante.',
    ctx: 'La ley considera nulo el contrato de gestación por sustitución (art. 10 de la Ley 14/2006) y, desde mayo de 2025, los niños nacidos así en el extranjero ya no pueden inscribirse directamente en el Registro Civil. La rechazan buena parte del feminismo, que la considera explotación, y el conservadurismo religioso; Ciudadanos, hoy sin representación, era el único partido que defendía regularla.',
    ctxSrc: ['e45', 'e07', 'e04'],
    pro: 'Permite a muchas personas ser padres y, regulada, protegería mejor a las gestantes que el mercado internacional actual.',
    con: 'Convierte el cuerpo de las mujeres y a los bebés en objeto de contrato y se aprovecha de mujeres con pocos recursos.',
    pos: {
      psoe: [-2, 'A', 'Su Gobierno cerró en 2025 la inscripción directa de los nacidos así en el extranjero; María Jesús Montero la calificó de «explotación del cuerpo de la mujer» (2023).', ['e07', 'e04']],
      podemos: [-2, 'B', 'La rechaza desde 2018; Irene Montero la calificó de «violencia contra las mujeres» (2023).', ['e06', 'e04']],
      sumar: [-2, 'C', 'Unidas Podemos, del que procede buena parte del Frente Amplio, la rechazó como «explotación reproductiva» (2020).', ['e05']],
      vox: [-1, 'B', 'Pidió prohibirla y sancionarla en 2020; en 2023 su portavoz dijo no tener «posición tomada».', ['e05', 'e04']],
      pp: [0, 'B', 'Sin posición definida: pide un debate «sereno» (2020 y 2023).', ['e05', 'e04']]
    }
  },
  {
    id: 'd_tr2', axis: null,
    text: 'La prostitución entre adultos debería regularse como un trabajo con derechos, en lugar de abolirse.',
    ctx: 'El PSOE defiende la abolición: su ley contra el proxenetismo empezó a tramitarse en 2022 con el apoyo del PP y la división de Unidas Podemos, y fracasó en 2024 sin el apoyo de Sumar, Podemos ni el PP. El feminismo está dividido entre el abolicionismo y quienes piden derechos laborales para las trabajadoras sexuales.',
    ctxSrc: ['e08', 'e09', 'e11'],
    pro: 'Regularla daría derechos y seguridad a quienes la ejercen y separaría el trabajo voluntario de la trata.',
    con: 'La prostitución es una forma de explotación que alimenta la trata; regularla la normaliza.',
    pos: {
      psoe: [-2, 'A', 'Abolicionista: impulsó en 2022 y en 2024 una ley para castigar el proxenetismo en todas sus formas.', ['e08', 'e11']],
      pp: [-1, 'A', 'Votó a favor de tramitar la ley abolicionista en 2022, pero no la apoyó en 2024.', ['e08', 'e11']],
      sumar: [0, 'B', 'Se opuso a la ley abolicionista del PSOE (2024); los comunes ya votaron en contra en 2022.', ['e10', 'e09']],
      podemos: [0, 'A', 'Se abstuvo en 2024.', ['e11']]
    }
  },
  {
    id: 'd_tr3', axis: null,
    text: 'La Transición y la Constitución de 1978 fueron un éxito y el sistema político que crearon debe mantenerse en lo esencial.',
    ctx: 'Para unos, la Transición es un modelo de reconciliación; para otros, un pacto que dejó intactas estructuras del franquismo (el «régimen del 78»). En el acto del Día de la Constitución de 2025 no participaron Vox, Junts, ERC, EH Bildu, PNV ni BNG, por motivos distintos.',
    ctxSrc: ['e33'],
    pro: 'Trajo la democracia, la mayor etapa de prosperidad y libertad de la historia de España y un amplio autogobierno.',
    con: 'Se pactó bajo presión, sin depurar el franquismo, y bloquea debates como la forma de Estado o el derecho a decidir.',
    pos: {
      pp: [2, 'C', 'Participa en el acto institucional del Día de la Constitución.', ['e33']],
      psoe: [1, 'C', 'Participa en el acto institucional; propone reformas, como un Estado autonómico con cogobernanza.', ['e33', 'pe02']],
      vox: [1, 'C', 'Se presenta como defensor de la Constitución, pero quiere devolver competencias al Estado y no acudió al acto de 2025.', ['e33', 'pe03']],
      erc: [-2, 'C', 'No participa en el acto; aspira a la independencia de Cataluña.', ['e33', 'pe07']],
      junts: [-2, 'C', 'No participa en el acto; aspira a la independencia de Cataluña.', ['e33', 'pe08']],
      bildu: [-2, 'C', 'No participa en el acto institucional.', ['e33', 'pe10']],
      bng: [-2, 'C', 'No participa en el acto institucional.', ['e33', 'pe11']]
    }
  }
];

/* Etiquetas cortas */
COTEJO.deepShort = {
  d_sis0: 'Modelo económico ideal', d_sis1: 'El capitalismo debe ser la base', d_sis2: 'Propiedad pública de sectores clave', d_sis3: 'Límite máximo a la riqueza',
  d_sis4: 'Estado mínimo', d_sis5: 'Renta básica universal', d_eco1: 'Decrecimiento', d_eco2: 'La tecnología lo resolverá', d_eco3: 'Derechos de los animales',
  d_aut1: 'Gobierno fuerte sin contrapesos', d_aut2: 'Vigilancia frente a privacidad', d_aut3: 'Legalizar el cannabis', d_aut4: 'Pena de muerte', d_aut5: 'Libertad para ofender',
  d_val1: 'Prioridad a la familia tradicional', d_val2: 'Educación en igualdad y diversidad', d_val3: 'Papeles de género naturales',
  d_rel1: 'Fin de los privilegios de la Iglesia', d_rel2: 'Valores cristianos en las leyes', d_rel3: 'Retirar símbolos religiosos',
  d_isl1: 'El islam como amenaza', d_isl6: 'Vigilancia especial de mezquitas', d_isl2: 'Restringir el velo', d_isl4: 'Crítica al islam legítima',
  d_isl3: 'Igualdad de derechos religiosos', d_isl5: 'Combatir la islamofobia',
  d_nac1: 'Identidad nacional esencial', d_nac2: 'Ciudadano del mundo', d_nac3: 'Perdón por la conquista', d_nac4: 'Fronteras abiertas',
  d_sob1: 'Federación europea', d_sob2: 'Recuperar soberanía frente a la UE', d_geo1: 'Salir de la OTAN', d_geo2: 'Occidente como garantía', d_geo3: 'Cooperar con Rusia',
  d_dem1: 'Decidir por referéndum', d_dem2: 'Élite que no representa', d_dem3: 'Partidos y Parlamento', d_ter0: 'Modelo territorial ideal', d_ter1: 'Derecho a la secesión',
  d_tr1: 'Gestación subrogada', d_tr2: 'Regular la prostitución', d_tr3: 'Mantener el sistema del 78'
};
