/**
 * General configuration file
 *
 * @param {Boolean} DEBUG - Enable console output. IMPORTANT: Writing to console can be slow therefor it is suggested to turn this off in release.
 * @param {Boolean} SIMULATION - Enable web simulation. Communication with the robot will redirected to web simulation interface.
 * @param {Boolean} DEBUG_TO_FILE - TODO
 */
var Config = {
    DEBUG: true,
    SIMULATION: false,
    DEBUG_TO_FILE: false,
}

module.exports = Config;