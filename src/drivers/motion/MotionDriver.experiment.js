global.Mep = require('../../Mep');
const MotionDriver = require('./MotionDriver');

let motionDriver = new MotionDriver('MotionDriver', {
    startX: 0,
    startY: 0
});

motionDriver.on('positionChanged', (name, position) => {
    console.log(position);
});