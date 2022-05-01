Write-Output "Installing Bliss..."

$file = '../.env'

if (-not(Test-Path -Path $file -PathType Leaf)) {
     try {
         $null = New-Item -ItemType File -Path $file -Force -ErrorAction Stop
         Copy-Item .env.example .env
         Write-Output "Please edit .env file and restart the script."
         exit 1
     }
     catch {
         throw $_.Exception.Message
     }
 }


Write-Output "Running docker-compose..."
Write-Output "This may take a while..."

docker-compose up -d
Write-Output "Migrating database..."
docker-compose exec bliss yarn prisma migrate deploy
Write-Output "Seeding database..."
docker-compose exec bliss yarn prisma db seed 

Write-Output "Successfully installed Bliss"
Write-Output "Run the following to view logs:"
Write-Output "docker-compose logs -f --tail=50 --no-log-prefix bliss"