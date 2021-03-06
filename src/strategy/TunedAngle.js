/** @namespace strategy */

const TAG = 'TunedAngle';

/**
 * Tunable angle. Angle is chosen depends on table name in configuration.
 *
 * @author Darko Lukic <lukicdarkoo@gmail.com>
 * @memberof strategy
 * @example
 * new TuneAngle(
 *      150,
 *      [151, 'table_1'],
 *      [148, 'table_2']
 * );
 */
class TunedAngle {
    /**
     * Add multiple angles, add angle for each table. It must has
     * at least one angle which will be used as default. Other angles
     * must have tag!
     *
     * @param {Number} defaultAngle Default point X coordinate
     */
    constructor(defaultAngle) {
        // If there are table dependent points
        for (let i = 1; i < arguments.length; i++) {

            // Check if the argument is valid
            if (typeof arguments[i][0] === 'undefined' ||
                typeof arguments[i][1] === 'undefined') {

                Mep.Log.error(TAG, 'Invalid arguments');
                continue;
            }

            // Check if table name matches
            if (Mep.Config.get('table') == arguments[i][1]) {
                this.angle = arguments[i][0];
            }
        }

        // Otherwise use default point
        if (typeof this.angle === 'undefined') {
            this.angle = defaultAngle;
        }
    }

    /**
     * Get angle depending on the chosen table in configuration.
     *
     * @returns {Number} Angle
     */
    getAngle() {
        return this.angle;
    }
}

module.exports = TunedAngle;
