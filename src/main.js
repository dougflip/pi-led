const fs = require('fs');
const http = require('http');
const url = require('url');
const Gpio = require('onoff').Gpio;
const led = new Gpio(14, 'out');

const indexHtml = fs.readFileSync('./src/index.html', 'utf8');

const respondWithLight = (msg, val) => res => {
  res.setTimeout(1000);
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(msg);
  return led.writeSync(val);
};

const respondWithLightOn = respondWithLight('turning the light on', 1);
const respondWithLightOff = respondWithLight('turning the light off', 0);

const requestHandler = (req, res) => {
  console.log('request comming in');
  const { pathname } = url.parse(req.url);
  console.log('pathname is right here...', pathname);

  if (pathname === '/light-on') {
    console.log('turning the light on')
    return respondWithLightOn(res)
  }

  if (pathname === '/light-off') {
    return respondWithLightOff(res);
  }

  res.setTimeout(500);
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200, {'Content-Type': 'text/html'});
  return res.end(indexHtml);
};

const server = http.createServer(requestHandler);

server.listen(6555, null, null, () => {
  console.log('server up and running');
});

process.on('SIGINT', () => {
  console.log('see ya!');
  server.close();
  led.unexport();
});
