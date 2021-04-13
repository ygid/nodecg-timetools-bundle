module.exports = function (nodecg) {
	// Import all necessary classes
	const {DateDiff} = require('../model/DateDiff.js');

	var default_config_datediff = {name: 'datediff-0', elapsed: 0, end_datetime: null, compute: false, format: null}
	var default_conf_arr = [
		{name: 'datediff-0', elapsed: 0, end_datetime: null, compute: false, format: null},
		{name: 'datediff-1', elapsed: 0, end_datetime: null, compute: false, format: null},
		{name: 'datediff-2', elapsed: 0, end_datetime: null, compute: false, format: null},
		{name: 'datediff-3', elapsed: 0, end_datetime: null, compute: false, format: null},
		{name: 'datediff-4', elapsed: 0, end_datetime: null, compute: false, format: null}
	]
	const interval_obj = {}

	if (!nodecg.Replicant('DateDiffInstances') || !Array.isArray(nodecg.Replicant('DateDiffInstances').length)) {
		nodecg.Replicant('DateDiffInstances', {defaultValue: default_conf_arr, persistent: true})
	}

	var r = nodecg.readReplicant('DateDiffInstances');
	nodecg.log.debug(r)

	for (var i = 0; i < r.length; r++) {
		var ci = r[i]
	// 	nodecg.log.debug(r[i])
		var co = nodecg.readReplicant(`datediff-${ci.name}`)
		if (!co || !co.name) co = ci;

		var datediff = new DateDiff(co.name, co.elapsed, co.end_datetime, co.compute, co.format)
				
	// 	if (!datediff) {
	// 		nodecg.Replicant('datediff-'+i.toString(), {defaultValue: datediff, persistent:true})
	// 	}

		startWatch(datediff)
	}
	
	
	




	// initializeReplicants();

	// const app = nodecg.Router();
    // app.post('/timetools/new-datediff', (req, res) => {
    //     newDateDiff(req.body.min)
    //     res.send();
    // });
	// app.post('/timetools/delete-datediff', (req, res) => {
    //     nodecg.Replicant('DateDiffInstances').value.splice(req.data, 1)
    //     res.send();
    // });
    // nodecg.mount(app);

	// function newDateDiff(i) {
	// 	var settings = default_config_datediff
	// 	settings.name = `datediff-${i}`;
		
	// 	if (!Array.isArray(nodecg.readReplicant('DateDiffInstances'))) {
	// 		nodecg.Replicant('DateDiffInstances').value = []
	// 	}
		
	// 	var arr =[];
	// 	for (var c = 0; c < nodecg.readReplicant('DateDiffInstances').length; c++) {
	// 		arr.push(nodecg.readReplicant('DateDiffInstances')[c])
	// 	}
	// 	arr.push(settings)
	// 	nodecg.log.debug(arr);

	// 	nodecg.Replicant('DateDiffInstances').value = arr;
	// 	// nodecg.Replicant('DateDiffInstances').value = arr; 
		
	// 	initializeReplicants(settings)
	// }

    // Create/resume classes
	// function initializeReplicants(default_conf) {
	// 	if (!default_conf) {
	// 		default_conf = default_config_datediff
	// 	}
		
	// 	var datediff = null;
	// 	if (!Array.isArray(nodecg.readReplicant('DateDiffInstances'))) {
	// 		nodecg.Replicant('DateDiffInstances').value = default_conf_arr
	// 	}
	// 	var DateDiffInstances = nodecg.Replicant('DateDiffInstances').value;
	// 	for (var i = 0; i < nodecg.Replicant('DateDiffInstances').value.length; i++) {
	// 		var ci = DateDiffInstances[i]
	// 		var co = null;
	// 		if (nodecg.Replicant(`datediff-${ci.name}`)) {
	// 			co = nodecg.Replicant(`datediff-${ci.name}`).value
	// 		}
			
	// 		if (!co || !co.name) co = ci;
			
	// 		datediff = new DateDiff(co.name, co.elapsed, co.end_datetime, co.compute, co.format)
			
	// 		if (!datediff || !datediff.name) {
	// 			nodecg.Replicant('datediff-'+i.toString(), {defaultValue: datediff, persistent:true})
	// 		}
				
	// 		var val = nodecg.Replicant('datediff-'+i.toString()).value
			
	// 		if (!val || val == '') {
	// 			nodecg.Replicant('datediff-'+i.toString()).value = datediff;
	// 		}
			
	// 		startWatch(datediff)
	// 	}
	// }
	

	function startWatch(obj) {
		if (!interval_obj[obj.name+'-interval']) {
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
	}

}