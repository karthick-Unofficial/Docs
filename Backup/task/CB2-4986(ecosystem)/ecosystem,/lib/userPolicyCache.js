const USER_TABLE = "sys_user";
const ENTITY_TYPE_TABLE = "sys_entityType";
const FEED_TYPES_TABLE = "sys_feedTypes";
const ORG_INTEGRATION_TABLE = "sys_orgIntegration";
const ROLE_INTEGRATION_TABLE = "sys_roleIntegration";
const ROLE_APPLICATION_TABLE = "sys_roleApplication";
const ENTITY_COLLECTIONS_TABLE = "sys_entityCollections";
const EVENT_TABLE = "sys_event";
const EVENT_FEED_CACHE_TABLE = "sys_eventFeedCache";
const AUTH_EXCLUSION_TABLE = "sys_authExclusion";
const LIST_TABLE = "sys_list";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rethink connection/db
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/lib/userPolicyCache.js");
const EventEmitter = require("events");
const global = require("../app-global.js");

// -------------------- Queries -------------------- 

// Query to grab users -- can be replaced or updated as necessary
const userQuery = r
	.table(USER_TABLE)
	.filter({ deleted: false }, { default: true })
	.without("password")
	.pluck("orgId", "id", "roleId", "name", "admin", "ecoAdmin");

// Query to keep users permissions up to date -- can be replaced or updated as necessary
// -- TODO: FILTER DELETED IN CONSUMING CLASS - AUTHORIZATION SHOULD NOT EXCLUDE DELETED, WHAT IF YOU WANT TO DO SOMETHING WITH DELETED USERS (OR ANYTHING ELSE)
const userPermissionStream = r.table(USER_TABLE)
	.filter({ deleted: false }, { default: true })
	.pluck("orgId", "id", "roleId", "name", "admin", "ecoAdmin")
	.changes({ includeInitial: false, includeTypes: true });

// Query to keep entity types up to date
const entityTypeStream = r.table(ENTITY_TYPE_TABLE)
	.pluck("id", "appId", "name")
	.changes({ includeInitial: true, includeTypes: true });

// Query to keep feed types up to date
const feedTypesStream = r.table(FEED_TYPES_TABLE)
	.changes({ includeInitial: true, includeTypes: true });

// Query to keep orgIntegrations up to date
const orgIntegrationStream = r.table(ORG_INTEGRATION_TABLE)
	.changes({ includeInitial: true, includeTypes: true });


// Query to keep usersIntegrations up to date
const roleIntegrationStream = r.table(ROLE_INTEGRATION_TABLE)
	.without("id", "lastModifiedDate")
	.changes({ includeInitial: true, includeTypes: true });

// Query to keep userApplications up to date
const roleApplicationStream = r.table(ROLE_APPLICATION_TABLE)
	.without("id", "lastModifiedDate")
	.changes({ includeInitial: true, includeTypes: true });


// Query to keep collections up to date
const collectionStream = r.table(ENTITY_COLLECTIONS_TABLE)
	.without("createdDate", "lastModifiedDate")
	.changes({ includeInitial: true, includeTypes: true });

// Query to keep events up to date
// todo: temporarily allow all events in cache for activity auth, replace with something less memory intensive (ass number of events increase)
const eventStream = r.table(EVENT_TABLE)
	.filter({"isDeleted": false})
	// .filter(r.now().during(r.row("startDate").default(r.now()),
	// 	r.row("endDate").default(r.time(10000, 1, 1, "Z"))))
	.pluck("startDate", "endDate", "id", "isDeleted", "isPublic", "owner", "ownerOrg", "sharedWith", "isActive")
	.changes({ includeInitial: true, includeTypes: true });

// Query to keep event entities up to date
const eventFeedCacheStream = r.table(EVENT_FEED_CACHE_TABLE)
	.without("lastUpdated", "pinnedBy")
	.changes({ includeInitial: true, includeTypes: true});

// Query to keep user exclusions up to date
const authExclusionStream = r.table(AUTH_EXCLUSION_TABLE)
	.without("created", "id", "entityType", "feedId")
	.changes({ includeInitial: true, includeTypes: "true" });

// Query to keep lists up to date
const eventListStream = r.table(LIST_TABLE)
	.filter({"deleted": false, "targetType" : "Event"})
	.pluck("id", "feedId", "owner", "ownerOrg", "targetId")
	.changes({ includeInitial: true, includeTypes: true });

// -------------------- End Queries -----------------


let instance = null;
const APP_PERMISSION_TYPES = {
	manage: "manage",
	share: "share",
	view: null
};
Object.freeze(APP_PERMISSION_TYPES);

const FEED_PERMISSION_TYPES = {
	view: null,
	contribute: null,
	manage: "manage",
	control: "control",
	share: "share" // -- share is pass through to app permisison - for events and status cards check permisison at app level not feed
};
Object.freeze(FEED_PERMISSION_TYPES);

class UserPolicyCache {
	constructor(options) {
		if (!instance) {
			this._options = options;
			this.events = new EventEmitter();

			this.appPermissionTypes = APP_PERMISSION_TYPES;
			this.feedPermissionTypes = FEED_PERMISSION_TYPES;

			// Initial properties
			this._usersById = {};
			this._registeredFeeds = {};
			this._orgIntegrations = {};
			this._integrationsByOrgId = {};
			this._roleIntegrations = {};
			this._roleApplications = {};
			this._entityTypesByName = {};
			this._feedTypesById = {};
			this._collectionsById = {};
			this._eventsById = {};
			this._eventEntities = {}; // Event Feed Cache entries
			this._exclusionsByUser = {}; // authExclusion entries
			this._eventListsById = {};

			// Initialize
			this._init();

			// Create singleton
			instance = this;
		}
		return instance;
	}

	// ----------------------------- Initialization Private Methods -----------------------------

	_init() {
		// Initial user permissions
		this._setInitialUsers().then(() => {
			// User permission changefeed
			this._beginPermissionStream();

			// Org integration changefeed
			this._beginOrgIntegrationStream();

			// User integration changefeed
			this._beginIntegrationStream();

			// User application changefeed
			this._beginApplicationStream();

			// FeedTypes changefeed
			this._beginEntityTypeStream();

			// FeedTypes changefeed
			this._beginFeedTypesStream();

			// Collections changefeed
			this._beginCollectionStream();
			
			// Events changefeed
			this._beginEventStream();

			// Event entities
			this._beginEventFeedCacheStream();

			// User excluded entities
			this._beginExclusionStream();

			// Event list entities
			this._beginEventListStream();
		});
	}

	_setInitialUsers() {
		return new Promise(async (resolve) => {
			const users = await userQuery.run();

			users.forEach((user) => {
				this._usersById[user.id] = user;
				// Set up empty object for userInts by intId later
				// this._usersById[user.id].userInt = {};
				// Set up empty object for userApps by appId later
				// this._usersById[user.id].userApp = {};
			});
			resolve(users);
		});
	}

	_getUserAppPermissions(userId) {
		const userRoleId = this.getUserById(userId) ? this.getUserById(userId).roleId : null;
		if(userRoleId) {
			return this.getRoleApplications(userRoleId);
		}
		return null;
	}

	_getUserIntPermissions(userId) {
		const userRoleId = this.getUserById(userId) ? this.getUserById(userId).roleId : null;
		if(userRoleId) {
			const permissions = this.getRoleIntegrations(userRoleId);
			if (permissions) {
				Object.keys(permissions).forEach(intId => {
					const permission = permissions[intId];
					const orgInt = this.getOrgIntegration(permission.orgIntId);
					if(orgInt) {
						permission.policy = orgInt.policy;
					}
				});
			}
			return permissions;
		}
		return null;
	}

	_getUserAppPermission(userId, appId) {
		const permissions = this._getUserAppPermissions(userId);
		return permissions ? permissions[appId] : null; 
	}

	_getUserIntPermission(userId, intId) {
		const permissions = this._getUserIntPermissions(userId);
		if (permissions) {
			const permission = permissions[intId];
			if(permission) {
				const orgInt = this.getOrgIntegration(permission.orgIntId);
				if(orgInt) {
					permission.policy = orgInt.policy;
					return permission;
				}
			}
		}
		return null;
	}

	_beginPermissionStream() {
		userPermissionStream
			.run()
			.then((feed) => {
				feed.each((err, change) => {
					if(err) console.log(err);
					// TODO: Think about how to handle org-admins, since their permissions come from another table -- do they ever change?
					this.events.emit("change", { type: "userPermission", change: change });
					if(change && change.new_val) {
						const userId = change.new_val.id;

						// If user exists, update user
						const user = this.getUserById(userId);
						if (user) {
							this._usersById[userId] = {...user, ...change.new_val};
						}
						// Otherwise, user is new, add to cache and add necessary blank properties
						else {
							this._usersById[userId] = change.new_val;
							// this.getUserById(userId).userInt = {};
							// this.getUserById(userId).userApp = {};
						}
						this._usersById[userId] = change.new_val;
					}
				});
			});
	}

	_beginOrgIntegrationStream() {
		orgIntegrationStream
			.run()
			.then((feed) => {
				feed.each((err, change) => {
					if (err) console.log(err);
					this.events.emit("change", { type: "orgIntegration", change: change });

					// change or initial
					if (change && change.new_val) {
						const orgIntId = change.new_val.id;
						this._orgIntegrations[orgIntId] = change.new_val;
						const orgId = change.new_val.orgId;
						const intId = change.new_val.intId;
						if(!this._integrationsByOrgId[orgId]) this._integrationsByOrgId[orgId] = {};
						this._integrationsByOrgId[orgId][intId] = true;
					}
					else if (change && !change.new_val && change.old_val) {
						const orgIntId = change.old_val.id;
						if (this._orgIntegrations[orgIntId]) {
							delete this._orgIntegrations[orgIntId];
						}
						const orgId = change.old_val.orgId;
						if(this._integrationsByOrgId[orgId]) {
							const intId = change.old_val.intId;
							delete this._integrationsByOrgId[orgId][intId];
						}
					}
				});
			});
	}

	_beginIntegrationStream() {
		roleIntegrationStream
			.run()
			.then((feed) => {
				feed.each((err, change) => {
					if (err) console.log(err);
					this.events.emit("change", { type: "roleIntegration", change: change });

					// change or initial
					if (change && change.new_val) {
						const roleId = change.new_val.roleId;
						const intId = change.new_val.intId;
						if(!this._roleIntegrations[roleId]) this._roleIntegrations[roleId] = {};
						this._roleIntegrations[roleId][intId] = change.new_val;
					}
					else if (change && !change.new_val && change.old_val) {
						const roleId = change.old_val.roleId;
						const intId = change.old_val.intId;
						if (this._roleIntegrations[roleId] && this._roleIntegrations[roleId][intId]) {
							delete this._roleIntegrations[roleId][intId];
						}
					}
				});
			});
	}

	_beginApplicationStream() {
		roleApplicationStream
			.run()
			.then((feed) => {
				feed.each((err, change) => {
					if (err) console.log(err);
					this.events.emit("change", { type: "roleApplication", change: change });

					// change or initial
					if (change && change.new_val) {
						const roleId = change.new_val.roleId;
						const appId = change.new_val.appId;
						if(!this._roleApplications[roleId]) this._roleApplications[roleId] = {};
						this._roleApplications[roleId][appId] = change.new_val;
					}
					else if (change && !change.new_val && change.old_val) {
						const roleId = change.old_val.roleId;
						const appId = change.old_val.appId;
						if (this._roleApplications[roleId] && this._roleApplications[roleId][appId]) {
							delete this._roleApplications[roleId][appId];
						}
					}
				});
			});
	}


	_beginEntityTypeStream() {
		entityTypeStream
			.run()
			.then((feed) => {
				feed.each((err, change) => {
					if (err) console.log(err);
					this.events.emit("change", { type: "entityType", change: change });

					// change or initial
					if (change && change.new_val) {
						const entityTypeName = change.new_val.name;

						this._entityTypesByName[entityTypeName] = change.new_val;
					}
					else if (change && !change.new_val && change.old_val) {
						const entityTypeName = change.old_val.name;

						if (this._entityTypesByName[entityTypeName]) {
							delete this._entityTypesByName[entityTypeName];
						}
					}
				});
			});
	}

	_beginFeedTypesStream() {
		feedTypesStream
			.run()
			.then((feed) => {
				feed.each((err, change) => {
					if (err) console.log(err);
					this.events.emit("change", { type: "feedTypes", change: change });

					// change or initial
					if (change && change.new_val) {
						const feedId = change.new_val.feedId;

						this._feedTypesById[feedId] = change.new_val;
					}
					else if (change && !change.new_val && change.old_val) {
						const feedId = change.old_val.feedId;

						if (this._feedTypesById[feedId]) {
							delete this._feedTypesById[feedId];
						}
					}
				});
			});
	}

	_beginCollectionStream() {
		collectionStream
			.run()
			.then((feed) => {
				feed.each((err, change) => {
					if (err) console.log(err);
					this.events.emit("change", { type: "collection", change: change });

					// change or initial
					if (change && change.new_val) {
						const collectionId = change.new_val.id;

						this._collectionsById[collectionId] = change.new_val;
					}
					// Deletion -- This will probably never happen but can stay
					// For collections, we just change 'isDeleted' to true
					else if (change && !change.new_val && change.old_val) {
						const collectionId = change.old_val.id;

						if (this._collectionsById[collectionId]) {
							delete this._collectionsById[collectionId];
						}
					}
				});
			});
	}

	_beginEventStream() {
		eventStream
			.run()
			.then((feed) => {
				feed.each((err, change) => {
					if (err) console.log(err);
					this.events.emit("change", { type: "event", change: change });
					// Change or initial
					if (change && change.new_val) {
						const eventId = change.new_val.id;

						this._eventsById[eventId] = change.new_val;
					}
					// Deletion -- This will probably never happen but can stay
					// For events, we just change 'isDeleted' to true
					else if (change && !change.new_val && change.old_val) {
						const eventId = change.old_val.id;

						if (this._eventsById[eventId]) {
							delete this._eventsById[eventId];
						}
					}
				});
			});
	}

	_beginEventFeedCacheStream() {
		eventFeedCacheStream
			.run()
			.then((feed) => {
				feed.each((err, change) =>{
					if (err) { 
						console.log("eventFeedCacheStream", err.message, err.stack);
					}
					this.events.emit("change", { type: "eventFeed", change: change });
					// Initial or change
					if (change && change.new_val) {
						const entityId = change.new_val.entityId;
						const eventId = change.new_val.eventId;
						if(!this._eventEntities[entityId]) this._eventEntities[entityId] = {};
						this._eventEntities[entityId][eventId] = change.new_val;
					}
					// Remove
					if (change && !change.new_val && change.old_val) {
						const entityId = change.old_val.entityId;
						const eventId = change.old_val.eventId;
						if (this._eventEntities[entityId] && this._eventEntities[entityId][eventId]) {
							delete this._eventEntities[entityId][eventId];
						}
					}
				});
			});
	}

	_beginExclusionStream() {
		authExclusionStream
			.run()
			.then((feed) => {
				feed.each((err, change) => {
					if (err) {
						logger.error("_beginExclusionStream", "Error while attempting to stream authExclusion for cache", {err}, SYSTEM_CODES.RETHINKDB);
					}
					this.events.emit("change", { type: "exclusion", change: change });

					// Initial or addition
					if (change && change.new_val) {
						const { userId, entityId } = change.new_val;

						if (!this._exclusionsByUser[userId]) {
							this._exclusionsByUser[userId] = [entityId];
						}
						else {
							this._exclusionsByUser[userId].push(entityId);
						}
					}

					// Deletion
					else if (change && !change.new_val && change.old_val) {
						const { userId, entityId } = change.old_val;

						if (this._exclusionsByUser[userId]) {
							const idx = this._exclusionsByUser[userId].indexOf(entityId);
							this._exclusionsByUser[userId].splice(idx, 1);
						}
					}
				});
			});
	}

	_beginEventListStream() {
		eventListStream
			.run()
			.then((feed) => {
				feed.each((err, change) => {
					if (err) console.log(err);
					this.events.emit("change", { type: "eventList", change: change });

					// Change or initial
					if (change && change.new_val) {
						const listId = change.new_val.id;
						this._eventListsById[listId] = change.new_val;
					}
					else if (change && !change.new_val && change.old_val) {
						const listId = change.old_val.id;
						if (this._eventListsById[listId]) {
							delete this._eventListsById[listId];
						}
					}
				});
			});
	}

	// ----------------------------- Public Methods -----------------------------
	// -- Note could be problems with users we initialize with(i.e. orgadmin) as they have same id in DB in both systems
	getUserById(userId) {
		let user = this._usersById[userId];
		if(!user && global.ecoLinkManager.isActive()){
			user = global.ecoLinkManager.getUserPolicyCacheUser(userId);
		}
		return user;
	}

	getOrgIntegration(orgIntId) {
		let orgInt = this._orgIntegrations[orgIntId];
		if(!orgInt && global.ecoLinkManager.isActive()){
			orgInt = global.ecoLinkManager.getUserPolicyCacheOrgInt(orgIntId);
		}
		return orgInt;
	}

	getRoleApplications(userRoleId) {
		let roleApps = this._roleApplications[userRoleId];
		if(!roleApps && global.ecoLinkManager.isActive()){
			roleApps = global.ecoLinkManager.getUserPolicyCacheRoleApps(userRoleId);
		}
		return roleApps;
	}

	getRoleIntegrations(userRoleId) {
		let roleInts = this._roleIntegrations[userRoleId];
		if(!roleInts && global.ecoLinkManager.isActive()){
			roleInts = global.ecoLinkManager.getUserPolicyCacheRoleInts(userRoleId);
		}
		return roleInts;
	}

	getEvent(eventId) {
		let event = this._eventsById[eventId];
		if(!event && global.ecoLinkManager.isActive()) {
			event = global.ecoLinkManager.getUserPolicyCacheEvent(eventId);
		}
		return event;
	}

	getEventEntity(entityId) {
		// merge in events from all ecos - may need to happen in ecoLinkManager
		let eventEnt = null;
		if(this._eventEntities[entityId]) {
			eventEnt = this._eventEntities[entityId];
		}
		if(global.ecoLinkManager.isActive()){
			// this would actually be a merged eventEnt from all remote ecos - currently just first match
			const remoteEventEnt = global.ecoLinkManager.getUserPolicyCacheEventEntity(entityId);
			if(remoteEventEnt) {
				if(eventEnt) {
					eventEnt = { ...eventEnt, ...remoteEventEnt };
				}
				else {
					eventEnt = remoteEventEnt;
				}
			}
		}
		return eventEnt;
	}

	getName(userId) {
		const user = this.getUserById(userId);
		if(user)
			return user.name;
		else 
			return "User Name Unknown";
	}

	userIsOrgAdmin(userId) {
		const user = this.getUserById(userId);
		return user ? !!user.admin : false;
	}

	userIsEcoAdmin(userId) {
		const user = this.getUserById(userId);
		return user ? !!user.ecoAdmin : false;
	}

	isPinnedToEvent(eventId, entityId) {
		const eventEnt = this.getEventEntity(entityId);
		// -- TODO: REFACTOR
		return eventEnt && eventEnt[eventId.split("@@")[0]];
	}

	getAllCachedData() {
		const allCachedData =  {
			users: this._usersById,
			orgIntegrations: this._orgIntegrations,
			integrationsByOrgId: this._integrationsByOrgId,
			roleIntegrations: this._roleIntegrations,
			roleApplications: this._roleApplications,
			feeds: this._registeredFeeds,
			entityTypes: this._entityTypesByName,
			feedTypes: this._feedTypesById,
			collections: this._collectionsById,
			events: this._eventsById,
			eventEntities: this._eventEntities,
			authExclusions: this._exclusionsByUser
		};
		return allCachedData;
	}

	getAllRemoteCaches() {
		return global.ecoLinkManager.getAllUserPolicyCaches();
	}

	authorizeApplication(userId, applicationId, permission = null) {
		// const userPermissions = this.getUserById(userId);
		// const appPermissions = userPermissions.userApp[applicationId];
		const appPermissions = this._getUserAppPermission(userId, applicationId);
		if(appPermissions) {
			// -- has access to app
			if(permission === null) return true;
			else {
				return appPermissions.permissions.includes(permission);
			}

		}
		return false;
	}
	

	// Check entity vs the correct policy
	authorizeEntity(userId, entity, permission = null) {

		// If user has excluded entity, bail
		if (this.hasExclusions(userId, entity.id)) {
			return false;
		}

		const userPermissions = this.getUserById(userId);
		if (!userPermissions) return false;

		// -- activity uses type - may change that
		const entityType = entity.entityType || entity.type;

		// certain entities (event, status card) are authorized by in user's org or shared with user's org requires a different method of auth
		const orgShareEnts = ["event", "statusCard"];
		if(orgShareEnts.includes(entityType)) {
			// -- only use the cached event if the ownerOrg and sharedWith props are not present (I believe this only occurs with events from activities)
			entity = entityType === "event" && !entity.ownerOrg && !entity.sharedWith ?
				this.getEvent(entity.id) : entity;

			if(entity){
				if((permission === this.feedPermissionTypes.manage) || (permission === this.feedPermissionTypes.share)) {
					const appId = this._entityTypesByName[entityType].appId;
					if(!appId) {
						logger.error("authorizeEntity", `Authorization requested for undefined entity type ${entityType}`, { entityType: entityType, userId: userId, entity: entity, permission: permission });
						return false;
					}
					if(!this.authorizeApplication(userId, appId, permission)) return false;
					// -- has to belong to users org or been shared with the users org to manage/share
					// if user is remote couldn't possibly be the owner so don't authorize unless explictly shared
					return (entity.ownerOrg === userPermissions.orgId) || (entity.sharedWith && entity.sharedWith.includes(userPermissions.orgId));
				}
				else {
					// -- you can view/contribute shared events/status org-share auth type entities
					// if user is remote couldn't possibly be the owner so don't authorize unless explictly shared
					return (entity.ownerOrg === userPermissions.orgId) || (entity.sharedWith && entity.sharedWith.includes(userPermissions.orgId));
				}
			}
			else {
				return false;
			}
		}

		// -- org auth entities
		const orgAuthEnts = ["collection", "organization"];
		if(orgAuthEnts.includes(entityType)) {
			// -- grab ownerOrg from cached entity if not present already
			entity = entityType === "collection" && !entity.ownerOrg ? this._collectionsById[entity.id] : entity;
			return entity.ownerOrg === userPermissions.orgId;
		}

		// -- TODO: ENT_AUTH linkedEntities is unique case, there is pointer to the link but it targets 2 entities
		// -- you would expect to see on the camera and track activity stream in the current case
		const unauthEnts = [
			"attachment", 
			"health-report", 
			"comment", 
			"berth-assignment", 
			"berth", 
			"camera group", 
			"system", 
			"linkedEntities", 
			"alarm",
			"external"
		];
		if(unauthEnts.includes(entityType)) return true;
		
		// -- TODO - SHOULD JUST EXCLUDE THE POLICY IN FEED PERMISSIONS IF EXPIRED - THEN WE WON'T NEED SEPARATE authorizeFeedAccess
		// -- AN EVENT FOR POLICY EXPIRATION CAN REMOVE AND UPDATE CACHE AS NEEDED OR JUST HAVE AN OCCASIONAL CHECK FOR THAT OR OCCASIONALLY REFRESH
		// const feedPermissions = userPermissions ? userPermissions.userInt[entity.feedId] : null;
		const feedPermissions = entity !== undefined ? this._getUserIntPermission(userId, entity.feedId) : {};
		// No permissions? Bail
		// -- If feed permissions then done for view/contrib owner/always 
		// -- events need to further confirm is pinned to event that user has access to
		if (!feedPermissions || !userPermissions) {
			return false;
		}
	
		const hasFeedAccess = entity !== undefined ? this.authorizeFeedAccess(userId, entity.feedId, permission) : false;
		if(hasFeedAccess == "event") {
			// event requires further check to ensure user has access to the event, the event is active and the entity is pinned to the event
			return this._authorizeEventsPolicy(
				userPermissions.orgId,
				entity
			);
		}
		// Owner, always policy only require access to the feed and proper permisison
		return hasFeedAccess;
	}

	// used exclusively for feed sharing between orgs in different ecosystems (linked ecos)
	authorizeEntityForOrg(orgId, entity, permission = null) {

		// -- activity uses type - may change that
		const entityType = entity.entityType || entity.type;

		// certain entities (event, status card) are authorized by in user's org or shared with user's org requires a different method of auth
		const orgShareEnts = ["event", "statusCard"];
		if(orgShareEnts.includes(entityType)) {
			return entity.ownerOrg === orgId || (entity.sharedWith && entity.sharedWith.includes(orgId));
		}

		// -- org auth entities - not applicable cross org or cross eco
		const orgAuthEnts = ["collection", "organization"];
		if(orgAuthEnts.includes(entityType)) {
			return false;
		}

		// -- TODO: ENT_AUTH linkedEntities is unique case, there is pointer to the link but it targets 2 entities
		// -- you would expect to see on the camera and track activity stream in the current case
		const unauthEnts = [
			"attachment", 
			"health-report", 
			"comment", 
			"berth-assignment", 
			"berth", 
			"camera group", 
			"system", 
			"linkedEntities", 
			"alarm",
			"external"
		];
		if(unauthEnts.includes(entityType)) return true;
		
		const feedPermissions = this._integrationsByOrgId[orgId][entity.feedId];

		// No permissions? Bail
		// -- If feed permissions then done for view/contrib owner/always 
		// -- events need to further confirm is pinned to event that user has access to
		if (!feedPermissions) {
			return false;
		}

		const policy = feedPermissions.policy;

		// Validate term period, if it exists
		if (policy.term) {
			const valid = this._isBetweenDateRange(new Date(), policy.term.start, policy.term.end);
			if (!valid) return false;
		}

		// -- owner shouldn't be required here as this is always a shared feed
		if (policy.policyType === "always") {
			return true;
		}
		else if(policy.policyType === "event") {
			return this._authorizeEventsPolicy(
				orgId,
				entity
			);
		}
		
	}

	authorizeActivity(userId, activity) {
		// user has access to source app
		// user has access to feeds for entities
		// pass through non-entities but perhaps make explicit

		// -- policy (feed entities)
		// -- individual (event, status card) individually shared with other orgs in sharedWith array
		// -- asset (attachment, etc.)
		
		// -- verify user has access to activity authAppId, * or null/undefined allows all
		const authAppId = activity.authAppId ? activity.authAppId : "*";
		// const appIsAuth = authAppId === "*" || user.userApp[authAppId];
		const appIsAuth = authAppId === "*" || this._getUserAppPermission(userId, authAppId);
		if(!appIsAuth) return false;
		const objectIsAuth = activity.object ? this.authorizeEntity(userId, activity.object) : true;
		if(!objectIsAuth) return false;
		const targetIsAuth = activity.target ? this.authorizeEntity(userId, activity.target) : true;
		if(!targetIsAuth) return false;
		return true;
	}


	getFeedType(feedId) {
		let feedType =  this._feedTypesById[feedId];
		if(!feedType && global.ecoLinkManager.isActive()){
			feedType = global.ecoLinkManager.getUserPolicyFeedType(feedId);
		}
		return feedType;
	}

	// Check access to feed vs policy
	// TODO: Remove this should become unecessary as will make it so policy not returned if expired and track expired policies
	// could potentially be done in cache as well an ensure we are expiring at or before policy expiration
	// view and contribute are implied if feed is assigned. Others are explicit in permissions
	authorizeFeedAccess(userId, feedId, permission = null) {
		const userPermissions = this.getUserById(userId);
		const feedPermissions = this._getUserIntPermission(userId, feedId);

		if (!feedPermissions || !userPermissions) {
			return false;
		}

		const feedType = this.getFeedType(feedId);
		// const entityType = this._entityTypesByName[feedType.entityType];
		// const appPermissions = userPermissions.userApp[entityType.appId];
		// -- if no permissions assigned still allow view/contribute
		feedPermissions.permissions = feedPermissions.permissions || []; 
		const hasRequestedPermission = permission ? feedPermissions.permissions.includes(permission) : true;
		// No permissions? Bail
		if (!hasRequestedPermission) {
			return false;
		}

		// const canView = feedPermissions.config.canView;
		const policy = feedPermissions.policy;
		const policyType = policy.type;

		// No policyType? Bail
		if (!policyType) {
			logger.error("authorizeFeedAccess", "Feed requires a policy type", { userId: userId, feedPermissions: feedPermissions });
			return false;
		}

		// Validate term period, if it exists
		if (policy.term) {
			const valid = this._isBetweenDateRange(new Date(), policy.term.start, policy.term.end);
			if (!valid) return false;
		}

		if (policyType === "always") {
			return this._authorizeAlwaysFeed(
				userPermissions.orgId,
				feedType.ownerOrg
			);
		}
		else if (policyType === "owner") {
			return this._authorizeOwnerFeed(
				userPermissions.orgId,
				feedType.ownerOrg
			);
		}
		else if (policyType === "event") {
			// return canViewExternalOrg ? "event" : false;
			return "event";
		}
		else {
			logger.error("authorizeFeedAccess", "Error authorizing feed invalid policy type ${policyType}", { userId: userId, feedPermissions: feedPermissions, policyType: policyType });
			return false;
		}
	}

	/**
	 * For event policy return only entities that are pinned to active events user has access to
	 * @param {*} userId the userId of user who has event policy
	 * @param {*} feed
	 */
	getEventPolicyFeed(userId, feedId) {
		const userPermissions = this.getUserById(userId);
		if (!userPermissions) return [];

		const userOrg = userPermissions.orgId;
		// Get eventIds that users org has access to
		const orgEventIds = Object.keys(this._eventsById).filter(eventId => {
			const event = this._eventsById[eventId];
			return event.ownerOrg === userOrg || event.sharedWith.includes(userOrg);
		});
		
		
		const feedEnts = [];

		for(const entId in this._eventEntities) {
			for(const eventId in this._eventEntities[entId]) {
				if(orgEventIds.includes(eventId)) {
					const eventEnt = this._eventEntities[entId][eventId];
					if(eventEnt.feedID === feedId) {
						feedEnts.push(eventEnt.feedId);
					}
				}
			}
		}

		return feedEnts;

	}

	getUserIntegrations(userId, permission = null) {
		const userIntegrations = this._getUserIntPermissions(userId);
		const results = [];
		for(const intKey in userIntegrations) {
			// CHANGE THIS *****************************************************************
			// Extract local int from remote int Id (THOUGHT I DID THIS WHEN INCLUDING REMOTE USERPOLICY CAHCE SO NEED TO CHECK THAT)
			const userInt = { ...userIntegrations[intKey] };
			if(userInt.intId.includes("@@")) {
				const idParts = userInt.intId.split("@@");
				userInt["isRemote"] = idParts[1] !== global.ecoLinkManager.getSourceEcoId();
				if(!userInt["isRemote"]) // makes it local as it is local
					userInt.intId = idParts[0];
			}
			// CHANGE THIS *****************************************************************
			const hasFeedAccess = this.authorizeFeedAccess(userId, userInt.intId, permission);
			if(hasFeedAccess) {			
				const feedType = this.getFeedType(userInt.intId); //this._feedTypesById[userInt.intId];
				results.push({ ...userInt, ...feedType });
			}
		}
		return results;
	}

	// TODO: Refactor using getUserIntegrations
	getUserIntegrationsByEntityType(userId, entityType, permission = null) {
		// const userIntegrations = this.getUserById(userId).userInt;
		const userIntegrations = this._getUserIntPermissions(userId);
		const results = [];
		for(const intKey in userIntegrations) {
			// CHANGE THIS *****************************************************************
			// Extract local int from remote int Id (THOUGHT I DID THIS WHEN INCLUDING REMOTE USERPOLICY CACHE SO NEED TO CHECK THAT)
			const userInt = { ...userIntegrations[intKey] };
			if(userInt.intId.includes("@@")) {
				const idParts = userInt.intId.split("@@");
				userInt["isRemote"] = idParts[1] !== global.ecoLinkManager.getSourceEcoId();
				if(!userInt["isRemote"]) // makes it local as it is local
					userInt.intId = idParts[0];
			}
			// CHANGE THIS *****************************************************************
			// const userInt = userIntegrations[intKey];
			const hasFeedAccess = this.authorizeFeedAccess(userId, userInt.intId, permission);
			
			if(hasFeedAccess) {			
				const feedType = this.getFeedType(userInt.intId); //this._feedTypesById[userInt.intId];
				if(feedType && feedType.entityType === entityType) {
					results.push({ ...userInt, ...feedType });
				}
			}
		}
		return results;
	}

	// Add a user's handler to the registration list by feedId
	registerUser(userId, feedId, sessionId, handler, filter = false, options) {
		// If feed key does not exist, create it
		if (!this._registeredFeeds[feedId]) {
			this._registeredFeeds[feedId] = {};
		}

		// If user key does not exist, create it
		if (!this._registeredFeeds[feedId][userId]) {
			this._registeredFeeds[feedId][userId] = {};
		}

		/**
		 * Register user to feed. Filter is used to determine if event entity filtering should be done
		 * -- The user is registered by a unique sessionId, which will ensure that multiple instances of the same user,
		 * -- such as being logged in to multiple browsers, will all receive changes correctly to their unique handlers
		 */ 
		this._registeredFeeds[feedId][userId][sessionId] = {
			callback: handler,
			filter: filter,
			userId: userId,
			options: options || {}
		};

		console.log("registerUser", userId, feedId, sessionId);

		// If we register correctly, return true
		if (this._registeredFeeds[feedId][userId][sessionId] && typeof this._registeredFeeds[feedId][userId][sessionId].callback === "function") {
			return true;
		}

		return false;
	}

	// -- TODO - NOT CERTAIN WHY SEPARATE FOR OWNER|ALWAYS AND EVENT - REFACTOR IF POSSIBLE
	// Get the handlers of all users who are registered to a feed via Owner/Always policies
	getFullHandlerArray(feedId) {
		// If doesn't exist, bail
		if (!this._registeredFeeds[feedId]) return [];

		const handlerArray = [];

		const userIds = Object.keys(this._registeredFeeds[feedId]);

		userIds.forEach(userId => {
			// Object with sessionIds as keys
			const userSessions = this._registeredFeeds[feedId][userId];

			// Filter by "filter: false" and push user session objs into handlerArray
			Object.keys(userSessions)
				.filter(sessionId => {
					return !userSessions[sessionId].filter;
				})
				.forEach(filteredSessionId => {
					handlerArray.push(userSessions[filteredSessionId]);
				});
		});

		return handlerArray;
	}

	// Get the handlers of all users who are registerd to a feed and will receive event-filtered items
	getFilteredHandlerArray(feedId) {
		// If doesn't exist, bail
		if (!this._registeredFeeds[feedId]) return [];

		const handlerArray = [];

		const userIds = Object.keys(this._registeredFeeds[feedId]);

		userIds.forEach(userId => {
			// Object with sessionIds as keys
			const userSessions = this._registeredFeeds[feedId][userId];

			// Filter by "filter: true" and push user session objs into handlerArray
			Object.keys(userSessions)
				.filter(sessionId => {
					return userSessions[sessionId].filter;
				})
				.forEach(filteredSessionId => {
					handlerArray.push(userSessions[filteredSessionId]);
				});
		});

		return handlerArray;
	}

	// Remove a user's handler from a feed, and delete the feed if it has no registered users
	removeRegisteredUser(userId, feedId, sessionId) {
		if (
			this._registeredFeeds[feedId] 
			&& this._registeredFeeds[feedId][userId]
			&& this._registeredFeeds[feedId][userId][sessionId]
		) {
			// Remove user session
			delete this._registeredFeeds[feedId][userId][sessionId];

			// If use has no more sessions...
			if (Object.keys(this._registeredFeeds[feedId][userId]).length < 1) {
				// ...remove user from feed
				delete this._registeredFeeds[feedId][userId];
			}
		}

		// If last user is removed, remove feed key
		if (this._registeredFeeds[feedId]) {
			if (Object.keys(this._registeredFeeds[feedId]).length < 1) {
				delete this._registeredFeeds[feedId];
			}
		}
	}

	// Check to see if the stream should end. If no users are subscribed, send true.
	shouldEndStream(feedId) {
		// If no feedId property, then all users have been removed and need to end stream
		return !this._registeredFeeds.hasOwnProperty(feedId);
	}

	// Check a user's exclusions (hidden entities)
	hasExclusions(userId, entityId) {
		// If user has no exclusions in cache return false
		if (!this._exclusionsByUser[userId]) {
			return false;
		}
		else {
			return this._exclusionsByUser[userId].includes(entityId);
		}
	}

	// ----------------------------- Private Methods -----------------------------
	
	// Check access to a feed via Always policy
	_authorizeAlwaysFeed(userOrg, feedOwnerOrg) {
		// We've already confirmed they have access to the feed AFAIK now there is no other limiting factor
		return true;
	}

	// Check access to a feed via Owner po+licy
	_authorizeOwnerFeed(userOrg, feedOwnerOrg) {
		// We've already confirmed they have access to the feed AFAIK now there is no other limiting factor
		return true;
	}

	// Authorize an entity vs the event policy
	_authorizeEventsPolicy(orgId, entity) {
		// -- get events org is authorized for
		const orgEventIds = Object.keys(this._eventsById).filter(eventId => {
			const event = this._eventsById[eventId];
			return event.isActive && (event.ownerOrg === orgId || event.sharedWith.includes(orgId));
		});

		if (entity.entityType === "list") {
			const list = this._eventListsById[entity.id];
			if (!list || !list.targetId) {
				return false;
			}

			// -- make sure list target event is authorized for this org
			return orgEventIds.includes(list.targetId);
		}
		else {
			const feedCacheEnt = this._eventEntities[entity.id];

			// No entity in feed cache or out of scope? Bail
			// In scope will handle the start/end of event checking
			if (!feedCacheEnt) {
				return false;
			}

			for(const eventId in feedCacheEnt) {
				if(orgEventIds.includes(eventId) && feedCacheEnt[eventId].inScope) {
					return true;
				}
			}

			return false;
		}
	}
	
	_isBetweenDateRange(date, start, end) {
		return( start < date && date < end );
	}
}

module.exports = UserPolicyCache;
