FROM node as builder
#WORKDIR /home/application/daigou/daigou_front
WORKDIR D:\temp

COPY . .
RUN npm install
RUN npm run build --dev

FROM nginx:stable-alpine
#COPY --from=builder /home/application/daigou/daigou_front/dist/daigoufront /usr/share/nginx/html
COPY --from=builder D:\test/dist/daigoufront D:\Program Files\nginx-1.16.1\html
EXPOSE 80
