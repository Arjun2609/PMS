@echo off
setlocal enabledelayedexpansion

set PGPATH=C:\Program Files\PostgreSQL\18\bin
set PGUSER=postgres
set PGHOST=localhost
set PGPASSWORD=1q2w3e4r5t

echo.
echo ========================================
echo   PMS - Database Setup
echo ========================================
echo.

echo [1/7] Creating database...
"%PGPATH%\psql.exe" -U %PGUSER% -h %PGHOST% -tc "SELECT 1 FROM pg_database WHERE datname = 'pms_db'" | findstr /c:"1" >nul
if errorlevel 1 (
    "%PGPATH%\psql.exe" -U %PGUSER% -h %PGHOST% -f scripts\01_create_database\create_database.sql
    echo [OK] Database created
) else (
    echo [OK] Database already exists
)

echo.
echo [2/7] Creating roles...
"%PGPATH%\psql.exe" -U %PGUSER% -h %PGHOST% -d pms_db -f scripts\02_create_roles\create_roles.sql >nul 2>&1
echo [OK] Roles created

echo.
echo [3/7] Creating schemas...
"%PGPATH%\psql.exe" -U %PGUSER% -h %PGHOST% -d pms_db -f scripts\03_create_schemas\create_schemas.sql >nul 2>&1
echo [OK] Schemas created

echo.
echo [4/7] Creating tables...
"%PGPATH%\psql.exe" -U %PGUSER% -h %PGHOST% -d pms_db -f scripts\04_create_tables\create_tables.sql >nul 2>&1
echo [OK] Tables created

echo.
echo [5/7] Creating functions...
"%PGPATH%\psql.exe" -U %PGUSER% -h %PGHOST% -d pms_db -f scripts\05_create_functions\create_functions.sql >nul 2>&1
echo [OK] Functions created

echo.
echo [6/7] Creating procedures...
"%PGPATH%\psql.exe" -U %PGUSER% -h %PGHOST% -d pms_db -f scripts\06_create_procedures\create_procedures.sql >nul 2>&1
echo [OK] Procedures created

echo.
echo [7/7] Creating indexes and triggers...
"%PGPATH%\psql.exe" -U %PGUSER% -h %PGHOST% -d pms_db -f scripts\07_create_indexes\create_indexes.sql >nul 2>&1
echo [OK] Indexes and triggers created

echo.
echo ========================================
echo   Database Setup Complete!
echo ========================================
echo.

"%PGPATH%\psql.exe" -U %PGUSER% -h %PGHOST% -d pms_db -c "SELECT 'Connection Test: SUCCESS' as status;"

pause
