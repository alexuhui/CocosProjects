
@REM release or debug
if /I "%1"=="d" goto DebugMode
if /I "%1"=="debug" goto DebugMode
if /I "%1"=="Debug" goto DebugMode
if /I "%1"=="DEBUG" goto DebugMode

if /I "%1"=="r" goto ReleaseMode
if /I "%1"=="release" goto ReleaseMode
if /I "%1"=="Release" goto ReleaseMode
if /I "%1"=="RELEASE" goto ReleaseMode

:DebugMode
    set conf=Debug
    goto End
:ReleaseMode
    set conf=Release
    goto End
:End

cmake -S . -B cmake-build -G "Visual Studio 17 2022" -A "Win32"
cmake --build cmake-build --config %conf%

@REM get folder name
for /f "delims=" %%i in ("%cd%") do set folder=%%~ni

@REM run exe
.\cmake-build\bin\%folder%\%conf%\%folder%.exe
