# Prepara las imagenes del anexo documental a partir del expediente escaneado.
#
#   powershell -ExecutionPolicy Bypass -File herramientas\preparar-anexo.ps1 -Origen "C:\ruta\a\las\paginas"
#
# Que hace con cada pagina listada en content/anexo.json:
#   1. La endereza. Muchos diplomas se escanearon de lado.
#   2. Tapa en negro los rectangulos del campo "censura" (datos personales).
#   3. La reduce a 1200 px de ancho para consulta en pantalla y guarda ademas
#      una miniatura de 360 px para la galeria.
#
# Las paginas que NO estan en content/anexo.json no se procesan: es asi a
# proposito. Las excluidas por privacidad no deben llegar nunca a public/.
param(
  [Parameter(Mandatory = $true)][string]$Origen
)

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$raiz = Split-Path -Parent $PSScriptRoot
$manifiesto = Get-Content (Join-Path $raiz "content\anexo.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$destino = Join-Path $raiz "public\evidencias\anexo-2020"
$destinoMini = Join-Path $destino "miniaturas"
New-Item -ItemType Directory -Force $destino | Out-Null
New-Item -ItemType Directory -Force $destinoMini | Out-Null

# Paginas escaneadas de lado, cuyo texto corre de abajo a arriba.
$giroHorario = @(
  '0017','0018','0019','0020','0021','0023','0025','0026','0028','0029','0030',
  '0031','0032','0033','0034','0035','0036','0038','0039','0041','0042','0043',
  '0044','0047','0052','0054','0061','0063','0064','0065','0066','0067','0068',
  '0069','0070','0073','0080','0081'
)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
function Guardar($bmp, $ruta, $calidad) {
  $par = New-Object System.Drawing.Imaging.EncoderParameters 1
  $par.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [int]$calidad)
  $bmp.Save($ruta, $codec, $par)
}

function Escalar($origen, $anchoDestino) {
  $altoDestino = [int]($origen.Height * $anchoDestino / $origen.Width)
  $bmp = New-Object System.Drawing.Bitmap $anchoDestino, $altoDestino
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($origen, 0, 0, $anchoDestino, $altoDestino)
  $g.Dispose()
  return $bmp
}

$total = 0
$pesoTotal = 0
$indice = @()

foreach ($grupo in $manifiesto.grupos) {
  foreach ($p in $grupo.paginas) {
    $rutaOrigen = Join-Path $Origen ($p.pagina + ".jpg")
    if (-not (Test-Path $rutaOrigen)) { throw "Falta la pagina $($p.pagina) en $Origen" }

    $im = [System.Drawing.Image]::FromFile($rutaOrigen)
    if ($giroHorario -contains $p.pagina) {
      $im.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
    }
    if ($p.PSObject.Properties.Name -contains 'girar' -and $p.girar -eq 180) {
      $im.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone)
    }

    # La censura se aplica antes de reducir, sobre las coordenadas de la pagina
    # enderezada a resolucion original.
    if ($p.PSObject.Properties.Name -contains 'censura' -and $p.censura) {
      $lienzo = New-Object System.Drawing.Bitmap $im
      $im.Dispose()
      $g = [System.Drawing.Graphics]::FromImage($lienzo)
      foreach ($r in $p.censura) {
        $g.FillRectangle([System.Drawing.Brushes]::Black, [int]$r[0], [int]$r[1], [int]$r[2], [int]$r[3])
      }
      $g.Dispose()
      $im = $lienzo
    }

    $nombre = "{0}_2020_{1}_Ardon.jpg" -f $grupo.codigo, $p.slug
    $grande = Escalar $im 1200
    Guardar $grande (Join-Path $destino $nombre) 74
    $grande.Dispose()
    $mini = Escalar $im 360
    Guardar $mini (Join-Path $destinoMini $nombre) 70
    $mini.Dispose()
    $im.Dispose()

    $peso = (Get-Item (Join-Path $destino $nombre)).Length
    $pesoTotal += $peso + (Get-Item (Join-Path $destinoMini $nombre)).Length
    $indice += [pscustomobject]@{ Pagina = $p.pagina; Codigo = $grupo.codigo; Archivo = $nombre; KB = [math]::Round($peso / 1KB) }
    $total++
  }
}

$indice | Format-Table -AutoSize | Out-String -Width 200 | Write-Output
Write-Output ("paginas publicadas: {0}" -f $total)
Write-Output ("peso total del anexo: {0} MB" -f [math]::Round($pesoTotal / 1MB, 2))
