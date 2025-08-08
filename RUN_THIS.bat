@echo off
title Starting Hayday inventory Tracker (Localhost Mode)
cd /d %~dp0

REM Launch HTTP server to enable fetch access
start "" "start_server.vbs"

REM Open the watermark HTML via localhost
start explorer "http://localhost:8004/index.html"

