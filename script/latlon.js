
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Latitude/longitude spherical geodesy formulae & scripts (c) Chris Veness 2002-2012            */
/*   - www.movable-type.co.uk/scripts/latlong.html                                                */
/*                                                                                                */
/*  Sample usage:                                                                                 */
/*    var p1 = new LatLon(51.5136, -0.0983);                                                      */
/*    var p2 = new LatLon(51.4778, -0.0015);                                                      */
/*    var dist = p1.distanceTo(p2);          // in km                                             */
/*    var brng = p1.bearingTo(p2);           // in degrees clockwise from north                   */
/*    ... etc                                                                                     */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Note that minimal error checking is performed in this example code!                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


/**
 * Object LatLon: tools for geodetic calculations
 *
 * @requires Geo
 */
 
 
/**
 * Creates a point on the earth's surface at the supplied latitude / longitude
 *
 * @constructor
 * @param {Number} lat: latitude in degrees
 * @param {Number} lon: longitude in degrees
 * @param {Number} [radius=6371]: radius of earth if different value is required from standard 6,371km
 */
function LatLon(lat, lon, radius) {
    if (typeof(radius) == 'undefined') radius = 6371;  // earth's mean radius in km

    this.lat    = Number(lat);
    this.lon    = Number(lon);
    this.radius = Number(radius);
}



/**
 * Returns the (initial) bearing from this point to the supplied point, in degrees
 *   see http://williams.best.vwh.net/avform.htm#Crs
 *
 * @this    {LatLon} latitude/longitude of origin point
 * @param   {LatLon} point: latitude/longitude of destination point
 * @returns {Number} initial bearing in degrees from North
 */
LatLon.prototype.bearingTo = function(point) {
    var nieuw1 = this.lat.toRadians(), nieuw2 = point.lat.toRadians();
    var nieuw3 = (point.lon-this.lon).toRadians();

    var y = Math.sin(nieuw3) * Math.cos(nieuw2);
    var x = Math.cos(nieuw1)*Math.sin(nieuw2) -
            Math.sin(nieuw1)*Math.cos(nieuw2)*Math.cos(nieuw3);
    var nieuw4 = Math.atan2(y, x);
  
    return (nieuw4.toDegrees()+360) % 360;
}



/** Converts numeric degrees to radians */
if (typeof Number.prototype.toRadians == 'undefined') {
    Number.prototype.toRadians = function() {
        return this * Math.PI / 180;
    }
}


/** Converts radians to numeric (signed) degrees */
if (typeof Number.prototype.toDegrees == 'undefined') {
    Number.prototype.toDegrees = function() {
        return this * 180 / Math.PI;
    }
}

