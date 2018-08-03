# HTML5 Speedtest

A very lightweight Speedtest implemented in Javascript, using XMLHttpRequest and Web Workers.

## Compatibility
Only modern browsers are supported (IE11, Edge, Chrome, Firefox, Safari)

## Features
* Download
* Upload
* Ping
* Jitter
* IP Address

## Requirements
 - Your server must accept large POST requests (up to 20 Megabytes), otherwise the upload test will fail
 - It's also better if your server does not use compression, but it's not mandatory

## Nginx config example:
```
  server {
    listen 80;
    server_name speed.nubenautas.net;
    location = /favicon.ico {
      alias /home/mencargo/src/nubenautas/public/favicon.ico;
    }
    location / {
      root /home/mencargo/src/speed;
    }
    location /ip {
      default_type text/plain;
      return 200 "${remote_addr}";
    }
    location /empty {
      default_type text/plain;
      return 200;
    }
  }
```

## Donate
[Donate with PayPal](https://www.paypal.me/mencargo)

## Credits
Inspired in https://github.com/adolfintel/speedtest
