# HTML5 Speedtest

No Flash, No Java, No Websocket, No Bullshit.

This is a very lightweight Speedtest implemented in Javascript, using XMLHttpRequest and Web Workers.

## Try it
[Take a Speedtest](http://speedtest.fdossena.com)

## Compatibility
Only modern browsers are supported (Edge 12+)

## Requirements
 - A reasonably fast web server. PHP is optional but recommended (see doc.pdf for details)
 - Some way to generate garbage data (PHP script included, see doc.pdf for other solutions)
 - Your server must accept large POST requests (up to 20 Megabytes), otherwise the upload test will fail
 - It's also better if your server does not use compression, but it's not mandatory

## How to use
See the examples or doc.pdf

## License
Copyright (C) 2016-2017 Federico Dossena

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/lgpl>.
