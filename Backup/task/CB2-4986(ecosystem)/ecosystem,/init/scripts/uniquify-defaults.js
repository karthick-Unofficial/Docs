const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const uuidv4 = require("uuid/v4");

module.exports.applyScript = async function () {
	try {
        
		const userUpdates = [
			{ "sys_attachment": ["createdBy"] },
			{ "sys_authExclusion": ["userId"] },
			{ "sys_cameraGroup": ["owner"] },
			{ "sys_entityCollections": ["owner"] },
			{ "sys_event": ["owner"] },
			{ "sys_facility": ["owner"] },
			{ "sys_floorplan": ["createdBy"] },
			{ "sys_linkedEntities": ["createdBy"] },
			{ "sys_list": ["owner"] },
			{ "sys_listCategories": ["owner"] },
			{ "sys_orgSharingConnections": ["createdBy"] },
			{ "sys_replay": ["owner"] },
			{ "sys_shape": ["owner"] },
			{ "sys_spotlight": ["owner"] },
			{ "sys_statusCard": ["owner"] },
			{ "sys_userAppState": ["user"] }
		];
        
		const orgUpdates = [
			{ "sys_authProviders": ["orgId"] },
			{ "sys_camera": ["ownerOrg"] },
			{ "sys_cameraGroup": ["ownerOrg"] },
			{ "sys_entityCollections": ["ownerOrg"] },
			{ "sys_event": ["ownerOrg"] },
			{ "sys_facility": ["ownerOrg"] },
			{ "sys_feedEntities": ["ownerOrg"] },
			{ "sys_feedTypes": ["ownerOrg"] },
			{ "sys_list": ["ownerOrg"] },
			{ "sys_listCategories": ["ownerOrg"] },
			{ "sys_orgApplication": ["orgId"] },
			{ "sys_orgEventType": ["orgId"] },
			{ "sys_orgExternalSystem": ["orgId"] },
			{ "sys_orgRoles": ["orgId"] },
			{ "sys_organization": ["orgId"] },
			{ "sys_replay": ["ownerOrg"] },
			{ "sys_shape": ["ownerOrg"] },
			{ "sys_statusCard": ["ownerOrg"] },
			{ "sys_user": ["orgId"] },
			{ "sys_orgIntegration": ["feedOwnerOrg"] },
			{ "sys_orgIntegration": ["orgId"] },
			{ "sys_roleIntegration": ["feedOwnerOrg"] }
		];


		const orgAdminId = "2c9c0362-345b-4f33-9976-219a4566b9c3";
		const ecoAdminId = "bc6c9ca9-9e32-487b-b7b8-22b03d24ce13";

		const orgAdminUser = await r.table("sys_user").get(orgAdminId);
		const newOrgAdminId = uuidv4();
		orgAdminUser.id = newOrgAdminId;
		const deleteResult = await r.table("sys_user").get(orgAdminId).delete();
		const insertResult = await r.table("sys_user").insert(orgAdminUser);

		const ecoAdminUser = await r.table("sys_user").get(ecoAdminId);
		const newEcoAdminId = uuidv4();
		ecoAdminUser.id = newEcoAdminId;
		const ecoAdminDeleteResult = await r.table("sys_user").get(ecoAdminId).delete();
		const ecoAdminInsertResult = await r.table("sys_user").insert(ecoAdminUser);
        
		// -- Update Org Admin
		for(const userUpdate of userUpdates) {
			const table = Object.keys(userUpdate)[0];
			const updateKey = userUpdate[table][0];
			const updateVal = {};
			updateVal[updateKey] = newOrgAdminId;
			const oaResult = await r.table(table)
				.filter(r.row(updateKey).eq(orgAdminId))
				.update(updateVal);
		}

		// -- Update Eco Admin
		for(const userUpdate of userUpdates) {
			const table = Object.keys(userUpdate)[0];
			const updateKey = userUpdate[table][0];
			const updateVal = {};
			updateVal[updateKey] = newEcoAdminId;
			const oaResult = await r.table(table)
				.filter(r.row(updateKey).eq(ecoAdminId))
				.update(updateVal);
		}

		// Organization ----------------------------------------------------------------------------------
		const aresSecOrg = "ares_security_corporation";
		const newAresSecOrg = `${aresSecOrg}_${uuidv4()}`;

		// "sys_event": "ownerOrg",
		// "sys_statusCard": "ownerOrg"
		const eventsSharedWith = await r.table("sys_event").filter(r.row("sharedWith").contains(aresSecOrg));
		for(const event of eventsSharedWith) {
			const swOrgIdx = event.sharedWith.indexOf(aresSecOrg); 
			event.sharedWith[swOrgIdx] = newAresSecOrg;
			const updateResult = await r.table("sys_event").get(event.id).update({ "sharedWith": event.sharedWith });
		}
		const statusCardsSharedWith = await r.table("sys_statusCard").filter(r.row("sharedWith").contains(aresSecOrg));
		for(const statusCard of statusCardsSharedWith) {
			const swOrgIdx = statusCard.sharedWith.indexOf(aresSecOrg); 
			statusCard.sharedWith[swOrgIdx] = newAresSecOrg;
			const updateResult = await r.table("sys_event").get(statusCard.id).update({ "sharedWith": statusCard.sharedWith });
		}

		const srcOrgResult = await r.table("sys_orgSharingConnections").filter({ "sourceOrg": aresSecOrg }).update({ "sourceOrg": newAresSecOrg });
		// -- We won't know what new id of target org would be if ares_security_corporation so will need to resolve manually
		// -- applies to org_integration as well if orgId is remote ares_security_corp
		//const targetOrgResult = await r.table("sys_orgSharingConnections").filter({ "targetOrg": aresSecOrg }).update({ "targetOrg": newAresSecOrg });


		for(const orgUpdate of orgUpdates) {
			const table = Object.keys(orgUpdate)[0];
			const updateKey = orgUpdate[table][0];
			const updateVal = {};
			updateVal[updateKey] = newAresSecOrg;
			const oResult = await r.table(table)
				.filter(r.row(updateKey).eq(aresSecOrg))
				.update(updateVal);
		}


		// Ares Sec Feeds
		const replaceFeedIds = ["ares_security_corporation_facilities", "ares_security_corporation_lists", "ares_security_corporation_shapes"];
		let feedIdUpdateResult = null;
		for(const feedId of replaceFeedIds) {            
			const newFeedId = feedId.replace(aresSecOrg, newAresSecOrg);
			feedIdUpdateResult = await r.table("sys_feedTypes").filter({ "feedId": feedId }).update({ "feedId": newFeedId });
			feedIdUpdateResult = await r.table("sys_facility").filter({ "feedId": feedId }).update({ "feedId": newFeedId });
			feedIdUpdateResult = await r.table("sys_list").filter({ "feedId": feedId }).update({ "feedId": newFeedId });
			feedIdUpdateResult = await r.table("sys_shape").filter({ "feedId": feedId }).update({ "feedId": newFeedId });
            
			feedIdUpdateResult = await r.table("sys_orgIntegration").filter({ "intId": feedId }).update({ "intId": newFeedId });
			feedIdUpdateResult = await r.table("sys_roleIntegration").filter({ "intId": feedId }).update({ "intId": newFeedId });
		}

		const orgInts = await r.table("sys_orgIntegration").filter({ "orgId": newAresSecOrg });
		for(const orgInt of orgInts) {
			const orgIntDeleteResult = await r.table("sys_orgIntegration").get(orgInt.id).delete();
		    orgInt.id = orgInt.id.replace(aresSecOrg, newAresSecOrg);
			const orgIntInsertResult = await r.table("sys_orgIntegration").insert(orgInt);
		}

		const roleInts = await r.table("sys_roleIntegration").filter({ "feedOwnerOrg": newAresSecOrg });
		for(const roleInt of roleInts) {
		    const newOrgIntId = roleInt.orgIntId.replace(aresSecOrg, newAresSecOrg);
			const roleIntUpdateResult = await r.table("sys_roleIntegration").get(roleInt.id).update({ "orgIntId": newOrgIntId });
		}


		return {
			"success": true
		};
	} catch (err) {
		console.log("There was an error with uniquify-defaults script: ", err);
		return {
			"success": false,
			err
		};
	}
};