const userModel = require("../models/userModel")();
const userCache = {};

userModel.streamAll(
	function(item) {
		if(item.new_val) {
			userCache[item.new_val.id] = item.new_val;
		}
	});

function _getUser(userId) {
	return userCache[userId] || {
		id: userId,
		name: userId,
		email: null
	};
}

module.exports = { get: _getUser };
