// // The watch id references the current `watchHeading`
//     var watchID = null;

//     // Wait for device API libraries to load
//     //
//     document.addEventListener("deviceready", onDeviceReady, false);

//     // device APIs are available
//     //
//     function onDeviceReady() {
//         startWatch();
//     }

//     // Start watching the compass
//     //
//     function startWatch() {

//         // Update compass every 3 seconds
//         var options = { frequency: 500 };

//         watchID = navigator.compass.watchHeading(onSuccess, onError, options);
//     }

//     // Stop watching the compass
//     //
//     function stopWatch() {
//         if (watchID) {
//             navigator.compass.clearWatch(watchID);
//             watchID = null;
//         }
//     }

//     // onSuccess: Get the current heading
//     //
//     function onSuccess(heading) {
//         var element = document.getElementById('heading');
//         element.innerHTML = 'Heading: ' + heading.magneticHeading;
        
//         if ((heading.magneticHeading > 210) && heading.magneticHeading < 260) {
//                 navigator.notification.vibrate(2000);
//         }
        
//         if ((heading.magneticHeading > 150) && heading.magneticHeading < 180) {
//                 navigator.notification.beep(1);
//         }
//     }

//     // onError: Failed to get the heading
//     //
//     function onError(compassError) {
//         alert('Compass error: ' + compassError.code);
//     }
        
        
        
//        // Wait for device API libraries to load
//     //
//     document.addEventListener("deviceready", onDeviceReady, false);

//     // device APIs are available
//     //
//     function onDeviceReady() {
//         // Empty
//     }

//     // Beep three times
//     //
//     function playBeep() {
//         navigator.notification.beep(3);
//     }

//     // Vibrate for 2 seconds
//     //
//     function vibrate() {
//         navigator.notification.vibrate(2000);
//     }
   
        
//            