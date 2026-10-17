/* Cotejo 29-N · Preguntas y posiciones de los partidos.
   pos[partido] = [valor -2..2, confianza 'A'|'B'|'C', nota, [ids de fuente]]
   Un partido ausente de pos = sin posición documentada (no puntúa).
   ax: dirección de la afirmación en los ejes del mapa (e = económico, t = territorial, s = valores).
   core: incluida en la versión rápida. */
window.COTEJO = window.COTEJO || {};

COTEJO.questions = [
  /* ───────────── ECONOMÍA Y FISCALIDAD ───────────── */
  {
    id: 'eco1', cat: 'eco', core: true, ax: { e: 1 },
    text: 'Debería bajarse el IRPF a la mayoría de contribuyentes, aunque eso reduzca la recaudación.',
    ctx: 'El IRPF es, junto con el IVA, el impuesto que más recauda. El PP propone deflactarlo y duplicar el mínimo por hijo; Vox, una tarifa de dos tipos (15% y 25%) con 22.000 € exentos, cuyo coste el Ministerio de Hacienda cifró en unos 85.000 M€ (oct-2026); SALF, un 0% por debajo de 35.000 €.',
    ctxSrc: ['pe01', 'pe03', 'pe06'],
    pro: 'Devuelve renta a familias y clases medias y corrige la subida encubierta que provoca la inflación cuando los tramos no se actualizan.',
    con: 'Reduce los ingresos para sanidad, educación o pensiones salvo que se recorte gasto o suba el déficit; en euros, ahorra más a quien más gana.',
    pos: {
      pp: [1, 'B', 'Deflactar el IRPF y duplicar el mínimo por descendientes (decálogo de sep-2026); no cuantifica la rebaja.', ['pe01']],
      psoe: [-1, 'B', 'Defiende una fiscalidad «más progresiva»; ha aplicado rebajas selectivas, no generales.', ['pe02']],
      vox: [2, 'B', 'IRPF de dos tipos (15% y 25%) con 22.000 € exentos y 4 puntos menos por hijo.', ['pe03']],
      sumar: [-2, 'B', 'Reforma fiscal progresiva: más esfuerzo de rentas altas y grandes empresas.', ['pe04']],
      podemos: [-2, 'B', 'Reforma fiscal progresiva.', ['pe05']],
      erc: [-1, 'C', 'Fiscalidad progresiva; su prioridad es que Cataluña gestione sus impuestos.', ['pe07']],
      salf: [2, 'B', 'IRPF del 0% para ingresos inferiores a 35.000 € y 5 puntos menos por hijo.', ['pe06']],
      junts: [1, 'B', 'Bajar impuestos a clases medias, autónomos y empresas.', ['pe08']],
      bildu: [-2, 'B', 'Fiscalidad más progresiva.', ['pe10']],
      bng: [-1, 'C', 'Sin propuesta concreta; perfil de izquierda.', ['pe11']],
      upn: [1, 'B', 'Fiscalidad baja; deflactar la tarifa del IRPF (programa 2023).', ['pe13', 'upn23']]
    }
  },
  {
    id: 'eco2', cat: 'eco', core: true, ax: { e: -1 },
    text: 'Las grandes fortunas deberían seguir pagando un impuesto específico sobre su patrimonio.',
    ctx: 'El Impuesto Temporal de Solidaridad de las Grandes Fortunas (Ley 38/2022) grava patrimonios de más de 3 M€ y está prorrogado sin fecha de fin. Varias comunidades del PP bonifican al 100% el Impuesto de Patrimonio; Andalucía lo hace desde 2022.',
    ctxSrc: ['f02', 'q14'],
    pro: 'Grava una riqueza muy concentrada y evita que la competencia fiscal entre comunidades deje el impuesto vacío.',
    con: 'Recauda poco en relación con su coste político, puede ahuyentar inversión y residentes y es poco común en Europa.',
    pos: {
      psoe: [2, 'A', 'Creó el impuesto (2022) y lo prorrogó indefinidamente.', ['f02', 'v23']],
      pp: [-2, 'A', 'Propone suprimirlo; sus gobiernos autonómicos bonifican Patrimonio al 100%.', ['pe01', 'q14']],
      vox: [-2, 'B', 'Suprimir Sucesiones, Patrimonio y la plusvalía municipal.', ['pe03']],
      sumar: [2, 'B', 'Impuestos a las grandes fortunas y a la banca.', ['pe04']],
      podemos: [2, 'B', 'Impuestos a las grandes fortunas.', ['pe05']],
      erc: [1, 'C', 'Fiscalidad progresiva.', ['pe07']],
      salf: [-2, 'B', 'Supresión del Impuesto de Patrimonio.', ['pe06']],
      junts: [-1, 'C', 'Defiende rebajas fiscales; sin propuesta explícita sobre este impuesto.', ['pe08']],
      bildu: [2, 'B', 'Más impuestos a las grandes fortunas.', ['pe10']],
      bng: [1, 'C', 'Perfil de izquierda; sin propuesta específica.', ['pe11']],
      adelante: [2, 'C', 'Formación anticapitalista; posición inferida.', ['ctx13']],
      upn: [-1, 'C', 'Defiende una fiscalidad baja.', ['pe13']]
    }
  },
  {
    id: 'eco3', cat: 'eco', ax: { e: -1 },
    text: 'La banca y las grandes energéticas deberían pagar un gravamen adicional sobre sus beneficios.',
    ctx: 'En noviembre de 2024 el Congreso convirtió el gravamen temporal a la banca en un impuesto progresivo (del 1% al 7% del margen de intereses y comisiones). El de las energéticas decayó a finales de 2024; su prórroga, incluida en el decreto «ómnibus», cayó en enero de 2025.',
    ctxSrc: ['v23', 'v24', 'v50'],
    pro: 'Los beneficios récord de esos sectores se deben en parte a la subida de tipos y de precios; el gravamen reparte esa carga.',
    con: 'Puede encarecer el crédito y frenar la inversión energética; acaba repercutiendo en clientes y accionistas.',
    pos: {
      psoe: [2, 'A', 'Aprobó el impuesto a la banca (nov-2024) e intentó prorrogar el de energéticas.', ['v23', 'v50']],
      pp: [-2, 'A', 'Votó en contra y derogó en el Senado la base legal del gravamen energético.', ['v23', 'v24']],
      vox: [-2, 'A', 'Votó en contra.', ['v23']],
      sumar: [2, 'A', 'Votó a favor.', ['v23']],
      podemos: [2, 'A', 'Votó a favor y exigió un impuesto permanente a las energéticas.', ['v23', 'v24']],
      erc: [2, 'A', 'Votó a favor y pidió prorrogar el de energéticas.', ['v23', 'v24']],
      junts: [0, 'A', 'Sí al impuesto a la banca; no al de energéticas.', ['v23', 'v24']],
      bildu: [2, 'A', 'Votó a favor y pidió prorrogar el de energéticas.', ['v23', 'v24']],
      pnv: [0, 'A', 'Sí al de la banca; apoyó suprimir el de energéticas.', ['v23', 'v24']],
      bng: [2, 'A', 'Votó a favor y pidió prorrogar el de energéticas.', ['v23', 'v24']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      cc: [1, 'A', 'Votó a favor del impuesto a la banca.', ['v23']],
      upn: [-2, 'A', 'Votó en contra.', ['v23']]
    }
  },
  {
    id: 'eco4', cat: 'eco', ax: { e: 1 },
    text: 'Habría que reducir con fuerza el gasto público: menos organismos, altos cargos, asesores y subvenciones.',
    ctx: 'Vox presentó en junio de 2026 un plan de desregulación y de supresión de organismos; SALF propone recortar al menos un 70% los asesores y altos cargos y eliminar las subvenciones a partidos, sindicatos y patronal. El Gobierno sostiene que el gasto social ha reducido la pobreza y la desigualdad.',
    ctxSrc: ['pe03', 'pe06', 'ctx01'],
    pro: 'Libera recursos para bajar impuestos o reducir deuda y combate duplicidades y clientelismo.',
    con: 'Los recortes amplios suelen acabar afectando a servicios básicos; muchas estructuras señaladas cumplen funciones necesarias.',
    pos: {
      vox: [2, 'B', 'Plan de desregulación y supresión de «chiringuitos».', ['pe03']],
      salf: [2, 'B', 'Recortar al menos un 70% asesores y altos cargos; eliminar subvenciones a partidos, sindicatos y patronal.', ['pe06']],
      pp: [1, 'B', 'Auditoría de las cuentas públicas y derogar tres normas por cada nueva.', ['pe01']],
      psoe: [-1, 'B', 'Defiende el gasto social: «no sacrificar el Estado del Bienestar».', ['ctx01']],
      sumar: [-2, 'C', 'Prioriza ampliar servicios públicos.', ['pe04']],
      podemos: [-2, 'C', 'Prioriza ampliar servicios públicos.', ['pe05']],
      erc: [-1, 'C', 'Posición inferida.', ['pe07']],
      bildu: [-2, 'C', 'Posición inferida.', ['pe10']],
      bng: [-1, 'C', 'Posición inferida.', ['pe11']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [1, 'C', 'Critica el gasto del Gobierno central.', ['pe13']]
    }
  },

  /* ───────────── TRABAJO Y PENSIONES ───────────── */
  {
    id: 'tra1', cat: 'tra', core: true, ax: { e: -1 },
    text: 'Debería reducirse por ley la jornada laboral máxima a 37,5 horas semanales sin rebaja de sueldo.',
    ctx: 'El proyecto de ley del Gobierno, impulsado por la ministra de Trabajo, fue devuelto el 10 de septiembre de 2025 al prosperar las enmiendas a la totalidad de PP, Vox y Junts, con el apoyo de UPN (178–170).',
    ctxSrc: ['v06'],
    pro: 'Reparte mejor el tiempo de trabajo y mejora la conciliación y la productividad por hora; muchos convenios ya lo aplican.',
    con: 'Encarece el empleo en pymes y en sectores con mucha mano de obra; sus críticos prefieren pactarlo en la negociación colectiva.',
    pos: {
      psoe: [2, 'A', 'Proyecto del Gobierno; votó contra su devolución.', ['v06']],
      pp: [-2, 'A', 'Presentó enmienda a la totalidad.', ['v06']],
      vox: [-2, 'A', 'Presentó enmienda a la totalidad.', ['v06']],
      sumar: [2, 'A', 'Impulsora del proyecto.', ['v06']],
      podemos: [2, 'A', 'Votó contra la devolución.', ['v06']],
      erc: [2, 'A', 'Votó contra la devolución.', ['v06']],
      junts: [-2, 'A', 'Presentó enmienda a la totalidad.', ['v06']],
      bildu: [2, 'A', 'Votó contra la devolución; apoya reducir la jornada.', ['v06', 'pe10']],
      pnv: [1, 'B', 'Entre los 170 votos contra la devolución, según el recuento.', ['v06']],
      bng: [2, 'B', 'Entre los 170 votos contra la devolución, según el recuento.', ['v06']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      cc: [1, 'B', 'Entre los 170 votos contra la devolución, según el recuento.', ['v06']],
      upn: [-2, 'A', 'Votó con PP, Vox y Junts.', ['v06']]
    }
  },
  {
    id: 'tra2', cat: 'tra', core: true, ax: { e: -1 },
    text: 'Para sostener las pensiones es preferible aumentar los ingresos del sistema (más cotizaciones, sobre todo de los salarios altos) que endurecer el acceso o rebajar las pensiones.',
    ctx: 'La reforma de 2021–2023 volvió a ligar las pensiones al IPC (Ley 21/2021) y subió cotizaciones mediante el «mecanismo de equidad intergeneracional» y una cuota de solidaridad para los salarios más altos. El PP rechaza ese mecanismo y la reforma de 2023, aunque promete blindar la subida con el IPC.',
    ctxSrc: ['p11', 'v53', 'pe01'],
    pro: 'Mantiene el poder adquisitivo de los pensionistas y reparte el esfuerzo entre más cotizantes.',
    con: 'Encarece la contratación y reduce los salarios netos; sin cambios en la edad o en el cálculo, la factura crece con el envejecimiento.',
    pos: {
      psoe: [2, 'A', 'Reforma de 2021–2023: IPC, mecanismo de equidad y cuota de solidaridad.', ['p11', 'v53']],
      pp: [-1, 'B', 'Rechaza el mecanismo de equidad y la reforma de 2023; promete el IPC por ley.', ['pe01']],
      vox: [-1, 'C', 'Propone eximir del IRPF las pensiones y financiarlas con el ahorro de suprimir el Estado autonómico.', ['pe03']],
      sumar: [2, 'B', 'Reforzar la financiación de la Seguridad Social.', ['pe04']],
      podemos: [2, 'B', 'Financiarlas con mayor progresividad fiscal.', ['pe05']],
      erc: [1, 'C', 'Posición inferida.', ['pe07']],
      salf: [-1, 'C', 'Califica el sistema de «estafa piramidal», sin concretar la alternativa.', ['pe06']],
      junts: [-1, 'B', 'Sostenibilidad «sin cargar más a empresas y autónomos».', ['pe08']],
      bildu: [2, 'C', 'IPC y pensión mínima suficiente.', ['pe10']],
      bng: [1, 'C', 'Subir las pensiones mínimas y de viudedad.', ['pe11']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [-1, 'C', 'Advierte sobre la sostenibilidad del sistema.', ['pe13']]
    }
  },
  {
    id: 'tra3', cat: 'tra', ax: { e: 1 },
    text: 'Junto al sistema público, debería crearse un pilar de ahorro individual para la jubilación (capitalización), obligatorio o muy incentivado.',
    ctx: 'Las pensiones españolas son de reparto: las cotizaciones de hoy pagan las pensiones de hoy. En Vox, José María Figaredo propuso un sistema mixto con capitalización individual (2025 y oct-2026), aunque Abascal y otros dirigentes niegan que el partido vaya a privatizarlas.',
    ctxSrc: ['pe03'],
    pro: 'Diversifica el riesgo demográfico y genera un ahorro propio para las generaciones jóvenes.',
    con: 'La transición es muy cara (hay que pagar las pensiones actuales mientras se ahorra) y traslada el riesgo de mercado a los trabajadores.',
    pos: {
      vox: [1, 'B', 'Figaredo plantea un sistema mixto; Abascal: «nunca» privatizar.', ['pe03']],
      pp: [1, 'C', 'Plantea un sistema «viable» para los jóvenes sin detallarlo; tradicional defensor de planes complementarios.', ['pe01']],
      salf: [1, 'C', 'Pide reformar un sistema que considera insostenible, sin concretar.', ['pe06']],
      psoe: [-1, 'C', 'Defiende el reparto y el refuerzo de ingresos.', ['pe02']],
      sumar: [-2, 'C', 'Defiende el sistema público.', ['pe04']],
      podemos: [-2, 'C', 'Defiende el sistema público.', ['pe05']],
      bildu: [-2, 'C', 'Defiende un sistema público y vasco propio.', ['pe10']],
      bng: [-1, 'C', 'Posición inferida.', ['pe11']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']]
    }
  },

  /* ───────────── VIVIENDA ───────────── */
  {
    id: 'viv1', cat: 'viv', core: true, ax: { e: -1 },
    text: 'Deberían limitarse por ley los precios del alquiler en las zonas con mercados tensionados.',
    ctx: 'La Ley 12/2023 permite a las comunidades declarar «zonas tensionadas» y topar rentas; varias comunidades se niegan a aplicarla. El decreto de vivienda derogado el 2 de octubre de 2026 limitaba además las subidas al 2% hasta finales de 2027.',
    ctxSrc: ['v25', 'v01'],
    pro: 'Frena subidas que superan con mucho a los salarios y da estabilidad a quien alquila.',
    con: 'Puede reducir la oferta, empujar a contratos de temporada o sin declarar y desincentivar la construcción.',
    pos: {
      psoe: [2, 'A', 'Ley 12/2023 y decretos de 2026.', ['v25', 'v01']],
      pp: [-2, 'A', 'Votó en contra y propone eliminar las zonas tensionadas y sus topes.', ['v25', 'pe01']],
      vox: [-2, 'A', 'Votó en contra; propone derogar la ley de vivienda.', ['v25', 'pe03']],
      sumar: [2, 'A', 'Votó a favor.', ['v25']],
      podemos: [2, 'A', 'Votó a favor.', ['v25']],
      erc: [2, 'A', 'Votó a favor.', ['v25', 'pe07']],
      salf: [-2, 'B', 'Rechaza los topes al alquiler.', ['pe06']],
      junts: [-2, 'A', 'Votó contra la ley (2023) y contra los decretos (2026).', ['v25', 'v03']],
      bildu: [2, 'A', 'Votó a favor.', ['v25']],
      pnv: [0, 'A', 'Votó en contra en 2023 por invasión de competencias; «sí crítico» al decreto principal de 2026.', ['v25', 'v01']],
      bng: [1, 'A', 'Se abstuvo en 2023 por competencias; pide topes en las ciudades gallegas.', ['v25', 'pe11']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      cc: [0, 'A', 'En contra en 2023; apoyó el decreto principal de 2026.', ['v25', 'pe12']],
      upn: [-2, 'B', 'Votó contra los decretos de 2026.', ['pe13']]
    }
  },
  {
    id: 'viv2', cat: 'viv', core: true, ax: { e: -1 },
    text: 'Los contratos de alquiler de vivienda habitual deberían prorrogarse obligatoriamente (o renovarse de forma automática) para frenar subidas y desahucios.',
    ctx: 'El 2 de octubre de 2026 el Congreso derogó el RDL 26/2026 (prórroga extraordinaria de hasta dos años y suspensión de desahucios de personas vulnerables por grandes tenedores) por 172–178, y el RDL 27/2026 (renovación automática) por 166–184. Fue el detonante del adelanto electoral.',
    ctxSrc: ['v01', 'v02', 'ctx02'],
    pro: 'Da seguridad a los inquilinos en plena escalada de rentas y evita desahucios sin alternativa.',
    con: 'Limita el derecho del propietario a disponer de su vivienda y puede retraer la oferta futura de alquiler.',
    pos: {
      psoe: [2, 'A', 'Aprobó ambos decretos.', ['v01']],
      pp: [-2, 'A', 'Votó contra ambos.', ['v01', 'v03']],
      vox: [-2, 'A', 'Votó en contra: forzar prórrogas «reduce la oferta».', ['v03']],
      sumar: [2, 'A', 'Votó a favor.', ['v01']],
      podemos: [2, 'A', 'Votó a favor.', ['v01']],
      erc: [2, 'A', 'Votó a favor.', ['pe07']],
      salf: [-2, 'C', 'Rechaza intervenir el alquiler; posición inferida.', ['pe06']],
      junts: [-2, 'A', 'Votó en contra; rechazó sobre todo la regulación del alquiler de temporada.', ['v01', 'v03']],
      bildu: [2, 'A', 'Votó a favor.', ['pe10']],
      pnv: [0, 'A', '«Sí crítico» a la prórroga; no a la renovación indefinida.', ['v01', 'pe09']],
      bng: [2, 'A', 'Votó a favor.', ['pe11']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      cc: [0, 'A', 'Sí al primer decreto; no a la renovación automática.', ['pe12']],
      upn: [-2, 'A', 'Votó en contra.', ['v03']]
    }
  },
  {
    id: 'viv3', cat: 'viv', core: true, ax: { e: 1 },
    text: 'Debería permitirse el desalojo judicial exprés (en 24-48 horas) de las viviendas ocupadas ilegalmente.',
    ctx: 'La proposición de ley del PP (desalojo en 24 horas, sin empadronamiento del ocupante y penas más duras) se tomó en consideración el 19 de mayo de 2026 por 171–164 con 11 abstenciones, pero caducó con la disolución de las Cortes.',
    ctxSrc: ['v04', 'v05'],
    pro: 'Protege al propietario frente a ocupaciones que tardan meses o años en resolverse.',
    con: 'Puede dejar sin garantías a familias vulnerables o a inquilinos en conflicto; la ley ya prevé vías de desalojo.',
    pos: {
      pp: [2, 'A', 'Autor de la ley.', ['v04', 'v05']],
      psoe: [-1, 'A', 'Votó en contra.', ['v04']],
      vox: [2, 'A', 'Votó a favor; propone el desalojo policial en 24 horas.', ['v04', 'pe03']],
      sumar: [-2, 'A', 'Votó en contra.', ['v04']],
      podemos: [-2, 'A', 'Votó en contra.', ['v04']],
      erc: [-2, 'A', 'Votó en contra.', ['v04']],
      salf: [2, 'B', 'Desalojo en 24 horas y prisión por okupación.', ['pe06']],
      junts: [1, 'A', 'Se abstuvo; propone combatir la ocupación ilegal.', ['v04', 'pe08']],
      bildu: [-2, 'A', 'Votó en contra.', ['v04']],
      pnv: [0, 'A', 'Se abstuvo.', ['v04']],
      bng: [-2, 'A', 'Votó en contra.', ['v04']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']],
      cc: [1, 'A', 'Votó a favor.', ['v04']],
      upn: [2, 'A', 'Votó a favor.', ['v04']]
    }
  },
  {
    id: 'viv4', cat: 'viv', ax: { e: -1 },
    text: 'Debería restringirse la compra de vivienda por parte de no residentes de fuera de la UE y de grandes fondos de inversión.',
    ctx: 'Sánchez anunció en enero de 2025 un impuesto de hasta el 100% sobre las compras de no residentes extracomunitarios, que no llegó a aprobarse. El decreto derogado en 2026 prohibía a los fondos comprar viviendas por debajo del 70% de su valor de tasación hasta 2028.',
    ctxSrc: ['f01', 'v01'],
    pro: 'Reduce la competencia especulativa por un bien escaso en las zonas más tensionadas.',
    con: 'Puede chocar con la libre circulación de capitales en la UE y con la seguridad jurídica, y su efecto en los precios es discutido.',
    pos: {
      psoe: [2, 'B', 'Impuesto de hasta el 100% (propuesta de 2025) y límites a los fondos (RDL 26/2026).', ['f01', 'v01']],
      pp: [-1, 'C', 'Rechaza intervenir el mercado; prioriza aumentar la oferta.', ['pe01']],
      sumar: [2, 'C', 'Regular a los grandes tenedores y sancionar la especulación.', ['pe04']],
      podemos: [2, 'B', 'Prohibir las compras especulativas.', ['pe05']],
      erc: [1, 'B', 'Límites a la compra especulativa.', ['pe07']],
      junts: [-1, 'C', 'Votó contra el decreto de 2026; pide seguridad jurídica.', ['v03', 'pe08']],
      bildu: [1, 'B', 'Medidas contra la compra especulativa.', ['pe10']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [-1, 'C', 'Seguridad jurídica para los propietarios.', ['pe13']]
    }
  },
  {
    id: 'viv5', cat: 'viv', ax: { e: -1 },
    text: 'Deberían limitarse más los pisos turísticos (licencias, impuestos) para devolver vivienda al alquiler residencial.',
    ctx: 'El decreto derogado en octubre de 2026 aplicaba un IVA del 10% a los pisos turísticos y recargos del IBI a la vivienda vacía. Varias comunidades y ayuntamientos ya limitan las licencias.',
    ctxSrc: ['v01'],
    pro: 'Recupera viviendas para residentes en barrios saturados por el turismo.',
    con: 'El turismo genera rentas y empleo; las limitaciones pueden vulnerar derechos de los propietarios y desplazar la actividad a otras zonas.',
    pos: {
      psoe: [2, 'A', 'IVA del 10% en el decreto de 2026.', ['v01', 'pe02']],
      pp: [-1, 'C', 'Votó contra el decreto que lo incluía; algunas comunidades del PP limitan licencias.', ['v01']],
      vox: [-1, 'C', 'Votó contra el decreto.', ['v03']],
      sumar: [2, 'B', 'Límites a los pisos turísticos.', ['pe04']],
      podemos: [1, 'C', 'Posición inferida.', ['pe05']],
      erc: [2, 'B', 'Límites a los pisos turísticos.', ['pe07']],
      bildu: [2, 'B', 'Medidas contra los pisos turísticos.', ['pe10']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      cc: [1, 'B', 'Quiere regular el alquiler vacacional en Canarias.', ['pe12']]
    }
  },

  /* ───────────── INMIGRACIÓN ───────────── */
  {
    id: 'inm1', cat: 'inm', core: true, ax: { s: -1 },
    text: 'España debería facilitar la regularización de los inmigrantes en situación irregular que ya viven y trabajan aquí, como la regularización extraordinaria de 2026.',
    ctx: 'Tras una iniciativa legislativa popular con más de 600.000 firmas (tramitada en abril de 2024 con el apoyo de todos los grupos salvo Vox), el Gobierno aprobó por real decreto (RD 316/2026) una regularización para quienes llevaran al menos cinco meses en España antes de 2026 y sin antecedentes penales. Se esperaban unas 500.000 personas; las solicitudes rondaron las 900.000.',
    ctxSrc: ['v09', 'v47', 'q16'],
    pro: 'Aflora empleo sumergido, aumenta las cotizaciones y reduce la explotación laboral.',
    con: 'Puede generar un «efecto llamada» y tensionar servicios públicos; se aprobó sin pasar por el Congreso.',
    pos: {
      psoe: [2, 'A', 'Aprobó el RD 316/2026.', ['v47']],
      pp: [-2, 'B', 'Votó tramitar la ILP en 2024, pero hoy promete el «fin de las regularizaciones masivas».', ['v09', 'pe01', 'v47']],
      vox: [-2, 'A', 'Único grupo en contra de la ILP; recurrió el decreto ante el Supremo.', ['v09', 'pe03']],
      sumar: [2, 'B', 'Regularización de las personas arraigadas.', ['pe04']],
      podemos: [2, 'A', 'Pactó el decreto con el PSOE.', ['v47']],
      erc: [1, 'A', 'Apoyó tramitar la ILP (2024).', ['v09']],
      salf: [-2, 'B', 'Propone un plan de «deportación masiva».', ['pe06']],
      junts: [-1, 'B', 'Apoyó la ILP en 2024; en 2026 critica la regularización y apoyó vetarla a quien tenga antecedentes.', ['v09', 'v49']],
      bildu: [2, 'B', 'Defiende la regularización.', ['pe10']],
      pnv: [1, 'A', 'Apoyó tramitar la ILP.', ['v09']],
      bng: [1, 'A', 'Apoyó tramitar la ILP.', ['v09']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      cc: [1, 'A', 'Apoyó tramitar la ILP.', ['v09']]
    }
  },
  {
    id: 'inm2', cat: 'inm', core: true, ax: { s: 1 },
    text: 'Los españoles deberían tener prioridad sobre los extranjeros con residencia legal en el acceso a ayudas sociales y vivienda pública («prioridad nacional»).',
    ctx: 'PP y Vox incluyeron una cláusula de «prioridad nacional» en sus acuerdos de gobierno de Extremadura, Aragón y Castilla y León (2026), formulada como «arraigo» y sujeta a informes de legalidad. En el Congreso, el PP votó contra las mociones de Vox para aplicarla en toda España (abril y junio de 2026).',
    ctxSrc: ['ctx15', 'ctx16', 'v20'],
    pro: 'Prioriza a quienes llevan más tiempo contribuyendo y refuerza la cohesión de la comunidad.',
    con: 'Puede vulnerar la igualdad ante la ley (art. 14 de la Constitución) y el Derecho europeo sobre residentes de larga duración.',
    pos: {
      vox: [2, 'A', 'La exige en ayudas, vivienda y servicios; mociones en el Congreso (2026).', ['v20', 'pe03']],
      pp: [0, 'A', 'La pacta en tres comunidades como «arraigo», pero vota contra la versión de Vox en el Congreso.', ['v20', 'v21', 'ctx15']],
      psoe: [-2, 'A', 'Votó contra la moción de Vox.', ['v20']],
      sumar: [-2, 'A', 'Votó contra la moción de Vox.', ['v20']],
      podemos: [-2, 'B', 'Todos los grupos salvo Vox votaron en contra, según la crónica.', ['v20']],
      erc: [-2, 'A', 'Votó contra la moción de Vox.', ['v20']],
      salf: [2, 'B', 'Prioridad para españoles y residentes legales en ayudas y vivienda protegida.', ['pe06']],
      junts: [-1, 'A', 'Votó contra la moción de Vox.', ['v20']],
      bildu: [-2, 'A', 'Votó contra la moción de Vox.', ['v20']],
      pnv: [-2, 'A', 'Votó contra la moción de Vox.', ['v20']],
      bng: [-2, 'B', 'Todos los grupos salvo Vox votaron en contra, según la crónica.', ['v20']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']],
      cc: [-1, 'C', 'Todos los grupos salvo Vox votaron en contra; voto individual no detallado.', ['v20']]
    }
  },
  {
    id: 'inm3', cat: 'inm', core: true, ax: { s: -1 },
    text: 'La acogida de menores migrantes no acompañados debería repartirse obligatoriamente entre todas las comunidades autónomas.',
    ctx: 'El RDL 2/2025 creó un mecanismo obligatorio de reparto (unos 4.000 menores desde Canarias y 400 desde Ceuta el primer año). Se convalidó el 10 de abril de 2025 (179–170) tras un pacto con Junts; comunidades del PP lo recurrieron.',
    ctxSrc: ['v11'],
    pro: 'Reparte una responsabilidad que hoy recae sobre Canarias, Ceuta y Melilla, cuyos centros están desbordados.',
    con: 'Invade competencias autonómicas y no actúa sobre la causa: la llegada irregular.',
    pos: {
      psoe: [2, 'A', 'Aprobó el RDL 2/2025.', ['v11']],
      pp: [-1, 'A', 'Votó en contra.', ['v11']],
      vox: [-2, 'A', 'Votó en contra; rompió sus gobiernos autonómicos por este motivo (jul-2024).', ['v11', 'r01']],
      sumar: [2, 'A', 'Votó a favor.', ['v11']],
      podemos: [2, 'A', 'Votó a favor.', ['v11']],
      erc: [1, 'A', 'Votó a favor.', ['v11']],
      salf: [-2, 'C', 'Posición inferida.', ['pe06']],
      junts: [0, 'A', 'Votó a favor tras pactar criterios que limitan las llegadas a Cataluña.', ['v11']],
      bildu: [2, 'A', 'Votó a favor.', ['v11']],
      pnv: [1, 'A', 'Votó a favor; pide corresponsabilidad del Estado.', ['v11', 'pe09']],
      bng: [1, 'A', 'Votó a favor.', ['v11']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      cc: [2, 'A', 'Lo reclama; votó a favor.', ['v11', 'pe12']]
    }
  },
  {
    id: 'inm4', cat: 'inm', ax: { s: 1 },
    text: 'Los extranjeros condenados por delitos graves o reincidentes deberían ser expulsados como norma general.',
    ctx: 'El Código Penal ya permite sustituir ciertas penas por la expulsión (art. 89). El PP propone la expulsión «como regla» tras delitos graves o reincidencia; Vox, en todos los casos de reincidencia, además de retirar la nacionalidad.',
    ctxSrc: ['pe01', 'pe03'],
    pro: 'Protege a la sociedad de quien abusa de la acogida y refuerza la legalidad migratoria.',
    con: 'Puede ser desproporcionado (arraigo, familia), es difícil de ejecutar sin acuerdos de retorno y estigmatiza a un colectivo.',
    pos: {
      pp: [2, 'B', 'Expulsión como regla tras delitos graves o reincidencia.', ['pe01']],
      vox: [2, 'B', 'Deportación inmediata de los extranjeros que cometan delitos.', ['pe03']],
      sumar: [-1, 'C', 'Rechaza los enfoques securitarios.', ['pe04']],
      podemos: [-2, 'C', 'Rechaza la criminalización de la inmigración.', ['pe05']],
      erc: [-1, 'C', 'Posición inferida.', ['pe07']],
      salf: [2, 'B', 'Expulsión de los inmigrantes irregulares, a los que vincula con la delincuencia.', ['pe06']],
      junts: [1, 'B', 'Pide que Cataluña gestione las expulsiones; apoyó vetar la regularización con antecedentes.', ['pe08', 'v49']],
      bildu: [-2, 'B', 'Rechaza vincular inmigración y delincuencia.', ['pe10']],
      bng: [-1, 'C', 'Posición inferida.', ['pe11']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [1, 'C', 'Control de la inmigración irregular.', ['pe13']]
    }
  },
  {
    id: 'inm5', cat: 'inm', ax: { s: -1 },
    text: 'En conjunto, la inmigración es necesaria para sostener la economía y las pensiones de España.',
    ctx: 'Sánchez defendió en el Congreso (oct-2024) que España debe elegir entre ser «un país abierto y próspero o cerrado y pobre», y vinculó la regularización a las pensiones (abr-2026). Vox y SALF sostienen que la respuesta al envejecimiento debe ser la natalidad.',
    ctxSrc: ['m01', 'm02', 'pe06'],
    pro: 'Cubre puestos de trabajo vacantes, aporta cotizantes jóvenes y frena el envejecimiento de la población.',
    con: 'El efecto fiscal depende de salarios y empleo; la presión sobre vivienda y servicios y la integración son retos reales.',
    pos: {
      psoe: [2, 'B', '«País abierto y próspero»; la regularización es «necesaria» para las pensiones.', ['m01', 'm02']],
      pp: [1, 'B', 'Defiende una inmigración «legal, ordenada y mutuamente beneficiosa», con cuotas y visado por puntos.', ['pe01']],
      vox: [-2, 'B', 'Propone la «remigración»; natalidad frente a inmigración.', ['pe03']],
      sumar: [2, 'C', 'Vías legales y seguras.', ['pe04']],
      podemos: [2, 'C', 'Vías legales y seguras.', ['pe05']],
      erc: [1, 'C', 'Acogida e integración a través del catalán y del empleo.', ['pe07']],
      salf: [-2, 'B', 'La natalidad, no la inmigración, debe responder al envejecimiento.', ['pe06']],
      bildu: [2, 'C', 'Acogida y acceso pleno a los servicios.', ['pe10']],
      pnv: [1, 'B', 'Inmigración ordenada ligada al mercado laboral vasco.', ['pe09']],
      bng: [2, 'B', 'La ve como parte de la respuesta al envejecimiento de Galicia.', ['pe11']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [1, 'B', 'Inmigración ordenada y ligada al empleo.', ['pe13']]
    }
  },

  /* ───────────── MODELO TERRITORIAL ───────────── */
  {
    id: 'ter1', cat: 'ter', core: true, ax: { t: -1 },
    text: 'La Ley de Amnistía para los implicados en el «procés» fue una medida acertada para la convivencia.',
    ctx: 'La Ley Orgánica 1/2024 se aprobó el 30 de mayo de 2024 (177–172) y el Tribunal Constitucional la avaló en junio de 2025. El Supremo no la aplica a la malversación de Puigdemont. Antes de las elecciones de 2023, Sánchez y otros dirigentes socialistas sostenían que no cabía en la Constitución.',
    ctxSrc: ['v07', 'p01', 't07'],
    pro: 'Rebajó la tensión en Cataluña y facilitó la normalización institucional y el regreso a la política ordinaria.',
    con: 'Se aprobó a cambio de los votos para una investidura, contradice lo dicho antes de las elecciones y rompe la igualdad ante la ley.',
    pos: {
      psoe: [2, 'A', 'Aprobó la ley; la defiende como «herramienta de normalización».', ['v07', 'pe02']],
      pp: [-2, 'A', 'Votó en contra y promete derogarla.', ['v07', 'pe01']],
      vox: [-2, 'A', 'Votó en contra y promete derogarla.', ['v07', 'pe03']],
      sumar: [2, 'A', 'Votó a favor.', ['v07']],
      podemos: [2, 'A', 'Votó a favor.', ['v07']],
      erc: [2, 'A', 'Votó a favor.', ['v07']],
      salf: [-2, 'B', 'Se opuso.', ['pe06']],
      junts: [2, 'A', 'Votó a favor y exige aplicarla también a Puigdemont.', ['v07', 'pe08']],
      bildu: [2, 'A', 'Votó a favor.', ['v07']],
      pnv: [1, 'A', 'Votó a favor.', ['v07']],
      bng: [1, 'A', 'Votó a favor.', ['v07']],
      cc: [-1, 'A', 'Votó en contra («motivos inaceptables»).', ['v07', 't12']],
      upn: [-2, 'A', 'Votó en contra.', ['v07']]
    }
  },
  {
    id: 'ter2', cat: 'ter', core: true, ax: { t: -1 },
    text: 'Cataluña (y otras comunidades que lo pidan) debería poder recaudar y gestionar todos sus impuestos, con una financiación «singular».',
    ctx: 'El pacto PSC-ERC de 2024 prevé que la Generalitat recaude todos los impuestos, empezando por el IRPF; el calendario se ha retrasado a 2027–2028. La propuesta de nuevo modelo con «ordinalidad» (enero de 2026) quedó congelada por falta de mayoría. País Vasco y Navarra ya tienen concierto o convenio.',
    ctxSrc: ['t04', 't05', 'p16'],
    pro: 'Da más autonomía y responsabilidad fiscal y corrige un déficit fiscal que Cataluña considera excesivo.',
    con: 'Rompe la caja común, puede reducir la solidaridad con las comunidades de menor renta y prima los pactos bilaterales.',
    pos: {
      erc: [2, 'A', 'Firmó el pacto de financiación singular (2024).', ['t04']],
      junts: [2, 'B', 'Que Cataluña gestione toda su recaudación.', ['pe08']],
      psoe: [1, 'A', 'Firmó el pacto con ERC y propuso la «ordinalidad»; parte del partido lo rechaza.', ['t04', 'p16']],
      pp: [-2, 'A', 'Financiación en el Consejo de Política Fiscal, sin acuerdos bilaterales.', ['pe01', 'p16']],
      vox: [-2, 'B', 'Rechaza la condonación de deuda y cualquier singularidad.', ['pe03']],
      sumar: [1, 'C', 'Financiación más justa y Estado plurinacional.', ['pe04']],
      salf: [-2, 'B', 'Financiación por criterios objetivos.', ['pe06']],
      bildu: [2, 'C', 'Soberanía fiscal; Euskadi ya tiene concierto.', ['pe10']],
      pnv: [1, 'C', 'Defiende el concierto vasco y la singularidad.', ['pe09']],
      bng: [1, 'C', 'Pide un nuevo sistema adaptado a Galicia.', ['pe11']],
      cc: [1, 'C', 'Defiende el régimen económico y fiscal canario.', ['pe12']],
      upn: [-1, 'C', 'Defiende el convenio navarro; posición inferida sobre Cataluña.', ['pe13']]
    }
  },
  {
    id: 'ter3', cat: 'ter', core: true, ax: { t: -1 },
    text: 'Debería poder celebrarse un referéndum de autodeterminación pactado si un parlamento autonómico lo pide con amplia mayoría.',
    ctx: 'La Constitución no prevé referéndums de secesión; sus partidarios proponen pactarlo con el Estado o reformarla. En 2021 el Congreso rechazó una moción de ERC para negociarlo (38–276–36): el PSOE votó en contra y Unidas Podemos se abstuvo.',
    ctxSrc: ['v44'],
    pro: 'Resolvería por las urnas un conflicto político con amplio apoyo social en algunos territorios.',
    con: 'La soberanía reside en el conjunto del pueblo español (art. 1.2 de la Constitución) y un referéndum así puede fracturar a la sociedad.',
    pos: {
      erc: [2, 'B', 'Defiende un referéndum pactado.', ['pe07']],
      junts: [2, 'B', 'Aspira a la independencia y reivindica el referéndum de 2017.', ['pe08']],
      bildu: [2, 'B', 'Derecho a decidir.', ['pe10']],
      bng: [2, 'B', 'Derecho a decidir.', ['pe11']],
      pnv: [1, 'C', 'Nuevo estatus pactado que reconozca a Euskadi como nación.', ['pe09']],
      podemos: [1, 'A', 'Lo defendió históricamente; se abstuvo en la votación de 2021.', ['v44']],
      sumar: [0, 'C', 'Posiciones internas diversas: los Comuns lo apoyan; Sumar habla de Estado plurinacional.', ['pe04']],
      psoe: [-2, 'A', 'Votó en contra (2021).', ['v44']],
      pp: [-2, 'A', 'Votó en contra (2021).', ['v44']],
      vox: [-2, 'A', 'Votó en contra; propone ilegalizar partidos que persigan romper la unidad de España.', ['v44', 'pe03']],
      salf: [-2, 'C', 'Posición inferida.', ['pe06']],
      cc: [-1, 'C', 'Posición inferida.', ['pe12']],
      upn: [-2, 'C', 'Posición inferida.', ['pe13']]
    }
  },
  {
    id: 'ter4', cat: 'ter', ax: { t: 1 },
    text: 'El Estado debería recuperar competencias como la educación o la sanidad para garantizar la igualdad entre territorios.',
    ctx: 'Vox propone devolver al Estado educación, sanidad, seguridad y justicia; SALF, un currículo escolar y una central de compras sanitarias únicos. El PP defiende contenidos comunes y más presencia del Estado, sin recentralizar competencias.',
    ctxSrc: ['pe03', 'pe06', 'pe01'],
    pro: 'Garantiza los mismos servicios y derechos en todo el país y elimina duplicidades.',
    con: 'El autogobierno acerca la gestión a los ciudadanos; recentralizar exigiría reformas profundas y rompería los consensos de 1978.',
    pos: {
      vox: [2, 'B', 'Devolver al Estado educación, sanidad, seguridad y justicia.', ['pe03']],
      salf: [2, 'B', 'Un Estado más centralizado frente a las «taifas».', ['pe06']],
      pp: [-1, 'B', 'Contenidos comunes y más presencia del Estado, sin recentralizar.', ['pe01']],
      psoe: [-2, 'B', 'Estado autonómico con cogobernanza.', ['pe02']],
      sumar: [-2, 'C', 'Estado plurinacional.', ['pe04']],
      podemos: [-2, 'C', 'Reforma federal.', ['pe05']],
      erc: [-2, 'B', 'Más autogobierno.', ['pe07']],
      junts: [-2, 'B', 'Más competencias para la Generalitat.', ['pe08']],
      bildu: [-2, 'B', 'Completar las transferencias pendientes.', ['pe10']],
      pnv: [-2, 'B', 'Rechaza recentralizar la educación.', ['pe09']],
      bng: [-2, 'B', 'Más autogobierno.', ['pe11']],
      adelante: [-1, 'C', 'Andalucismo; posición inferida.', ['ctx12']],
      cc: [-2, 'C', 'Desarrollo pleno del Estatuto canario.', ['pe12']],
      upn: [-1, 'B', 'Defiende el régimen foral de Navarra.', ['pe13']]
    }
  },
  {
    id: 'ter5', cat: 'ter', ax: { t: 1 },
    text: 'Debería garantizarse por ley un mínimo de enseñanza en castellano en todas las comunidades con lengua cooficial.',
    ctx: 'Los tribunales catalanes fijaron un 25% de castellano en las aulas; la Generalitat defiende la inmersión en catalán. El PP propone el derecho a estudiar en español en todas las etapas educativas.',
    ctxSrc: ['pe01', 'pe07'],
    pro: 'Garantiza el derecho a recibir enseñanza en la lengua común y la libertad de elección de las familias.',
    con: 'La inmersión protege lenguas minorizadas y logra que el alumnado domine ambas; los porcentajes fijados por ley o por jueces fragmentan la escuela.',
    pos: {
      pp: [2, 'B', 'Derecho a estudiar en español en todas las etapas.', ['pe01']],
      vox: [2, 'B', 'Derecho a estudiar en español en todo el territorio.', ['pe03']],
      salf: [1, 'C', 'Currículo único nacional.', ['pe06']],
      psoe: [-1, 'C', 'El PSC defiende la inmersión; sin propuesta estatal de mínimos.', ['pe02']],
      sumar: [-2, 'C', 'Posición inferida.', ['pe04']],
      podemos: [-1, 'C', 'Posición inferida.', ['pe05']],
      erc: [-2, 'B', 'Inmersión en catalán; rechaza las sentencias del 25%.', ['pe07']],
      junts: [-2, 'B', 'Inmersión; rechaza los porcentajes impuestos por los tribunales.', ['pe08']],
      bildu: [-2, 'B', 'El euskera como lengua vehicular.', ['pe10']],
      pnv: [-2, 'B', 'El euskera como eje de la educación.', ['pe09']],
      bng: [-2, 'B', 'El gallego como lengua vehicular.', ['pe11']],
      upn: [1, 'B', 'Libertad de modelo lingüístico; critica la extensión del euskera.', ['pe13']]
    }
  },

  /* ───────────── INSTITUCIONES Y JUSTICIA ───────────── */
  {
    id: 'ins1', cat: 'ins', core: true,
    text: 'Los vocales jueces del Consejo General del Poder Judicial deberían ser elegidos directamente por los propios jueces, no por el Parlamento.',
    ctx: 'El CGPJ estuvo más de cinco años y medio con el mandato caducado (diciembre de 2018 a junio de 2024) hasta un acuerdo PP-PSOE con mediación de la Comisión Europea, que incluía estudiar una reforma del sistema de elección.',
    ctxSrc: ['v40', 'v41'],
    pro: 'Reduce la influencia de los partidos sobre el gobierno de los jueces, como recomiendan instituciones europeas.',
    con: 'Puede dar el control a las asociaciones judiciales mayoritarias y restar legitimidad democrática al órgano.',
    pos: {
      pp: [2, 'B', 'Los jueces elegirían a los vocales judiciales.', ['pe01']],
      vox: [2, 'B', 'Llevó una ley orgánica en ese sentido al Congreso (2024).', ['pe03']],
      psoe: [-1, 'C', 'Defiende la elección parlamentaria; el acuerdo de 2024 abría un estudio de reforma.', ['v40', 'pe02']],
      sumar: [-1, 'C', 'Revisar los mecanismos de designación con transparencia.', ['pe04']],
      podemos: [-1, 'C', 'Despolitización «parcial» de los nombramientos.', ['pe05']],
      junts: [1, 'C', '«Blindar» el poder judicial frente a los partidos.', ['pe08']]
    }
  },
  {
    id: 'ins2', cat: 'ins',
    text: 'Debería prohibirse que los partidos políticos y las asociaciones vinculadas a ellos ejerzan la acusación popular en los procesos penales.',
    ctx: 'El PSOE registró en enero de 2025 una proposición de ley que lo prohíbe (y suprime el delito de ofensas religiosas), aplicable a causas ya abiertas. Sus críticos la vinculan a los procesos que afectan a la familia del presidente.',
    ctxSrc: ['v38', 'v39'],
    pro: 'Evita el uso partidista de los juzgados y las querellas basadas en recortes de prensa.',
    con: 'La acusación popular es un control ciudadano previsto en la Constitución (art. 125) y ha impulsado causas de corrupción.',
    pos: {
      psoe: [2, 'A', 'Autor de la proposición de ley (ene-2025).', ['v38']],
      pp: [-2, 'B', 'Defiende mantener la acusación popular.', ['pe01']],
      vox: [-2, 'C', 'Ejerce la acusación popular en varias causas; posición inferida.', ['pe03']],
      sumar: [0, 'B', 'Mostró recelos ante la propuesta.', ['v39']],
      junts: [1, 'B', 'Enmienda a la totalidad por considerarla «insuficiente».', ['v39', 'v55']],
      bildu: [1, 'B', 'La ve con buenos ojos.', ['v39']],
      pnv: [0, 'B', 'Mostró recelos ante la propuesta.', ['v39']]
    }
  },
  {
    id: 'ins3', cat: 'ins',
    text: 'Deberían prohibirse los indultos por corrupción y por delitos contra el orden constitucional.',
    ctx: 'En 2021 el Gobierno indultó parcialmente a los líderes del «procés» condenados por sedición y malversación, con informe desfavorable del Supremo. PP y Vox proponen vetar los indultos por corrupción y por delitos contra la forma del Estado.',
    ctxSrc: ['p03', 'pe01', 'pe03'],
    pro: 'Impide que un Gobierno perdone delitos de sus aliados o de su propio entorno.',
    con: 'El indulto es una herramienta de gracia útil para la convivencia y no debería limitarse por tipo de delito.',
    pos: {
      pp: [2, 'B', 'Prohibir indultos por terrorismo y corrupción; a cargos políticos solo con dos tercios del Congreso.', ['pe01']],
      vox: [2, 'B', 'Prohibir indultos por corrupción o delitos contra la forma del Estado.', ['pe03']],
      salf: [1, 'C', 'Discurso anticorrupción: imprescriptibilidad de esos delitos.', ['pe06']],
      psoe: [-2, 'A', 'Concedió los indultos de 2021.', ['p03']],
      sumar: [-1, 'C', 'Unidas Podemos, en el Gobierno, apoyó los indultos de 2021.', ['p03']],
      podemos: [-1, 'C', 'Apoyó los indultos de 2021 desde el Gobierno.', ['p03']],
      erc: [-2, 'C', 'Sus líderes fueron indultados; posición inferida.', ['p03']],
      junts: [-2, 'C', 'Posición inferida.', ['p03']],
      bildu: [-2, 'C', 'Posición inferida.', ['pe10']]
    }
  },
  {
    id: 'ins4', cat: 'ins',
    text: 'España debería celebrar un referéndum para elegir entre monarquía y república.',
    ctx: 'Cambiar la forma de Estado exige una reforma constitucional agravada (art. 168). En 2025, ERC, Junts, EH Bildu, Podemos y el BNG no asistieron al acto del Congreso por los 50 años de la monarquía; IU pide un referéndum.',
    ctxSrc: ['v42', 'v43'],
    pro: 'Las generaciones nacidas después de 1960 nunca han votado la forma de Estado; una consulta la legitimaría o la cambiaría.',
    con: 'La monarquía parlamentaria aporta estabilidad y el debate dividiría sin resolver problemas más urgentes.',
    pos: {
      podemos: [2, 'B', 'Republicano; no asistió al acto de los 50 años de la monarquía.', ['v42']],
      sumar: [1, 'B', 'IU pide un referéndum; la coalición no lo plantea como prioridad.', ['v43']],
      erc: [2, 'B', 'Republicano.', ['v42']],
      junts: [1, 'B', 'Defiende una república catalana; no asistió al acto.', ['v42']],
      bildu: [2, 'B', 'Republicano.', ['v42']],
      bng: [2, 'B', 'Republicano.', ['v42']],
      psoe: [-2, 'A', 'Votó contra una consulta sobre la república (legislatura 2011–2015).', ['v54']],
      pp: [-2, 'A', 'Votó en contra de esa consulta.', ['v54']],
      vox: [-2, 'C', 'Defiende la monarquía; posición inferida.', ['pe03']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      cc: [-1, 'C', 'Posición inferida.', ['pe12']],
      upn: [-2, 'C', 'Posición inferida.', ['pe13']]
    }
  },
  {
    id: 'ins5', cat: 'ins', ax: { s: 1 },
    text: 'Debería derogarse la Ley de Memoria Democrática de 2022.',
    ctx: 'La ley (2022) declara ilegal el régimen franquista, refuerza la búsqueda de desaparecidos y amplía el periodo de estudio hasta 1983. PP y Vox prometen derogarla.',
    ctxSrc: ['v27', 'pe01', 'pe03'],
    pro: 'Sus críticos la consideran una lectura parcial del pasado que reabre heridas y divide.',
    con: 'Repara a las víctimas del franquismo, muchas aún en fosas comunes, y aplica estándares internacionales de verdad y reparación.',
    pos: {
      pp: [2, 'B', 'Promete derogarla.', ['pe01']],
      vox: [2, 'B', 'Promete derogarla.', ['pe03']],
      psoe: [-2, 'A', 'La aprobó.', ['v27']],
      sumar: [-2, 'A', 'Unidas Podemos la votó.', ['v27']],
      podemos: [-2, 'A', 'La votó.', ['v27']],
      pnv: [-2, 'A', 'La votó.', ['v27']],
      bildu: [-2, 'A', 'La votó tras ampliar el periodo hasta 1983.', ['v27']],
      erc: [-1, 'A', 'Se abstuvo por considerarla insuficiente.', ['v27']],
      bng: [-2, 'C', 'Posición inferida.', ['pe11']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [1, 'C', 'Prioriza la memoria de las víctimas del terrorismo.', ['pe13']]
    }
  },

  /* ───────────── SEGURIDAD ───────────── */
  {
    id: 'seg1', cat: 'seg', core: true, ax: { s: -1 },
    text: 'Debería derogarse o reformarse a fondo la Ley de Seguridad Ciudadana de 2015 («ley mordaza»).',
    ctx: 'La ley, aprobada por el PP en 2015, sigue en vigor once años después. Su reforma era un compromiso del pacto de Gobierno PSOE-Sumar, pero quedó bloqueada por los desacuerdos sobre pelotas de goma, faltas de respeto a la autoridad y devoluciones en frontera.',
    ctxSrc: ['c10', 'c11'],
    pro: 'Algunas sanciones administrativas limitan los derechos de reunión y expresión y dan un amplio margen a la policía.',
    con: 'Da herramientas a las fuerzas de seguridad para mantener el orden público; los sindicatos policiales se oponen a la reforma.',
    pos: {
      psoe: [1, 'B', 'Comprometió su reforma; no la ha culminado.', ['c10', 'c11']],
      pp: [-2, 'C', 'La aprobó en 2015.', ['c10']],
      vox: [-2, 'C', 'Rechaza la reforma; posición inferida.', ['c10']],
      sumar: [2, 'B', 'Compromiso del pacto de Gobierno.', ['c11']],
      podemos: [2, 'B', 'Defiende su derogación.', ['c11']],
      erc: [2, 'B', 'Defiende su derogación.', ['c10']],
      salf: [-2, 'C', 'Posición inferida.', ['pe06']],
      bildu: [2, 'B', 'Defiende su derogación.', ['c10']],
      pnv: [1, 'B', 'Autor de una propuesta de reforma.', ['c10']],
      bng: [2, 'C', 'Posición inferida.', ['pe11']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [-2, 'C', 'Posición inferida.', ['pe13']]
    }
  },
  {
    id: 'seg2', cat: 'seg', ax: { s: 1 },
    text: 'Debería ampliarse la prisión permanente revisable a más delitos.',
    ctx: 'El Congreso rechazó el 17 de marzo de 2026 (172–174) tomar en consideración una propuesta del PP para aplicarla a asesinatos con ocultación del cadáver o reincidencia. Solo la apoyaron PP, Vox, UPN y CC.',
    ctxSrc: ['v19'],
    pro: 'Protege frente a los delitos más graves y reincidentes y responde a una demanda social.',
    con: 'Sus críticos dudan de su efecto disuasorio y de su encaje con el fin de reinserción de las penas (art. 25 de la Constitución).',
    pos: {
      pp: [2, 'A', 'Autor de la propuesta.', ['v19']],
      vox: [2, 'A', 'Votó a favor.', ['v19']],
      upn: [1, 'A', 'Votó a favor.', ['v19']],
      cc: [1, 'A', 'Votó a favor.', ['v19']],
      salf: [1, 'C', 'Defiende un fuerte endurecimiento penal.', ['pe06']],
      psoe: [-1, 'A', 'Votó en contra.', ['v19']],
      sumar: [-2, 'A', 'Votó en contra.', ['v19']],
      podemos: [-2, 'A', 'Votó en contra.', ['v19']],
      erc: [-2, 'A', 'Votó en contra.', ['v19']],
      junts: [-1, 'A', 'Votó en contra.', ['v19']],
      bildu: [-2, 'A', 'Votó en contra.', ['v19']],
      pnv: [-1, 'A', 'Votó en contra.', ['v19']],
      bng: [-2, 'A', 'Votó en contra.', ['v19']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']]
    }
  },
  {
    id: 'seg3', cat: 'seg', ax: { s: 1 },
    text: 'Deberían endurecerse las penas a la multirreincidencia en hurtos y delitos leves.',
    ctx: 'La ley de multirreincidencia, propuesta por Junts, se aprobó el 12 de febrero de 2026 (302–36) y está en vigor desde abril: castiga con prisión a quien acumule varias condenas por hurto y endurece el robo de móviles.',
    ctxSrc: ['v17', 'v18'],
    pro: 'Responde a un problema concentrado en pocos autores que reinciden decenas de veces.',
    con: 'Puede llenar las cárceles de pequeños delincuentes sin atacar causas como la pobreza o las adicciones.',
    pos: {
      junts: [2, 'A', 'Autora de la ley.', ['v17', 'v18']],
      pp: [2, 'A', 'Votó a favor.', ['v17']],
      vox: [2, 'A', 'Votó a favor.', ['v17']],
      psoe: [1, 'A', 'Votó a favor y reactivó su tramitación.', ['v17']],
      pnv: [1, 'A', 'Votó a favor.', ['v17']],
      cc: [1, 'B', 'Entre los 302 votos a favor, según el recuento.', ['v17']],
      upn: [1, 'B', 'Entre los 302 votos a favor, según el recuento.', ['v17']],
      erc: [0, 'A', 'Se abstuvo.', ['v17']],
      sumar: [-2, 'A', 'Votó en contra.', ['v17']],
      podemos: [-2, 'A', 'Votó en contra.', ['v17']],
      salf: [2, 'B', 'Macrocárcel para multirreincidentes.', ['pe06']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']]
    }
  },

  /* ───────────── IGUALDAD Y DERECHOS ───────────── */
  {
    id: 'igu1', cat: 'igu', core: true, ax: { s: -1 },
    text: 'El derecho al aborto debería incluirse expresamente en la Constitución.',
    ctx: 'El Gobierno aprobó en abril de 2026 una reforma del artículo 43 para «garantizar» la interrupción voluntaria del embarazo. El Congreso rechazó las enmiendas de totalidad de PP y Vox (177–171), pero la reforma necesita tres quintos y decae con la disolución.',
    ctxSrc: ['v15', 'v16'],
    pro: 'Blinda un derecho frente a cambios de mayoría y garantiza su prestación en la sanidad pública.',
    con: 'Ya está regulado por ley; llevarlo a la Constitución cierra un debate moral en el que la sociedad está dividida.',
    pos: {
      psoe: [2, 'A', 'Promotor de la reforma.', ['v16']],
      pp: [-2, 'A', 'Enmienda de totalidad; acepta la ley vigente: «un derecho de acuerdo con la ley».', ['v15', 'q17']],
      vox: [-2, 'A', 'Enmienda de totalidad; propone derogar la ley del aborto.', ['v15', 'pe03']],
      sumar: [2, 'B', 'Rechazó los vetos (recuento 177–171).', ['v15']],
      podemos: [2, 'B', 'Rechazó los vetos (recuento 177–171).', ['v15']],
      erc: [1, 'A', 'Apoya el derecho; critica la vía elegida.', ['v15']],
      salf: [-1, 'C', 'Ayudas para que ninguna embarazada aborte por motivos económicos.', ['pe06']],
      junts: [1, 'C', 'Posición inferida del recuento (177–171).', ['v15']],
      bildu: [2, 'B', 'Rechazó los vetos (recuento 177–171).', ['v15']],
      pnv: [1, 'A', 'Apoya el derecho; critica la vía elegida.', ['v15']],
      bng: [2, 'B', 'Rechazó los vetos (recuento 177–171).', ['v15']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [-2, 'C', 'Posición inferida.', ['pe13']]
    }
  },
  {
    id: 'igu2', cat: 'igu', core: true, ax: { s: 1 },
    text: 'La ley de violencia de género debería sustituirse por una ley de violencia intrafamiliar que no distinga por sexo.',
    ctx: 'La Ley Integral de 2004 protege específicamente a las mujeres frente a la violencia de sus parejas o exparejas. Vox propone derogarla; en 2023, el pacto PP-Vox de Extremadura no mencionaba la «violencia machista».',
    ctxSrc: ['pe03', 'q09'],
    pro: 'Sus defensores sostienen que toda víctima merece la misma protección, sea cual sea su sexo.',
    con: 'La violencia en la pareja afecta de forma desproporcionada a las mujeres; una ley neutra diluiría una respuesta especializada.',
    pos: {
      vox: [2, 'B', 'Derogar la ley de 2004 y aprobar una de violencia intrafamiliar.', ['pe03']],
      pp: [-1, 'B', 'Cumplir el Pacto de Estado y endurecer las penas por violencia machista; sus pactos con Vox han evitado el término.', ['pe01', 'q09']],
      psoe: [-2, 'B', 'Lucha contra la violencia machista.', ['pe02']],
      sumar: [-2, 'B', 'Lucha contra la violencia machista.', ['pe04']],
      podemos: [-2, 'B', 'Refuerzo de la ley contra la violencia machista.', ['pe05']],
      erc: [-2, 'B', 'Partido feminista.', ['pe07']],
      junts: [-2, 'B', 'Apoya las políticas contra la violencia de género.', ['pe08']],
      bildu: [-2, 'B', 'Más recursos contra la violencia machista.', ['pe10']],
      pnv: [-2, 'C', 'Posición inferida.', ['pe09']],
      bng: [-2, 'B', 'Más recursos contra la violencia machista.', ['pe11']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']],
      cc: [-2, 'B', 'Apoya las políticas contra la violencia de género.', ['pe12']],
      upn: [-1, 'B', 'Apoya las políticas contra la violencia de género.', ['pe13']]
    }
  },
  {
    id: 'igu3', cat: 'igu', ax: { s: 1 },
    text: 'Debería derogarse la «Ley Trans» y volver a exigir requisitos médicos para el cambio registral de sexo.',
    ctx: 'La ley de 2023 permite cambiar el sexo registral por la sola voluntad a partir de los 16 años (con reglas específicas para menores). Se aprobó con el apoyo del PSOE —salvo la abstención de Carmen Calvo y otros tres diputados— y el rechazo de PP, Vox y Ciudadanos.',
    ctxSrc: ['g01', 'g02'],
    pro: 'Sus críticos, también desde parte del feminismo, temen efectos en el deporte, en los espacios femeninos y en menores.',
    con: 'Despatologiza a las personas trans y equipara a España con otros países; los requisitos médicos se consideran estigmatizantes.',
    pos: {
      pp: [2, 'B', 'Promete derogar la Ley Trans.', ['pe01', 'g01']],
      vox: [2, 'B', 'Promete derogarla.', ['pe03', 'g01']],
      salf: [1, 'B', 'Retirar de la sanidad pública los tratamientos de cambio de sexo.', ['pe06']],
      psoe: [-1, 'A', 'La aprobó, con disidencias internas.', ['g01', 'g02']],
      sumar: [-2, 'A', 'Unidas Podemos la impulsó.', ['g01']],
      podemos: [-2, 'A', 'Impulsora desde el Ministerio de Igualdad.', ['g01']],
      erc: [-2, 'C', 'Posición inferida.', ['pe07']],
      junts: [-1, 'C', 'Posición inferida.', ['pe08']],
      bildu: [-2, 'C', 'Defiende los derechos LGTBI.', ['pe10']],
      pnv: [-1, 'C', 'Posición inferida.', ['pe09']],
      bng: [-2, 'C', 'Posición inferida.', ['pe11']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']]
    }
  },
  {
    id: 'igu4', cat: 'igu', ax: { s: -1 },
    text: 'La eutanasia debe seguir siendo legal en España.',
    ctx: 'La ley se aprobó en marzo de 2021 (202–141) con el apoyo de PSOE, Unidas Podemos, ERC, Junts, PNV, EH Bildu, BNG y Ciudadanos; PP, Vox y UPN votaron en contra, y PP y Vox la recurrieron al Tribunal Constitucional.',
    ctxSrc: ['v26'],
    pro: 'Reconoce el derecho a decidir sobre el final de la propia vida con garantías médicas.',
    con: 'Puede presionar a personas vulnerables; sus críticos priorizan los cuidados paliativos.',
    pos: {
      psoe: [2, 'A', 'Votó a favor.', ['v26']],
      pp: [-1, 'A', 'Votó en contra (2021) y la recurrió al Constitucional.', ['v26']],
      vox: [-2, 'A', 'Votó en contra y propone derogarla.', ['v26', 'pe03']],
      sumar: [2, 'A', 'Unidas Podemos votó a favor.', ['v26']],
      podemos: [2, 'A', 'Votó a favor.', ['v26']],
      erc: [2, 'A', 'Votó a favor.', ['v26']],
      junts: [2, 'A', 'Votó a favor.', ['v26']],
      bildu: [2, 'A', 'Votó a favor.', ['v26']],
      pnv: [2, 'A', 'Votó a favor.', ['v26']],
      bng: [2, 'A', 'Votó a favor.', ['v26']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [-2, 'A', 'Votó en contra.', ['v26']]
    }
  },
  {
    id: 'igu5', cat: 'igu', ax: { s: 1 },
    text: 'Debería prohibirse el uso del burka y el niqab en los espacios públicos.',
    ctx: 'El 17 de febrero de 2026 el Congreso rechazó la ley de Vox (170–177). Junts votó en contra por motivos competenciales y presentó la suya, que solo apoyó Junts. El PSOE se mostró abierto a negociar la de Junts; Sumar la calificó de racista.',
    ctxSrc: ['v28', 'v29'],
    pro: 'Defiende la igualdad de la mujer y la identificación en el espacio público.',
    con: 'Afecta a muy pocas personas, puede estigmatizar a una minoría religiosa y aislar aún más a esas mujeres.',
    pos: {
      vox: [2, 'A', 'Autor de la ley rechazada.', ['v28']],
      pp: [2, 'A', 'Votó a favor; rechaza el burka y el niqab.', ['v28', 'pe01']],
      junts: [2, 'A', 'Presentó su propia ley de prohibición.', ['v28', 'v29']],
      upn: [1, 'B', 'Votó a favor de la ley de Vox, según el recuento.', ['v28']],
      psoe: [0, 'B', 'Votó contra la de Vox, pero se abrió a negociar la de Junts.', ['v29']],
      erc: [-1, 'A', 'Se abstuvo en la de Junts.', ['v28']],
      sumar: [-2, 'B', 'La considera racista.', ['v29']],
      podemos: [-2, 'C', 'Posición inferida.', ['v29']],
      bildu: [-2, 'C', 'Posición inferida.', ['v28']],
      pnv: [-1, 'C', 'Posición inferida.', ['v28']],
      bng: [-2, 'C', 'Posición inferida.', ['v28']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']]
    }
  },

  /* ───────────── EXTERIOR Y DEFENSA ───────────── */
  {
    id: 'ext1', cat: 'ext', core: true,
    text: 'España debería aumentar el gasto en defensa hasta los objetivos de la OTAN acordados en La Haya (3,5% + 1,5% del PIB en 2035).',
    ctx: 'España alcanzó por primera vez el 2% del PIB en 2025, con un plan de 10.471 M€ aprobado sin votación parlamentaria. En La Haya (junio de 2025) firmó la declaración, pero sostiene que no necesita superar el 2,1%; Trump amenazó con represalias comerciales.',
    ctxSrc: ['x29', 'x33', 'x01'],
    pro: 'Refuerza la seguridad ante Rusia y la credibilidad ante los aliados, y estimula la industria de defensa.',
    con: 'Exige decenas de miles de millones más al año, que saldrían de otras partidas o de más deuda; el 5% es un objetivo discutido.',
    pos: {
      psoe: [-2, 'A', 'Rechaza el 5%: «no sacrificar el Estado del Bienestar».', ['ctx01', 'x01']],
      pp: [0, 'B', 'Más del 2% «con el aval del Congreso», sin comprometer el 5%.', ['x02', 'pe01']],
      vox: [1, 'B', 'Más del 2%, sin cifrar; condicionado a la protección de fronteras.', ['x03']],
      sumar: [-2, 'B', 'Se opuso al plan de 10.471 M€.', ['x30']],
      podemos: [-2, 'B', 'Rechaza el aumento del gasto militar.', ['x25', 'pe05']],
      erc: [-1, 'C', 'Posición inferida.', ['pe07']],
      salf: [-2, 'B', 'Votó contra el plan europeo de rearme (mar-2025).', ['pe06']],
      bildu: [-2, 'B', 'Crítico con la OTAN y el gasto militar.', ['pe10']],
      bng: [-2, 'B', 'Crítico con la OTAN y el gasto militar.', ['pe11']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [1, 'C', 'Atlantista.', ['pe13']]
    }
  },
  {
    id: 'ext2', cat: 'ext',
    text: 'España debería seguir enviando ayuda militar a Ucrania.',
    ctx: 'España envía ayuda militar a Ucrania desde 2022. En enero de 2026 Sánchez abrió la puerta a una futura misión de paz con militares españoles; Podemos e IU se opusieron, y PP y Sumar pidieron conocer los detalles.',
    ctxSrc: ['x26', 'ctx01'],
    pro: 'Ayudar a Ucrania a defenderse frena una agresión que amenaza la seguridad europea.',
    con: 'Prolonga la guerra y el riesgo de escalada; esos recursos podrían dedicarse a la diplomacia o a necesidades internas.',
    pos: {
      psoe: [2, 'B', 'Apoyo «firme» a Ucrania.', ['ctx01', 'pe02']],
      pp: [2, 'C', 'Apoya a Ucrania y reprocha a Vox sus ambigüedades.', ['x27']],
      vox: [1, 'B', 'Condena la invasión «ilegítima e inmoral» pero rechaza enviar tropas; comparte grupo europeo con Orbán.', ['x27', 'x28']],
      sumar: [0, 'C', 'Dividido: IU rechaza los envíos de armas.', ['x26', 'v56']],
      podemos: [-2, 'B', 'Rechaza el envío de armas y de tropas.', ['x25']],
      salf: [-2, 'B', 'Votó contra una resolución de apoyo a Ucrania (mar-2025).', ['pe06']],
      bildu: [-1, 'B', 'Sus eurodiputados no respaldaron la ayuda urgente de 2022.', ['v56']],
      pnv: [2, 'C', 'Europeísta; posición inferida.', ['pe09']],
      bng: [-1, 'C', 'Posición inferida.', ['pe11']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [2, 'C', 'Atlantista.', ['pe13']]
    }
  },
  {
    id: 'ext3', cat: 'ext', core: true,
    text: 'España debería mantener o ampliar el embargo de armas y las sanciones a Israel por la guerra de Gaza.',
    ctx: 'España reconoció el Estado de Palestina en mayo de 2024 y aprobó un embargo de armas a Israel (RDL 10/2025), convalidado el 8 de octubre de 2025 (178–169; PP y Vox en contra, UPN se abstuvo). El Centre Delàs denuncia que seguían vigentes contratos con empresas israelíes.',
    ctxSrc: ['x10', 'v13', 'x14'],
    pro: 'Presiona para detener una guerra con un enorme coste en vidas civiles y para que se cumpla el derecho internacional.',
    con: 'Rompe con un socio democrático que combate a Hamás y perjudica a la industria y a la cooperación en seguridad.',
    pos: {
      psoe: [2, 'A', 'Aprobó el embargo y reconoció a Palestina.', ['v13', 'x10']],
      pp: [-1, 'A', 'Votó en contra; defiende dos Estados «tras una negociación real y sin Hamás».', ['v13', 'pe01']],
      vox: [-2, 'A', 'Votó en contra; aliado del Likud de Netanyahu.', ['v13', 'x15', 'x16']],
      sumar: [2, 'A', 'Votó a favor; pedía romper relaciones.', ['v13']],
      podemos: [2, 'A', 'Votó a favor tras exigir más medidas.', ['v13']],
      erc: [2, 'A', 'Votó a favor.', ['v14']],
      junts: [1, 'A', 'Votó a favor.', ['v14']],
      bildu: [2, 'A', 'Votó a favor.', ['v14']],
      pnv: [1, 'A', 'Votó a favor.', ['v14']],
      bng: [2, 'A', 'Votó a favor.', ['v14']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      cc: [1, 'A', 'Votó a favor.', ['v14']],
      upn: [0, 'A', 'Se abstuvo.', ['v14']]
    }
  },
  {
    id: 'ext4', cat: 'ext', core: true,
    text: 'España debería mantener su apoyo al plan de autonomía marroquí como base para resolver el conflicto del Sáhara Occidental.',
    ctx: 'En marzo de 2022 Sánchez calificó el plan marroquí como «la base más seria, realista y creíble», sin consultar al Congreso, que aprobó después una proposición contraria con el voto del PP. En octubre de 2025, la Resolución 2797 de la ONU afirmó por primera vez que esa autonomía «podría constituir la solución más viable».',
    ctxSrc: ['x04', 'x07'],
    pro: 'Estabiliza la relación con Marruecos (fronteras, migración, comercio) y se alinea con EE.UU., Francia y la ONU.',
    con: 'Abandona la neutralidad y el derecho de autodeterminación del pueblo saharaui, en una antigua colonia española, y tensa la relación con Argelia.',
    pos: {
      psoe: [2, 'A', 'Autor del giro de 2022.', ['x07']],
      pp: [-1, 'B', 'Votó la proposición pro-referéndum (2022) y pidió revocar el «posicionamiento unilateral» (2024); hoy habla de respetar las resoluciones de la ONU.', ['x04', 'x06', 'pe01']],
      vox: [-1, 'A', 'Se abstuvo en 2022 y criticó el «volantazo»; exige firmeza con Marruecos.', ['x05', 'pe03']],
      sumar: [-2, 'B', 'Proposición por la autodeterminación (nov-2025).', ['x08']],
      podemos: [-2, 'A', 'Impulsó la proposición de 2022.', ['x04']],
      erc: [-2, 'A', 'Impulsó la proposición de 2022.', ['x04']],
      junts: [-1, 'C', 'Posición inferida.', ['x04']],
      bildu: [-2, 'A', 'Impulsó la proposición de 2022.', ['x04']],
      pnv: [-2, 'B', 'En desacuerdo con la Resolución 2797.', ['x08']],
      bng: [-2, 'C', 'Posición inferida.', ['x04']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']]
    }
  },
  {
    id: 'ext5', cat: 'ext',
    text: 'España debería alinearse más con la Administración Trump (comercio, defensa, Venezuela), aunque eso la aleje de la mayoría de socios europeos.',
    ctx: 'En 2025 Trump amenazó a España con aranceles por no comprometerse con el 5% en defensa. En enero de 2026, tras la captura de Maduro por EE.UU., el Gobierno rechazó una intervención que «viola el derecho internacional»; Vox la celebró y el PP acusó al Gobierno de complacencia con el chavismo.',
    ctxSrc: ['x01', 'x19', 'x20', 'x21'],
    pro: 'EE.UU. es el principal aliado militar y un gran mercado; chocar con Washington tiene costes económicos y de seguridad.',
    con: 'Los aranceles y las intervenciones unilaterales de Trump chocan con los intereses europeos y con el derecho internacional.',
    pos: {
      vox: [2, 'B', 'Aliado de Trump; celebró la captura de Maduro y no revisó la alianza pese a los aranceles.', ['x18', 'x21']],
      pp: [-1, 'B', 'Atlantista y europeísta; critica los aranceles, pero celebró la caída de Maduro.', ['x20', 'pe01']],
      psoe: [-2, 'B', 'Rechazó la intervención en Venezuela y el objetivo del 5%.', ['x19', 'x01']],
      sumar: [-2, 'B', 'Calificó la intervención de «violación flagrante de la soberanía».', ['x35']],
      podemos: [-2, 'C', 'Posición inferida.', ['pe05']],
      erc: [-2, 'C', 'Posición inferida.', ['pe07']],
      junts: [-1, 'C', 'Europeísmo.', ['pe08']],
      bildu: [-2, 'C', 'Posición inferida.', ['pe10']],
      pnv: [-1, 'C', 'Europeísta.', ['pe09']],
      bng: [-2, 'C', 'Posición inferida.', ['pe11']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']]
    }
  },
  {
    id: 'ext6', cat: 'ext',
    text: 'La Unión Europea debería tener más competencias (defensa común, deuda común, política exterior), aunque los Estados cedan soberanía.',
    ctx: 'Tras la pandemia la UE emitió deuda común (Next Generation EU) y hoy debate una defensa europea. Vox, que preside Patriots, pide un nuevo tratado que devuelva poder a los Estados; SALF plantea un referéndum de permanencia si no se renegocia la relación.',
    ctxSrc: ['pe03', 'pe06'],
    pro: 'Da peso a Europa frente a EE.UU., China y Rusia y permite afrontar mejor las crisis comunes.',
    con: 'Aleja las decisiones de los ciudadanos y reduce la capacidad de cada país para decidir según sus intereses.',
    pos: {
      psoe: [2, 'B', 'Europeísmo y autonomía estratégica europea.', ['pe02']],
      pp: [1, 'B', 'Papel central de España en la UE y refuerzo del pilar europeo de defensa.', ['pe01']],
      vox: [-2, 'B', 'Nuevo tratado que devuelva poder a los Estados.', ['pe03']],
      sumar: [1, 'C', 'Refuerzo de la ONU y la UE.', ['pe04']],
      podemos: [-1, 'C', 'Crítica a la deriva militarista de la UE; posición inferida.', ['pe05']],
      erc: [1, 'B', 'Europeísta.', ['pe07']],
      salf: [-2, 'B', 'Referéndum de permanencia si no se renegocia.', ['pe06']],
      junts: [1, 'B', 'Europeísmo.', ['pe08']],
      pnv: [2, 'B', 'Europeísta.', ['pe09']],
      adelante: [-1, 'C', 'Posición inferida.', ['ctx13']],
      cc: [1, 'B', 'Defiende el estatus ultraperiférico de Canarias.', ['pe12']],
      upn: [1, 'B', 'Europeísta.', ['pe13']]
    }
  },
  {
    id: 'ext7', cat: 'ext',
    text: 'España debería apoyar el acuerdo comercial entre la UE y Mercosur.',
    ctx: 'El Parlamento Europeo pidió en enero de 2026 (334–324) un dictamen al Tribunal de Justicia de la UE que frena su ratificación; según organizaciones agrarias, el 81% de los eurodiputados españoles (PP, PSOE y PNV) votó contra esa remisión. Agricultores y ganaderos temen la competencia.',
    ctxSrc: ['x23', 'x24'],
    pro: 'Abre un gran mercado sudamericano a la industria y los servicios europeos y refuerza los lazos con Latinoamérica.',
    con: 'Expone al campo europeo a productos fabricados con normas sanitarias y ambientales menos exigentes.',
    pos: {
      pp: [2, 'A', 'Sus eurodiputados votaron contra frenarlo; apoya el acuerdo.', ['x24', 'x22', 'pe01']],
      psoe: [2, 'A', 'Sus eurodiputados votaron contra frenarlo.', ['x24']],
      vox: [-2, 'B', 'Revertir los acuerdos comerciales con Mercosur y Marruecos.', ['pe03']],
      sumar: [-1, 'C', 'Sus aliados europeos impulsaron la remisión al TJUE; posición inferida.', ['x23']],
      podemos: [-2, 'C', 'Su grupo europeo impulsó la remisión al TJUE; posición inferida.', ['x23']],
      salf: [-2, 'B', 'Se opone al acuerdo.', ['pe06']],
      bildu: [-1, 'C', 'Posición inferida.', ['x23']],
      pnv: [1, 'A', 'Votó contra frenarlo.', ['x24']],
      bng: [-2, 'C', 'Defensa de los sectores lácteo y agrario; posición inferida.', ['pe11']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']]
    }
  },

  /* ───────────── ENERGÍA Y CLIMA ───────────── */
  {
    id: 'ene1', cat: 'ene', core: true,
    text: 'Las centrales nucleares deberían seguir funcionando más allá del calendario de cierre (2027-2035).',
    ctx: 'El calendario pactado con las eléctricas cierra las siete centrales entre 2027 y 2035. En febrero de 2025 el Congreso aprobó una proposición del PP para prolongarlas (171–164). En agosto de 2026 el Gobierno prorrogó Almaraz hasta cerca de 2030, manteniendo el cierre total en 2035.',
    ctxSrc: ['v30', 'v33', 'v34'],
    pro: 'Aporta electricidad estable y sin emisiones de CO₂, ayuda a contener precios y refuerza la seguridad del suministro.',
    con: 'Genera residuos de larga vida, exige inversiones costosas y retrasa la apuesta por renovables y almacenamiento.',
    pos: {
      pp: [2, 'A', 'Proposición no de ley y proposición de ley (2025).', ['v30']],
      psoe: [-1, 'A', 'Mantiene el cierre en 2035, pero prorrogó Almaraz.', ['v34']],
      vox: [2, 'A', 'Votó a favor; pide mantener Almaraz hasta 2050.', ['v30', 'v35']],
      sumar: [-2, 'A', 'Votó en contra y rechazó la prórroga de Almaraz.', ['v30', 'v35']],
      podemos: [-1, 'A', 'Se abstuvo en la proposición de febrero de 2025.', ['v31']],
      erc: [0, 'A', 'Se abstuvo (feb-2025); votó contra suprimir las fechas de cierre (nov-2025).', ['v30', 'v32']],
      salf: [2, 'B', 'Paralizar el calendario de cierre y apostar por reactores modulares.', ['pe06']],
      junts: [1, 'A', 'Se abstuvo; apoya la continuidad de Ascó.', ['v30', 'v32']],
      bildu: [-2, 'C', 'Posición inferida.', ['pe10']],
      pnv: [-1, 'A', 'Votó en contra (feb-2025).', ['v30']],
      bng: [-2, 'C', 'Posición inferida.', ['pe11']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [2, 'A', 'Votó a favor.', ['v30']]
    }
  },
  {
    id: 'ene2', cat: 'ene',
    text: 'Hay que acelerar la transición ecológica aunque suponga costes o restricciones, como las zonas de bajas emisiones o el fin de la venta de coches de combustión en 2035.',
    ctx: 'Según el Gobierno, más de la mitad de la electricidad ya es renovable. Vox propone derogar la Ley de Cambio Climático (2021) y frenar el Pacto Verde europeo; el PP defiende una transición «ordenada, realista y justa».',
    ctxSrc: ['ctx01', 'pe03', 'pe01'],
    pro: 'Reduce emisiones, dependencia energética y los costes de la crisis climática (sequías, incendios, DANA).',
    con: 'Encarece la vida y castiga a zonas rurales e industrias; el ritmo debería adaptarse a la tecnología y a los costes.',
    pos: {
      psoe: [2, 'B', 'Renovables, electrificación y descarbonización.', ['pe02']],
      pp: [-1, 'B', 'Transición «ordenada, realista y justa», con plazos que no encarezcan la vida.', ['pe01']],
      vox: [-2, 'B', 'Derogar la Ley de Cambio Climático; frenar el Pacto Verde y el veto a la combustión.', ['pe03']],
      sumar: [2, 'B', 'Más renovables y menos fósiles.', ['pe04']],
      podemos: [2, 'C', 'Transición ecológica.', ['pe05']],
      erc: [1, 'B', 'Transición con renovables y soberanía energética.', ['pe07']],
      salf: [-2, 'B', 'Rechazo a los «dogmas» de la Agenda 2030.', ['pe06']],
      junts: [0, 'B', 'Transición sin frenar la industria ni el campo.', ['pe08']],
      bildu: [1, 'B', 'Transición planificada desde lo público.', ['pe10']],
      pnv: [1, 'B', 'Transición ordenada sin perder empleo industrial.', ['pe09']],
      bng: [1, 'C', 'Renovables con participación vecinal.', ['pe11']],
      adelante: [1, 'C', 'Posición inferida.', ['ctx13']],
      cc: [1, 'C', 'Transición adaptada a las islas.', ['pe12']],
      upn: [-1, 'B', 'Compatible con la industria del automóvil y el campo.', ['pe13']]
    }
  },

  /* ───────────── SANIDAD Y EDUCACIÓN ───────────── */
  {
    id: 'san1', cat: 'san', core: true, ax: { e: -1 },
    text: 'Debería limitarse la gestión privada en la sanidad pública (conciertos y externalizaciones).',
    ctx: 'El Gobierno aprobó en mayo de 2026 un proyecto de ley que hace de la gestión directa la regla y deroga la Ley 15/1997; caduca con la disolución. PP, Vox y Junts mostraron reticencias.',
    ctxSrc: ['v45', 'v46'],
    pro: 'Evita que el dinero público se desvíe a beneficios privados y refuerza la sanidad pública.',
    con: 'Los conciertos ayudan a reducir listas de espera y la colaboración público-privada puede ser eficiente.',
    pos: {
      psoe: [2, 'A', 'Proyecto de ley de gestión pública (2026).', ['v45']],
      pp: [-2, 'B', 'Reticencias a la ley; defiende la libertad de elección del paciente.', ['v46', 'pe01']],
      vox: [-2, 'B', 'Más conciertos con la sanidad privada.', ['pe03']],
      sumar: [2, 'A', 'Proyecto impulsado por la ministra Mónica García.', ['v45']],
      podemos: [2, 'B', 'Frenar la privatización y los conciertos.', ['pe05']],
      erc: [1, 'B', 'Limitar las derivaciones a la privada.', ['pe07']],
      salf: [-2, 'B', 'Conciertos con clínicas privadas para cumplir plazos.', ['pe06']],
      junts: [-1, 'B', 'Colaboración público-privada; reticencias a la ley.', ['pe08', 'v46']],
      bildu: [2, 'B', 'Sanidad 100% pública, sin derivaciones a la privada.', ['pe10']],
      bng: [1, 'C', 'Defensa de la sanidad pública.', ['pe11']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']],
      upn: [-1, 'B', 'Colaboración con la privada para reducir listas de espera.', ['pe13']]
    }
  },
  {
    id: 'san2', cat: 'san', ax: { e: 1 },
    text: 'La educación concertada debería tener más apoyo público y las familias más libertad para elegir centro, por ejemplo con un cheque escolar.',
    ctx: 'El PP propone sustituir la LOMLOE (2020) por una nueva ley pactada y proteger la concertada; Vox, el cheque escolar. La izquierda defiende priorizar la red pública.',
    ctxSrc: ['pe01', 'pe03', 'pe04'],
    pro: 'Respeta la libertad de las familias y aprovecha una red que escolariza a una parte importante del alumnado.',
    con: 'Puede aumentar la segregación por renta y origen y restar recursos a la escuela pública.',
    pos: {
      pp: [2, 'B', 'Proteger la concertada; nueva ley educativa.', ['pe01']],
      vox: [2, 'B', 'Cheque escolar.', ['pe03']],
      salf: [2, 'B', 'Ampliar los conciertos, incluida la educación diferenciada.', ['pe06']],
      upn: [2, 'B', 'Libertad de elección de centro y concertada.', ['pe13']],
      junts: [1, 'B', 'Libertad de elección y apoyo a la concertada.', ['pe08']],
      pnv: [1, 'B', 'Integra red pública y concertada (ley vasca de 2023).', ['pe09']],
      psoe: [-1, 'C', 'Aprobó la LOMLOE.', ['pe02']],
      sumar: [-2, 'B', 'Educación pública; contra la segregación.', ['pe04']],
      podemos: [-2, 'B', 'Educación pública y gratuita.', ['pe05']],
      erc: [-1, 'C', 'Posición inferida.', ['pe07']],
      bildu: [-2, 'B', 'Menos financiación para la concertada.', ['pe10']],
      bng: [-2, 'C', 'Defensa de la escuela pública.', ['pe11']],
      adelante: [-2, 'C', 'Posición inferida.', ['ctx13']]
    }
  },
  {
    id: 'san3', cat: 'san', ax: { s: -1 },
    text: 'La sanidad pública debe atender también a los inmigrantes en situación irregular en igualdad de condiciones.',
    ctx: 'En 2012 el Gobierno del PP limitó su atención a urgencias, embarazo y menores (RDL 16/2012); en 2018 el Gobierno del PSOE restableció el acceso universal (RDL 7/2018). Vox propone volver a limitarla a urgencias.',
    ctxSrc: ['p17', 'pe03'],
    pro: 'Atender en primaria es más eficaz y barato que en urgencias y protege la salud pública.',
    con: 'Supone un gasto para quien no cotiza y puede actuar como incentivo a la inmigración irregular.',
    pos: {
      psoe: [2, 'A', 'Restableció la universalidad (2018).', ['p17']],
      pp: [-1, 'A', 'Su Gobierno la restringió en 2012; no ha anunciado volver a hacerlo.', ['p17']],
      vox: [-2, 'B', 'Solo urgencias para los inmigrantes irregulares.', ['pe03']],
      sumar: [2, 'C', 'Sanidad universal.', ['pe04']],
      podemos: [2, 'C', 'Sanidad pública y universal.', ['pe05']],
      erc: [2, 'C', 'Posición inferida.', ['pe07']],
      salf: [-2, 'B', 'Atención para ciudadanos y residentes legales; facturar al resto.', ['pe06']],
      bildu: [2, 'B', 'Acceso pleno a los servicios públicos.', ['pe10']],
      pnv: [1, 'C', 'Posición inferida.', ['pe09']],
      bng: [1, 'C', 'Posición inferida.', ['pe11']],
      adelante: [2, 'C', 'Posición inferida.', ['ctx13']]
    }
  }
];

/* Etiquetas cortas para informes y gráficos */
COTEJO.qshort = {
  eco1: 'Bajar el IRPF', eco2: 'Impuesto a grandes fortunas', eco3: 'Gravamen a banca y energéticas', eco4: 'Recortar gasto y organismos',
  tra1: 'Jornada de 37,5 horas', tra2: 'Más cotizaciones para las pensiones', tra3: 'Pilar de capitalización',
  viv1: 'Topes al alquiler', viv2: 'Prórroga obligatoria de alquileres', viv3: 'Desalojo exprés de okupas', viv4: 'Limitar compras de no residentes y fondos', viv5: 'Limitar pisos turísticos',
  inm1: 'Regularización de inmigrantes', inm2: 'Prioridad nacional', inm3: 'Reparto obligatorio de menores', inm4: 'Expulsión de extranjeros condenados', inm5: 'La inmigración es necesaria',
  ter1: 'Ley de Amnistía', ter2: 'Financiación singular', ter3: 'Referéndum de autodeterminación', ter4: 'Recentralizar competencias', ter5: 'Mínimo de castellano en la escuela',
  ins1: 'Jueces eligen el CGPJ', ins2: 'Limitar la acusación popular', ins3: 'Prohibir indultos por corrupción', ins4: 'Referéndum monarquía o república', ins5: 'Derogar la Memoria Democrática',
  seg1: 'Derogar la «ley mordaza»', seg2: 'Ampliar la prisión permanente', seg3: 'Endurecer la multirreincidencia',
  igu1: 'Aborto en la Constitución', igu2: 'Ley de violencia intrafamiliar', igu3: 'Derogar la Ley Trans', igu4: 'Mantener la eutanasia', igu5: 'Prohibir burka y niqab',
  ext1: 'Gasto en defensa al 5%', ext2: 'Ayuda militar a Ucrania', ext3: 'Embargo y sanciones a Israel', ext4: 'Plan marroquí para el Sáhara', ext5: 'Alinearse con Trump', ext6: 'Más competencias para la UE', ext7: 'Acuerdo UE-Mercosur',
  ene1: 'Alargar las nucleares', ene2: 'Acelerar la transición ecológica',
  san1: 'Limitar la gestión privada sanitaria', san2: 'Más apoyo a la concertada', san3: 'Sanidad para irregulares'
};
