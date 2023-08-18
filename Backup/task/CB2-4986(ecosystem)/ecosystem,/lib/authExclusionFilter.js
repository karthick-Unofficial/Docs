const AUTH_EXCLUSION_TABLE = "sys_authExclusion";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r;

/**
 * Filter excluded items from streaming to a user
 * @param {string} userId -- User's id
 * @param {string} property -- Optionally change what property to look for to find the entityId
 */
exports.authExclusionFilter = function(userId, property = "id") {
	return (doc) => {
		return r.branch(
			r.table(AUTH_EXCLUSION_TABLE)
				.filter({
					"userId": userId,
					"entityId": doc(property)
				})
				.count()
				.gt(0),
			false,
			true
		);
	};
};

/**
 * 
 * @param {string} userId -- User's id
 * @param {string} property -- Optionally change what property to look for to find the entityId
 */
exports.authExclusionChangefeedFilter = function(userId, property = "id") {
	return (change) => {
		return r.branch(
			change.hasFields("new_val"),
			r.table(AUTH_EXCLUSION_TABLE)
				.filter({
					"userId": userId,
					"entityId": change("new_val")(property)
				})
				.count()
				.gt(0).not(),
			change.hasFields("old_val"),
			r.table(AUTH_EXCLUSION_TABLE)
				.filter({
					"userId": userId,
					"entityId": change("old_val")(property)
				})
				.count()
				.gt(0).not(),
			true
		);
	};
};

/**
 * Check to see if an entity has been excluded and throw error if so
 * @param {string} userId -- User's id
 * @param {string} entityId -- Entity's id
 * @param {obj} error -- Error object
 */
exports.authExclusionCheck = async function(userId, entityId, error) {

	const isExcluded = await r.table(AUTH_EXCLUSION_TABLE)
		.filter({
			"userId": userId,
			"entityId": entityId
		})
		.count()
		.gt(0)
		.run();

	if (isExcluded) {
		throw error;
	}
	
	return;
};