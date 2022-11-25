FROM nginx

COPY ./nginx.conf /nginx.conf

CMD ["/bin/sh" , "-c" , "envsubst '$USER_PORT $THEATER_PORT $SOCKET_PORT $POLL_PORT' < /nginx.conf > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]

RUN rm /etc/nginx/nginx.conf 

COPY nginx.conf /etc/nginx/nginx.conf
