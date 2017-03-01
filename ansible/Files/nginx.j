upstream desafio {

    server 127.0.0.2:3000;
}

server {
    listen 80 http2;
    listen [::]:80 http2;
    server_name www.desafio.com

    location / {
        proxy_pass http://desafio;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

    }
}
