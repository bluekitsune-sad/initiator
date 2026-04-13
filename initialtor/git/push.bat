@echo off

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format dd/MM/yyyy"') do set DATE_STR=%%i

cd frontend\SynapseLabCRMFrontEnd-main || exit /b

git add .
git commit -m "%DATE_STR% update"
git push

cd ..\..

cd synapselabcrm || exit /b

git add .
git commit -m "update %DATE_STR%"
git push origin main:processing

cd ..

echo Done.
pause
