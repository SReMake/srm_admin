FROM node:lts-bookworm AS builder

WORKDIR /app

COPY . .

RUN npm install && npm run build-only

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
ADD default.conf /etc/nginx/conf.d/
EXPOSE 80