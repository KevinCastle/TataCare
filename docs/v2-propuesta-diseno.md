# TataCare v2 — Propuesta de diseño

> Julio 2026 · Para revisión antes de construir. La v1 en producción no se toca.

---

## 1. La marca

**Logo:** un **techo** sobre un **corazón** — *cuidar bajo un mismo techo*. La familia se organiza para que el tata esté bien, aunque los cuidadores vivan en tres casas distintas. Geométrico, funciona a 16px (favicon) y como ícono de app, sin degradados ni sombras.

**Tagline:** "Cuidar bajo un mismo techo"

**Personalidad en tres palabras:**
- **Cálida** — es una app de cariño, no un expediente clínico
- **Clara** — en una urgencia no hay tiempo para interpretar
- **Confiable** — datos médicos merecen sobriedad

---

## 2. Color — "Papel, pino y copihue"

Nada de blanco hospital ni azul genérico de startup (el azul #006FEE actual es el default de NextUI). El rojo existe, pero es **solo** para alertas — así, cuando aparece, significa algo.

| Color | Hex | Uso | Contraste sobre Papel | WCAG |
|---|---|---|---|---|
| **Papel** | `#FAF6EF` | Fondo global. Cálido, sin deslumbrar | — | — |
| **Tinta** | `#22302C` | Texto principal | 12.8 : 1 | AAA |
| **Pino** | `#14584E` | Botones, tabs activos, links (texto blanco encima: 8.3:1) | 7.7 : 1 | AAA |
| **Copihue** | `#C2455F` | Acento emocional: favoritos, gustos, el corazón del logo. Íconos y texto grande | 4.5 : 1 | AA |
| **Alerta** | `#B3261E` | Alergias y urgencias. Siempre ícono + palabra, nunca color solo | 6.1 : 1 | AA |
| **Aviso** | `#8A5A00` | Tratamientos por vencer, recordatorios | 5.5 : 1 | AA |
| **Bien** | `#2E7D32` | Confirmaciones, "tomado", al día | 4.8 : 1 | AA |
| **Niebla** | `#5C6B66` | Texto secundario y metadatos | 5.2 : 1 | AA |

Los ratios están calculados, no estimados. Son el contrato del design system.

---

## 3. Tipografía — Atkinson Hyperlegible

Diseñada por el **Braille Institute** específicamente para personas con baja visión: cada letra es inconfundible respecto a sus vecinas (`I l 1`, `0 O o`, `B 8` no se confunden). Gratis en Google Fonts, con historia real de accesibilidad — exactamente la fuente que una app para cuidadores debería usar. Te regala un video entero: *"elegí la fuente diseñada para los ojos de tu abuela"*.

**Escala** (todo en `rem` — si el usuario agranda la letra en su teléfono, la app entera lo respeta):

| Rol | Tamaño / peso |
|---|---|
| Título | 28px / 700 |
| Sección | 22px / 700 |
| Cuerpo | **17px** / 400 — no 14 ni 16 |
| Etiqueta | 13px / 700, mayúsculas con letter-spacing |

---

## 4. Accesibilidad — no es una feature, es el piso

1. **Objetivos táctiles ≥ 48px** — WCAG 2.2 pide 24; doblamos.
2. **La letra escala contigo** — tipografía en rem que sigue el ajuste del sistema. No se rompe al 200% de zoom.
3. **Contraste AA mínimo, AAA en lo vital** — texto principal a 12.8:1.
4. **Nunca solo color** — una alergia es borde rojo + ícono + la palabra "Alergia". Funciona en escala de grises y con daltonismo.
5. **Teclado y lector de pantalla** — HTML semántico, foco visible siempre, skip links, errores de formulario anunciados en español.
6. **Movimiento opcional** — `prefers-reduced-motion` respetado.

---

## 5. Las pantallas — una app de teléfono, no una web encogida

Navegación de **pestañas inferiores** (al alcance del pulgar). Instalable como **PWA** con ícono propio.

**Bottom tabs:** `Ficha · Remedios · Salud · Bitácora · Más`

### 5.1 Mis tatas (home tras login)

```
┌─────────────────────────────┐
│ Buenos días,            (K) │
│ Kevin                       │
│                             │
│ MIS TATAS                   │
│ ┌─────────────────────────┐ │
│ │ (LS) Luis Soto        > │ │
│ │      82 años · O+       │ │
│ │ [⚠ 1 alergia][5 remedios]│ │
│ │ [⏳ 1 por vencer]        │ │
│ │ ┆Ayer: "Durmió bien,   ┆ │ │
│ │ ┆caminamos" — Carmen   ┆ │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ (MP) María Pilar      > │ │
│ │      78 años · A−       │ │
│ │ [3 remedios][✓ Al día]  │ │
│ └─────────────────────────┘ │
│ [ + Agregar a un tata ]     │
└─────────────────────────────┘
```

El estado de cada persona de un vistazo: alertas, remedios por vencer y la última nota de la bitácora. Saludo con nombre — es una app de familia.

### 5.2 La Ficha — pantalla de urgencia (la más importante)

```
┌─────────────────────────────┐
│ < (LS) Luis Soto            │
│        82 años · Fonasa     │
│ ┌─────┐ ┌─────┐ ┌─────────┐ │
│ │ O+  │ │75 kg│ │12.345.  │ │
│ │Sangre│ │Peso│ │678-9 RUT│ │
│ └─────┘ └─────┘ └─────────┘ │
│ ╔═════════════════════════╗ │
│ ║ ⚠ ALERGIA · Penicilina  ║ │  ← borde rojo + ícono + palabra
│ ║ Reacción grave.         ║ │
│ ╚═════════════════════════╝ │
│ CONDICIONES                 │
│ [Diabetes 2][Hipertensión]  │
│ REMEDIOS DESTACADOS         │
│ │💊 Losartán 50mg    ♥│     │
│ │   cada 12h · 22:00   │    │
│                             │
│ [ 📞 Llamar a Carmen·hija ] │  ← botón grande, tel: directo
├─────────────────────────────┤
│ Ficha Remedios Salud Bit Más│  ← bottom tabs
└─────────────────────────────┘
```

Sangre, alergia y botón de llamada **en el primer vistazo, sin scroll**. Es la pantalla que le muestras al médico de urgencias.

### 5.3 Remedios

```
┌─────────────────────────────┐
│ < Remedios                  │
│   Luis Soto · 5 activos     │
│ ┌─────────────────────────┐ │
│ │💊 Losartán 50 mg      ♥ │ │  ← ♥ copihue = destacado, sube a Ficha
│ │  Cada 12h · Hipertensión│ │  ← condición que trata
│ │ [✓ Quedan 38 días]      │ │  ← verde: al día
│ │ [Farmacia Ahumada]      │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │💊 Metformina 850 mg   ♥ │ │
│ │  Cada 8h · Diabetes 2   │ │
│ │ [⏳ Quedan 6 días]       │ │  ← ámbar: por vencer
│ │ [Cruz Verde]            │ │
│ └─────────────────────────┘ │
│                        (+)  │  ← FAB agregar
└─────────────────────────────┘
```

Días restantes calculados y semaforizados. Cada remedio muestra la condición que trata.

### 5.4 Bitácora (el diario compartido)

```
┌─────────────────────────────┐
│ < Bitácora                  │
│   Luis Soto · hoy 10 julio  │
│ ┌─────────────────────────┐ │
│ │ ¿Cómo estuvo el día?    │ │
│ │ ★ ★ ★ ★ ☆              │ │
│ │ ÁNIMO                   │ │
│ │ 😞 😕 😐 [🙂] 😄        │ │  ← caras de 48px, tocables
│ │ NOTA                    │ │
│ │ ┆Caminamos a la plaza…┆ │ │
│ │ [ Guardar registro ]    │ │
│ └─────────────────────────┘ │
│ AYER                        │
│ │(C) Carmen · miércoles ★5│ │
│ │"Durmió toda la noche…"  │ │  ← lo que escribió el turno anterior
└─────────────────────────────┘
```

### 5.5 Salud (enfermedades y alergias)

```
┌─────────────────────────────┐
│ < Salud                     │
│   Luis · 2 alergias · 3 dx  │
│ ALERGIAS                    │
│ ╔═════════════════════════╗ │
│ ║ ⚠ Penicilina            ║ │  ← rojas y PRIMERO: son lo que mata
│ ║ Reacción grave · Carmen ║ │  ← quién la registró
│ ╚═════════════════════════╝ │
│ ╔═════════════════════════╗ │
│ ║ ⚠ Maní · hinchazón leve ║ │
│ ╚═════════════════════════╝ │
│ DIAGNÓSTICOS                │
│ │♥ Diabetes tipo 2        │ │
│ │  Controlada · ex. 3 meses│ │
│ │  [💊 Metformina]         │ │  ← el remedio que la trata
│ │♥ Hipertensión           │ │
│ │  [💊 Losartán]           │ │
│ │♥ Artrosis de rodilla    │ │
│ │  Evitar escaleras       │ │
│                        (+)  │
└─────────────────────────────┘
```

Los 4 booleanos sueltos de v1 (diabetes, hipertensión…) ahora son diagnósticos normales — un solo modelo mental.

### 5.6 Gustos y mañas (gustos, disgustos, actividades)

```
┌─────────────────────────────┐
│ < Gustos y mañas            │
│   Para conocer a Luis       │
│ ♥ LE GUSTA (copihue)        │
│ │El bolero — Lucho Gatica  ││
│ │ Ponerle música al almuerzo││
│ │Té con dos de azúcar 17:00││
│ ✕ NO LE GUSTA               │
│ │La sopa fría y que le     ││
│ │hablen fuerte             ││
│ ⚠ LE HACE MAL (alerta)      │
│ │La sal en exceso          ││
│ │ Por la presión           ││  ← el "por qué" siempre visible
│ ↻ ACTIVIDADES               │
│ │Caminar a la plaza ·      ││
│ │dominó los domingos       ││
│                        (+)  │
└─────────────────────────────┘
```

La pantalla para el cuidador nuevo que no conoce a la persona. Cada entrada admite detalle con contexto.

### 5.7 Edición — patrón de TODOS los formularios

```
┌─────────────────────────────┐
│ ✕ Nuevo remedio             │
│ NOMBRE                      │  ← etiqueta SIEMPRE visible
│ ┌─────────────────────────┐ │     (nunca solo placeholder)
│ │ Losartán                │ │
│ └─────────────────────────┘ │
│ DOSIS                       │
│ ┌─────────────────────────┐ │
│ │ Por ejemplo: 50 mg      │ │  ← borde rojo
│ └─────────────────────────┘ │
│ ⚠ Escribe la dosis — la     │  ← error que explica POR QUÉ
│   necesita quien reemplace  │     importa, no "campo requerido"
│   tu turno                  │
│ CADA CUÁNTAS HORAS          │
│    (−)   12 h   (+)         │  ← stepper, no teclado numérico
│ ¿PARA QUÉ CONDICIÓN?        │
│ [Hipertensión ✓][Diabetes 2]│  ← chips desde Salud, no texto libre
│ ♥ Destacar en la ficha [ON] │
│ [ Guardar remedio ]         │
└─────────────────────────────┘
```

Campos de 46px, errores hablados en español humano, selección por chips en vez de dropdowns donde se pueda.

### 5.8 Compartir (cuidadores con rol + link temporal para médicos)

```
┌─────────────────────────────┐
│ < Compartir                 │
│   Ficha de Luis Soto        │
│ PERSONAS CON ACCESO         │
│ │(C) Carmen Soto   [Dueña] ││
│ │(K) Kevin Castillo[Editor]││
│ │(R) Rosa Fuentes [Lectora]││  ← cuidadora contratada: solo lee
│ [ + Invitar cuidador ]      │
│ ACCESO PARA EL MÉDICO       │
│ ┌─────────────────────────┐ │
│ │ [24h ✓][48h][7 días]    │ │  ← duración que eliges
│ │ ▦▦▦  TATA-4F9K          │ │  ← QR + código corto
│ │ ▦▦▦  Solo lectura ·     │ │
│ │      expira mañana 09:41│ │
│ │      Revocar ahora      │ │
│ └─────────────────────────┘ │
│ ┆El médico lo escanea o    ┆│
│ ┆escribe el código en      ┆│
│ ┆tata-care.app/dr — sin    ┆│
│ ┆crear cuenta. Puede dejar ┆│
│ ┆nota clínica en bitácora. ┆│
└─────────────────────────────┘
```

Evolución del link de un solo uso de v1: roles permanentes para la familia, acceso temporal revocable para el médico.

### 5.9 Modo urgencia ⭐ (idea nueva)

```
┌─────────────────────────────┐
│ ═══════ borde rojo ═══════  │
│        · URGENCIA ·         │
│         Luis Soto           │
│  82 años · Fonasa · RUT …   │
│ ┌─────────────────────────┐ │
│ │          O+             │ │  ← 44px, lo primero que se ve
│ │    GRUPO SANGUÍNEO      │ │
│ └─────────────────────────┘ │
│ █ ⚠ ALERGIA: PENICILINA █   │
│ █   y maní · grave      █   │
│  Diabetes 2 · Hipertensión  │
│  Toma Losartán y Metformina │
│ [ 📞 Llamar a Carmen·hija ] │
│  Muéstrale esta pantalla    │
│  al equipo médico           │
└─────────────────────────────┘
```

Un botón en la Ficha abre esta vista para **entregar el teléfono a los paramédicos**: tipografía gigante, solo lo vital, sin navegación. Lo que un TENS necesita leer en 5 segundos.

### 5.10 Más (quinta pestaña)

Contactos de emergencia · Gustos y mañas · Compartir ficha · Datos legales · Ajustes.

---

## 6. Ideas que suben el nivel

### 6.1 Aprobadas ✅ (entran al plan v2)

Todas nacen del mismo principio: la app la usan **varias personas de distintas edades coordinándose alrededor de alguien frágil**.

| Idea | Qué es | Por qué vale |
|---|---|---|
| 🚨 **Modo urgencia** | Pantalla XXL para entregar el teléfono a paramédicos (ver 5.9) | Barata de construir, altísimo valor percibido |
| 🎙️ **Notas de voz en bitácora** | Audio + transcripción automática | Una cuidadora de 68 años no teclea párrafos: dicta. Derriba la barrera de entrada más real |
| 👤 **¿Quién está hoy?** | Turno visible en el home; la bitácora lo hereda | Menos "¿fuiste tú o yo?" en el grupo de WhatsApp |
| 🧾 **Rastro de confianza** | Cada dato muestra quién lo editó y cuándo ("Carmen · ayer") | Cuando tres hermanos editan la misma ficha, la confianza es una feature |
| 💊 **Aviso de recompra** | "A Metformina le quedan 6 días — se compra en Cruz Verde" | El semáforo ya sabe la farmacia; solo falta avisar |
| ⏰ **Próxima dosis en la Ficha** | "Losartán en 2 h 15 min" arriba del todo | Convierte la ficha en el panel del día; prepara las push del roadmap (Mes 8) |
| 🌱 **Empty states que enseñan** | "Aún no registras remedios. Empieza por los del desayuno." | El onboarding es la app misma |
| 🎂 **Cumpleaños** | "Luis cumple 83 el 12 de agosto", recordatorio a todos | Costo: un campo que ya existe. Valor: la app entiende que es una familia |
| 🔠 **Letra gigante en la app** | Toggle "letra grande" en Ajustes, además del ajuste del sistema | Quienes más lo necesitan no saben dónde está el ajuste del sistema |

### 6.2 Nuevas aprobadas para v2 ✅

Decisión de julio 2026: estas tres entran sí o sí a la construcción.

**🗂️ La carpeta médica** — bóveda de exámenes, recetas y epicrisis (foto/PDF) ordenada por fecha, con tipo de documento y quién lo subió. Hoy eso vive en un cajón o en WhatsApp. Vercel Blob ya está pagado: es la feature más barata con más retención. Vive en la pestaña **Más**. A futuro alimenta al "traductor de exámenes" con IA.

**📅 Calendario de turnos** — evolución de "¿quién está hoy?": planificar quién cubre cada día, con huecos visibles ("nadie el sábado"). El home muestra el turno de hoy y la bitácora lo hereda automáticamente. Vive en la pestaña **Más** (y asoma en el home).

**👴 Modo espejo para el tata** — vista de solo lectura para el propio adulto mayor: letra gigante, "hoy te toca Losartán a las 10:00", foto de quién lo cuida hoy. Se activa desde Ajustes y **bloquea el dispositivo en esa vista** (ideal para una tablet vieja en la casa del tata) hasta desbloquear con PIN del cuidador. El tata pasa de objeto de la app a usuario. Nadie hace esto.

### 6.3 Roadmap futuro 🗺️ (aprobadas en concepto, no son prioridad v2)

**Con IA** — regla transversal: la IA **nunca diagnostica ni recomienda tratamiento**; explica, ordena, compara y sugiere preguntas para el médico. Ese límite es legal, ético y es mensaje de marca. Encajan en los meses de IA del roadmap (Mes 13-14 y 19):

| Idea | Qué es | Mes sugerido |
|---|---|---|
| 📷 **Escanear la receta** | Foto a la receta del médico → la IA la transcribe a remedios estructurados (nombre, dosis, horario). La feature más "mágica" para video | Mes 13 (junto a "¿para qué sirve esta pastilla?") |
| 💰 **Comparador de farmacias + bioequivalentes** | Compara Cruz Verde/Salcobrand/Ahumada (varían hasta 3x) y sugiere el bioequivalente ("70% menos") | Mes 14 |
| ⚠️ **Detector de interacciones** | Cruza el remedio nuevo con remedios/alergias/condiciones: "Ibuprofeno + Losartán pueden subir la presión — pregúntale al médico" | Mes 13-14 |
| 🩺 **Traductor de exámenes** | Foto al laboratorio/epicrisis → explicación en español humano. Depende de la carpeta médica (v2) | Mes 19 |
| 🗣️ **Bitácora dictada e interpretada** | Dictas 30 segundos y la IA rellena estrellas, ánimo y nota | Mes 14 |
| 📋 **Brief del turno entrante** | Resumen generado para el cuidador que llega: "OJO: dejó de comer completo hace 2 días" | Mes 19 |
| 💬 **Pregúntale a la ficha** | Chat en lenguaje natural sobre la bitácora e historial | Mes 19+ |
| 🌙 **Farmacia de turno** | Dato público MINSAL de farmacias 24h. Ni siquiera es IA — salva noches | Cuando haya app móvil (geolocalización) |

**De producto**

| Idea | Qué es |
|---|---|
| 📈 **Signos vitales** | Presión, glicemia y peso con gráficos y rangos de alerta. Graficado para llevarle al médico |
| 🧾 **Gastos compartidos** | Cuánto gastó cada hermano y el balance. Las familias se pelean más por plata que por turnos |
| 🖨️ **La ficha del refrigerador** | Versión imprimible del modo urgencia — en Chile la emergencia se pega con imán en el refri |
| 📦 **Kit de viaje/hospital** | "Se hospitaliza / viaja 5 días" → qué remedios empacar y en qué cantidad |

---

## 7. En el computador

Las pestañas inferiores se convierten en **riel lateral** y el contenido vive en una columna centrada de lectura cómoda. Mismos tokens, mismos componentes — cero "versión de escritorio" aparte que mantener.

---

## 8. Arquitectura técnica

- **Next.js 15 App Router + TypeScript estricto + Tailwind v4**, tokens como variables CSS (los mismos que luego exportas a Expo en tu roadmap).
- **Server Components + Server Actions** — se elimina el patrón v1 de Zustand + API routes con verbos HTTP invertidos.
- **Prisma + Postgres** (Neon en prod). **Auth.js v5** credenciales + JWT.
- **PWA instalable:** manifest, service worker, safe areas.
- Componentes propios accesibles (nada de NextUI).

### Schema v2 (cambios clave sobre v1)

```
users, elders,
caregivers   ← elder↔user CON rol: owner / editor / viewer
medications,
conditions   ← unifica diseases + allergies con un campo `type`;
               los 4 booleanos sueltos del elder pasan a ser conditions normales
contacts, tastes, daily_logs,
invites      ← token + expiración + rol asignado
documents    ← carpeta médica: tipo (examen/receta/epicrisis/otro),
               archivo en Blob, fecha, quién lo subió
shifts       ← calendario de turnos: elder, cuidador, fecha, nota
```

El **modo espejo** no necesita tabla: es un modo de sesión del dispositivo (se activa en Ajustes, se desbloquea con PIN del cuidador).

---

## 9. Plan de construcción — 10 bloques

Cada bloque termina en estado funcional; tú commiteas entre bloques.

1. **Fundación** — branch v2, Next.js 15, tokens CSS, fuente, primitivas UI accesibles, PWA base
2. **Marca** — logo SVG definitivo, íconos de app, splash, landing pública
3. **Datos + Auth** — schema Prisma nuevo (con roles), registro e inicio de sesión
4. **Tatas** — lista, crear/editar ficha, la pantalla de urgencia + modo urgencia
5. **Dominios** — remedios, salud, contactos, gustos
6. **Bitácora** — registro diario con calificaciones e historial
7. **Compartir** — invitaciones con roles + acceso temporal para el médico
8. **Carpeta médica** — subida a Blob, tipos de documento, listado por fecha
9. **Turnos + modo espejo** — calendario de turnos, "¿quién está hoy?" en el home, vista espejo con bloqueo por PIN
10. **Cierre** — auditoría de accesibilidad, pulido PWA, documentación

---

## Decisiones abiertas (dime qué corrijo)

- [ ] ¿"Remedios" o "Medicamentos"? (propongo Remedios: más chileno, más corto en el tab)
- [ ] ¿"Bitácora" o "Comentarios"? (propongo Bitácora: describe mejor el diario compartido)
- [ ] ¿"Mis tatas" como nombre del home? ¿O "tata" suena raro para abuelas? (alternativa: "Mi familia")
- [ ] Paleta pino/copihue vs. otra dirección de color
- [ ] Logo techo+corazón vs. evolución del mark actual (figuras humanas)
