$password = "zhiwu183."
$commands = @"
cd /tmp
rm -rf family-tasks
wget https://github.com/YELLOW1992/family-tasks/archive/refs/heads/main.zip -O family-tasks.zip
unzip -o family-tasks.zip
cd family-tasks-main
npm install
npm run build
rm -rf /var/www/html/*
cp -r dist/* /var/www/html/
cd /tmp
rm -rf family-tasks-main family-tasks.zip
"@

echo $password | ssh root@118.196.117.4 $commands
