@echo off
REM Blog RSS Importer - Complete Workflow Script for Windows
REM Usage: run-workflow.bat [command]

setlocal enabledelayedexpansion

REM Script directory
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

REM Colors (limited support in Windows)
set "INFO=[INFO]"
set "SUCCESS=[SUCCESS]"
set "WARNING=[WARNING]"
set "ERROR=[ERROR]"

REM Functions
:print_header
echo.
echo =====================================
echo %~1
echo =====================================
echo.
goto :eof

:print_success
echo %SUCCESS% %~1
goto :eof

:print_error
echo %ERROR% %~1
goto :eof

:print_warning
echo %WARNING% %~1
goto :eof

:check_dependencies
call :print_header "Checking Dependencies"

where node >nul 2>nul
if %errorlevel% neq 0 (
    call :print_error "Node.js is not installed"
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    call :print_error "npm is not installed"
    exit /b 1
)

if not exist "node_modules" (
    call :print_warning "Dependencies not installed, running npm install..."
    npm install
    if %errorlevel% neq 0 (
        call :print_error "Failed to install dependencies"
        exit /b 1
    )
)

call :print_success "Dependencies OK"
goto :eof

:check_env
if not exist ".env" (
    call :print_warning ".env file not found, copying from example..."
    copy .env.example .env >nul
    call :print_warning "Please edit .env file with your configuration"
)
goto :eof

:import_rss
call :print_header "Importing RSS Data"
npm start
if %errorlevel% neq 0 (
    call :print_error "RSS import failed"
    exit /b 1
)
call :print_success "RSS import completed"
goto :eof

:sync_to_blog
call :print_header "Syncing to Blog"
node integration/blogSync.js sync
if %errorlevel% neq 0 (
    call :print_error "Blog sync failed"
    exit /b 1
)
call :print_success "Blog sync completed"
goto :eof

:run_complete_workflow
call :print_header "Running Complete Workflow"

call :check_dependencies
call :check_env

call :print_header "Step 1: RSS Import"
node index.js
if %errorlevel% neq 0 (
    call :print_error "RSS import failed"
    exit /b 1
)

call :print_header "Step 2: Blog Synchronization"
node integration/blogSync.js sync
if %errorlevel% neq 0 (
    call :print_error "Blog sync failed"
    exit /b 1
)

call :print_header "Step 3: Status Check"
node integration/workflow.js status

call :print_success "Complete workflow finished!"
goto :eof

:run_scheduled
call :print_header "Starting Scheduled Workflow"
node integration/workflow.js schedule
goto :eof

:run_quick_sync
call :print_header "Quick Sync (Existing Data)"
node integration/blogSync.js sync
if %errorlevel% neq 0 (
    call :print_error "Quick sync failed"
    exit /b 1
)
call :print_success "Quick sync completed"
goto :eof

:run_status
call :print_header "Workflow Status"
node integration/workflow.js status
goto :eof

:run_test
call :print_header "Testing RSS Feeds"
npm run test
goto :eof

:run_dev
call :print_header "Development Mode"
npm run dev
goto :eof

:show_help
echo Blog RSS Importer - Workflow Script
echo.
echo Usage: %~nx0 [command]
echo.
echo Commands:
echo   complete    Run complete workflow (import + sync)
echo   import      Import RSS data only
echo   sync        Sync to blog only
echo   quick       Quick sync using existing data
echo   schedule    Start scheduled workflow (every 6 hours)
echo   status      Show workflow status
echo   test        Test RSS feeds
echo   dev         Development mode with auto-reload
echo   help        Show this help message
echo.
echo Examples:
echo   %~nx0 complete     # Run full workflow
echo   %~nx0 quick        # Quick sync only
echo   %~nx0 schedule     # Start automation
echo.
goto :eof

REM Main script logic
set command=%1
if "%command%"=="" set command=help

if "%command%"=="complete" (
    call :run_complete_workflow
) else if "%command%"=="import" (
    call :check_dependencies
    call :check_env
    call :import_rss
) else if "%command%"=="sync" (
    call :sync_to_blog
) else if "%command%"=="quick" (
    call :run_quick_sync
) else if "%command%"=="schedule" (
    call :check_dependencies
    call :check_env
    call :run_scheduled
) else if "%command%"=="status" (
    call :run_status
) else if "%command%"=="test" (
    call :check_dependencies
    call :run_test
) else if "%command%"=="dev" (
    call :check_dependencies
    call :run_dev
) else if "%command%"=="help" (
    call :show_help
) else (
    call :print_error "Unknown command: %command%"
    echo.
    call :show_help
    exit /b 1
)

endlocal
