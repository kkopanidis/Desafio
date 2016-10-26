# Desafio

Steps for executing:
  1. $ npm install
  2. $ npm start
  3. then go to localhost:3000
  4. ~magick

For Docker:

1) $ docker build .
2) $ docker images
3) copy the tag id from docker images
4) $ docker tag TAG_ID_HERE desafio:latest
5) $ docker run -d -p 80:3000 -d desafio:latest
