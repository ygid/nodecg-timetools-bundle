const {Clock} = require('./Clock.js');

class Counter  {
    constructor(name, elapsed, mode, interval_repeat) {
        // super();
        this.type = 'counter';
        this.format = 'H:i:s';
        this.paused = false;
        this.interval = null;
        
        this.name = name

        elapsed ? this.elapsed = elapsed 
            : this.elapsed=0;
        mode ? this.mode = mode  /* 1- count up 0- count down */
            : this.mode = 1;
        interval_repeat ? this.interval_repeat = interval_repeat 
            : this.interval_repeat = 1000;
    }

    handleCount() {
        if (!this.paused) {
            if (this.mode === 1) {
                this.countUp()
            } else if (this.mode === 0) {
                this.countDown()
            }
        }
        // console.log(this.elapsed) // clock is running
    }

    countUp() {
        this.elapsed += 1    
    }

    countDown() {
        if (this.elapsed > 0) {
            this.elapsed -= 1 
        } else {
            this.elapsed = 0;
        }
    }

    start(cb) {
        // this.cb = cb
        // this.interval = setInterval(()=>{
        //     this.count();
        //     if (typeof(cb) == 'function') {
        //         var self = this
        //         this.cb(self);
        //     }
        // }, this.interval_repeat)
    }
    
}

module.exports = {Counter}