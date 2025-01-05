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

![image](https://github.com/user-attachments/assets/f28f9cd2-56f2-4f19-b0c9-db35aadf1810)

Why not sense the pedals of a home trainer?

## Prerequisites

You need:

- Visual Studio with Wilderness labs Meadow extension 
- Git
- Node.JS
- Visual Studio Code (optional to maintain the server app)

I use an [Advantech POC-W243L](https://advdownload.advantech.com/productfile/PIS/POC-W243L/file/POC-W243L_DS(040920)20200409192305.pdf) Widescreen touch panel PC to show the street view panoramas.

A [wilderness labs meadow f7](https://store.wildernesslabs.co/products/meadow-f7) is uses to turn sensor data into street view cycle events.

As switch, a simple relay will do. I use a [e3jk-ds30m1](https://www.farnell.com/datasheets/1634350.pdf). It is powered by 12 volts but offers me an acurate photoelectric sensor relay switch so no contact with the pedals is needed. 

Regarding the fitness device, I got a Rambler RF 702 hometrainer. Because the sensor I use makes contactless measurements, almost any fitness device will do. I actually measure my the movement of one knee, not the pedals. 

## Meadow F7v2 Feather

This is a great board for both tinkering and production, especially if you only use C# as programming language.

I use the Digital input D04, that handles an event when 0 or 3 volts DC is measured.

Because it is quite sensitive in measuring flanks, I added a 100 milliseconds filter on it. 

Just connect the board D04 pin and 3 volt pin to the relay and you are good to go. 

For testing, you can connect and disconnect them directly.

See the console log for the behavior.

## Starting the application

Follow the following steps:

0. Clone this repo
1. Browse to the streetview-src folder for the streetview server app, created in nodejs.
2. Perform 'npm install' 
3. Perform 'npm start'
4. Accept firewall questions for both public AND private networks
5. See that the server app is running
6. The server app accepts 'o' to open a browser 
7. The server app accepts 'q' to close the app
8. Notice that the web server app uses port 7000.
9. Open a streetview browser, showing Streetview (a black screen is normal for the starting situation)
10. In the server app, see the incoming fetch calls from the browser
11. Note the IP address of your server (via 'ipconfig')
12. Open the source code of the meadow in Visual Studio
13. In the source code, fill in the Wifi SSID, Wifi password, and the IP address of the server app 'cycle' calls
14. Optionally, change the interval (the cycle speed)  
15. Deploy the meadow code in Visual Studio to your Meadow F7v2 Feather
16. In the Visual studio console, see the wifi is connected
17. In the Visual studio console, see the website is being called once the switch changes reach the interval
18. In the server app, see the incoming cycle calls from the Meadow F7v2 Feather

While you are 'cycling' the next panoramas are shown, based on the cycle interval.

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
http://localhost:7000/location?lat=36.14417733187105&lon=-96.00325431507174&heading=250
```

Notice that it is only picked up once a new fetch is executed. 

The heading is only for applicable in the first panorama. 

The next panorama from the list of directions describes the actual heading.

## Does it work?

Well, we are depending on the quality of streetview regarding the panoramas.

It seems the panoramas are not as well alligned as expected. 

So, you need to help the experience a bit if you get trapped in a loop by skipping to a panorama a few clicks away.

## License

This Streetview Cyclist repository is available under an MIT license.

This repository is partly based on this [Street view side-by-side](https://developers.google.com/maps/documentation/javascript/examples/streetview-simple#clone-sample) example.

That code has its own copyrights: Copyright 2019 Google LLC. All Rights Reserved. SPDX-License-Identifier: Apache-2.0

Please check the Streetview API website for additional requirements needed to access that streetview api.

## Contributions

If you want to contribute, please provide a pull request.
