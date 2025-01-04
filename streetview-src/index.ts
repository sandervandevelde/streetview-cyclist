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
var heading = 70.0;
var latitude = 0.0; 
var longitude = 0.0;

var movetonewlocation = false;

var executionOnceOnStartup = 0;

var lastFetchTimestamp = -11;

var links = [];

window.setInterval(async function() {

  var response = await fetch('http://localhost:7000/fetch', {method: "GET"});

  const data = await response.json();
  
  if (parseInt(data.timestamp) != lastFetchTimestamp)
  {
    // new timestamp and potentially new coordinates
  
    lastFetchTimestamp = data.timestamp;

    if ((latitude != parseFloat(data.lat) 
            && longitude != parseFloat(data.lon)) 
        || heading != parseFloat(data.heading))
    {
      // new coordinates
      movetonewlocation = true;

      // new heading
      heading = parseFloat(data.heading);
      latitude = parseFloat(data.lat);
      longitude = parseFloat(data.lon);  
    }
  }
  else
  {
    // no new timestamp
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

    if (movetonewlocation == false 
          && links.length > 0)
    {
      // show the next panorama taken from the links

      panotest.setMotionTracking(false);
      panotest.setPano(links[0].pano);

      var pov = panotest.getPov();
      pov.heading = links[0].heading;
      panotest.setPov(pov);    
    }
    else
    {
      // show the (new) start point 

      movetonewlocation = false

      panotest.setMotionTracking(false);
      panotest.setPosition({ lat: latitude, lng: longitude});
      var pov = panotest.getPov();
      pov.heading = heading;
      panotest.setPov(pov);    
    }

}, 500);


export {};
