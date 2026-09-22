# Prepara los documentos de evidencia del periodo 2026 que estaban en el
# ordenador y en el disco portatil del docente.
#
#   powershell -ExecutionPolicy Bypass -File herramientas\preparar-documentos.ps1
#
# Que hace con cada documento listado en content/documentos.json:
#   - Si ya es PDF, lo copia.
#   - Si es .docx, lo convierte a PDF con Word.
#   - Si tiene "censura": true, sustituye las cadenas de herramientas/censura.json antes de convertir.
#     Se usa para el telefono personal, que no se publica.
#
# Solo toca lo que el manifiesto lista. Un archivo que no este ahi no llega a
# public/, igual que en el anexo de 2020.
$ErrorActionPreference = 'Stop'

$raiz = Split-Path -Parent $PSScriptRoot
$manifiesto = Get-Content (Join-Path $raiz 'content\documentos.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$destino = Join-Path $raiz 'public\evidencias\documentos-2026'
New-Item -ItemType Directory -Force $destino | Out-Null
$trabajo = Join-Path $env:TEMP ('prep_' + [guid]::NewGuid().ToString('N').Substring(0, 8))
New-Item -ItemType Directory -Force $trabajo | Out-Null

Add-Type -AssemblyName System.IO.Compression.FileSystem

# La sustitucion la hace Word, no un reemplazo sobre document.xml: en el XML una
# misma palabra suele venir partida en varios <w:t>, asi que buscar la cadena
# entera falla sin avisar. Se recorren todas las historias del documento para
# alcanzar tambien encabezados y pies.
function Censurar-EnWord {
  param($Documento, [string[]]$Cadenas)
  $sustituidas = 0
  foreach ($cadena in $Cadenas) {
    # Todas las historias, no solo el cuerpo: encabezados, pies y notas.
    foreach ($inicio in $Documento.StoryRanges) {
      $historia = $inicio
      while ($historia) {
        $buscar = $historia.Find
        $buscar.ClearFormatting()
        $buscar.Replacement.ClearFormatting()
        # wdFindContinue = 1, wdReplaceAll = 2
        if ($buscar.Execute($cadena, $false, $false, $false, $false, $false, $true, 1, $false, '[dato omitido]', 2)) {
          $sustituidas++
        }
        $historia = $historia.NextStoryRange
      }
    }
    # Los cuadros de texto y las formas quedan fuera de StoryRanges.
    foreach ($forma in $Documento.Shapes) {
      if ($forma.TextFrame.HasText) {
        $r = $forma.TextFrame.TextRange
        if ($r.Text -like "*$cadena*") {
          $r.Text = $r.Text.Replace($cadena, '[dato omitido]')
          $sustituidas++
        }
      }
    }
    foreach ($forma in $Documento.InlineShapes) {
      if ($forma.Type -eq 5 -and $forma.TextFrame -and $forma.TextFrame.HasText) {
        $r = $forma.TextFrame.TextRange
        if ($r.Text -like "*$cadena*") {
          $r.Text = $r.Text.Replace($cadena, '[dato omitido]')
          $sustituidas++
        }
      }
    }
  }
  return $sustituidas
}

$word = $null
$power = $null
$filas = @()
try {
  foreach ($grupo in $manifiesto.grupos) {
    foreach ($d in $grupo.documentos) {
      if (-not (Test-Path $d.origen)) { throw "No existe: $($d.origen)" }
      $ext = if ($d.PSObject.Properties.Name -contains 'extension' -and $d.extension) { $d.extension } else { 'pdf' }
      $nombre = "{0}_2026_{1}_Ardon.{2}" -f $grupo.codigo, $d.slug, $ext
      $rutaFinal = Join-Path $destino $nombre
      $fuente = $d.origen

      $censura = @()
      if ($d.PSObject.Properties.Name -contains 'censura' -and $d.censura) {
        # Las cadenas a censurar viven fuera de content/ (herramientas/censura.json, no versionado):
        # content/ se empaqueta en el sitio y publicaria el propio dato que se quiere ocultar.
        if (-not $mapaCensura) { $mapaCensura = Get-Content (Join-Path $PSScriptRoot 'censura.json') -Raw -Encoding UTF8 | ConvertFrom-Json }
        $cadenas = $mapaCensura.PSObject.Properties[$d.slug]
        if (-not $cadenas) { throw "No hay cadenas de censura para $($d.slug) en herramientas/censura.json" }
        $censura = @($cadenas.Value)
      }

      $extension = [System.IO.Path]::GetExtension($fuente).ToLower()

      if ($ext -ne 'pdf') {
        # Una imagen se publica tal cual: convertirla a PDF no aportaria nada.
        Copy-Item $fuente $rutaFinal -Force
      }
      elseif ($extension -eq '.pdf') {
        if ($censura.Count -gt 0) { throw "No se puede censurar un PDF de origen: $nombre" }
        Copy-Item $fuente $rutaFinal -Force
      }
      elseif ($extension -eq '.pptx' -or $extension -eq '.ppt') {
        if ($censura.Count -gt 0) { throw "La censura solo esta implementada para Word: $nombre" }
        if (-not $power) {
          $power = New-Object -ComObject PowerPoint.Application
        }
        # PowerPoint no admite abrir invisible en todas las versiones; se abre
        # sin ventana (msoFalse en WithWindow) y se exporta a PDF (32).
        $pres = $power.Presentations.Open([string]$fuente, $true, $false, $false)
        $pres.SaveAs([string]$rutaFinal, 32)
        $pres.Close()
      }
      else {
        if (-not $word) {
          $word = New-Object -ComObject Word.Application
          $word.Visible = $false
          $word.DisplayAlerts = 0
        }
        # Las rutas se pasan como cadenas explicitas: los valores que salen de
        # ConvertFrom-Json llegan como PSObject y Word los rechaza.
        # Si hay que censurar, el documento se abre con escritura para poder
        # sustituir; nunca se guarda encima del original.
        $soloLectura = ($censura.Count -eq 0)
        $doc = $word.Documents.Open([string]$fuente, $false, $soloLectura)
        if ($censura.Count -gt 0) {
          $sustituidas = Censurar-EnWord -Documento $doc -Cadenas $censura
          if ($sustituidas -eq 0) { throw "No se encontro el dato a censurar en $nombre" }
        }
        $doc.ExportAsFixedFormat([string]$rutaFinal, 17)              # 17 = PDF
        $doc.Close(0)                                                 # 0 = no guardar
      }

      $kb = [math]::Round((Get-Item $rutaFinal).Length / 1KB)
      $filas += [pscustomobject]@{ Codigo = $grupo.codigo; Archivo = $nombre; KB = $kb; Censurado = ($censura.Count -gt 0) }
    }
  }
}
finally {
  if ($word) { $word.Quit(); [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null }
  if ($power) { $power.Quit(); [System.Runtime.InteropServices.Marshal]::ReleaseComObject($power) | Out-Null }
  Remove-Item $trabajo -Recurse -Force -ErrorAction SilentlyContinue
}

$filas | Format-Table -AutoSize | Out-String -Width 160 | Write-Output
Write-Output ("documentos preparados: {0}" -f $filas.Count)
Write-Output ("peso total: {0} MB" -f [math]::Round((Get-ChildItem $destino -File | Measure-Object Length -Sum).Sum / 1MB, 2))
