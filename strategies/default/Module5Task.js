const Task = Mep.require('strategy/Task');
const TunedPoint = Mep.require('strategy/TunedPoint');
const TunedAngle = Mep.require('strategy/TunedAngle');
const Delay = Mep.require('misc/Delay');
const Point = Mep.require('misc/Point');
const lunar = Mep.getDriver('LunarCollector');
const Console = require('./Console');
const MotionDriver = Mep.require('drivers/motion/MotionDriver');

const TAG = 'Module5Task';

class Module5Task extends Task {
	async onRun(){
		try {
            lunar.limiterClose();
            await lunar.prepare();
            await Mep.Motion.go(new TunedPoint(-765, 670));
            await lunar.collect();
            await Delay(500);
            await Mep.Motion.go(new TunedPoint(-1000, 360), { backward: true });

            lunar.standby().catch(() => {});

            this.finish();
        } catch (e) {
            Mep.Log.error(TAG, e);
            this.suspend();
        }

    }
}
module.exports = Module5Task;