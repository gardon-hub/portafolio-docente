# Portafolio Docente 2026 — Gustavo Alonso Ardón

Versión digital del *Portafolio Docente 2026* de la Facultad de Medicina Veterinaria y Zootecnia
de la Universidad Nacional de Agricultura (Honduras).

Todo el contenido sale del documento `Portafolio_Docente_2026_Gustavo_Ardon.docx`. **Para actualizar
el sitio se editan archivos de texto en la carpeta `content/`; no hace falta tocar el código.**

---

## Índice

1. [Cómo ejecutar el proyecto](#1-cómo-ejecutar-el-proyecto)
2. [Dónde está cada cosa](#2-dónde-está-cada-cosa)
3. [Cómo cambiar textos](#3-cómo-cambiar-textos)
4. [Cómo actualizar la fotografía](#4-cómo-actualizar-la-fotografía)
5. [Cómo agregar una evidencia](#5-cómo-agregar-una-evidencia)
6. [Cómo sustituir el archivo de una evidencia](#6-cómo-sustituir-el-archivo-de-una-evidencia)
7. [Cómo pasar una evidencia de histórica a vigente](#7-cómo-pasar-una-evidencia-de-histórica-a-vigente)
8. [Cómo modificar la visibilidad](#8-cómo-modificar-la-visibilidad)
9. [Cómo generar una nueva versión](#9-cómo-generar-una-nueva-versión)
10. [Cómo publicarlo](#10-cómo-publicarlo)
11. [Decisiones que conviene respetar](#11-decisiones-que-conviene-respetar)

---

## 1. Cómo ejecutar el proyecto

Se necesita [Node.js](https://nodejs.org) 20 o superior. La primera vez:

```bash
npm install
```

Para trabajar en el sitio, con recarga automática al guardar:

```bash
npm run dev
```

Abra la dirección que imprime la terminal (normalmente `http://localhost:5178`).

**Para verlo en el teléfono sin publicarlo**, en la misma red Wi-Fi:

```bash
npm run dev:red
```

Vite imprime dos direcciones; use la de **Network** (algo como `http://192.168.1.20:5178`).
`localhost` no funciona desde otro aparato.

Otros comandos:

| Comando             | Qué hace                                                       |
| ------------------- | -------------------------------------------------------------- |
| `npm run build`     | Compila el sitio a `dist/` y genera `sitemap.xml`                |
| `npm run preview`   | Sirve `dist/` para revisar el resultado final antes de publicar  |
| `npm run typecheck` | Revisa los tipos sin compilar                                    |
| `npm run lint`      | Pasa el linter (oxlint)                                          |
| `npm run formato`   | Da formato a todo el código y a los archivos de `content/`       |

---

## 2. Dónde está cada cosa

```
content/                 <- EL CONTENIDO. Es lo único que hay que editar normalmente.
  profile.json             Datos del docente, fotografía, indicadores y créditos.
  sections.json            Los 12 apartados con todo su texto, listas y tablas.
  evidence.json            Los 42 códigos de evidencia con su ficha completa.
  timeline.json            Trayectoria institucional y formación académica.
  projects.json            Proyectos de innovación educativa.

public/                  <- ARCHIVOS QUE SE PUBLICAN TAL CUAL.
  evidencias/              Aquí van los PDF e imágenes de las evidencias públicas.
  imagenes/                Aquí va la fotografía profesional.
  documentos/              Aquí puede ir el .docx original, si desea ofrecerlo.

src/                     <- El código. No hace falta tocarlo para actualizar contenido.
  paginas/                 Una pantalla por archivo.
  componentes/             Piezas reutilizables (tarjetas, tablas, línea de tiempo…).
  estilos/index.css        Colores, tipografías y estilos de impresión.
  lib/exportarWord.ts      Generador del archivo .docx.

herramientas/            Script que genera el mapa del sitio al compilar.
```

Después de editar cualquier archivo de `content/`, **compruebe que sigue siendo JSON válido**:

```bash
node -e "require('./content/evidence.json'); console.log('formato correcto')"
```

Si tiene un error (una coma de más, unas comillas sin cerrar), el comando lo dirá.

---

## 3. Cómo cambiar textos

### Datos del encabezado, el perfil y los créditos

Están en `content/profile.json`. Por ejemplo, para registrar el correo institucional cuando
lo tenga:

```json
"contacto": {
  "correoInstitucional": "gardon@unag.edu.hn",
  "notaCorreo": "",
  "sitio": null
}
```

### Texto de un apartado

Está en `content/sections.json`. Cada apartado tiene una lista de `bloques`, y cada bloque tiene un
`tipo` que decide cómo se dibuja:

| `tipo`              | Para qué sirve                                                |
| ------------------- | ------------------------------------------------------------- |
| `parrafo`           | Un párrafo, con `titulo` opcional                              |
| `destacado`         | La cita resaltada con borde verde (`etiqueta` + `texto`)       |
| `nota`              | Aviso ámbar, para advertencias de privacidad                   |
| `lista`             | Lista de viñetas                                               |
| `tabla`             | Tabla con `columnas` y `filas` (en el teléfono se apila sola)  |
| `tarjetas`          | Rejilla de tarjetas con `titulo` y `texto`                     |
| `acordeon`          | Secciones que se abren y cierran                               |
| `indicadores`       | Cifras grandes (`valor`, `etiqueta`, `nota`)                   |
| `linea-tiempo`      | Dibuja `trayectoria` o `formacion` de `timeline.json`          |
| `proyectos`         | Dibuja las tarjetas de `projects.json`                         |
| `enlace-evidencias` | Párrafo con enlace al Centro de evidencias                     |

Para añadir un párrafo nuevo, copie un bloque existente y cámbiele el texto:

```json
{ "tipo": "parrafo", "titulo": "Un título opcional", "texto": "El texto del párrafo." }
```

Para añadir una fila a una tabla, agréguela al final de `filas`, con **el mismo número de celdas
que columnas tiene la tabla**.

---

## 4. Cómo actualizar la fotografía

1. Copie la imagen a `public/imagenes/`. Un archivo `.jpg` o `.webp` de unos 600 × 800 píxeles
   basta; conviene que pese menos de 300 kB para que abra rápido en el teléfono.
2. En `content/profile.json`, escriba el nombre del archivo:

```json
"fotografia": {
  "archivo": "perfil.jpg",
  "alt": "Fotografía profesional de Gustavo Alonso Ardón",
  "iniciales": "GA"
}
```

Mientras `archivo` sea `null`, la portada muestra un recuadro con las iniciales y la nota
«Fotografía pendiente de cargar».

### El anexo documental de 2020

`content/anexo.json` describe las 71 páginas del expediente de enero de 2020 que se publican, y
también las 13 que **no** se publican y por qué. El sitio las muestra en `/anexo` y dentro de la
ficha de cada evidencia.

Ese archivo es a la vez contenido e instrucciones de preparación:

- `slug` determina el nombre del archivo publicado, con la nomenclatura del propio portafolio:
  `CÓDIGO_2020_slug_Ardon.jpg`. El sitio lo deriva con la misma regla, así que el manifiesto y las
  imágenes no pueden dejar de coincidir.
- `girar: 180` endereza una página que quedó boca abajo.
- `censura` son rectángulos negros en píxeles —`x, y, ancho, alto`— sobre la página ya enderezada,
  a resolución original (2550 × 3300). Se usan para tapar datos personales.

Para regenerar las imágenes desde los escaneos originales:

```bash
powershell -ExecutionPolicy Bypass -File herramientas\preparar-anexo.ps1 -Origen "C:\ruta\a\los\escaneos"
```

Produce una versión de 1200 px para el visor y una miniatura de 360 px para la galería. **Solo
procesa las páginas listadas en `content/anexo.json`**: es deliberado, para que una página excluida
por privacidad no pueda llegar nunca a `public/` por descuido.

Para añadir una página que hoy está excluida, muévala de `exclusiones` a su grupo y vuelva a
ejecutar el comando. Para retirar una publicada, bórrela del grupo, añádala a `exclusiones` con su
motivo y **borre a mano su archivo y su miniatura** de `public/evidencias/anexo-2020/`.

### Los documentos del periodo 2026

`content/documentos.json` lista los documentos de trabajo de 2026 —sílabo, planes de unidad,
rúbricas, POA, informes— que respaldan una evidencia. El sitio los muestra dentro de la ficha de su
código.

Cada entrada lleva:

- `origen`: la ruta local del archivo, tal como está en el ordenador o en el disco portátil.
- `slug`: determina el nombre publicado, `CÓDIGO_2026_slug_Ardon.pdf`.
- `censura` (opcional): las cadenas de texto que se sustituyen por «dato omitido» antes de
  convertir. Se usa para el teléfono personal.

Para regenerarlos:

```bash
powershell -ExecutionPolicy Bypass -File "herramientas\preparar-documentos.ps1"
```

Los `.docx` se convierten a PDF con Word; los que ya son PDF se copian tal cual.

**La sustitución la hace el buscar-y-reemplazar de Word, no un reemplazo sobre el XML.** Dentro de
un `.docx` una misma palabra suele venir partida en varios fragmentos, así que un reemplazo de
texto plano falla sin avisar: la primera versión de este script parecía funcionar y dejaba el
teléfono en el PDF. El script recorre además los cuadros de texto y las formas, donde también puede
esconderse el dato, y aborta si no encuentra nada que sustituir.

Al igual que el anexo, **solo procesa lo que el manifiesto lista**.

### La tarjeta que se ve al compartir el enlace

`public/imagenes/tarjeta-social.jpg` es la imagen de 1200 × 630 que aparece cuando alguien comparte
el enlace del portafolio por WhatsApp, Facebook o LinkedIn. **Es una imagen fija: no se actualiza
sola.** Hay que rehacerla cuando cambien el año del portafolio, el nombre, el cargo o la fotografía.

Para regenerarla, siga las instrucciones de la cabecera de `herramientas/tarjeta-social.js`: en
resumen, arranque el sitio con `npm run dev`, abra la consola del navegador con F12, pegue ese
archivo completo y pulse Intro. El navegador descarga la tarjeta nueva; muévala a
`public/imagenes/` reemplazando la anterior. Los textos los toma de `content/profile.json`, así que
basta con actualizar ese archivo antes.

Un detalle que conviene no romper: en `index.html`, las etiquetas `og:image` y `twitter:image`
llevan la **dirección completa** del sitio, no una ruta relativa. WhatsApp y Facebook ignoran las
rutas relativas y el enlace saldría sin imagen. Si el sitio cambia de dirección, hay que
actualizarlas a mano.

---

## 5. Cómo agregar una evidencia

Abra `content/evidence.json` y añada una entrada a la lista `evidencias`. Copie una existente y
cambie los campos; todos son obligatorios salvo los marcados como opcionales:

```json
{
  "codigo": "E3.2",
  "titulo": "Programa o sílabo actualizado de cada asignatura",
  "categoria": "Planificación y materiales",
  "tipo": "Instrumento docente",
  "apartado": 3,
  "apartadoSlug": "actividad-docente",
  "periodo": "2026",
  "anio": "2026",
  "descripcion": "Una o dos frases sobre qué demuestra la evidencia.",
  "estado": "vigente",
  "estadoTexto": "Incorporado en septiembre de 2026",
  "origenExpediente": "vigente-2026",
  "visibility": "public",
  "motivoRestriccion": null,
  "enMatriz": true,
  "fuenteDocumento": "Apartado 3, evidencias recomendadas; matriz maestra",
  "anexo": 12,
  "archivo": "E3.2_2026_Silabo_Avicola_Ardon.pdf",
  "miniatura": null,
  "tipoArchivo": "PDF, 8 páginas"
}
```

Qué significa cada campo:

- **`codigo`** — el código de la matriz (`E3.2`). Debe ser único; es la dirección de la ficha
  (`#/evidencias/E3.2`).
- **`apartado`** y **`apartadoSlug`** — el número y la dirección del apartado al que pertenece.
  El `slug` tiene que coincidir con el de `sections.json`.
- **`estado`** — uno de `historico`, `vigente`, `pendiente` o `restringido`. Decide el color de la
  etiqueta y permite filtrar.
- **`estadoTexto`** — la frase que se muestra tal cual, tomada de la matriz del documento.
- **`origenExpediente`** — `"historico-2020"` pinta la barra azul de evidencia histórica,
  `"vigente-2026"` la marca como del periodo actual, `null` la deja sin distintivo.
- **`visibility`** — vea el punto 8.
- **`anio`** — sirve para el filtro por año. Puede ser `null`.
- **`archivo`**, **`miniatura`**, **`tipoArchivo`**, **`anexo`** — `null` mientras no exista el
  documento; la ficha lo dice con claridad.
- **`advertenciaPrivacidad`** *(opcional)* — recordatorio de qué hay que borrar antes de adjuntar
  el archivo.
- **`notaCodigo`** *(opcional)* — para explicar una diferencia entre el apartado y la matriz.

Si la evidencia pertenece a un apartado, añada también su código a la lista `evidencias` de ese
apartado en `sections.json`, para que aparezca al final de la página del apartado.

---

## 6. Cómo sustituir el archivo de una evidencia

1. Copie el PDF o la imagen a `public/evidencias/`, con la nomenclatura del portafolio:
   `CÓDIGO_AÑO_DESCRIPCIÓN_APELLIDO.pdf` — por ejemplo `E4.2_2026_Rubrica_Proyecto_Ardon.pdf`.
2. En `content/evidence.json`, escriba ese nombre en `archivo` y describa el formato en
   `tipoArchivo` (por ejemplo `"PDF, 3 páginas"`).
3. Si quiere una miniatura, guarde una imagen pequeña en la misma carpeta y anote su nombre en
   `miniatura`. Sin miniatura se dibuja un recuadro con el código, que también se ve bien.

**Antes de copiar cualquier archivo, revise que no contenga datos personales innecesarios.**
El visor solo muestra el archivo si `visibility` es `"public"`.

---

## 7. Cómo pasar una evidencia de histórica a vigente

Cuando consiga la constancia actualizada de 2026, cambie tres campos:

```json
"estado": "vigente",
"estadoTexto": "Constancia de categoría docente emitida el 20/09/2026",
"origenExpediente": "vigente-2026"
```

Con eso desaparece la barra azul de evidencia histórica y la ficha pasa a contarse entre las
vigentes. Recuerde revisar también `visibility`: las históricas están restringidas por
precaución, y una constancia nueva y limpia puede pasar a `"public"`.

---

## 8. Cómo modificar la visibilidad

El campo `visibility` acepta tres valores:

| Valor          | Qué ocurre                                                                      |
| -------------- | ------------------------------------------------------------------------------- |
| `"public"`     | Se muestran la ficha y el archivo, con botones de ver y descargar                |
| `"restricted"` | Se muestra solo la ficha, con el motivo. **El archivo no debe estar en `public/`** |
| `"private"`    | Igual que restringida, y el archivo no se incorpora al proyecto en ningún caso   |

Regla que no conviene romper: **un archivo de una evidencia restringida o privada no se copia a
`public/evidencias/`**. Ocultar solo el enlace no protege nada, porque la dirección del archivo
seguiría siendo accesible para cualquiera que la escriba.

Cuando marque una evidencia como restringida, explique por qué en `motivoRestriccion`: ese texto
se muestra al visitante y deja constancia de la decisión.

En la página `#/privacidad` hay un resumen de la auditoría aplicada, que se actualiza solo a partir
de estos campos.

### Enlaces que no van ni en `content/` ni en este README

Todo lo que se escribe en `content/` viaja al navegador dentro del archivo compilado: aunque no
aparezca en pantalla, cualquiera puede leerlo. Y este README se publica con el repositorio, que es
público en GitHub. Por eso las direcciones de recursos que contienen datos de terceros —por ejemplo el
muro de Padlet del módulo de Ambientes Pecuarios (E3.5)— se anotan en `herramientas/NOTAS-PRIVADAS.md`,
que está en `.gitignore`, igual que `herramientas/censura.json` con las cadenas que se tapan al preparar
documentos. Si se clona el repositorio en otra máquina hay que copiar esos dos archivos a mano.

---

## 9. Cómo generar una nueva versión

1. Actualice lo que corresponda en `content/`.
2. Cambie la versión visible en `content/profile.json`:

```json
"version": "Versión 2 | Diciembre de 2026"
```

3. Compruebe que todo sigue en orden:

```bash
npm run typecheck && npm run lint && npm run build
```

4. Revise el resultado con `npm run preview` antes de publicar.

El portafolio en Word y la versión para imprimir se generan solos a partir del contenido: no hay
que mantener un documento aparte.

### El PDF completo que se ofrece en Descargas

En `public/documentos/` hay además un PDF ya armado, para quien prefiera descargar un archivo en
lugar de pasar por el diálogo de impresión. Ese sí es un archivo fijo, así que hay que rehacerlo
cuando cambie el contenido:

1. Abra `/#/descargas` en el sitio y pulse **Descargar en Word**.
2. Abra el `.docx` en Word y expórtelo a PDF (Archivo → Guardar como → PDF).
3. Reemplace `public/documentos/Portafolio_Docente_2026_Ardon.pdf` con el nuevo archivo.
4. Actualice `pdfCompleto` en `content/profile.json` con el número de páginas y la fecha:

```json
"pdfCompleto": {
  "archivo": "Portafolio_Docente_2026_Ardon.pdf",
  "paginas": 23,
  "actualizado": "20 de septiembre de 2026",
  "nota": "Contiene los doce apartados y la matriz completa de evidencias. …"
}
```

Si pone `"archivo": null`, la tarjeta desaparece de la página de descargas y quedan solo el Word y
la impresión; nunca se queda un enlace roto.

---

## 10. Cómo publicarlo

El sitio compilado son archivos estáticos: sirve cualquier alojamiento, sin base de datos ni
servidor propio.

```bash
npm run build
```

Queda todo en `dist/`. La navegación usa direcciones con `#` (por ejemplo
`.../#/evidencias/E6.4`) precisamente para que funcione igual en la raíz de un dominio, en una
subcarpeta o abierto desde una carpeta local, sin configurar reglas de reescritura.

### En GitHub Pages

El sitio ya está publicado en **https://gardon-hub.github.io/portafolio-docente/**, desde el
repositorio `gardon-hub/portafolio-docente`. Para actualizarlo, después de editar el contenido:

```bash
git add -A && git commit -m "Actualizar el portafolio" && git push
npm run publicar
```

- El primer comando guarda los cambios del proyecto en la rama `main`.
- **`npm run publicar` es el que actualiza el sitio en línea**: compila y sube el resultado a la
  rama `gh-pages`, que es de donde GitHub Pages sirve la página. El sitio tarda uno o dos minutos
  en reflejar el cambio.

Nótese que subir a `main` **no** publica nada por sí solo: hacen falta los dos pasos.

#### Por qué no se publica solo, y cómo activarlo el día que quiera

Lo habitual sería un flujo de GitHub Actions que compile y publique en cada `git push`, como en
`optiaula-io`. No se hizo así porque el token de `gh` de esta máquina no tiene el permiso
`workflow`, y GitHub rechaza subir archivos a `.github/workflows/` sin él.

**El flujo ya está escrito y probado**, esperando en `herramientas/publicacion-automatica.yml`.
Ahí no hace nada: GitHub solo mira dentro de `.github/workflows/`. Para activarlo:

1. Conceda el permiso. Este comando muestra un código de un solo uso y una dirección:

```bash
gh auth refresh -h github.com -s workflow
```

Ábrala en el navegador, **asegurándose de tener la sesión iniciada como `gardon-hub`** y no con
otra cuenta, pegue el código y autorice. Pedirá la verificación en dos pasos.

2. Mueva el archivo a su sitio y súbalo:

```bash
mkdir -p .github/workflows && mv herramientas/publicacion-automatica.yml .github/workflows/publicar.yml && git add -A && git commit -m "Activar la publicación automática" && git push
```

3. Cambie el origen de Pages, de la rama al flujo de trabajo:

```bash
gh api -X PUT repos/gardon-hub/portafolio-docente/pages -f build_type=workflow
```

Desde ese momento basta con `git push`, y sobran tanto `npm run publicar` como la rama
`gh-pages`, que puede borrarse con `git push origin --delete gh-pages`.

#### Si cambia la dirección del sitio

La dirección está en dos lugares que hay que ajustar a la vez:

```bash
SITIO_URL=https://la-nueva-direccion/ npm run build
```

y la línea `Sitemap:` de `public/robots.txt`.

### En una memoria USB o una carpeta local

Compile y copie la carpeta `dist/` completa. Abriendo `dist/index.html` el sitio funciona sin
conexión y sin servidor.

---

## 11. Decisiones que conviene respetar

Estas decisiones no están escritas en el código y se perderían si alguien las cambia sin saberlo:

- **El documento manda.** Ningún texto del sitio se inventó ni se reinterpretó. Cuando el
  documento y la matriz se contradicen, el sitio muestra las dos versiones y lo advierte, en vez
  de corregir en silencio. Vea el aviso al final del Centro de evidencias.
- **El correo personal del currículo de 2020 no se publica.** La fila «Correo de contacto» de la
  hoja de vida dice que está pendiente el institucional. Cuando lo tenga, se registra en
  `profile.json`.
- **Las evidencias del expediente de 2020 quedan restringidas por defecto** hasta que se revisen y
  se autorice su publicación. Llevan número de identidad, firmas y sellos.
- **Las fotografías de Lunes de Huevito (E7.2) muestran a menores de edad.** No se publican sin
  autorización expresa de madres, padres o tutores y de los centros educativos.
- **Las relaciones nominales de tesis y PPS (E6.4) contienen nombres de estudiantes y empresas.**
  Solo puede publicarse una versión agregada o anonimizada.
- **No se usa el logotipo oficial de la universidad.** El sitio se identifica con el nombre escrito
  y un monograma tipográfico. Si la universidad entrega el logotipo, se coloca en
  `public/imagenes/` y se añade al encabezado.
- **Sin analítica, sin cookies de terceros y sin formularios.** Lo único que el sitio guarda en el
  navegador es la preferencia de modo claro u oscuro.
- **Sin dependencias innecesarias.** El archivo de Word se genera escribiendo el ZIP y el
  WordprocessingML a mano (`src/lib/zip.ts` y `src/lib/exportarWord.ts`), para no cargar una
  librería de cientos de kilobytes en un sitio que debe abrir rápido con conexión móvil lenta. El
  PDF se obtiene desde el diálogo de impresión del navegador, con la hoja de estilos de impresión
  que ya trae el sitio.
- **El enlace con forma de botón lleva la clase `boton`.** La regla `a:not([class*='boton'])` de
  `src/estilos/index.css` vive fuera de toda `@layer` y, en la cascada, lo no estratificado gana a
  `@layer components`. Sin esa exclusión, cualquier enlace-botón quedaría con el texto del color de
  su propio fondo.
- **`* { min-width: 0 }`** en la base del CSS. Un elemento flexible o de rejilla no se encoge por
  debajo del ancho de su contenido salvo que se le indique; sin esa regla, las tablas y las
  rejillas desbordan la pantalla del teléfono.

---

## Créditos

Portafolio Docente 2026 — Gustavo Alonso Ardón
Facultad de Medicina Veterinaria y Zootecnia
Universidad Nacional de Agricultura, Honduras
