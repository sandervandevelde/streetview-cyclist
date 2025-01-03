# Google Streetview cyclist

## Introduction

Cycle your way to Streetview, from location to location. 

## How does it work?

The streetview app runs a nodejs webserver app.

It also supports a browser app (written in typescript) to show a streetview panorama.

The browser app fetches a cycle signal from theserver app to show the next panorama.

A meadow app connects to the server app and sends a new cycle signal.

So, the meadow controls the streetview panorama.

It's up to you to add logic for sending that cycle signal.

Why not sense the pedals of a hometrainer?

## Prerequisites

You need:

- Visual Studio with Wilderness labs Meadow extension 
- Git
- Node.JS
- Visual Studio Code (optional to maintain the server app)

## Starting the application

Follow the following steps:

0. Clone this repo
1. Browse to the streetview-src folder
2. Perform 'npm install'
3. Perform 'npm start'
4. Accept firewall questions for both public AND private networks
5. See the server app is running
6. The server accepts 'o' to open a browser showing streetview (a black screen is normal)
7. The server accepts 'q' to close the app
8. Note the ip address of your server
9. In the sourcecode of the meadow, fill in the Wifi SSID, Wifi password, and the IP address of the server app
10. Deploy the meadow code in Visual Studio
11. In the meadow console, see the wifi is connected
12. In the meadow console, see website is called
13. In the server app, see the incoming cycle calls

Notice that the web server app and 

## License

This Streetview Cyclist repository is available under MIT license.

This repository is partly based on this [Street view side-by-side](https://developers.google.com/maps/documentation/javascript/examples/streetview-simple#clone-sample) example.

That code has copyrights: Copyright 2019 Google LLC. All Rights Reserved. SPDX-License-Identifier: Apache-2.0

## Contributions

If you want to contribute, plaese provide a pull request.
