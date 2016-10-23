# Speedtest in 4k

No Flash, No Java, No Websocket, No Bullshit.

This is a very small Speedtest implemented in Javascript, using XMLHttpRequest and Web Workers.

## Try it
[Take a Speedtest](http://speedtest.adolfintel.com)

## Compatibility
Only modern browsers are supported (Edge 12+)

## Requirements
 - A reasonably fast web server
 - Some way to generate garbage data using either the included PHP script, a [big file of random data](http://downloads.adolfintel.com/geth.php?r=speedtest-bigfile), or a symlink to /dev/urandom
 - Your server must not compress the data it sends
 - Your server must accept large POST requests (up to 10 Megabytes), otherwise the upload test will fail
 - Client side, there must not be any type of buffering (such as a proxy), or you may get incorrect results

## How to use
See the examples, it's really simple.

## License
Copyright (C) 2016 Federico Dossena

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
