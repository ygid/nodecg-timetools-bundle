'use strict';

module.exports = function (nodecg) {
	// Import all necessary classes
	const {Timer} = require('./model/Timer.js');
	const {Counter} = require('./model/Counter.js');

	const interval_obj = {}

	// Dynamically update the replicants
	const startWatch = (obj) => {
		interval_obj[obj.name+'-interval'] = setInterval(()=>{
			// nodecg.log.debug(obj)
			if (typeof(obj.count === 'function')){
				obj.count();
			}
			nodecg.Replicant(obj.name).value = obj
		}, obj.interval_repeat)
	}


	// Set the config every class will use by default
	var default_config_counter = {name: 'counter-0', elapsed: 0, mode: 1, interval_repeat: 1000}
	nodecg.Replicant('CounterInstances', {defaultValue: [default_config_counter], persistent: true})
	nodecg.Replicant('CounterInstances').value = [default_config_counter];
	var CounterInstances = nodecg.Replicant('CounterInstances').value;
	// Create/resume classes
	for (var i = 0; i < CounterInstances.length; i++) {
		var counter = nodecg.Replicant(CounterInstances[i].name).value
		nodecg.Replicant(CounterInstances[i].name).value = null;
		if (!counter) {
			var ci = CounterInstances[i]
			counter = new Counter(ci.name, ci.elapsed, ci.mode, ci.interval_repeat)
			nodecg.Replicant('counter-'+i.toString(), {defaultValue: counter, persistent:true})
		}
		// nodecg.log.debug(counter)
		
		startWatch(counter)
	}
	
};
