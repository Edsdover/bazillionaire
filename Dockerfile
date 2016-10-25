FROM node:6
ADD . /code
WORKDIR /code
RUN npm install
CMD npm start
