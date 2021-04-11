const {Clock} = require('./Clock.js');

class Timer extends Clock {
    constructor() {
        super();
        this.type = 'timer';
        this.startTime = 'today';
        this.endTime = null;
    }
}

module.exports = {Timer}