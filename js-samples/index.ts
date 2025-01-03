/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

function initialize() {
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano") as HTMLElement,
    {
      zoom: 1,
      motionTracking: false,
      motionTrackingControl: false
    }
  );

}

declare global {
  interface Window {
    initialize: () => void;
  }
}
window.initialize = initialize;

var panotest;

// test coordinates
var heading = 70;
var latitude = 37.86926; 
var longitude = -122.254811;

// new york 5th avanue
latitude = 40.74750521592752;
longitude = -73.98526357003048;

// route 66
heading = 70;
//latitude = 36.14417733187105;
//longitude = -96.00325431507174;


// arrizona

latitude = 33.68457960371;
longitude = -111.49962138054569;


var executionOnceOnStartup = 0;

var lastFetchTimestamp = -1;

var links = [];

window.setInterval(async function() {

  var response = await fetch('http://localhost:7000/fetch', {method: "GET"});

  const data = await response.json();
  
  if (parseInt(data.timestamp) != lastFetchTimestamp)
  {
    lastFetchTimestamp = data.timestamp;
  }
  else
  {
    return;
  }

  if (executionOnceOnStartup == 0)
  {
    panotest = new google.maps.StreetViewPanorama(document.getElementById('pano')  as HTMLElement);

    panotest.addListener("links_changed", () => {
      links = panotest.getLinks();
    });
    
    executionOnceOnStartup = 1;
  }

    if (links.length > 0)
    {
      panotest.setMotionTracking(false);
      panotest.setPano(links[0].pano);

      var pov = panotest.getPov();
      pov.heading = links[0].heading;
      panotest.setPov(pov);    
    }
    else
    {
      panotest.setMotionTracking(false);
      panotest.setPosition({ lat: latitude, lng: longitude});
      var pov = panotest.getPov();
      heading = heading + 10;
      pov.heading = heading;
      panotest.setPov(pov);    
    }

}, 500);


export {};
