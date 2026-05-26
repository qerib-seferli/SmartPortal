# Bu skript GLOBAL PRO saytını lokal statik server kimi yayımlayır.
param([int]$Port = 4176)

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Listener = [System.Net.HttpListener]::new()
$Listener.Prefixes.Add("http://127.0.0.1:$Port/")
$Listener.Start()
Write-Host "SmartPortal GLOBAL PRO: http://127.0.0.1:$Port/index.html"

try {
  while ($Listener.IsListening) {
    $Context = $Listener.GetContext()
    $Path = $Context.Request.Url.LocalPath.TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($Path)) { $Path = "index.html" }
    $File = Join-Path $Root $Path
    if (Test-Path -LiteralPath $File -PathType Leaf) {
      $Ext = [System.IO.Path]::GetExtension($File).ToLowerInvariant()
      $Types = @{ ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8"; ".js"="text/javascript; charset=utf-8"; ".json"="application/json; charset=utf-8"; ".svg"="image/svg+xml" }
      $Context.Response.ContentType = $Types[$Ext]
      if (-not $Context.Response.ContentType) { $Context.Response.ContentType = "application/octet-stream" }
      $Bytes = [System.IO.File]::ReadAllBytes($File)
      $Context.Response.ContentLength64 = $Bytes.Length
      $Context.Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
    } else {
      $Context.Response.StatusCode = 404
    }
    $Context.Response.Close()
  }
}
finally {
  $Listener.Stop()
}
