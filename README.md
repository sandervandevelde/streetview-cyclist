# Google Streetview cyclist

## Introduction

You can cycle your way through Google Streetview, from location to location, and see the wonders of the world at home. 

![image](https://github.com/user-attachments/assets/e9641f3b-ba44-49f7-8a08-49baace943ce)

## How does it work?

The streetview app runs a nodejs webserver app.

It also supports a browser app (written in typescript) to show a streetview panorama.

The browser app fetches a cycle signal from the server app to show the next panorama.

A meadow app connects to the server app and sends a new cycle signal.

So, the meadow controls the street view panorama.

It's up to you to add logic to send that cycle signal.

Why not sense the pedals of a home trainer?

## Prerequisites

You need:

- Visual Studio with Wilderness labs Meadow extension 
- Git
- Node.JS
- Visual Studio Code (optional to maintain the server app)

I use an [Advantech POC-W243L](https://advdownload.advantech.com/productfile/PIS/POC-W243L/file/POC-W243L_DS(040920)20200409192305.pdf) Widescreen touch panel PC to show the street view panoramas.

A [wilderness labs meadow f7](https://store.wildernesslabs.co/products/meadow-f7) is uses to turn sensor data into street view cycle events.

## Starting the application

Follow the following steps:

0. Clone this repo
1. Browse to the streetview-src folder
2. Perform 'npm install'
3. Perform 'npm start'
4. Accept firewall questions for both public AND private networks
5. See if the server app is running
6. The server accepts 'o' to open a browser showing Streetview (a black screen is normal)
7. The server accepts 'q' to close the app
8. Note the IP address of your server
9. In the source code of the meadow, fill in the Wifi SSID, Wifi password, and the IP address of the server app
10. Deploy the meadow code in Visual Studio
11. In the meadow console, see the wifi is connected
12. In the meadow console, see the website is being called
13. In the server app, see the incoming cycle calls

Notice that the web server app uses port 7000.

## Rest API

The rest application comes with three api calls.

These are all GET calls.

### /fetch

The typescript logic in the browser calls 'fetch' to retrieve the latest timestamp plus optional location cooridates:

```
http://localhost:7000/fetch
```

### /cycle

Any client can serve a timestamp: 

```
http://localhost:7000/cycle?timestamp=42
```

If the timestamp differs from the last call, this signals the streetview to show the next panorama.

### /location

A new starting point can be sent via this call:

```
http://localhost:7000/location?lat=36.14417733187105&lon=-96.00325431507174
```

Notice that it is only picked up once a new fetch is executed.

## License

This Streetview Cyclist repository is available under an MIT license.

This repository is partly based on this [Street view side-by-side](https://developers.google.com/maps/documentation/javascript/examples/streetview-simple#clone-sample) example.

That code has copyrights: Copyright 2019 Google LLC. All Rights Reserved. SPDX-License-Identifier: Apache-2.0

## Contributions

If you want to contribute, please provide a pull request.
