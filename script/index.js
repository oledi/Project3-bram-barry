var APP = APP || {};

(function () {
  
    APP.controller = {
      
        init: function () {
            
			navigator.splashscreen.hide();
            
            console.log("APP JS works");
            
            APP.interaction.init();
            APP.map.init();
        }
    };
    
    APP.settings = {
        
        user: null,
        watchID: null,
        firstLocation: null,
        currentHeading: null,
        globalLat: null,
        globalLon: null,
        baseLat: null,
        baseLon: null,
        placesRadius: 100,
        placesArray: [],
        placesHeadingArray: [],
        mapZoom: 16,
		dayMapping: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'],
		locationOpen: 'false'		
    };
    
    APP.interaction = {
      
        init: function () {
             
            APP.interaction.compassBtn();
        },
        compassBtn: function () {

            var btn = document.getElementById('startkompas');  
            btn.onclick = function() { 
                
                APP.compass.init();                
            }
        }
    };   
    
    APP.compass = {
        
        init: function () {
             
            APP.compass.startWatch();
        },        
        startWatch: function () {

            document.getElementById('startkompas').style.display = 'none';
            document.getElementById('aanwijzing').style.display = 'block';

            var options = { frequency: 100, timeout: 10000, enableHighAccuracy: false };

            APP.settings.watchID = navigator.compass.watchHeading(APP.compass.onSuccess, APP.compass.onError, options);

            APP.compass.matchHeading();
        },    
        stopWatch: function () {
            
            if (APP.settings.watchID) {
                
                navigator.compass.clearWatch(APP.settings.watchID);
                APP.settings.watchID = null;
            }
        },
        onSuccess: function (heading) {
                          
            APP.settings.currentHeading = heading.magneticHeading;
            
            var headingDiv = document.getElementById('heading');                            
            headingDiv.innerHTML = APP.settings.currentHeading;          
        },
        onError: function (compassError) {
            
            //alert('Compass error\n code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        },
        matchHeading: function () {
            
            console.log("matchHeading");

            APP.settings.placesArray = [];
			
            jQuery.ajax({
                dataType: 'json',
                url: 'https://maps.googleapis.com/maps/api/place/search/json?key=AIzaSyD8TqIqz6zTXDLBU2otYH8gByMGwX2t7H0&location=' + APP.settings.globalLat + ',' + APP.settings.globalLon + '&radius=25&sensor=false&types=amusement_park|art_gallery|bar|book_store|cafe|church|city_hall|embassy|fire_station|hospital|library|mosque|museum|night_club|place_of_worship|police|restaurant|school|spa|synagogue|train_station|zoo',
                success: function(response) {
                
                    for (var i = 0; i < response.results.length; i++) {
                        
                        var placeArray = [];
                        
                        placeArray[0] = response.results[i].geometry.location.lat;
                        placeArray[1] = response.results[i].geometry.location.lng;
                        placeArray[2] = response.results[i].name;
                        placeArray[3] = response.results[i].reference;
						placeArray[4] = response.results[i].icon;

                        APP.settings.placesArray.push(placeArray);

                        if (i == response.results.length - 1) {

                            setInterval(function() {
                                APP.compass.executeHeading();
                            }, 2000);
                        }
                    }
                }
            });
			
			APP.settings.locationOpen = 'false';

			$('#weertijd').show();	
			$('#location').removeClass('locationOpen');
			$('#pijlbeneden').removeClass('pijlbenedenLocationOpen');
			$('#loccontent').removeClass('localContentLocationOpen');

			$('#locp').hide();
			$('#locfotocontainer').hide();
			$('#locphone').hide();
			$('#openingstijdencontainer').hide();
        },
        executeHeading: function() {
            
            APP.settings.placesHeadingArray = [];
			
			if(APP.settings.locationOpen == 'false') {
			
				for (var a = 0; a < APP.settings.placesArray.length; a++) {

					var headingArray = [];

					var p1 = new LatLon(APP.settings.globalLat, APP.settings.globalLon);  
					var p2 = new LatLon(APP.settings.placesArray[a][0], APP.settings.placesArray[a][1]);            
					var brng = p1.bearingTo(p2);

					headingArray[0] = brng;
					headingArray[1] = a;  

					APP.settings.placesHeadingArray.push(headingArray);

					if (a == APP.settings.placesArray.length - 1) {

						for (var b = 0; b < APP.settings.placesHeadingArray.length; b++) {
							console.log(APP.settings.placesHeadingArray[b][0]);

							if ((APP.settings.currentHeading > (parseInt(APP.settings.placesHeadingArray[b][0]) - 10)) && APP.settings.currentHeading < (parseInt(APP.settings.placesHeadingArray[b][0]) + 10)) {                     				
								$('#aanwijzing').hide();
								$('#gevondenloc').show();

								var reference = APP.settings.placesArray[APP.settings.placesHeadingArray[b][1]][3];
								$('#gevondenloch3').html(APP.settings.placesArray[APP.settings.placesHeadingArray[b][1]][2]);

								$('#gevondenlocfoto').attr('src', APP.settings.placesArray[APP.settings.placesHeadingArray[b][1]][4]);

								var pijlbeneden = document.getElementById('pijlbeneden');

								pijlbeneden.onclick = function() {
									APP.map.showLocationInfo(reference);
								}

							} else {

								$('#aanwijzing').show();
								$('#gevondenloc').hide();							
								$('#aanwijzing').html('Richt je smartphone op een locatie');
							}
						}
					}
				}
			}
        }
    };
    
    APP.map = {
        
        init: function () {
             
            APP.map.setFirstLocation();
        },
        setFirstLocation: function () {
            
            if(navigator.geolocation)
            {
                APP.settings.firstLocation = navigator.geolocation.getCurrentPosition(APP.map.showPosition);
            }            
        },
        showPosition: function (position) {
        
            APP.settings.baseLat = position.coords.latitude;
            APP.settings.baseLon = position.coords.longitude;

            APP.settings.globalLat = position.coords.latitude;
            APP.settings.globalLon = position.coords.longitude;

            var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var myOptions = {
                zoom: APP.settings.mapZoom,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };

            map = new google.maps.Map(document.getElementById("map"), myOptions);

            APP.settings.user = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: "Gebruiker"
            });

            navigator.geolocation.watchPosition(APP.map.updateLocation, APP.map.handleLocationError,
            {
                enableHighAccuracy: true,
                maximumAge: 3000,   //1000 bram
                timeout: 5000,      //100 bram
                frequency: 2000
            });
        },
        updateLocation: function (position) {
        
            APP.settings.globalLat = position.coords.latitude;
            APP.settings.globalLon = position.coords.longitude;

            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            
            map.setCenter(latlng);
            map.setZoom(APP.settings.mapZoom);

            APP.settings.user.setPosition(latlng);

            var point1 = new LatLon(APP.settings.baseLat, APP.settings.baseLon);  
            var point2 = new LatLon(APP.settings.globalLat, APP.settings.globalLon);
			
            var distance = point1.distanceTo(point2);

            if (distance > 0.025) {
                
                APP.compass.matchHeading();
                APP.settings.baseLat = APP.settings.globalLat;
                APP.settings.baseLon = APP.settings.globalLon;
                distance = 0;
            }
        },
        handleLocationError: function (error) {
            
            //alert('Map error\n code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        },
		showLocationInfo: function (reference) {
			
			if (APP.settings.locationOpen == 'false') {
				APP.settings.locationOpen = 'true';
				
				$('#weertijd').hide();				
				$('#location').addClass('locationOpen');
				$('#pijlbeneden').addClass('pijlbenedenLocationOpen');
				$('#loccontent').addClass('localContentLocationOpen');

				$.ajax({
					dataType: 'json',
					url: 'https://maps.googleapis.com/maps/api/place/details/json?reference=' + reference + '&sensor=true&key=AIzaSyD8TqIqz6zTXDLBU2otYH8gByMGwX2t7H0',
					success: function(response) {
						
						response.result.formatted_address = response.result.formatted_address.replace(', Nederland', '');						
						$('#locp').html(response.result.formatted_address);
						$('#locp').show();

						if(response.result.photos != "undefined") {
							var foto = 'https://maps.googleapis.com/maps/api/place/photo?maxheight=240&photoreference=' + response.result.photos[0].photo_reference + '&sensor=true&key=AIzaSyD8TqIqz6zTXDLBU2otYH8gByMGwX2t7H0';
							
							$('#locfoto').attr('src', foto);
							$('#locfotocontainer').show();
						}

						if(response.result.international_phone_number != "undefined") {
							$('#locphone').attr('href', 'tel:' + response.result.international_phone_number);
							$('#locphone').show();
						}

						if(response.result.opening_hours != "undefined") 
						{
							$('#openingstijden').empty();
							
							if ($('#openingstijden li').length < 1) {
								for(var i = 0; i < response.result.opening_hours.periods.length; i++)
								{                                
									$('#openingstijden').append('<li>' + APP.settings.dayMapping[response.result.opening_hours.periods[i].open.day] + ' - ' + response.result.opening_hours.periods[i].open.time + ' - '+ response.result.opening_hours.periods[i].close.time + '</li>');
								}
								
								$('#openingstijdencontainer').show();
							}
						}
					}
				});

			} else {
				
				APP.settings.locationOpen = 'false';
				
				$('#weertijd').show();	
				$('#location').removeClass('locationOpen');
				$('#pijlbeneden').removeClass('pijlbenedenLocationOpen');
				$('#loccontent').removeClass('localContentLocationOpen');
				
				$('#locp').hide();
				$('#locfotocontainer').hide();
				$('#locphone').hide();
				$('#openingstijdencontainer').hide();
			}		
		}
    };

    document.addEventListener("deviceready", APP.controller.init, false);
       
})();
