class DateDiff  {
    constructor(name, start_datetime, end_datetime, compute, format) {
        // super();
        this.type = 'date_diff';
        this.format = 'H:i:s';
        this.start_datetime = null; // defaults to now
        this.end_datetime = new Date(); // defaults to now
        this.compute = false; // if we want to update the time serverside
        this.name = name;
        this.elapsed = 0;
        this.interval_repeat = 1000;

        // if (start_datetime) this.start_datetime = start_datetime;
        if (end_datetime) this.end_datetime = end_datetime;
        if (compute) this.compute = compute;
        if (format) this.format = format;
    }

    updateTime() {
        if (this.end_datetime) {
            var sd = new Date().getTime()
            var ed = new Date(this.end_datetime).getTime()
            this.elapsed = Math.abs(Math.floor((sd - ed)/1000))
        } else {
            this.elapsed = 0;
        }
    }

}

module.exports = {DateDiff}