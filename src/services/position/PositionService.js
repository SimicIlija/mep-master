'use strict';
/** @namespace services.position */

const driverManager = Mep.getDriverManager();
const Point = Mep.require('misc/Point');
const EventEmitter = require('events').EventEmitter;

const TAG = 'PositionService';

/**
 * Implements algorithms to collect data from sensors and determine current robot's location
 * @memberOf services.position
 */
class PositionService extends EventEmitter {
    init(config) {
        this.config = config;

        // Set default position
        this.point = driverManager.getDriver('MotionDriver').getPosition();
        this.orientation = driverManager.getDriver('MotionDriver').getOrientation();

        // Init methods
        this._processPositionChange = this._processPositionChange.bind(this);
        this._processOrientationChange = this._processOrientationChange.bind(this);

        // Subscribe on drivers
        driverManager.callMethodByGroup('position', 'on', ['positionChanged', this._processPositionChange.bind(this)]);
        driverManager.callMethodByGroup('position', 'on', ['orientationChanged', this._processOrientationChange.bind(this)]);

        // Initial publish
        Mep.Telemetry.send(TAG, 'PositionChanged', this.point);
        Mep.Telemetry.send(TAG, 'OrientationChanged', { orientation: this.orientation });
    }

    _processPositionChange(driverName, point, precision) {
        // TODO: Sensor Fusion problem: https://en.wikipedia.org/wiki/Sensor_fusion
        // Implement Kalman filter: https://en.wikipedia.org/wiki/Kalman_filter
        Mep.Log.debug(TAG, point);

        this.point = point;
        this.emit('positionChanged', point);

        Mep.Telemetry.send(TAG, 'PositionChanged', point);
    }

    _processOrientationChange(driverName, orientation, precision) {
        this.orientation = orientation;
        this.emit('orientationChanged', orientation);

        Mep.Telemetry.send(TAG, 'OrientationChanged', { orientation: orientation });
    }

    /**
     * Get current robot's position
     * @returns {misc.Point} Current position
     */
    getPosition() {
        return this.point;
    }

    /**
     * Get current robot's orientation
     * @returns {Number} Orientation in degrees
     */
    getOrientation() {
        return this.orientation;
    }
}

module.exports = PositionService;
