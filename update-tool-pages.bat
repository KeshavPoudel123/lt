@echo off
echo Updating tool pages to include floating-home-button.css...

REM Loop through all tool directories
for /d %%d in (tools\*) do (
    if exist "%%d\index.html" (
        echo Processing %%d\index.html
        
        REM Use PowerShell to insert the CSS link
        powershell -Command "(Get-Content '%%d\index.html') -replace '(^\s*<!-- Common CSS -->[\r\n]+\s*<link rel=\"stylesheet\" href=\"../../assets/css/styles.css\">)', '$1\n    <link rel=\"stylesheet\" href=\"../../assets/css/floating-home-button.css\">' | Set-Content '%%d\index.html'"
        
        echo Updated %%d\index.html
    )
)

echo All tool pages have been updated!
pause
