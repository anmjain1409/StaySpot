@echo off
REM Setup MySQL Database for StaySpot

echo Creating StaySpot Database...

"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql" -u root -p < MYSQL_SETUP.sql

if %errorlevel% equ 0 (
    echo.
    echo Database setup completed successfully!
    echo.
) else (
    echo.
    echo Database setup failed!
    echo.
)

pause
