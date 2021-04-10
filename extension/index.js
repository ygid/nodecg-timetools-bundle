'use strict';

module.exports = function (nodecg) {
	const {Timer} = require('./model/Timer.js');
	let timer = new Timer();

	nodecg.log.debug(timer)
	
	
};
