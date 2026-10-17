/* Cotejo 29-N · Historial de cumplimiento y coherencia.
   Cada caso: a = área, y = fecha o periodo, t = título, p = lo prometido o afirmado,
   r = lo que ocurrió, v = veredicto, w = peso (1 normal, 2 compromiso central o de alto impacto), s = fuentes.
   La selección no es exhaustiva: prioriza compromisos verificables y de alto perfil, e incluye
   para cada partido tanto aciertos como incumplimientos. Ver metodología. */
window.COTEJO = window.COTEJO || {};

/* dim: 'cum' = cumplimiento de promesas · 'coh' = coherencia entre discurso y actos */
COTEJO.verdicts = {
  cumplida:      { l: 'Cumplida', score: 1, dim: 'cum', tone: 'ok', icon: '✓', d: 'Hizo lo que prometió.' },
  intentada:     { l: 'Intentada', score: 0.75, dim: 'cum', tone: 'mid', icon: '◐', d: 'Lo impulsó y votó, pero no logró mayoría.' },
  parcial:       { l: 'Parcial', score: 0.5, dim: 'cum', tone: 'mid', icon: '◐', d: 'Cumplió una parte relevante, no el compromiso completo.' },
  incumplida:    { l: 'Incumplida', score: 0, dim: 'cum', tone: 'bad', icon: '✕', d: 'No lo hizo pudiendo hacerlo, o lo abandonó.' },
  coherente:     { l: 'Coherente', score: 1, dim: 'coh', tone: 'ok', icon: '✓', d: 'Sus votos y actos coinciden con lo que defendía.' },
  ambigua:       { l: 'Ambigua', score: 0.5, dim: 'coh', tone: 'mid', icon: '~', d: 'Mensajes o votos contradictorios entre sí.' },
  giro:          { l: 'Giro', score: 0, dim: 'coh', tone: 'bad', icon: '↺', d: 'Hizo lo contrario de lo que había afirmado.' },
  contradiccion: { l: 'Contradicción', score: 0, dim: 'coh', tone: 'bad', icon: '✕', d: 'Sus actos contradicen su discurso.' },
  contexto:      { l: 'Contexto', score: null, dim: null, tone: 'ctx', icon: '•', d: 'Hecho relevante que no se puntúa (p. ej., causas judiciales abiertas).' }
};
COTEJO.relDims = {
  all: { l: 'Combinado', d: 'Media de todos los casos puntuables.' },
  cum: { l: 'Cumplimiento', d: '¿Hizo lo que prometió? Sobre todo depende de haber gobernado.' },
  coh: { l: 'Coherencia', d: '¿Sus votos y actos encajan con lo que dice? Evaluable también en la oposición.' }
};

COTEJO.relAreas = [
  { id: 'eco', name: 'Economía y fiscalidad' },
  { id: 'tra', name: 'Trabajo y pensiones' },
  { id: 'viv', name: 'Vivienda' },
  { id: 'inm', name: 'Inmigración' },
  { id: 'ter', name: 'Modelo territorial' },
  { id: 'pac', name: 'Pactos y alianzas' },
  { id: 'ins', name: 'Instituciones y corrupción' },
  { id: 'seg', name: 'Seguridad' },
  { id: 'igu', name: 'Igualdad y derechos' },
  { id: 'ext', name: 'Exterior y defensa' },
  { id: 'ene', name: 'Energía y clima' },
  { id: 'san', name: 'Sanidad y educación' }
];

COTEJO.reliability = {
  psoe: {
    power: 'Gobierno de España desde 2018: ha tenido capacidad para cumplir o incumplir en casi todas las áreas.',
    cases: [
      { a: 'eco', y: '2022–2024', t: 'Gravar a grandes fortunas y banca', p: 'Fiscalidad más progresiva sobre grandes patrimonios y beneficios bancarios.', r: 'Creó el Impuesto de Solidaridad de las Grandes Fortunas (2022, prorrogado) y un impuesto progresivo a la banca (nov-2024).', v: 'cumplida', w: 1, s: ['v23', 'f02'] },
      { a: 'eco', y: 'nov-2024 – ene-2025', t: 'Prórroga del gravamen a las energéticas', p: 'Se comprometió con ERC, Bildu, BNG y Podemos a prorrogarlo.', r: 'Lo incluyó en el decreto «ómnibus», que el Congreso tumbó en enero de 2025; el decreto pactado después con Junts lo dejó fuera.', v: 'intentada', w: 1, s: ['v24', 'v50', 'v57'] },
      { a: 'tra', y: '2019–2026', t: 'Salario mínimo al 60% del salario medio', p: 'Acuerdo de coalición de 2019.', r: 'El SMI pasó a 1.221 € en 14 pagas en 2026, un 66% más que en 2018.', v: 'cumplida', w: 2, s: ['p10'] },
      { a: 'tra', y: '2021', t: 'Pensiones ligadas al IPC por ley', p: 'Derogar el índice de revalorización de 2013 y garantizar el poder adquisitivo.', r: 'Ley 21/2021: revalorización anual con el IPC medio.', v: 'cumplida', w: 2, s: ['p11'] },
      { a: 'tra', y: '2019–2021', t: '«Derogar» la reforma laboral de 2012', p: 'El acuerdo de coalición hablaba de derogarla.', r: 'Reforma pactada con patronal y sindicatos (2021) que revierte partes clave (temporalidad, convenios), pero mantiene el coste del despido de 2012.', v: 'parcial', w: 2, s: ['p09'] },
      { a: 'tra', y: '2023–2025', t: 'Jornada de 37,5 horas', p: 'Pacto de Gobierno PSOE-Sumar (2023).', r: 'El proyecto fue devuelto por PP, Vox y Junts en septiembre de 2025.', v: 'intentada', w: 1, s: ['v06'] },
      { a: 'viv', y: '2019–2023', t: 'Ley estatal de vivienda', p: 'Ley con regulación de alquileres, prometida en 2019.', r: 'Aprobada en abril de 2023 (Ley 12/2023), con años de retraso.', v: 'cumplida', w: 2, s: ['v25'] },
      { a: 'viv', y: 'abr-2023 – 2025', t: '183.000 viviendas asequibles', p: 'Sánchez anunció en abril de 2023 la movilización de unos 183.000 inmuebles para alquiler asequible.', r: 'En octubre de 2024 se había entregado alrededor del 5,5%; el Gobierno contabilizaba unas 60.000 firmadas o en desarrollo.', v: 'incumplida', w: 2, s: ['p12'] },
      { a: 'viv', y: 'oct-2026', t: 'Decretos de vivienda de 2026', p: 'Prórroga de alquileres, topes y freno a desahucios.', r: 'El Congreso los derogó el 2 de octubre de 2026.', v: 'intentada', w: 1, s: ['v01'] },
      { a: 'inm', y: '2024–2026', t: 'Regularización extraordinaria', p: 'Apoyó tramitar la ILP (2024).', r: 'Aprobó el RD 316/2026, pactado con Podemos.', v: 'coherente', w: 1, s: ['v09', 'v47'] },
      { a: 'inm', y: '2025', t: 'Reparto obligatorio de menores migrantes', p: 'Corresponsabilidad de todas las comunidades.', r: 'RDL 2/2025, convalidado con Junts.', v: 'cumplida', w: 1, s: ['v11'] },
      { a: 'inm', y: '2024–2025', t: 'Competencias de inmigración para Cataluña', p: 'El Gobierno y el PSOE decían que fronteras e inmigración eran competencia «exclusiva del Estado».', r: 'Pactó con Junts una ley orgánica para delegarlas (mar-2025), que no obtuvo mayoría.', v: 'giro', w: 1, s: ['p15', 't08'] },
      { a: 'ter', y: '2023–2024', t: 'Amnistía', p: 'Antes del 23-J, Sánchez y otros dirigentes negaban que la amnistía cupiera en la Constitución.', r: 'Ley de Amnistía aprobada en mayo de 2024; Sánchez admitió un «cambio de opinión».', v: 'giro', w: 2, s: ['p01', 'p02'] },
      { a: 'ter', y: '2019–2021', t: 'Indultos del «procés»', p: 'Octubre de 2019: los condenados cumplirían «íntegramente» sus penas.', r: 'Indultos parciales en junio de 2021, con informe desfavorable del Supremo.', v: 'giro', w: 2, s: ['p03'] },
      { a: 'ter', y: '2019–2022', t: 'Puigdemont y el referéndum ilegal', p: 'Debate de 2019: «me comprometo a traerlo de vuelta a España» y a tipificar los referéndums ilegales.', r: 'Renunció a tipificarlo, derogó la sedición (2022) y aprobó la amnistía.', v: 'giro', w: 1, s: ['p04', 'p05'] },
      { a: 'ter', y: '2018–2026', t: 'Nuevo modelo de financiación autonómica', p: 'Reformar un modelo caducado desde 2014.', r: 'La propuesta de enero de 2026 quedó congelada sin mayoría parlamentaria.', v: 'incumplida', w: 1, s: ['p16'] },
      { a: 'ter', y: '2023', t: 'Lenguas cooficiales en el Congreso', p: 'Compromiso con sus socios de investidura.', r: 'Reforma del Reglamento aprobada en septiembre de 2023.', v: 'cumplida', w: 1, s: ['v36'] },
      { a: 'pac', y: '2015–2023', t: 'Pactos con EH Bildu', p: '«Con Bildu no vamos a pactar» (2015).', r: 'Acuerdos desde 2020 (presupuestos, investidura) y apoyo del PSN a la alcaldía de Bildu en Pamplona (2023).', v: 'giro', w: 1, s: ['p06'] },
      { a: 'pac', y: '2019', t: 'Coalición con Unidas Podemos', p: 'En septiembre de 2019 rechazó la coalición: con ciertos ministerios en manos de UP «no dormiría por la noche».', r: 'Preacuerdo de coalición el 12 de noviembre de 2019.', v: 'giro', w: 1, s: ['p07', 'p08'] },
      { a: 'ins', y: '2023–2026', t: 'Presentar los Presupuestos', p: 'Deber constitucional anual (art. 134.3) y promesa de presentar los de 2026.', r: 'En esta legislatura no se ha presentado ningún proyecto (al menos hasta septiembre de 2025); rigen los de 2023 prorrogados.', v: 'incumplida', w: 2, s: ['c08', 'c09'] },
      { a: 'ins', y: '2018–2026', t: 'Regeneración frente a la corrupción', p: 'La moción de censura de 2018 se justificó por la corrupción del PP.', r: 'El Supremo condenó en 2026 a José Luis Ábalos, exministro y ex secretario de Organización, a 24 años; Santos Cerdán, su sucesor, está investigado.', v: 'contradiccion', w: 2, s: ['c01', 'c02', 'c03'] },
      { a: 'ins', y: '2025–2026', t: 'Causas en el entorno del Gobierno', p: '—', r: 'Fiscal General condenado por revelación de secretos (2025); hermano del presidente condenado por prevaricación (2026, recurrible); su esposa, a juicio por un jurado (presunción de inocencia).', v: 'contexto', w: 1, s: ['c07', 'c04', 'c06'] },
      { a: 'seg', y: '2016–2026', t: 'Derogar la «ley mordaza»', p: 'Compromiso desde 2016, reiterado en los pactos de 2019 y 2023.', r: 'Sigue en vigor once años después.', v: 'incumplida', w: 2, s: ['c10', 'c11'] },
      { a: 'igu', y: '2019–2021', t: 'Ley de eutanasia', p: 'Programa de 2019.', r: 'Aprobada en marzo de 2021.', v: 'cumplida', w: 1, s: ['v26'] },
      { a: 'igu', y: '2024', t: 'Ley de paridad', p: 'Representación equilibrada en listas y órganos.', r: 'Ley Orgánica 2/2024.', v: 'cumplida', w: 1, s: ['p18'] },
      { a: 'igu', y: '2015–2026', t: 'Abolición de la prostitución', p: 'En sus programas desde 2015.', r: 'Proposiciones fallidas en 2022 y 2024; el anteproyecto anunciado para 2025 no ha llegado.', v: 'incumplida', w: 1, s: ['p13', 'p14'] },
      { a: 'ext', y: '2022', t: 'Sáhara Occidental', p: 'Posición de neutralidad respetuosa con las resoluciones de la ONU.', r: 'Giro en favor del plan de autonomía marroquí sin consultar al Congreso, que lo desautorizó.', v: 'giro', w: 2, s: ['x04', 'x07'] },
      { a: 'ext', y: '2024', t: 'Reconocimiento de Palestina', p: 'Compromiso reiterado desde 2015.', r: 'Reconocido en mayo de 2024.', v: 'cumplida', w: 1, s: ['x10'] },
      { a: 'ext', y: '2023–2026', t: 'Comercio de armas con Israel', p: 'El Gobierno aseguraba no comprar ni vender armas a Israel tras el 7 de octubre.', r: 'El Centre Delàs documentó contratos por más de 1.000 M€ con empresas israelíes; el embargo legal (2025) convivía con contratos vigentes en 2026.', v: 'parcial', w: 1, s: ['x12', 'x13', 'x14', 'v13'] },
      { a: 'ext', y: '2022–2025', t: '2% del PIB en defensa', p: 'Compromiso con la OTAN (inicialmente para 2029).', r: 'Alcanzado en 2025 con un plan aprobado sin votación en las Cortes.', v: 'cumplida', w: 1, s: ['x29', 'x33'] },
      { a: 'ene', y: '2019–2026', t: 'Calendario de cierre nuclear', p: 'Cierre escalonado 2027–2035, pactado también con Sumar.', r: 'Mantiene 2035 como fecha final, pero prorrogó Almaraz hasta cerca de 2030; Sumar lo considera un incumplimiento del pacto.', v: 'parcial', w: 1, s: ['v34', 'v35'] },
      { a: 'san', y: '2018', t: 'Sanidad universal', p: 'Revertir la exclusión de 2012.', r: 'RDL 7/2018 restableció el acceso universal.', v: 'cumplida', w: 1, s: ['p17'] },
      { a: 'san', y: '2026', t: 'Ley de gestión pública de la sanidad', p: 'Limitar la gestión privada.', r: 'Proyecto aprobado en mayo de 2026; decae con la disolución.', v: 'intentada', w: 1, s: ['v45'] }
    ]
  },

  pp: {
    power: 'Gobierno de España en 2011–2018 (y 1996–2004) y la mayoría de comunidades: amplia capacidad de cumplir.',
    cases: [
      { a: 'eco', y: '2011', t: 'Bajar la presión fiscal', p: 'La campaña de 2011 prometía rebajar impuestos.', r: 'Un mes después aprobó un gravamen complementario del IRPF para 2012–2013 (prorrogado en 2014).', v: 'giro', w: 2, s: ['q03'] },
      { a: 'eco', y: '2010–2012', t: 'IVA', p: 'Rajoy llamó en 2010 «sablazo del mal gobernante» a la subida del IVA y prometió no subirlo.', r: 'En julio de 2012 elevó el tipo general del 18% al 21%.', v: 'giro', w: 2, s: ['q01', 'q02'] },
      { a: 'eco', y: '2012–2017', t: 'Amnistía fiscal', p: '—', r: 'La regularización de 2012 fue declarada inconstitucional por el TC en 2017 por usar un decreto-ley; el Congreso reprobó a Montoro.', v: 'contexto', w: 1, s: ['q04', 'q19'] },
      { a: 'eco', y: '2022', t: 'Rebajas fiscales autonómicas', p: 'Promesas de bajar impuestos en sus comunidades.', r: 'Andalucía bonificó al 100% el Impuesto de Patrimonio y deflactó el IRPF (2022), como ejemplo.', v: 'cumplida', w: 1, s: ['q14'] },
      { a: 'tra', y: '2012', t: 'Reforma laboral', p: 'Defendía flexibilizar el mercado laboral.', r: 'RDL 3/2012: el despido improcedente pasó de 45 a 33 días por año.', v: 'coherente', w: 1, s: ['q18'] },
      { a: 'tra', y: '2012–2018', t: 'Pensiones e IPC', p: 'Hoy promete blindar la subida con el IPC; Feijóo afirmó que el PP «nunca dejó» de revalorizarlas con el IPC.', r: 'Con el PP en el Gobierno no se revalorizaron con el IPC en 2012, 2013, 2017 y 2018 (índice del 0,25%).', v: 'contradiccion', w: 2, s: ['q05'] },
      { a: 'viv', y: '2024–2026', t: 'Ley antiokupación', p: 'Agilizar los desalojos.', r: 'La aprobó en el Senado y la tomó en consideración en el Congreso (may-2026); caducó.', v: 'coherente', w: 1, s: ['v04', 'v05'] },
      { a: 'inm', y: '2024–2026', t: 'Regularización', p: 'Votó a favor de tramitar la ILP de regularización (abr-2024).', r: 'Hoy promete el «fin de las regularizaciones masivas» y critica el RD 316/2026.', v: 'giro', w: 1, s: ['v09', 'v10', 'pe01'] },
      { a: 'inm', y: '2026', t: '«Prioridad nacional»', p: 'La firmó con Vox en Extremadura, Aragón y Castilla y León.', r: 'Votó contra las mociones de Vox para aplicarla en toda España, alegando que lo pactado se basa en el «arraigo».', v: 'ambigua', w: 1, s: ['v20', 'v21', 'ctx15'] },
      { a: 'inm', y: '1996–2005', t: 'Regularizaciones de Aznar', p: '—', r: 'Los gobiernos de Aznar regularizaron a unas 524.000 personas; Rajoy llamó «disparate» a la de Zapatero (2005).', v: 'contexto', w: 1, s: ['q13'] },
      { a: 'ter', y: '2023–2026', t: 'Rechazo a la amnistía', p: 'Oposición frontal.', r: 'Votó en contra y promete derogarla.', v: 'coherente', w: 1, s: ['v07', 'pe01'] },
      { a: 'ter', y: 'feb-2024', t: '«Indulto condicionado» a Puigdemont', p: 'Rechazo a cualquier medida de gracia.', r: 'Fuentes del PP admitieron haber estudiado la amnistía «24 horas» y un indulto condicionado; Feijóo lo negó después.', v: 'ambigua', w: 1, s: ['q11', 'q12'] },
      { a: 'pac', y: 'jun-2023', t: 'Pacto con Vox en Extremadura', p: 'Guardiola: «no puedo dejar entrar en el gobierno a aquellos que niegan la violencia machista».', r: 'Días después pactó un gobierno con Vox sin mencionar la violencia machista.', v: 'giro', w: 1, s: ['q08', 'q09'] },
      { a: 'ins', y: '2011–2013', t: 'Ley de Transparencia', p: 'El Grupo Popular registró en 2011 su propia proposición de ley de transparencia y la defendió como compromiso.', r: 'Aprobó la Ley 19/2013 de transparencia, acceso a la información y buen gobierno; especialistas la consideraron insuficiente y tardía respecto a Europa.', v: 'cumplida', w: 1, s: ['h04', 'h05'] },
      { a: 'ins', y: '2023–2024', t: 'Sustituir las leyes autonómicas de memoria', p: 'Derogarlas y aprobar normas de «concordia» en sus gobiernos con Vox.', r: 'Se aprobaron leyes de concordia en Aragón y la Comunitat Valenciana (2024); el Gobierno central anunció recursos y relatores de la ONU las criticaron.', v: 'cumplida', w: 1, s: ['h01', 'h02', 'h03'] },
      { a: 'ins', y: '2018–2024', t: 'Renovación del CGPJ', p: 'Mandato constitucional de renovarlo cada cinco años.', r: 'Bloqueó la renovación más de cinco años y medio, hasta el acuerdo de junio de 2024 (el PSOE también la bloqueó en etapas anteriores).', v: 'incumplida', w: 2, s: ['v40', 'v41'] },
      { a: 'ins', y: '2018–2020', t: 'Corrupción: caso Gürtel', p: 'Discurso de «tolerancia cero».', r: 'El PP fue condenado como partícipe a título lucrativo (Audiencia Nacional 2018, confirmado por el Supremo en 2020).', v: 'contradiccion', w: 2, s: ['c15', 'q20'] },
      { a: 'ins', y: '2024–2026', t: 'Causas abiertas', p: '—', r: 'Juicio Kitchen (espionaje a Bárcenas desde Interior, visto para sentencia), investigación al exministro Montoro y la gestión de la DANA por Mazón, que dimitió en 2025.', v: 'contexto', w: 1, s: ['c12', 'c13', 'c14', 'c16'] },
      { a: 'seg', y: '2015–2026', t: 'Endurecimiento penal', p: 'Más seguridad y penas más duras.', r: 'Aprobó la Ley de Seguridad Ciudadana y la prisión permanente revisable (2015) y propuso ampliarla (2026).', v: 'coherente', w: 1, s: ['c10', 'v19'] },
      { a: 'igu', y: '2011–2014', t: 'Ley del aborto', p: 'El programa de 2011 prometía «cambiar el modelo» de la ley de plazos.', r: 'Retiró la reforma de Gallardón en 2014, que dimitió; solo cambió el consentimiento de las menores.', v: 'incumplida', w: 1, s: ['q06', 'q07'] },
      { a: 'igu', y: '2023', t: 'Violencia de género en pactos con Vox', p: 'Apoyo al Pacto de Estado contra la Violencia de Género.', r: 'El pacto de Gobierno de Extremadura con Vox no aludía a la «violencia machista».', v: 'contradiccion', w: 1, s: ['q09'] },
      { a: 'ext', y: '2014–2018', t: 'Gasto en defensa', p: 'Firmó el compromiso de la OTAN de alcanzar el 2% (Gales, 2014).', r: 'El gasto se mantuvo en torno al 0,9% del PIB (0,92% en 2014 y en 2018).', v: 'incumplida', w: 1, s: ['x31', 'x32'] },
      { a: 'ext', y: '2022–2025', t: 'Sáhara Occidental', p: 'Defensa de la posición tradicional de la ONU.', r: 'Votó la proposición pro-referéndum (2022) y llevó una moción de «neutralidad activa» (2024), pero Feijóo evitó decir si revertiría el giro.', v: 'ambigua', w: 1, s: ['x04', 'x06', 'x38'] },
      { a: 'ext', y: '2014–2024', t: 'Reconocimiento de Palestina', p: 'Apoyó en 2014 que el Congreso pidiera reconocerla.', r: 'En 2024 criticó el reconocimiento por la forma y el momento.', v: 'ambigua', w: 1, s: ['x09', 'x11'] },
      { a: 'ene', y: '2017–2026', t: 'Energía nuclear', p: 'Hoy defiende alargar la vida de las centrales.', r: 'Su Gobierno denegó en 2017 la renovación de Garoña, pese al informe favorable del CSN.', v: 'contradiccion', w: 1, s: ['q10'] },
      { a: 'san', y: '2012', t: 'Exclusión sanitaria', p: '—', r: 'El RDL 16/2012 excluyó de la sanidad a los inmigrantes irregulares adultos salvo urgencias, embarazo y menores.', v: 'contexto', w: 1, s: ['p17'] }
    ]
  },

  vox: {
    power: 'Sin gobierno estatal. Sus consejerías autonómicas (2023–2024 y desde 2026) no incluyeron Hacienda: hay poca evidencia de cumplimiento en gestión y más de coherencia entre discurso y voto.',
    cases: [
      { a: 'tra', y: 'ene-2025', t: 'Defensa de los pensionistas', p: 'Discurso de protección a los pensionistas.', r: 'Votó con PP y Junts contra el decreto «ómnibus» que incluía la revalorización, aunque el decreto mezclaba otras medidas.', v: 'ambigua', w: 1, s: ['v50', 'v57'] },
      { a: 'viv', y: '2026', t: 'Desalojos exprés', p: 'Desalojo de okupas en 24 horas.', r: 'Votó a favor de la ley del PP.', v: 'coherente', w: 1, s: ['v04'] },
      { a: 'inm', y: '2024–2025', t: 'Rechazo al reparto de menores', p: 'No acoger menores migrantes.', r: 'Rompió sus gobiernos con el PP (jul-2024) y votó contra el decreto de 2025.', v: 'coherente', w: 1, s: ['r01', 'v11'] },
      { a: 'inm', y: '2026', t: '«Prioridad nacional»', p: 'Prioridad de los españoles en ayudas y vivienda.', r: 'La incluyó en los pactos de gobierno de Extremadura, Aragón y Castilla y León.', v: 'cumplida', w: 1, s: ['ctx15', 'ctx16'] },
      { a: 'ter', y: '2023–2026', t: 'Rechazo a la amnistía', p: 'Oposición frontal.', r: 'Votó en contra y promete derogarla.', v: 'coherente', w: 1, s: ['v07'] },
      { a: 'pac', y: '2023–2024', t: 'Socio de gobiernos autonómicos', p: 'Firmó acuerdos de gobierno para toda la legislatura con el PP (2023).', r: 'Los abandonó en julio de 2024 por el reparto de menores; volvió a pactar en 2026.', v: 'incumplida', w: 1, s: ['r01', 'r02'] },
      { a: 'pac', y: '2022–2023', t: 'Medidas propias en Castilla y León', p: 'Derogar la memoria histórica, expulsiones, recortes a sindicatos.', r: 'El pacto de 2022 se basó sobre todo en el programa del PP; el protocolo «latido fetal» anunciado por su vicepresidente no se aplicó.', v: 'parcial', w: 1, s: ['r03', 'r04'] },
      { a: 'ins', y: '2023–2024', t: 'Leyes de «concordia»', p: 'Derogar las leyes autonómicas de memoria democrática.', r: 'Logró, con el PP, leyes de concordia en Aragón y la Comunitat Valenciana (2024), recurridas por el Gobierno central y criticadas por relatores de la ONU.', v: 'cumplida', w: 1, s: ['h01', 'h02', 'h03'] },
      { a: 'ins', y: '2013', t: '«Chiringuitos»', p: 'Eliminar organismos públicos sin función.', r: 'Abascal cobró unos 82.000 € al año como director de una fundación pública de la Comunidad de Madrid con escasa actividad; él mismo admitió que era un «chiringuito».', v: 'contradiccion', w: 1, s: ['c28', 'c29'] },
      { a: 'ins', y: '2023–2026', t: 'Financiación con un banco húngaro', p: '—', r: 'Préstamo de 6,5 M€ de MBH (vinculado al entorno de Orbán); el Tribunal de Cuentas denunció falta de colaboración del banco y Anticorrupción investiga. Vox lo considera legal y ya lo devolvió.', v: 'contexto', w: 1, s: ['c17', 'c18', 'c19'] },
      { a: 'seg', y: '2026', t: 'Endurecimiento penal', p: 'Penas más duras y prisión permanente.', r: 'Votó la ley de multirreincidencia y la ampliación de la prisión permanente.', v: 'coherente', w: 1, s: ['v17', 'v19'] },
      { a: 'igu', y: '2023', t: 'Ley de violencia de género', p: 'Sustituirla por «violencia intrafamiliar».', r: 'Logró que sus pactos autonómicos evitaran el término «violencia machista».', v: 'coherente', w: 1, s: ['q09'] },
      { a: 'ext', y: '2024–2026', t: 'Apoyo a Israel', p: 'Alineamiento con el Gobierno de Netanyahu.', r: 'Votó contra el embargo, se reunió con Netanyahu y comparte familia europea con el Likud.', v: 'coherente', w: 1, s: ['x15', 'x16', 'v13'] },
      { a: 'ext', y: '2025', t: 'Trump y los aranceles', p: 'Defensa del campo español.', r: 'Mantuvo la alianza con Trump pese a unos aranceles que dañan al campo; Abascal los llamó «error monumental» pero culpó a Bruselas y a Sánchez.', v: 'ambigua', w: 1, s: ['x17', 'x18', 'r05', 'x37'] },
      { a: 'ext', y: '2022–2025', t: 'Ucrania', p: 'Condena de la invasión rusa.', r: 'Mantiene la condena, pero se opone a enviar tropas y comparte familia europea con el Fidesz de Orbán, crítico con la ayuda a Ucrania; sus rivales le reprochan cercanía a Moscú, algo que Vox niega.', v: 'ambigua', w: 1, s: ['x27', 'x28'] },
      { a: 'ene', y: '2025–2026', t: 'Energía nuclear', p: 'Mantener las centrales.', r: 'Votó todas las iniciativas a favor y pide Almaraz hasta 2050.', v: 'coherente', w: 1, s: ['v30', 'v35'] }
    ]
  },

  sumar: {
    power: 'Socio minoritario del Gobierno en 2023–2026 (Trabajo, Sanidad, Cultura, Consumo): cumplimiento en sus ministerios y dependencia del PSOE en el resto.',
    cases: [
      { a: 'tra', y: '2018–2026', t: 'Subida del salario mínimo', p: 'Llevarlo al 60% del salario medio.', r: '1.221 € en 2026 (+66% desde 2018), negociado desde el Ministerio de Trabajo.', v: 'cumplida', w: 2, s: ['p10'] },
      { a: 'tra', y: '2021', t: '«Derogación» de la reforma laboral', p: 'Yolanda Díaz (2021): «decisión inalterable para este mismo año: la derogación».', r: 'Reforma pactada que revierte parte de la de 2012 pero mantiene el coste del despido.', v: 'parcial', w: 2, s: ['s01', 'p09'] },
      { a: 'tra', y: '2023–2025', t: 'Jornada de 37,5 horas', p: 'Compromiso estrella del pacto de Gobierno.', r: 'Tumbada por PP, Vox y Junts (sep-2025).', v: 'intentada', w: 2, s: ['v06'] },
      { a: 'viv', y: '2023', t: 'Ley de vivienda con topes', p: 'Regular los alquileres.', r: 'Aprobada en 2023 con el voto de Unidas Podemos.', v: 'cumplida', w: 1, s: ['v25'] },
      { a: 'viv', y: '2015–2023', t: 'Vivienda pública en Barcelona (Colau)', p: '4.000 pisos públicos por mandato.', r: 'El parque público ganó unos 4.600 pisos en ocho años (1.500 de nueva construcción); la reserva del 30% quedó muy por debajo de lo previsto.', v: 'parcial', w: 1, s: ['s02', 's03'] },
      { a: 'seg', y: '2023–2026', t: 'Derogar la «ley mordaza»', p: 'Compromiso del pacto de Gobierno.', r: 'Sin aprobar al final de la legislatura.', v: 'incumplida', w: 1, s: ['c10', 'c11'] },
      { a: 'igu', y: '2023–2024', t: 'Caso Errejón', p: 'Discurso y protocolos feministas.', r: 'Su portavoz dimitió por acusaciones de violencia sexual; Más Madrid admitió conocer una denuncia de 2023 y Sumar reconoció que «fallaron los protocolos».', v: 'contradiccion', w: 1, s: ['s04', 's05'] },
      { a: 'ext', y: '2025', t: 'Gasto en defensa', p: 'Contra el aumento del gasto militar.', r: 'Se opuso al plan de 10.471 M€, pero permaneció en el Gobierno que lo aprobó.', v: 'contradiccion', w: 1, s: ['x30', 'x29', 's09'] },
      { a: 'ext', y: '2023–2025', t: 'Sáhara Occidental', p: 'Autodeterminación del pueblo saharaui.', r: 'Forma parte del Gobierno que mantiene el apoyo al plan marroquí; registró una iniciativa en su contra (nov-2025).', v: 'contradiccion', w: 1, s: ['x08'] },
      { a: 'ext', y: '2025', t: 'Embargo de armas a Israel', p: 'Exigencia de Sumar.', r: 'El Gobierno aprobó el RDL 10/2025.', v: 'cumplida', w: 1, s: ['v13'] },
      { a: 'ene', y: '2026', t: 'Cierre nuclear', p: 'Respetar el calendario de cierre.', r: 'Rechazó públicamente la prórroga de Almaraz.', v: 'coherente', w: 1, s: ['v35'] },
      { a: 'san', y: '2026', t: 'Ley de gestión pública de la sanidad', p: 'Limitar la gestión privada.', r: 'Proyecto de la ministra Mónica García (may-2026); decae con la disolución.', v: 'intentada', w: 1, s: ['v45'] }
    ]
  },

  podemos: {
    power: 'En el Gobierno en 2020–2023 (Igualdad, Derechos Sociales, Consumo) y fuera de él desde diciembre de 2023.',
    cases: [
      { a: 'igu', y: '2023', t: 'Ley trans', p: 'Autodeterminación de género.', r: 'Aprobada en 2023 desde el Ministerio de Igualdad.', v: 'cumplida', w: 1, s: ['g01', 'g02'] },
      { a: 'igu', y: '2022–2023', t: 'Ley del «solo sí es sí»', p: 'Más protección frente a la violencia sexual.', r: 'Aprobada en 2022, pero provocó más de 1.200 rebajas de condena y 121 excarcelaciones (CGPJ, sep-2023), como había advertido el CGPJ; Podemos se opuso a reformarla.', v: 'parcial', w: 2, s: ['s06', 's07'] },
      { a: 'viv', y: '2023', t: 'Ley de vivienda', p: 'Regular los alquileres.', r: 'Aprobada en 2023 con su impulso.', v: 'cumplida', w: 1, s: ['v25'] },
      { a: 'tra', y: '2019–2021', t: '«Derogar» la reforma laboral', p: 'Acuerdo de coalición de 2019.', r: 'Reforma parcial en 2021.', v: 'parcial', w: 1, s: ['p09'] },
      { a: 'inm', y: '2024–2026', t: 'Regularización extraordinaria', p: 'Apoyar la ILP de regularización.', r: 'Pactó con el PSOE el RD 316/2026.', v: 'cumplida', w: 2, s: ['v47'] },
      { a: 'seg', y: '2020–2023', t: 'Derogar la «ley mordaza»', p: 'Compromiso del Gobierno de coalición.', r: 'No se logró mientras estuvo en el Gobierno.', v: 'incumplida', w: 1, s: ['c10'] },
      { a: 'ins', y: '2012–2018', t: 'Críticas a la «casta»', p: 'Iglesias criticó en 2012 que De Guindos comprara un ático de unos 600.000 €.', r: 'En 2018 Iglesias y Montero compraron un chalet de un precio similar en Galapagar.', v: 'contradiccion', w: 1, s: ['s08'] },
      { a: 'ext', y: '2022–2026', t: 'Rechazo a la escalada militar', p: 'Contra el envío de armas y el aumento del gasto.', r: 'Ha votado y declarado en ese sentido de forma sostenida.', v: 'coherente', w: 1, s: ['x25'] },
      { a: 'ext', y: '2025', t: 'Embargo de armas a Israel', p: 'Exigirlo.', r: 'Lo forzó y votó a favor.', v: 'coherente', w: 1, s: ['v13'] }
    ]
  },

  salf: {
    power: 'Sin experiencia de gobierno; evidencia muy limitada.',
    cases: [
      { a: 'ins', y: '2024', t: 'Sorteo del sueldo de eurodiputado', p: 'Sortear el 100% de su sueldo.', r: 'Alvise sorteó el suyo, no el de sus otros dos eurodiputados ni el de sus asesores.', v: 'cumplida', w: 1, s: ['c24'] },
      { a: 'ins', y: '2024–2026', t: 'Discurso anticorrupción', p: 'Acabar con la financiación opaca de la política.', r: 'Admitió ante el Supremo haber recibido 100.000 € en efectivo de un empresario de criptomonedas (niega su uso en campaña); causa abierta por presunta financiación ilegal.', v: 'contradiccion', w: 2, s: ['c21', 'c22', 'c23'] },
      { a: 'pac', y: '2025–2026', t: 'Cohesión interna', p: '—', r: 'Sus otros dos eurodiputados abandonaron el partido tras ser acusados por Alvise de estar «comprados»; el Supremo investiga a Alvise por presunto acoso.', v: 'contexto', w: 1, s: ['c25', 'c26', 'c20'] }
    ]
  },

  erc: {
    power: 'Gobernó Cataluña (2021–2024) y ha sido socio parlamentario decisivo.',
    cases: [
      { a: 'pac', y: '2015–2026', t: '«En 18 meses dejaré mi escaño»', p: 'Rufián (2015): dejaría el Congreso en 18 meses para «regresar a la República Catalana».', r: 'Sigue siendo diputado diez años después.', v: 'incumplida', w: 1, s: ['t03'] },
      { a: 'ter', y: '2023–2024', t: 'Amnistía a cambio de la investidura', p: 'Condición para apoyar a Sánchez.', r: 'Ley de Amnistía aprobada (2024).', v: 'cumplida', w: 1, s: ['v07'] },
      { a: 'ter', y: '2024–2026', t: 'Financiación singular', p: 'Que la Generalitat recaude todos los impuestos, empezando por el IRPF en 2026.', r: 'Calendario retrasado a 2027–2028 y nuevo modelo congelado sin mayoría.', v: 'parcial', w: 1, s: ['t04', 't05', 'p16'] }
    ]
  },

  junts: {
    power: 'Gobernó Cataluña hasta 2022; socio parlamentario de Sánchez en 2023–2025.',
    cases: [
      { a: 'ter', y: '2023–2024', t: 'Amnistía a cambio de la investidura', p: 'Condición para investir a Sánchez.', r: 'Aprobada en 2024, aunque el Supremo no la aplica a la malversación de Puigdemont.', v: 'cumplida', w: 1, s: ['v07', 't07'] },
      { a: 'pac', y: 'jul–ago 2024', t: 'Regreso de Puigdemont', p: '«Volveré cueste lo que cueste» para asistir al debate de investidura.', r: 'Reapareció en Barcelona el 8 de agosto de 2024 y se marchó sin asistir.', v: 'incumplida', w: 1, s: ['t06', 't07'] },
      { a: 'inm', y: '2024–2025', t: 'Competencias de inmigración', p: 'Lograr su delegación a Cataluña.', r: 'La ley pactada con el PSOE no obtuvo mayoría.', v: 'intentada', w: 1, s: ['t08', 'p15'] },
      { a: 'seg', y: '2024–2026', t: 'Ley de multirreincidencia', p: 'Endurecer las penas a la reincidencia en hurtos.', r: 'Aprobada en febrero de 2026.', v: 'cumplida', w: 1, s: ['v17', 'v18'] }
    ]
  },

  bildu: {
    power: 'Sin gobierno autonómico; gobierna municipios y ha sido socio estable del Gobierno.',
    cases: [
      { a: 'ins', y: '2023', t: 'Condenados de ETA en sus listas', p: 'Ante la polémica, comprometió que los 7 condenados por delitos de sangre no ocuparían cargo.', r: 'Los siete renunciaron; otros 37 candidatos con condenas por pertenencia o colaboración siguieron en las listas.', v: 'cumplida', w: 1, s: ['t09', 't10'] },
      { a: 'pac', y: '2020–2026', t: 'Apoyo al Gobierno de coalición', p: 'Socio de investidura y presupuestos.', r: 'Apoyo estable durante dos legislaturas.', v: 'coherente', w: 1, s: ['p06'] }
    ]
  },

  pnv: {
    power: 'Gobierno Vasco casi ininterrumpido y socio parlamentario de gobiernos de distinto signo.',
    cases: [
      { a: 'pac', y: 'may–jun 2018', t: 'Presupuestos de Rajoy y moción de censura', p: 'Apoyó los Presupuestos de 2018 a cambio de inversiones para Euskadi.', r: 'Una semana después votó la moción de censura contra Rajoy, tras el compromiso de Sánchez de mantener esos presupuestos.', v: 'giro', w: 1, s: ['t01', 't02'] }
    ]
  },

  bng: {
    power: 'Oposición en Galicia; un diputado en el Congreso.',
    cases: [
      { a: 'ter', y: '2021–2026', t: 'Traspaso de la AP-9', p: 'Reivindicación histórica del nacionalismo gallego.', r: 'Ley de traspaso aprobada en 2026 con el apoyo de todos los grupos salvo PP y Vox.', v: 'cumplida', w: 1, s: ['v51', 'v52'] }
    ]
  },

  cc: {
    power: 'Gobierna Canarias; vota en Madrid según la «agenda canaria».',
    cases: [
      { a: 'pac', y: 'ago–nov 2023', t: 'Doble apoyo de investidura', p: 'Votaría al candidato que asumiera la agenda canaria.', r: 'Pactó con el PP y votó a Feijóo (ago-2023); después votó a Sánchez (nov-2023), aunque rechazó la amnistía.', v: 'ambigua', w: 1, s: ['t11', 't12'] },
      { a: 'inm', y: '2024–2025', t: 'Reparto obligatorio de menores', p: 'Reclamaba la corresponsabilidad del resto de comunidades.', r: 'Logrado con el RDL 2/2025.', v: 'cumplida', w: 1, s: ['v11', 'pe12'] }
    ]
  },

  upn: {
    power: 'Un diputado, aliado del PP.',
    cases: [
      { a: 'pac', y: 'feb-2022', t: 'Voto de la reforma laboral', p: 'La dirección de UPN se comprometió a apoyarla.', r: 'Sus dos diputados votaron en contra y fueron expulsados temporalmente.', v: 'incumplida', w: 1, s: ['t13', 't14'] }
    ]
  },

  adelante: {
    power: 'Sin experiencia de gobierno ni representación previa en el Congreso.',
    cases: []
  }
};
