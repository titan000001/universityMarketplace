@echo off
echo Starting Local MySQL Server...
"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysqld.exe" --console --datadir="%~dp0mysql_data" --shared-memory
pause
