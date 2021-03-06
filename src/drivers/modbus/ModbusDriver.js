'use strict';
/** @namespace drivers.modbus */

const ModbusDriverBinder = require('bindings')('modbus').ModbusDriverBinder;
const BaseDriver = Mep.require('misc/BaseDriver');

const TAG = 'ModbusDriver';
const DEBUG = true;

/**
 * Driver for Modbus communication protocol.
 * @memberOf drivers.modbus
 * @fires drivers.modbus.ModbusDriver#coilChanged
 * @fires drivers.modbus.ModbusDriver#coilChanged_[slaveAddress]_[functionAddress]
 */
class ModbusDriver extends classes(ModbusDriverBinder, BaseDriver) {

    /**
     * Creates instance of ModbusDriver
     *
     * @param name {String} - Unique name of a driver
     * @param config {Object} - Configuration presented as an associative array
     */
    constructor(name, config) {
        super(DEBUG, (functionAddress, slaveAddress, detected) => {
            /**
             * Coil value changed event.
             *
             * @event drivers.modbus.ModbusDriver#coilChanged
             * @property {Number} slaveAddress - Slave address
             * @property {Number} functionAddress - Function address
             * @property {Boolean} detected - Value on slave address and function address
             */
            super.emit('coilChanged', slaveAddress, functionAddress, detected);

            /**
             * Coil value changed event on single address.
             *
             * @event drivers.modbus.ModbusDriver#coilChanged_[slaveAddress]_[functionAddress]
             * @property {Boolean} detected - Value on slave address and function address
             */
            super.emit('coilChanged_' + slaveAddress + '_' + functionAddress, detected);

            // Send to Logger
            Mep.Log.debug(TAG, 'Coil Changed', {
                slaveAddress: slaveAddress,
                functionAddress: functionAddress,
                detected: detected
            });
        });

        Mep.Log.debug(TAG, 'Driver with name', name, 'initialized');
    }

}

module.exports = ModbusDriver;
