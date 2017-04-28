const Task = Mep.require('strategy/Task');
const TunedPoint = Mep.require('strategy/TunedPoint');
const TunedAngle = Mep.require('strategy/TunedAngle');
const Delay = Mep.require('misc/Delay');
const Point = Mep.require('misc/Point');
const lunar = Mep.getDriver('LunarCollector');
const Console = require('./Console');

const TAG = 'CollectBackRocketTask';

class CollectBackRocketTask extends Task {
    async onRun() {
        try {
            await Mep.Motion.go(new TunedPoint(-1100, 370, [ 1100, 340, 'blue' ]), { speed: 180, backward: false, tolerance: -1 });
            await Mep.Motion.go(new TunedPoint(-1230, 370, [ 1250, 340, 'blue' ]), { speed: 70, backward: false, tolerance: -1 });
            await this.common.collect2();
            this.common.robot.colorfulModules = 2;
            lunar.standby();
            await Mep.Motion.straight(-70);

            this.finish();
        } catch (e) {
            Mep.Log.error(TAG, e);
            this.suspend();
        }
    }

    isAvailable() {
        return (lunar.isEmpty() === true);
    }
}

module.exports = CollectBackRocketTask;
