@echo off
echo Connecting to server...
plink -ssh root@47.76.135.98 -pw zhiwu183. "cd /root/family-tasks && git pull origin main && npm install && npm run build && rm -rf /var/www/html/* && cp -r dist/* /var/www/html/"
echo Deployment complete!
pause
