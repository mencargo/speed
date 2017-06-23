FROM php:5.6-apache
EXPOSE 80
WORKDIR /var/www/html/
COPY . /var/www/html
COPY example6.html /var/www/html/index.html
CMD ["/usr/local/bin/apache2-foreground"]
