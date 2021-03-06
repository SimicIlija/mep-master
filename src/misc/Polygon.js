'use strict';

/** @namespace misc */

const Point = Mep.require('misc/Point');

const TAG = 'Polygon';

/**
 * Describes an polygon
 * @see https://en.wikipedia.org/wiki/Polygon
 * @memberOf misc
 */
class Polygon {
    /**
     * @param {String} tag Additional information about polygon to describe it
     * @param {Number} duration Polygon will be destroyed after given number of milliseconds
     * @param {Array<misc.Point>} points Array of points which can describe an polygon
     */
    constructor(tag, duration, points) {
        // Check points
        if (points !== undefined && points.length < 3) {
            let msg = 'Polygon requires at least 3 points';
            Mep.Log.error(TAG, msg);
            throw Error(msg);
        }

        // Store values
        this.duration = duration;
        this.tag = tag;
        this.points = points;
        this.id = null;
    }

    makeSquareAroundPoint(centerPoint, sideSize) {
        this.points = [
            new Point(centerPoint.getX() - sideSize / 2, centerPoint.getY() - sideSize / 2),
            new Point(centerPoint.getX() + sideSize / 2, centerPoint.getY() - sideSize / 2),
            new Point(centerPoint.getX() + sideSize / 2, centerPoint.getY() + sideSize / 2),
            new Point(centerPoint.getX() - sideSize / 2, centerPoint.getY() + sideSize / 2),
        ];
        return this;
    }

    setId(id) {
        this.id = id;
        return this;
    }

    getId() {
        return this.id;
    }

    /**
     * Translate all points of polygon
     * @param {misc.Point} translatePoint Point which represents x and y value of translation
     */
    translate(translatePoint) {
        for (let point of this.points) {
            point.translate(translatePoint);
        }
        return this;
    }

    /**
     * Rotate all points of polygon around an origin point
     * @param {misc.Point} originPoint Center point of rotation
     * @param {Number} angleDegrees Required angle of rotation
     */
    rotate(originPoint, angleDegrees) {
        for (let point of this.points) {
            point.rotate(originPoint, angleDegrees)
        }
        return this;
    }

    /**
     * @returns {Array<misc.Point>} Get an array of points which describe a polygon
     */
    getPoints() {
        return this.points;
    }

    /**
     * @returns {Number} Get duration of milliseconds after the polygon will be destroyed
     */
    getDuration() {
        return this.duration;
    }

    /**
     * @returns {String} Get unique identifier of polygon
     */
    getTag() {
        return this.tag;
    }

    setTag(tag) {
        this.tag = tag;
    }

    /**
     * Clone a polygon
     * @returns {misc.Polygon} Cloned polygon
     */
    clone() {
        let points = [];
        for (let point of this.points) {
            points.push(point.clone());
        }
        return new Polygon(this.tag, this.duration, points);
    }

    /**
     * Optimized algorithm for polygon rotation around coordinate beginning
     * @param {Number} angleDegrees
     * @returns {misc.Polygon}
     */
    rotateAroundZero(angleDegrees) {
        for (let point of this.points) {
            point.rotateAroundZero(angleDegrees)
        }
        return this;
    }

    // TODO: Consider new algorithm: http://stackoverflow.com/a/2752754/1983050
    isPointInside(point) {
        let minX = this.points[0].getX();
        let maxX = this.points[0].getX();
        let minY = this.points[0].getY();
        let maxY = this.points[0].getY();

        for (let i = 1; i < this.points.length; i++) {
            if (point.getX() > maxX) maxX = this.points[i].getX();
            if (point.getX() < minX) minX = this.points[i].getX();
            if (point.getY() > maxY) maxY = this.points[i].getY();
            if (point.getY() < minY) minY = this.points[i].getY();
        }

        return !(point.getX() < minX || point.getX() > maxX || point.getY() < minY || point.getY() > maxY);
    }
}

module.exports = Polygon;