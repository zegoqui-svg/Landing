@echo off
echo ========================================
echo   ULTIMA SUBIDA SILUEL A GITHUB
echo ========================================

REM Configuracion de identidad
git config user.email "gomezelsa806@gmail.com"
git config user.name "Siluel Spa"

REM Preparando archivos (incluyendo las nuevas imagenes)
git add .
git commit -m "Version Final: Testimonios reales, nuevas fotos y sistema WhatsApp corregido"

REM Subiendo a GitHub con fuerza para asegurar que todo se actualice
echo Subiendo cambios finales a https://github.com/zegoqui-svg/Landing.git...
git push -u origin main --force

echo ========================================
echo   SUBIDA COMPLETADA CON EXITO
echo ========================================
pause
