FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install --no-audit --unsafe-perm
EXPOSE 80
EXPOSE 8082
ENTRYPOINT ["./entryPoint.sh"]
