FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install 
ARG REACT_APP_DOMAIN
ENV REACT_APP_DOMAIN=$REACT_APP_DOMAIN
ARG REACT_APP_SOCKET
ENV REACT_APP_SOCKET=$REACT_APP_SOCKET
RUN yarn build

FROM nginx:1.23.1-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
WORKDIR /etc/nginx/conf.d/ 
RUN rm -rf ./*
COPY ./myserver.conf .
ENTRYPOINT ["nginx", "-g", "daemon off;"]