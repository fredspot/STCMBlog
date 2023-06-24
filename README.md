# STCMBlog

# Change for Nginx
change the ngin.config
sudo cp nginx.conf /usr/share/nginx/nginx.conf
stop the nginx processes (sudo ps -aux | grep nginx)
sudo nginx -c nginx.conf
