'use strict';

module.exports = function (nodecg) {

	require("./controller/counterController.js")(nodecg)
	require("./controller/dateDiffController.js")(nodecg)
	
};
