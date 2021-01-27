FROM php:7.3.3-apache
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y libpq-dev && docker-php-ext-install pdo pdo_pgsql
EXPOSE 80

