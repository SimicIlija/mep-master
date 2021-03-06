const Task = Mep.require('strategy/Task');
const TunedPoint = Mep.require('strategy/TunedPoint');
const TunedAngle = Mep.require('strategy/TunedAngle');
const Delay = Mep.require('misc/Delay');
const Console = require('./Console');
const MotionDriver = Mep.require('drivers/motion/MotionDriver');

// Drivers
const starter = Mep.getDriver('StarterDriver');
const ballPicker = Mep.getDriver('BallPicker');
const directionBall = Mep.getDriver('DirectionBall');


const TAG = 'InitTask';

class InitTask extends Task {
    async onRun() {
        // Tests
        // Mep.getDriver('MotionDriver').softStop();


        // Initialization
        directionBall.setPosition(170);
        ballPicker.setSpeed(400);
        Mep.getDriver('MotionDriver').setConfig(MotionDriver.CONFIG_STUCK_ROTATION_MAX_FAIL_COUNT, 500);
        Mep.getDriver('MotionDriver').setConfig(MotionDriver.CONFIG_STUCK_DISTANCE_MAX_FAIL_COUNT, 500);
        Mep.getDriver('MotionDriver').setConfig(MotionDriver.CONFIG_PID_R_P, 1.5);
        Mep.getDriver('MotionDriver').setConfig(MotionDriver.CONFIG_PID_R_D, 95);

        // await starter.waitStartSignal(new Console());

        this.finish();
    }
}

module.exports = InitTask;
