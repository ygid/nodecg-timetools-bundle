module.exports = function (nodecg) {
	// Import all necessary classes
	const {DateDiff} = require('../model/DateDiff.js');

	const interval_obj = {}
	function startWatch(obj) {
		interval_obj[obj.name+'-interval'] = setInterval(()=>{
			// nodecg.log.debug(obj)
			if (obj != null && typeof(obj.updateTime === 'function')){
				obj.updateTime();
			}
			// @TODO This needs an optimization so it doesnt update every tick
			// We only should update it when it differs
			if (obj != null && obj != nodecg.Replicant(obj.name).value) {
				nodecg.Replicant(obj.name).value = obj
			}
		}, obj.interval_repeat)
	}
    
    var default_config_datediff = {name: 'datediff-0', elapsed: 0, end_datetime: null, compute: false, format: null}
	nodecg.Replicant('DateDiffInstances', {defaultValue: [default_config_datediff], persistent: true})
	// nodecg.Replicant('DateDiffInstances').value = [default_config_datediff]; 
    var DateDiffInstances = nodecg.Replicant('DateDiffInstances').value;

    // Create/resume classes
	var datediff = null;
	for (var i = 0; i < DateDiffInstances.length; i++) {
		var ci = DateDiffInstances[i]
		var co = nodecg.Replicant(ci.name).value
        if (!co || !co.name) co = ci;
		
        datediff = new DateDiff(co.name, co.elapsed, co.end_datetime, co.compute, co.format)

		if (!datediff || !datediff.name) {
			nodecg.Replicant('datediff-'+i.toString(), {defaultValue: datediff, persistent:true})
		}

		var val = nodecg.Replicant('datediff-'+i.toString()).value
		
		if (!val || val == '') {
			nodecg.Replicant('datediff-'+i.toString()).value = datediff;
		}
		
		startWatch(datediff)
	}

}