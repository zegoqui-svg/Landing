@echo off
echo ========================================
echo   PUBLICACION FINAL SILUEL A INTERNET
echo ========================================
echo.
echo Este paso hara que tu pagina sea accesible para todos tus clientes.
echo.
echo IMPORTANTE:
echo 1. Se abrira una ventana para que inicies sesion con tu GitHub.
echo 2. Acepta todos los permisos.
echo 3. Cuando vuelvas a esta ventana, presiona ENTER en cada pregunta.
echo.
pause

echo Publicando...
call npx vercel deploy --prod --yes

echo.
echo ========================================
echo   ¡PAGINA PUBLICADA CON EXITO!
echo ========================================
echo.
pause
