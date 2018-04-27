const distance = require('gps-distance');

/**
 * @param pointA - Array of two Coordinates. Lat / Lng
 * @param pointB - Array of two Coordinates. Lat / Lng
 */
function calcDistance(pointA, pointB) {
    return distance(parseFloat(pointA[0]), parseFloat(pointA[1]), parseFloat(pointB[0]), parseFloat(pointB[1])).toPrecision(4)
}

module.exports = {
    calcDistance: calcDistance
};