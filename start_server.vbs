Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "python -m http.server 8004", 0
