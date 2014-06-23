
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

LatLon.prototype.distanceTo = function(point, precision) {
    // default 4 significant figures reflects typical 0.3% accuracy of spherical model
    if (typeof precision == 'undefined') precision = 4;
  
    var R = this.radius;
    var nieuw1 = this.lat.toRadians(),  nieuw5 = this.lon.toRadians();
    var nieuw2 = point.lat.toRadians(), nieuw6 = point.lon.toRadians();
    var nieuw3 = nieuw2 - nieuw1;
    var nieuw4 = nieuw6 - nieuw5;

    var a = Math.sin(nieuw3/2) * Math.sin(nieuw3/2) +
            Math.cos(nieuw1) * Math.cos(nieuw2) *
            Math.sin(nieuw4/2) * Math.sin(nieuw4/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d.toPrecisionFixed(Number(precision));
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


if (typeof Number.prototype.toPrecisionFixed == 'undefined') {
    Number.prototype.toPrecisionFixed = function(precision) {

        // use standard toPrecision method
        var n = this.toPrecision(precision);

        // ... but replace +ve exponential format with trailing zeros
        n = n.replace(/(.+)e\+(.+)/, function(n, sig, exp) {
            sig = sig.replace(/\./, '');       // remove decimal from significand
            var l = sig.length - 1;
            while (exp-- > l) sig = sig + '0'; // append zeros from exponent
            return sig;
        });

        // ... and replace -ve exponential format with leading zeros
        n = n.replace(/(.+)e-(.+)/, function(n, sig, exp) {
            sig = sig.replace(/\./, '');       // remove decimal from significand
            while (exp-- > 1) sig = '0' + sig; // prepend zeros from exponent
            return '0.' + sig;
        });

        return n;
    }
}

