# Ejes de fondo: datos de expertos y posiciones documentadas

Notas de investigación del módulo «Ejes de fondo» (cerradas el 17-oct-2026). Identificadores de fuente entre corchetes, tal como figuran en `web/datos/fuentes.js`.

## 1. Fuente principal: Chapel Hill Expert Survey 2024

- Encuesta a 609 politólogos sobre 279 partidos de 31 países; trabajo de campo del 10-oct al 20-nov-2024 (Europa occidental) y del 1-nov al 17-dic-2024 (Europa oriental). Libro de códigos de febrero de 2025, versión 2. [ches24] [ches24c] [ches24d]
- Cita: Rovny, Bakker, Hooghe, Jolly, Marks, Polk, Steenbergen y Vachudova (2025), *Electoral Studies* 97, doi 10.1016/j.electstud.2025.102981. [ches24a]
- España: 14 partidos. Identificadores CHES usados: PSOE 501, PP 502, IU 504, PNV 506, ERC 511, BNG 513, CC 517, EH Bildu 524, Podemos 525, Vox 527, Junts 550, Sumar 551, SALF 552, UPN 553. Adelante Andalucía no figura.
- Sumar – Frente Amplio usa la fila «Sumar». IU tiene fila propia y se guarda solo como referencia.

### Variables y anclas (literal del libro de códigos)

| Variable | 0 | 10 |
|---|---|---|
| `lrecon` | extrema izquierda (papel activo del Estado) | extrema derecha (papel reducido) |
| `environment` | protección ambiental aun a costa del crecimiento | crecimiento aun a costa del medio ambiente |
| `climate_change` | políticas climáticas aun a costa del crecimiento | crecimiento aun a costa de las políticas climáticas |
| `civlib_laworder` | libertades civiles | mano dura contra el delito |
| `executive_power` | ejecutivo limitado | ejecutivo sin límites |
| `womens_rights` / `lgbtq_rights` | apoyo a esas políticas | oposición |
| `religious_principles` | oposición a principios religiosos en política | apoyo |
| `anti_islam` | retórica contra el islam nada importante | extremadamente importante (**relevancia, no posición**) |
| `multiculturalism` | multiculturalismo | asimilación |
| `nationalism` | concepciones cosmopolitas | nacionalistas |
| `eu_russia` | más defensa frente a Rusia | más comercio y diplomacia con Rusia |
| `people_v_elite` | deciden los representantes | decide «el pueblo» |
| `regions` | a favor de la descentralización | en contra |
| `eu_position` (1–7) | 1 muy en contra de la integración europea | 7 muy a favor |

Normalización a −1…+1: (x − 5) / 5; `eu_position`: (x − 4) / 3, invertida en el eje «Europa y soberanía».

## 2. Hechos verificados para el contexto de las preguntas

- **Cannabis**: el Congreso rechazó tramitar la ley integral de Más País (19-oct-2021) con PSOE, PP y Vox en contra; 75 votos a favor. Volvió a rechazar la de ERC (22-feb-2023). [e01] [e02] [e03]
- **Ofensas religiosas, injurias a la Corona y ultrajes a España**: arts. 525, 490–491 y 543 del Código Penal, vigentes (última modificación consolidada publicada el 9-abr-2026). PSOE y Sumar anunciaron el 15-jun-2026 un acuerdo para suprimirlos en la proposición de Sumar registrada a finales de 2023; no hubo votación ese día. [e46] [e36] [e37]
- **Gestación subrogada**: contrato nulo (art. 10 de la Ley 14/2006). La Instrucción de la DGSJFP de 28-abr-2025 (BOE-A-2025-8647) dejó sin efecto las de 2010 y 2019 sobre inscripción. Vox pidió prohibirla y sancionarla (Comisión de Igualdad, 18-nov-2020; rechazada por todos los demás grupos), pero en 2023 su portavoz dijo no tener «posición tomada». PSOE (M.ª J. Montero) y Podemos (I. Montero) la rechazan; el PP (Gamarra) no tenía posición definida. [e45] [e07] [e05] [e04] [e06]
- **Prostitución**: la ley del PSOE contra el proxenetismo se tomó en consideración en junio de 2022 (232 a favor, con el PP; los comunes en contra) y fracasó en mayo de 2024 sin Sumar, Podemos (abstención) ni el PP. [e08] [e09] [e10] [e11]
- **Acuerdos con la Santa Sede**: Podemos registró en mayo de 2022 una proposición no de ley para denunciarlos. En febrero de 2012 el congreso del PSOE se planteó revisarlos (de forma condicionada) y el PP lo rechazó («no genera empleo, pero sí puede generar conflictos»); IU, ICV y CHA pidieron denunciarlos y retirar símbolos religiosos de los actos oficiales. Yolanda Díaz firmó en 2017 la proposición de Unidos Podemos contra los privilegios de la Iglesia. [e12] [e14] [e13]
- **Jumilla (2025)**: moción de Vox con enmienda del PP para vetar celebraciones religiosas como la Fiesta del Cordero en instalaciones deportivas municipales. La Conferencia Episcopal lo criticó y el Gobierno lo impugnó. [e15] [e16] [e17] [e18]
- **Velo**: Feijóo apoya prohibir burka y niqab en espacios públicos, no el velo (17-ago-2025); Abascal pidió prohibir el velo en espacios públicos (8-ago-2025), aunque la proposición de ley de Vox de febrero de 2026 se limita al burka y el niqab; Junts propone vetar el velo en la enseñanza obligatoria (22-may-2025). [e19] [e20] [e21] [e22]
- **Corrección**: la declaración de que el velo está «amparado por el marco regulador» la hizo la consellera de Educación de la Generalitat, Esther Niubó (PSC), no el Gobierno de España; por eso la posición del PSOE en esa pregunta tiene evidencia baja. ERC, PSC, CUP y comunes votaron contra la moción de Aliança Catalana para mantener el cordón sanitario, sin fijar postura propia sobre el velo en la escuela, así que no se les asigna posición. [e23]
- **Vox y mezquitas**: «Menos fiestas del cordero, menos mezquitas y más libertades» (Abascal, Manresa, mayo de 2024); proposición no de ley para investigar y, en su caso, cerrar mezquitas donde se propague la radicalización (31-ene-2023); oposición a la licencia de una mezquita en Sevilla, cuyo Gobierno municipal del PP la tramitó (24-jul-2026). [e25] [e27] [e26]
- **OTAN (22-abr-2026)**: el Congreso rechazó el referéndum de salida propuesto por Podemos. A favor: ERC, EH Bildu, BNG y la diputada de Compromís; abstención: Sumar y CC; en contra: PP, PSOE, Vox, PNV, Junts y UPN. [e28] [e29]
- **Perdón por la Conquista (2019)**: el Gobierno rechazó «con toda firmeza» la carta de López Obrador; Casado la llamó «inadmisible»; Abascal acusó a López Obrador de estar «contagiado de socialismo indigenista»; Belarra la apoyó. [e30] [e32] [e31]
- **Día de la Constitución (6-dic-2025)**: no participaron Vox, Junts, ERC, EH Bildu, PNV ni BNG. [e33]
- **«Pin parental» (Murcia, 2020)**: exigencia de Vox para apoyar los presupuestos regionales; el Ministerio de Educación lo recurrió (18-feb-2020). [e34] [e35]
- **IU**: sus estatutos de 2016 la definen como movimiento anticapitalista que aspira a transformar el capitalismo en un sistema socialista. [iu16]
- **Textos legales**: Constitución (arts. 6, 15, 16, 38 y 92) [e38]; LO 11/1995 de abolición de la pena de muerte en tiempo de guerra [e39]; Ley 26/1992, acuerdo con la Comisión Islámica [e40]; Reglamento (UE) 2024/1689 de inteligencia artificial [e41]; Ley 13/2005 de matrimonio igualitario [e42]; Ley 19/2021 del ingreso mínimo vital [e43]; Ley 18/2013 de la tauromaquia [e44].

Todas las URL se comprobaron el 17-oct-2026 (respuesta 200) y los enlaces del BOE apuntan a la norma citada.

## 3. Criterios

- Las posiciones de los partidos en los ejes se toman del CHES sin retoques. Las posiciones documentadas por pregunta solo se muestran: no entran en la afinidad de fondo.
- Las dos preguntas de elección (modelo económico y territorial) sitúan cada opción en el eje con valores fijos que son una convención de la herramienta.
- Umbrales: «fuera del espectro» si se supera en más de 0,15 a la candidatura más extrema; «ninguna cerca» si la más próxima está a más de 0,30; combinación no representada si la más cercana en el plano está a 0,45 o más y al menos 0,20 más lejos que la más cercana en cada eje.
