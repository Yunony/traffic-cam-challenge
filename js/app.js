//Yuliya Baran traffic-cam-challenge info 343
// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

//create the Google Map and tell it to display in the <div id="map">
$(document).ready(function() {
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };

    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });

//You should also create a single google.maps.InfoWindow object
    var infoWindow = new google.maps.InfoWindow();


    var stations;
    var markers = [];
//Get the List of Traffic Cameras from seattle.gov
    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            stations = data;

            data.forEach(function(station, itemIndex) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(station.location.latitude),
                        lng: Number(station.location.longitude)
                    },
                    map: map
                });
                markers.push(marker);
//Show the Camera Image When the Marker is Clicked
                google.maps.event.addListener(marker, 'click', function() {
                    map.panTo(marker.getPosition());

                    var html = '<h2>' + station.cameralabel + '</h2>';
                    html += '<img src="' + station.imageurl.url + '"/>';

                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                });
            });
        })
        .fail(function(error) {
            console.log(error);
        })
        .always(function() {
            $('#ajax-loader').fadeOut();
        });

//Filter the Markers When Searching
    $("#search").bind("search keyup", function() {
        var getLocation = $('#search')[0].value.toLowerCase();
        for(var idk = 0; idk < stations.length; idk++) {
            if(stations[idk].cameralabel.toLowerCase().indexOf(getLocation) != -1) {
                markers[idk].setMap(map);
            }
            else {
                markers[idk].setMap(null);
            }
        }
    });
});