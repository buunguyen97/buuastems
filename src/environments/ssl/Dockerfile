#FROM node:12-alpine3.14 AS build
#FROM node:latest AS build
FROM node:16-alpine AS build
LABEL maintainer="jbh5310@concplay.co.kr"

RUN mkdir -p /app
WORKDIR /app

RUN export NODE_OPTIONS=--max_old_space_size=8192

RUN npm install -g @angular/cli

#RUN export NODE_OPTIONS=--max_old_space_size=6144
#RUN export NODE_OPTIONS=--max_old_space_size=8096

COPY package.json /app
COPY package-lock.json /app
RUN npm cache clean --force
RUN npm install

COPY . /app
#RUN ng build --configuration=production

RUN node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --configuration=prod

##FROM nginx:1.17.1-alpine
FROM nginx:latest
#COPY --from=build app/dist/deliveryfrontend /usr/share/nginx/html

COPY nginx/default_ssl.conf /etc/nginx/conf.d/default.conf
COPY nginx/nginx_ssl.crt /etc/nginx/certs/nginx_ssl.crt
COPY nginx/_wildcard_rtosys_com_SHA256WITHRSA.key /etc/nginx/certs/_wildcard_rtosys_com_SHA256WITHRSA.key

EXPOSE 4200 80 443

#CMD ["npm", "start"]
#ENTRYPOINT ["/bin/sh", "-c", "/bin/bash"]
