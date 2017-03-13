pi-led
=======

The goal is to turn an led on and off via HTTP.

## Setup

```
npm install
```

## PI Setup

Right now the server is hard coded to toggle GPIO 14 on and off.
As such, you need to wire your led to use GPIO 14 as the positive input power source.
Also, this uses [https://github.com/fivdi/onoff](https://github.com/fivdi/onoff)
so you pretty much need to run this code on a PI.

## Running the Server

```
npm start
```

Now you can reference your PI by IP address to load the index page, for example:

```
http://10.0.0.22:6555/
```

This loads a page with a single button which toggles the led.
Make sure to use your PI's IP and make sure your led is properly wired.
