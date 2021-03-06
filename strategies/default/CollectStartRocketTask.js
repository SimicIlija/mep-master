const Task = Mep.require('strategy/Task');
const TunedPoint = Mep.require('strategy/TunedPoint');
const TunedAngle = Mep.require('strategy/TunedAngle');
const Delay = Mep.require('misc/Delay');
const Point = Mep.require('misc/Point');
const lunar = Mep.getDriver('LunarCollector');
const Console = require('./Console');

const TAG = 'CollectStartRocketTask';

class CollectStartRocketTask extends Task {
    async onRun() {
        try {
            lunar.prepare();
            await Mep.Motion.go(
                new TunedPoint(-355, -740, [ 355, -735, 'blue' ]),
                { speed: 130, backward: false });

            this.common.robot.monochromeModules = 4;
            await this.common.collect();

            // Send message to SMALL robot
            Mep.Share.send({ leaveStartEnabled: true });

            //lunar.trackStop();
            await Mep.Motion.straight(-100, { speed: 150 });

            this.finish();
        } catch (e) {
            switch (e.action) {
                case 'stuck':
                    await Delay(500);
                    try { await Mep.Motion.straight(200, { opposite: true }); } catch (e) { Mep.Log.error(TAG, e); }
                    break;
            }
            Mep.Log.error(TAG, e);
            this.suspend();
        }
    }

    isAvailable() {
        return (lunar.isEmpty() === true);
    }
}

module.exports = CollectStartRocketTask;
