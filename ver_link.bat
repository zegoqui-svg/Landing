@echo off
echo ========================================
echo   OBTENIENDO LINK DE SILUEL...
echo ========================================
call npx vercel list
echo.
echo ========================================
echo   Busca la linea que dice "Url" o "Production".
echo   Ese es tu LINK.
echo ========================================
pause
