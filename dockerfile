FROM node:18
WORKDIR /app
COPY package.json .
COPY . .
RUN npm install

RUN mkdir -p src/uploads

CMD npm start
