FROM alpine:3.4
RUN apk add --update nginx
RUN rm -rf /var/cache/apk/* && rm -rf /tmp/*

ADD .docker/nginx.conf /etc/nginx/
ADD .docker/mustr.conf /etc/nginx/conf.d/

COPY ./build /var/www/

WORKDIR /var/www

EXPOSE 3001

CMD ["nginx"]