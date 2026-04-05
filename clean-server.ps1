$password = "zhiwu183."
echo $password | ssh root@118.196.117.4 "rm -rf /var/www/html/* && rm -rf /var/www/familytasks/*"
