const Task = Mep.require('utils/Task');
const DriverManager = Mep.require('drivers/DriverManager');

const TAG = 'InitTask';

class InitTask extends Task {
    constructor(weight, time, location) {
        super(weight, time, location);

        Mep.Log.debug(TAG, 'initialization');

        //this.motionDriver = DriverManager.get().getDriver(DriverManager.MOTION_DRIVER);
        this.modbusDriver = DriverManager.get().getDriver(DriverManager.MODBUS_DRIVER);
    }

    onRun() {
        //this.testModbus();
    }

    testModbus() {
        Mep.Log.debug(TAG, 'Start modbus coil reading');

        var that = this;

        var slaveAddress = 1;
        var functionAddress = 7; // Ono gore cudo
        this.modbusDriver.registerCoilReading(slaveAddress, functionAddress);
        this.modbusDriver.on('coilChanged', function(slaveAddress, functionAddress, state, id) {
            //that.motionDriver.stop();

            console.log('Coil Changed! Slave address: ' + slaveAddress + '; Function address: ' +
                functionAddress + '; State: ' + state);
        });
    }
}

module.exports = InitTask;