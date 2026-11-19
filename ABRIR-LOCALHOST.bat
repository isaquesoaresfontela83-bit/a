@echo off
setlocal
cd /d "%~dp0"
title Sabor da Emilly - Localhost
if not exist "public\index.html" (
  echo ERRO: Extraia a pasta inteira antes de abrir este arquivo.
  pause
  exit /b 1
)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0localhost.ps1"
if errorlevel 1 (
  echo.
  echo Nao foi possivel iniciar a previa.
  pause
)
