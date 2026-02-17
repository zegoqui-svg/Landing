@echo off
echo ========================================
echo   ASISTENTE DE SUBIDA FORZADA SILUEL A GITHUB
echo ========================================

REM Configuracion de identidad para este repositorio
git config user.email "gomezelsa806@gmail.com"
git config user.name "Siluel Spa"

REM Preparando archivos
git add .
git commit -m "Version Premium final con correcciones ortograficas e imagenes 4K"

REM Configurando rama y remoto
git branch -M main
git remote remove origin
git remote add origin https://github.com/zegoqui-svg/Landing.git

REM Forzando la subida a GitHub (Sobrescribiendo historial remoto)
echo Subiendo archivos a https://github.com/zegoqui-svg/Landing.git...
git push -u origin main --force

echo ========================================
echo   PROCESO COMPLETADO EXITOSAMENTE
echo ========================================
pause
