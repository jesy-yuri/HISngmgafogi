#!/usr/bin/env pwsh
# Start the Nest server with environment variables configured for XAMPP (Windows PowerShell)
# Usage: From the project `yuri` folder run: .\scripts\start-xampp.ps1

Write-Host "Configuring environment for XAMPP + Nest..."

# Backend CORS origin (adjust if XAMPP serves on a different host/port)
$env:CORS_ORIGIN = "http://localhost"

# MySQL (XAMPP) connection settings — adjust password if you set one in XAMPP
$env:DB_HOST = "127.0.0.1"
$env:DB_PORT = "3306"
$env:DB_USER = "root"
$env:DB_PASS = ""
$env:DB_NAME = "hms_demo"

# Ensure we are not using the SQLite fallback
Remove-Item Env:\USE_SQLITE -ErrorAction SilentlyContinue

Write-Host "Environment variables set:" -ForegroundColor Green
Write-Host " CORS_ORIGIN=$($env:CORS_ORIGIN)" -ForegroundColor Yellow
Write-Host " DB_HOST=$($env:DB_HOST) DB_PORT=$($env:DB_PORT) DB_USER=$($env:DB_USER) DB_NAME=$($env:DB_NAME)" -ForegroundColor Yellow

Write-Host "Installing dependencies (if needed)..."
npm install

Write-Host "Attempting to create database '$($env:DB_NAME)' using mysql CLI (if available)..."
try {
  & mysql -u $env:DB_USER -e "CREATE DATABASE IF NOT EXISTS $($env:DB_NAME) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  Write-Host "Database ensured (or mysql CLI not available)." -ForegroundColor Green
} catch {
  Write-Host "Could not run mysql CLI. Please create the database via phpMyAdmin if needed." -ForegroundColor Yellow
}

Write-Host "Starting Nest dev server..."
npm run start:dev
