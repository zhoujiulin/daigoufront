FROM node as builder
WORKDIR /home/application/daigou/daigou_front

COPY . .
RUN npm install
RUN npm run build --dev

FROM nginx:stable-alpine
COPY --from=builder /home/application/daigou/daigou_front/dist/daigoufront /usr/share/nginx/html
EXPOSE 80
