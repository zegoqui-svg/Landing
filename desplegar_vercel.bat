@echo off
echo ========================================
echo   ASISTENTE DE DESPLIEGUE SILUEL A VERCEL
echo ========================================
echo.
echo Este script te ayudara a subir tu pagina a internet GRATIS con Vercel.
echo.
echo PASOS IMPORTANTES:
echo 1. Se descargara el asistente de Vercel.
echo 2. Si te pide "Log in", elige "Continue with GitHub" (usa las flechas y Enter).
echo 3. Se abrira tu navegador -> Autoriza a Vercel.
echo 4. Vuelve aqui.
echo 5. A todas las preguntas que te haga (Set up and deploy? Scope? Link to existing project?), presiona ENTER para decir "Y" (Yes) o aceptar el valor por defecto.
echo.
echo Presiona una tecla para comenzar...
pause >nul

call npx vercel deploy --prod

echo.
echo ========================================
echo   PROCESO FINALIZADO
echo   Busca arriba la linea que dice "Production: https://..."
echo   Ese es tu LINK FINAL.
echo ========================================
pause
