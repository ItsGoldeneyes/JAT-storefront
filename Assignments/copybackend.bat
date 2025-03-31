@echo off

REM This script copies the backend directory to the XAMPP htdocs folder

REM WILL DELETE ANY FILES IN DESTINATION THAT DON'T MATCH SOURCE

set SOURCE="C:\Users\adamc\OneDrive\Documents\GitHub\CPS630\Assignments\Assignment 1\Backend"
set DESTINATION="C:\xampp\htdocs\Assignment1"

robocopy %SOURCE% %DESTINATION% /MIR
echo Backend directory synced.
pause