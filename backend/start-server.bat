@echo off
cd /d "C:\Users\bmaff\local-service-business-ide\backend"
set PORT=6666
set NODE_ENV=development
echo Starting server on port %PORT%...
echo Current directory: %CD%
node app-working.js