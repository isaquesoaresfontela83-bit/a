# Servidor local independente de Node.js e Java (Windows PowerShell 5.1+).
# Atende somente 127.0.0.1:8080; nao publica o site na internet.
$ErrorActionPreference = 'Stop'
$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'public'))
if (-not (Test-Path -LiteralPath (Join-Path $root 'index.html') -PathType Leaf)) {
  Write-Host 'Erro: pasta public/index.html nao encontrada. Extraia o ZIP completo.' -ForegroundColor Red
  exit 1
}
$port = 8080
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
try { $listener.Start() }
catch {
  Write-Host 'Nao foi possivel iniciar em localhost:8080. A porta pode estar ocupada.' -ForegroundColor Red
  Write-Host $_.Exception.Message
  exit 1
}
$mime = @{
  '.html'='text/html; charset=utf-8'
  '.css'='text/css; charset=utf-8'
  '.js'='text/javascript; charset=utf-8'
  '.png'='image/png'
  '.jpg'='image/jpeg'
  '.jpeg'='image/jpeg'
  '.svg'='image/svg+xml'
  '.webp'='image/webp'
  '.ico'='image/x-icon'
}
$crlf = [string][char]13 + [string][char]10
Write-Host ''
Write-Host 'SABOR DA EMILLY - PREVIA LOCAL' -ForegroundColor Yellow
Write-Host 'Site: http://localhost:8080'
Write-Host 'Para encerrar: feche esta janela ou pressione Ctrl+C.'
Write-Host ''
try { Start-Process 'http://localhost:8080/' }
catch { Write-Host 'Abra http://localhost:8080 no navegador.' }
try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $client.ReceiveTimeout = 4000
      $stream = $client.GetStream()
      $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
      $firstLine = $reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($firstLine)) { continue }
      $parts = $firstLine.Split(' ')
      $method = $parts[0]
      $status = '200 OK'
      $type = 'text/plain; charset=utf-8'
      $payload = [System.Text.Encoding]::UTF8.GetBytes('Arquivo nao encontrado.')
      if ($method -ne 'GET' -and $method -ne 'HEAD') {
        $status = '405 Method Not Allowed'
        $payload = [System.Text.Encoding]::UTF8.GetBytes('Metodo nao permitido.')
      } else {
        $pathPart = $parts[1].Split('?')[0].Split('#')[0]
        $pathPart = [System.Uri]::UnescapeDataString($pathPart)
        if ($pathPart -eq '/') { $pathPart = '/index.html' }
        $relative = $pathPart.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $full = [System.IO.Path]::GetFullPath((Join-Path $root $relative))
        $allowed = $full.StartsWith($root + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)
        if ($allowed -and [System.IO.File]::Exists($full)) {
          $payload = [System.IO.File]::ReadAllBytes($full)
          $extension = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
          $type = if ($mime.ContainsKey($extension)) { $mime[$extension] } else { 'application/octet-stream' }
        } else {
          $status = '404 Not Found'
        }
      }
      $responseHeaders = 'HTTP/1.1 ' + $status + $crlf +
        'Content-Type: ' + $type + $crlf +
        'Content-Length: ' + $payload.Length + $crlf +
        'X-Content-Type-Options: nosniff' + $crlf +
        'Cache-Control: no-store' + $crlf +
        'Connection: close' + $crlf + $crlf
      $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($responseHeaders)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      if ($method -ne 'HEAD') { $stream.Write($payload, 0, $payload.Length) }
      $stream.Flush()
    } catch {
      Write-Host ('Falha ao atender uma requisicao: ' + $_.Exception.Message) -ForegroundColor DarkYellow
    } finally { $client.Close() }
  }
} finally { $listener.Stop() }
