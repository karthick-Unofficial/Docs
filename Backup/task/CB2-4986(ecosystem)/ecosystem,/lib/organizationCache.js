const orgModel = require("../models/organizationModel")();
const orgCache = {};

orgModel.streamAll(
	function(item) {
		if(item.new_val) {
			orgCache[item.new_val.id] = item.new_val;
		}
	});

function _getOrg(orgId) {
	return orgCache[orgId] || {
		orgId: orgId,
		name: orgId
	};	
}

module.exports = { get: _getOrg };
