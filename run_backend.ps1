$ErrorActionPreference = 'Stop'

# Determine script and project root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Resolve-Path -Path $scriptDir

Write-Output "Project root: $projectRoot"

# 1) Locate Java
if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
	Write-Output "Using JAVA_HOME from environment: $env:JAVA_HOME"
} else {
	# Look for a bundled JDK under .tools/temurin17 (if project provides one)
	$bundled = Join-Path $projectRoot '.tools\temurin17'
	if (Test-Path $bundled) {
		$found = Get-ChildItem -Path $bundled -Directory -ErrorAction SilentlyContinue | Where-Object { Test-Path (Join-Path $_.FullName 'bin\java.exe') } | Select-Object -First 1
		if ($found) {
			$env:JAVA_HOME = $found.FullName
			Write-Output "Using bundled JDK: $env:JAVA_HOME"
		}
	}
}

if (-not $env:JAVA_HOME) {
	# Fall back to system java (in PATH)
	$javaCmd = Get-Command java -ErrorAction SilentlyContinue
	if ($javaCmd) {
		Write-Output "Using system java: $($javaCmd.Source)"
	} else {
		Write-Error "Java not found. Please install Java 17 and/or set JAVA_HOME."
		exit 1
	}
}

if ($env:JAVA_HOME) {
	$env:Path = "${env:JAVA_HOME}\bin;${env:Path}"
}

# 2) Change to backend module directory
$backendDir = Join-Path $projectRoot 'Backend\jewelry-shop-server\jewelry-shop-server'
if (-not (Test-Path $backendDir)) {
	Write-Error "Backend directory not found: $backendDir"
	exit 1
}
Set-Location $backendDir

# 3) Run with Maven Wrapper if available, otherwise use system mvn
$mvnw = Join-Path $backendDir 'mvnw.cmd'
if (Test-Path $mvnw) {
	Write-Output "Found mvnw wrapper. Running mvnw..."
	& $mvnw clean spring-boot:run
} else {
	$mvnCmd = Get-Command mvn.cmd -ErrorAction SilentlyContinue
	if (-not $mvnCmd) { $mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue }
	if ($mvnCmd) {
		Write-Output "Using system Maven: $($mvnCmd.Source)"
		& $mvnCmd.Source clean spring-boot:run
	} else {
		Write-Error "Maven not found. Install Maven or add the Maven Wrapper (mvnw) to the project."
		exit 1
	}
}
