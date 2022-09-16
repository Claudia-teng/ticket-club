FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install && yarn build

FROM nginx:1.23.1-alpine
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]