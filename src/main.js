const fs = require('fs');
const http = require('http');
const url = require('url');
const Gpio = require('onoff').Gpio;

const availableGpio = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

const led = new Gpio(14, 'out');

const gpioMap = availableGpio.reduce((acc, pin) => {
    return Object.assign({}, acc, {
        [pin]: new Gpio(pin, 'out')
    });
}, {});

const indexHtml = fs.readFileSync('./src/index.html', 'utf8');

const respondWithInvalidPinError = (pinNumber, res) => {
    res.setTimeout(500);
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(`${pinNumber} is not a valid GPIO pin`);
}

const respondWithGpioAction = (msg, pinNumber, action, res) => {
    if (!availableGpio.includes(pinNumber)) {
        return respondWithInvalidPinError(pinNumber, res);
    }

    res.setTimeout(1000);
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(msg);

    const val = action === 'on' ? 1 : 0;
    return gpioMap[pinNumber].writeSync(val);
};

const requestHandler = (req, res) => {
    console.log('request comming in');
    const { pathname } = url.parse(req.url);
    console.log('pathname is right here...', pathname);

    const rgxGpio = /\/gpio\/(\d+)\/(on|off)/;
    const match = rgxGpio.exec(pathname);
    if (match) {
        const [path, pinNumber, action] = match;
        const msg = `attempting action "${action}" with GPIO ${pinNumber}`
        console.log(msg);
        return respondWithGpioAction(msg, parseInt(pinNumber), action, res);
    };

    res.setTimeout(500);
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(indexHtml);
};

const server = http.createServer(requestHandler);

server.listen(6555, null, null, () => {
    console.log('server up and running');
});

process.on('SIGINT', () => {
    console.log('see ya!');
    server.close();
    availableGpio.forEach(pin => {
        gpioMap[pin].unexport();
    });
});
