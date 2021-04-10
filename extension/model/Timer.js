const {Clock} = require('./Clock.js');

class Timer extends Clock {
    constructor() {
        super();
        this.startTime = 'today';
        this.endTime = null;
    }
}

module.exports = {Timer}