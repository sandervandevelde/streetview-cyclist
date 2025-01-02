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
var latitude = 37.86926; 
var longitude = -122.254811;

// new york 5th avanue
latitude = 40.74750521592752;
longitude = -73.98526357003048;

// route 66
latitude = 36.14417733187105;
longitude = -96.00325431507174;

var heading = 70;

var single = 0;

var links = [];

window.setInterval(function() {

  var response = fetch('http://localhost:7000/fetch', {method: "GET"}, );


  if (single == 0)
  {
    panotest = new google.maps.StreetViewPanorama(document.getElementById('pano')  as HTMLElement);

    panotest.addListener("links_changed", () => {
      links = panotest.getLinks();
    });
    
    single = 1;
  }

    if (links.length > 0)
    {
      panotest.setPano(links[0].pano);
      panotest.setMotionTracking(false);
      var pov = panotest.getPov();
      pov.heading = links[0].heading;
      panotest.setPov(pov);    
    }
    else
    {
      panotest.setPosition({ lat: latitude, lng: longitude });
      var pov = panotest.getPov();
      heading = heading + 10;
      pov.heading = heading;
      panotest.setMotionTracking(false);
      panotest.setPov(pov);    
    }

}, 2500);


export {};
