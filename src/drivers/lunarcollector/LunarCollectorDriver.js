'use strict';

const Delay = Mep.require('misc/Delay');

/** @namespace drivers.lunarcollector */

const TAG = 'LunarCollector';


/**
 * @param {String} config.leftTrack Name of Dynamixel driver which runs left track
 * @param {String} config.rightTrack Name of Dynamixel driver which runs right track
 * @param {String} config.leftHand Name of Dynamixel driver which runs left hand
 * @param {String} config.rightHand Name of Dynamixel driver which runs right hand
 * @memberOf drivers.lunarcollector
 * @author Darko Lukic <lukicdarkoo@gmail.com>
 */
class LunarCollectorDriver {
    constructor(name, config) {
        this.config = Object.assign({
            ejectorSpeed: 150,
            colorTimeout: 6000
        }, config);
        this.name = name;

        this._leftTrack = Mep.getDriver(this.config['@dependencies']['leftTrack']);
        this._rightTrack = Mep.getDriver(this.config['@dependencies']['rightTrack']);
        this._leftHand = Mep.getDriver(this.config['@dependencies']['leftHand']);
        this._rightHand = Mep.getDriver(this.config['@dependencies']['rightHand']);
        this._bigTrack = Mep.getDriver(this.config['@dependencies']['bigTrack']);
        this._limiter = Mep.getDriver(this.config['@dependencies']['limiter']);
        this._servoPump = Mep.getDriver(this.config['@dependencies']['servoPump']);
        this._vacuumPump = Mep.getDriver(this.config['@dependencies']['vacuumPump']);
        this._cylinder = Mep.getDriver(this.config['@dependencies']['cylinder']);
        this._circularEjector = Mep.getDriver(this.config['@dependencies']['circularEjector']);
        this._colorSensor = Mep.getDriver(this.config['@dependencies']['colorSensor']);
        this._colorRotator = Mep.getDriver(this.config['@dependencies']['colorRotator']);
        this._colorRotator2 = Mep.getDriver(this.config['@dependencies']['colorRotator2']);
        this._colorServo = Mep.getDriver(this.config['@dependencies']['colorServo']);

        this._middleDetector = Mep.getDriver(this.config['@dependencies']['middleDetector']);
        this._frontDetector = Mep.getDriver(this.config['@dependencies']['frontDetector']);
        this._backDetector = Mep.getDriver(this.config['@dependencies']['backDetector']);
        this._circularInjector = Mep.getDriver(this.config['@dependencies']['circularInjector']);

        this._leftHand.setSpeed(600);
        this._rightHand.setSpeed(600);
        this._servoPump.setSpeed(300);
        this._servoPump.setPosition(200); // Put put inside robot
        //this.colorStandby();

    }

    async limiterOpenSafe() {
        await this.trackStop();
        await this._limiter.go(310);
        await this.trackStart();
        this._circularEjector.write(this.config.ejectorSpeed, true);
    }

    limiterClose() {
        this._circularEjector.write(0);
        return this._limiter.go(470);
    }

    limiterPrepare() {
        this._limiter.setPosition(420);
    }

    limiterOpen() {
        this._limiter.setPosition(310);
    }

    trackStart() {
        this._bigTrack.write(100);
        this._circularEjector.write(1);
    }

    trackStop() {
        this._bigTrack.write(0);
        this._circularEjector.write(0);
    }

    isEmpty() {
        return (this._middleDetector.getLastValue() === 0 &&
            this._frontDetector.getLastValue() === 0 &&
            this._backDetector.getLastValue() === 0
        );
    }

    isLastInside() {
        return (this._backDetector.getLastValue() === 1);
    }

    isLastOnly() {
        return (this._middleDetector.getLastValue() === 0 &&
            this._frontDetector.getLastValue() === 0 &&
            this._backDetector.getLastValue() === 1
        );
    }

    numberOfModules() {
        let count = 0;

        if (this._backDetector.getLastValue() === 1) count++;
        if (this._frontDetector.getLastValue() === 1) count++;
        if (this._middleDetector.getLastValue() === 1) count++;

        return count;
    }

    collect() {
        this._circularInjector.write(1);
        this.trackStart();
        this._leftTrack.setSpeed(1023);
        this._rightTrack.setSpeed(1023, true);
        this._leftHand.setPosition(490);
        this._rightHand.setPosition(520);
    }

    async lunarTake() {
        this._servoPump.setSpeed(700);
        this._limiter.setPosition(530);

        // Take a lunar
        this._cylinder.write(0);
        this._vacuumPump.write(1);
        this._servoPump.setPosition(200);
        await Delay(500);

        this._cylinder.write(1);
        await Delay(1000);
        this._cylinder.write(0);
        await Delay(1000);
    }

    async lunarEject() {
      this._servoPump.setSpeed(1023);

     this._servoPump.go(830).catch(() => {});
     await Delay(1200);
     this._cylinder.write(1);
     this._vacuumPump.write(0);
     //await Delay(200);
     //this._cylinder.write(1);
     await Delay(1000);
     this._cylinder.write(0);
    }

    async lunarPullOtherModules(){
      this._servoPump.setSpeed(1023);

     // Eject a lunar

     try { await this._servoPump.go(830); } catch (e) {}
     await Delay(100);
     this._cylinder.write(1);

    }

    async lunarKick(){
      this._servoPump.setSpeed(1023);

      // Eject a lunar
      this._vacuumPump.write(0);
      try { await this._servoPump.go(400); } catch (e) {}
      await Delay(500);
      this._cylinder.write(1);
      await Delay(300);
      try { await this._servoPump.go(850); } catch (e) {}

      await Delay(100);
      this._cylinder.write(0);
    }

    async lunarInject() {
        this._vacuumPump.write(1);
        //try { await this._servoPump.go(170); } catch (e) {}
        this._cylinder.write(1);
        await Delay(1000);
        this._cylinder.write(0);
    }

    async colorStandby() {
        await Delay(100);
        this._colorServo.setPosition(585);
        this._colorRotator.write(255);
        this._colorRotator2.write(0);
        this._colorSensor.stop();
        this._circularEjector.stop();
    }

    async rotate(timeout = this.config.colorTimeout) {
        let lunarCollector = this;
        let requiredColor = (Mep.Config.get('table').indexOf('blue') >= 0) ? 'blue' : 'yellow';

        // Prepare mechanisms for rotation
        await Mep.getDriver('ServoPump').setPosition(200); //NOTE: dodao djole, obrisati ukoliko    je nepotrebno
        this._colorSensor.start(50);
        this._colorRotator.write(0); // NOTE: this is temporary because motors are in series and should be in parallel
        this._colorRotator2.write(1);
        this._colorServo.setPosition(730);
        this._circularInjector.write(0);
		this.trackStart();

        // Rotate until color
        return new Promise((resolve, reject) => {
            let colorSensor = this._colorSensor;
            let colorChangedPromise = (color) => {
                if (color === requiredColor) {
                    colorSensor.removeListener('changed', colorChangedPromise);
                    setTimeout(resolve, 150); // Resolve with delay
                    lunarCollector.colorStandby();
                }
            };

            this._colorSensor.on('changed', colorChangedPromise);
            setTimeout(() => {
                reject();
                lunarCollector.colorStandby();
                colorSensor.removeListener('changed', colorChangedPromise);
            }, timeout);
        });
    }

    hold() {
        this._leftTrack.setSpeed(0);
        this._rightTrack.setSpeed(0);
    }

    async prepare(left = 550, right = 450) {
        this._leftTrack.setSpeed(0);
        this._rightTrack.setSpeed(0);

        try {
            await Promise.all([
                this._leftHand.go(left),
                this._rightHand.go(right)
            ]);
        } catch (e) {
            Mep.Log.error(TAG, 'prepare', e);
        }

        // this.trackStart();
    }

    standby() {
        this._circularInjector.write(0);
        this._leftTrack.setSpeed(0);
        this._rightTrack.setSpeed(0);
        this.trackStop();
        this._cylinder.write(0);
        this._servoPump.go(200);
        let leftHandPromise = this._leftHand.go(840);
        let rightHandPromise = this._rightHand.go(180);

        return Promise.all([
            leftHandPromise,
            rightHandPromise
        ]);
    }

    turnOff() {
        this._vacuumPump.write(0);
        this._circularInjector.write(0);
        try {
            this.trackStop();
            this._leftTrack.setSpeed(0);
            this._rightTrack.setSpeed(0);
            this._colorRotator.write(255);
            this._colorRotator2.write(0);
            this.limiterOpen();
        } catch (e) {}
    }

    getGroups() {
        return [];
    }
}

module.exports = LunarCollectorDriver;
