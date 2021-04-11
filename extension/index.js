'use strict';

module.exports = function (nodecg) {
	// Import all necessary classes
	const {Timer} = require('./model/Timer.js');
	const {Counter} = require('./model/Counter.js');

	const interval_obj = {}

	// Dynamically update the replicants and store the intervals in an object so we can pause them if needed
	function startWatch(obj) {
		interval_obj[obj.name+'-interval'] = setInterval(()=>{
			// nodecg.log.debug(obj)
			if (obj != null && typeof(obj.count === 'function')){
				obj.handleCount();
			}
			// @TODO This needs an optimization so it doesnt update every tick
			// We only should update it when it differs
			if (obj != null) {
				nodecg.Replicant(obj.name).value = obj
			}
		}, obj.interval_repeat)
	}


	// Set the config every class will use by default
	var default_config_counter = {name: 'counter-0', elapsed: 0, mode: 1, interval_repeat: 1000}
	nodecg.Replicant('CounterInstances', {defaultValue: [{name:'counter-0', elapsed:0, mode:1, interval_repeat:1000}], persistent: true})
	// nodecg.Replicant('CounterInstances').value = [default_config_counter]; // this resets the instances
	var CounterInstances = nodecg.Replicant('CounterInstances').value;
	// Create/resume classes
	var counter = null;
	for (var i = 0; i < CounterInstances.length; i++) {
		var ci = CounterInstances[i]
		var co = nodecg.Replicant(ci.name).value
		
		// We need to always initialize the class to set the value of the functions
		// It would be better to define the functions externally to be always available
		// Although it messes with the class patterns
		if (co.name) {
			counter = new Counter(co.name, co.elapsed, co.mode, co.interval_repeat)
		} else {
			counter = new Counter(ci.name, ci.elapsed, ci.mode, ci.interval_repeat)
		}

		if (!counter || !counter.name || !counter.elapsed) {
			nodecg.Replicant('counter-'+i.toString(), {defaultValue: counter, persistent:true})
		}

		startWatch(counter)
		
	}
	
};
