const userModel = require("../models/userModel")();
const authModel = require("../models/authenticationModel")();
const AuthenticationProviderFactory = require("../lib/authentication/authentication-provider-factory");
// let factory = null;
let handle = null;
const proc = require("node-app-core").process("user-sync-processor", {
	"nats": {
		"url": "nats://phoenix-nats:4222"
	}
});
require("../app-global.js").globalChangefeed = proc.globalChangefeed;

// 86400000 = 24hr
const pollFreq = 86400000;

const _health = {
	status: 1,
	metrics: {
		success: 0,
		fail: 0
	}
};

proc.initialize = function(args) {
	try {
		//TODO: Make this an interval instead of a timeout
		handle = setTimeout(initUserSync, pollFreq);
		proc.status(`Started polling. Attempting external user updates every ${pollFreq / 3600000} hours`);
	}
	catch(e) {
		proc.status("Error initializing user sync for external authProviders");
		proc.fail("unhandled exception", e); 
	}
	proc.initSuccess();
}; 

proc.shutdown = function() {
	clearInterval(handle);
	proc.shutdownSuccess();
};

proc.getHealth = function() {
	return _health;
};

async function initUserSync() {
	// Query all providers
	const providerList = await authModel.getAuthenticationProviders();
	
	for (let j = 0; j < providerList.length; j++) {
		const provider = providerList[j];

		// Do not sync system
		if (provider.providerId !== "system") {
			const shouldSync = provider.connection.sync;

			// Provider should automatically sync and is not the CB2 system provider
			if (shouldSync) {
				const factory = new AuthenticationProviderFactory();
				const authProvider = await factory.getAuthenticationProvider(provider.id);

				let errMessage = null;

				authProvider.getUsersForCommandBridgeGroup(async function (err, authUsers) {
					if (err) {
						errMessage = "userSyncProcessor - getUsersForCommandBridgeGroup failed with error: " + err;
						console.log(errMessage);
						proc.status(errMessage);
					}

					if (!authUsers) {
						errMessage = `userSyncProcessor - getUsersForCBGroup no users found for org ${provider.orgId}'s external authProvider`;
						console.log(errMessage);
						proc.status(errMessage);
					}
					else {

						const users = authUsers.map(function (authuser) {
							const user = {
								name: authuser.displayName,
								email: authuser.mail || authuser.sAMAccountName,
								username: authuser.sAMAccountName,
								orgId: provider.orgId,
								authProviderId: provider.id
							};
							
							return user;
						});


						if (users.length){
							try {
								const users = await userModel.upsertExternalUsers(users);
								const message = "userSyncProcessor - Users successfully synced to CB DB";
								console.log(message);
								// proc.status(message);
							} catch (err) {
								const errMessage = "userSyncProcessor - upsertExternalUsers error: " + JSON.stringify(err);
								console.log(errMessage);
								proc.status(errMessage);	
							}
						}					
					}
				});
			}
		}
	}
}