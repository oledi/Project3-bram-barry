
// JavaScript Document

// The watch id references the current `watchHeading`
    var watchID = null;

    var currentHeading = null;

    // Wait for device API libraries to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        startWatch();
    }

    // Start watching the compass
    //
    function startWatch() {

        // Update compass every 3 seconds
        var options = { frequency: 100 };

        watchID = navigator.compass.watchHeading(onSuccess, onError, options);
    }

    // Stop watching the compass
    //
    function stopWatch() {
        if (watchID) {
            navigator.compass.clearWatch(watchID);
            watchID = null;
        }
    }

    // onSuccess: Get the current heading
    //
    function onSuccess(heading) {
        var element = document.getElementById('heading');
        element.innerHTML = heading.magneticHeading;
        currentHeading = heading.magneticHeading;
    }

    // onError: Failed to get the heading
    //
    function onError(compassError) {
        alert('Compass error: ' + compassError.code);
    }
        
        
        
       // Wait for device API libraries to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        // Empty
    }

    // Beep three times
    //
    function playBeep() {
        navigator.notification.beep(3);
    }

    // Vibrate for 2 seconds
    //
    function vibrate() {
        navigator.notification.vibrate(2000);
    }






var POIArray = new Array(new Array(52.700600236554045, 5.291880369186401, "Locatie 1", "amstelhotel"));
            var circleRadius = 10; 
            var zoom = 16; 
            var map;
            var player;
            var marker;
            var circleArray = new Array();
            var circle;



    function loadDemo()
            {
                if(navigator.geolocation)
                {


                    // Create a Google Map… see Google API for more detail - willekeurige startpositie Australie
                    var myLatlng = new google.maps.LatLng(52.358937, 4.908957);
                    var myOptions = {
                        zoom: zoom,
                        center: myLatlng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    map = new google.maps.Map(document.getElementById("map"), myOptions);

                    // Place the player
                    player = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        //mouse-over op desktop
                        title:"CMD"
                    });


                    // voer de coordinaten van de poi in
                    // zet markers voor elk POI
                    var i=0;
                    for (i=0;i<POIArray.length;i++) {
                        var markerLatlng = new google.maps.LatLng(POIArray[i][0],POIArray[i][1])
                        // Place a hit marker
                        marker = new google.maps.Marker({
                            position:  markerLatlng,
                            map: map,
                            
                            //mouse over op desktop
                            title:POIArray[i][2]
                        });

                        // Place a circle that will cause the push
                        circle = new google.maps.Circle({
                            map: map,
                            radius: circleRadius
                        });
                        circle.setCenter(markerLatlng);
                        circleArray.push(circle);
                    }


                    // Start watchPosition
                    navigator.geolocation.watchPosition(updateLocation, handleLocationError,
                    {enableHighAccuracy: true,
                        maximumAge: 200,
                        timeout: 100
                    });
                }
            }

            /*De attributen krijgen een
            waarde*/
            function updateLocation(position)
            {
                // Extract latitude and longitude
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(latlng);
                map.setZoom(zoom);
                // Move the marker
                player.setPosition(latlng);



                var p1 = new LatLon(position.coords.latitude, position.coords.longitude);  
                var p2 = new LatLon(52.700600236554045, 5.291880369186401);                                                                                                                                                           
                var brng = p1.bearingTo(p2);                         
    
                document.getElementById('graden').innerHTML = brng;


                  if ((currentHeading > (parseInt(brng) - 10)) && currentHeading < (parseInt(brng) + 10)) {
                        navigator.notification.vibrate(100);
                        var kop = document.getElementById('header');
                        kop.innerHTML = 'Deze kant!';
                }

            }

            function handleLocationError(error)
            {
                switch(error.code)
                {
                    case 0:
                        updateStatus("There was an error while retrieving your location: " +  error.message);
                        break;

                    case 1:
                        updateStatus("The user prevented this page from retrieving a location.");
                        break;

                    case 2:
                        updateStatus("The browser was unable to determine your location: " +  error.message);
                        break;

                    case 3:
                        updateStatus("The browser timed out before retrieving the location.");
                        break;
                }
            }