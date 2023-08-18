import {
	cameraService,
	associationService,
	listService,
	listCategoryService,
	activityService,
	attachmentService,
	eventService,
	feedService,
	restClient,
	realtimeClient,
	ruleService,
	facilityService,
	linkedEntitiesService
} from "client-app-core";

import { unsubscribeFromFeed, addSubscriber } from "../Actions";
import {
	addContext,
	updateContext
} from "../Actions";

import * as t from "./actionTypes";
import _ from "lodash";

const subscriptionDataReceived = (
	contextId,
	data,
	subscriptionId,
	iterable = true,
	splitGeo = false
) => {
	return {
		type: t.SUBSCRIPTION_DATA_RECEIVED,
		payload: {
			contextId,
			data,
			subscriptionId,
			iterable,
			splitGeo
		}
	};
};

export const subscriptionDataBatchReceived = (
	contextId,
	data,
	subscriptionId,
	iterable = true,
	splitGeo = false
) => {
	return {
		type: t.SUBSCRIPTION_DATA_BATCH_RECEIVED,
		payload: {
			contextId,
			data,
			subscriptionId,
			iterable,
			splitGeo
		}
	};
};

export const subscriptionDataRemoved = (
	contextId,
	dataId,
	subscriptionId,
	iterable = true
) => {
	return {
		type: t.SUBSCRIPTION_DATA_REMOVED,
		payload: {
			contextId,
			dataId,
			subscriptionId,
			iterable
		}
	};
};

const subscriptionDataUpdated = (
	contextId,
	data,
	subscriptionId,
	iterable = true,
	splitGeo = false
) => {
	return {
		type: t.SUBSCRIPTION_DATA_UPDATED,
		payload: {
			contextId,
			data,
			subscriptionId,
			iterable,
			splitGeo
		}
	};
};

// Exported to be used for setting blank entity stream
export const subscriptionReceived = (
	contextId,
	subscription,
	subscriptionId,
	subscriberRef
) => {
	return {
		type: t.SET_SUBSCRIPTION,
		payload: {
			contextId,
			subscription,
			subscriptionId,
			subscriberRef
		}
	};
};

/**
 * Start a Camera Stream
 * @param: contextId -- Id of Camera you would like to stream
 * @param: videoProfile -- object with unsubscribe function
 * @param: subscriberRef -- reference to component that is using feed
 */
export const startLiveCameraStream = (
	contextId,
	videoProfile,
	subscriberRef
) => {
	return dispatch => {
		cameraService
			.streamVideo(contextId, videoProfile, (err, response) => {
				if (err) {
					console.log(err);
				} else {
					dispatch(
						subscriptionDataReceived(contextId, response, "liveCamera", false)
					);
				}
			})
			.then(subscription => {
				dispatch(
					subscriptionReceived(
						contextId,
						subscription.channel,
						"liveCamera",
						subscriberRef
					)
				);
			});
	};
};


/**
 * Start a list Stream
 * @param: eventId -- Id of Event you would like to stream lists from
 * @param: subscriberRef -- reference to component that is using feed
 */
export const startListStream = (eventId, subscriberRef) => {
	return dispatch => {
		eventService
			.streamLists(eventId, { expandRefs: true }, (err, response) => {
				if (err) {
					console.log(err);
				} else {
					if (response.code) {
						console.log(`Error code: ${response.code} - ${response.message}`);
					} else {
						if (response.type === "remove") {
							dispatch(
								subscriptionDataRemoved(eventId, response.old_val.id, "lists")
							);
						} else if (response.type === "change") {
							dispatch(
								subscriptionDataUpdated(eventId, response.new_val, "lists")
							);
						} else {
							dispatch(
								subscriptionDataReceived(eventId, response.new_val, "lists")
							);
						}
					}
				}
			})
			.then(subscription => {
				dispatch(
					subscriptionReceived(
						eventId,
						subscription.channel,
						"lists",
						subscriberRef
					)
				);
			});
	};
};

/**
 * Start an Activity Stream
 * @param: id -- Id of entity you would like to get Activities for
 * @param: targetType -- entityType of the entity you would like to get Activities for. (ex. "camera")
 * @param: contextId -- Id of entity that owns or is starting subscription
 * @param: subscriberRef -- reference to component that is using feed
 */
export const startActivityStream = (id, targetType, subscriberRef) => {
	return dispatch => {
		activityService
			.subscribeByTarget(id, targetType, (err, response) => {
				if (err) {
					console.log(err);
				} else {
					dispatch(
						subscriptionDataReceived(id, response.new_val, "activities")
					);
				}
			})
			.then(subscription => {
				dispatch(
					subscriptionReceived(
						id,
						subscription.channel,
						"activities",
						subscriberRef
					)
				);
			});
	};
};

/**
 * Start an Activity Stream for an Event
 * @param: id -- Id of entity you would like to get Activities for
 * @param: contextId -- Id of entity that owns or is starting subscription
 * @param: subscriberRef -- reference to component that is using feed
 */
export const startEventActivityStream = (
	eventId,
	subscriberRef,
	amount = 5
) => {
	return dispatch => {
		activityService
			.subscribeByEvent(eventId, "event", amount, (err, response) => {
				if (err) {
					console.log(err);
				} else {
					dispatch(
						subscriptionDataReceived(eventId, response.new_val, "activities")
					);
				}
			})
			.then(subscription => {
				dispatch(
					subscriptionReceived(
						eventId,
						subscription.channel,
						"activities",
						subscriberRef
					)
				);
			});
	};
};

/*
 * Start an Attachment Stream
 * @param: id -- Id of entity you would like to get Attachments for
 * @param: entityType -- entityType of the entity you would like to get Attachments for
 * @param: contextId -- Id of entity that owns or is starting subscription
 * @param: subscriberRef -- reference to component that is using feed
 */
export const startAttachmentStream = (id, subscriberRef) => {
	return dispatch => {
		attachmentService
			.subscribeByTarget(id, (err, response) => {
				if (err) {
					console.log(err);
				}
				if (!response) return;
				switch (response.type) {
					case "initial":
					case "add":
					case "change": {
						dispatch(
							subscriptionDataReceived(id, response.new_val, "attachments")
						);
						break;
					}
					case "remove":
						dispatch(
							subscriptionDataRemoved(id, response.old_val.id, "attachments")
						);
						break;

					default:
						break;
				}
			})
			.then(subscription => {
				dispatch(
					subscriptionReceived(
						id,
						subscription.channel,
						"attachments",
						subscriberRef
					)
				);
			});
	};
};

export const startEventPinnedItemsStream = (eventId, subscriberRef) => {
	return dispatch => {
		eventService
			.subscribeEventPinnedItems(eventId, (err, response) => {
				if (err || response.err) {
					console.log(response.err);
				} else if (response.changes) {
					response.changes.forEach(update => {
						const item = update.new_val;

						if (
							item &&
							(update.type === "add" ||
								update.type === "initial" ||
								update.type === "change")
						) {
							dispatch(subscriptionDataReceived(eventId, item, "pinnedItems"));
						} else if (update.type === "remove") {
							dispatch(
								subscriptionDataRemoved(
									eventId,
									update.old_val.id,
									"pinnedItems"
								)
							);
						}
					});
				}
			})
			.then(subscription => {
				dispatch(
					subscriptionReceived(
						eventId,
						subscription.channel,
						"pinnedItems",
						subscriberRef
					)
				);
			});
	};
};

/**
 * Stream cameras associated with an event. This includes:
 * 	- Cameras pinned to event
 * 	- Cameras that include the event in their FOV
 * @param {string} eventId 
 */
export const startEventCameraStream = (eventId, subscriberRef) => {
	return dispatch => {
		eventService.subscribeEventCameras(eventId, (err, res) => {
			if (err) console.log(err);
			else {
				res.changes.forEach(change => {
					switch (change.type) {
						case "initial":
						case "add":
						case "change":
							dispatch(
								subscriptionDataReceived(eventId, change.new_val, "eventCameras")
							);
							break;
						case "remove":
							dispatch(
								subscriptionDataRemoved(
									eventId,
									change.old_val.id,
									"eventCameras"
								)
							);
							break;
						default:
							break;
					}
				});
			}
		}).then(subscription => {
			dispatch(
				subscriptionReceived(
					eventId,
					subscription.channel,
					"eventCameras",
					subscriberRef
				)
			);
		});
	};
};

/**
 * Stream cameras associated with a facility's floorplan. This includes:
 * 	- Cameras attached to a floorplan
 * @param {string} facilityId
 * @param {string} floorPlanId
 */
export const startFloorPlanCameraStream = (facilityId, floorPlanId, subscriberRef) => {
	return dispatch => {
		facilityService.streamFloorplanCameras(facilityId, floorPlanId, (err, res) => {
			if (err) console.log(err);
			else {
				res.forEach(change => {
					switch(change.type) {
						case "initial":
						case "add":
						case "change":
							dispatch(
								subscriptionDataBatchReceived(facilityId, [change.new_val], "floorPlanCameras")
							);
							break;
						case "remove":
							dispatch(
								subscriptionDataRemoved(
									facilityId,
									change.old_val.id,
									"floorPlanCameras"
								)
							);
							break;
						default:
							break;
					}
				});
			}
		}).then(subscription => {
			dispatch(
				subscriptionReceived(
					facilityId,
					subscription.channel,
					"floorPlanCameras",
					subscriberRef
				)
			);
		});
	};
};

/**
 * Stream accessPoints associated with a facility's floorplan. This includes:
 * 	- Access Points attached to a floorplan
 * @param {string} facilityId
 * @param {string} floorPlanId
 */
export const startFloorPlanAccessPointsStream = (facilityId, floorPlanId, subscriberRef) => {
	return dispatch => {
		facilityService.streamFloorplanAccessPoints(facilityId, floorPlanId, (err, res) => {
			if (err) console.log(err);
			else {
				res.forEach(change => {
					switch(change.type) {
						case "initial":
						case "add":
						case "change":
							dispatch(
								subscriptionDataBatchReceived(facilityId, [change.new_val], "floorPlanAccessPoints")
							);
							break;
						case "remove":
							dispatch(
								subscriptionDataRemoved(
									facilityId,
									change.old_val.id,
									"floorPlanAccessPoints"
								)
							);
							break;
						default:
							break;
					}
				});
			}
		}).then(subscription => {
			dispatch(
				subscriptionReceived(
					facilityId,
					subscription.channel,
					"floorPlanAccessPoints",
					subscriberRef
				)
			);
		});
	};
};

export const startCamerasLinkedItemsStream = (contextId, subscriberRef) => {
	return (dispatch, getState) => {
		linkedEntitiesService.subscribeLinkedEntities(contextId, "camera", null, (err, response) => {
			if (err) {
				console.log("ERR", err);
			} else if (response.message) {
				console.log("Error: ", response.message);
			} else {
				console.log("response: ", response);
				response
					.filter(r => !!r)
					.forEach(r => {
						switch (r.type) {
							case "initial":
							case "add":
							case "change":
								dispatch(
									subscriptionDataReceived(contextId, r.new_val, "linkedEntities")
								);
								break;
							case "remove":
								dispatch(
									subscriptionDataRemoved(
										contextId,
										r.old_val.id,
										"linkedEntities"
									)
								);
								break;
							default:
								break;
						}
					});
			}
		}).then(subscription => {
			dispatch(
				subscriptionReceived(
					contextId,
					subscription.channel,
					"linkedEntities",
					subscriberRef
				)
			);
		});
	};
};
// Stream Items in FOV, called by method below
const getItemsInFOV = (contextId, subscriberRef, poly) => {
	return (dispatch, getState) => {
		const state = getState();
		eventService
			.subscribeActiveEvents(poly.entityData.geometry, (err, response) => {
				if (err) {
					console.log("ERR", err);
				} else {
					response
						.filter(r => !!r)
						.forEach(r => {
							switch (r.type) {
								case "initial":
								case "add":
								case "change":
									dispatch(
										subscriptionDataReceived(contextId, r.new_val, "fovEvents")
									);
									break;
								case "remove":
									dispatch(
										subscriptionDataRemoved(
											contextId,
											r.old_val.id,
											"fovEvents"
										)
									);
									break;
								default:
									break;
							}
						});
				}
			})
			.then(subscription => {
				dispatch(
					subscriptionReceived(
						contextId,
						subscription.channel,
						"fovEvents",
						subscriberRef
					)
				);
			});
		const integrations = state.session.user.profile.integrations.filter(
			int => int.config.canView
		);
		integrations.forEach(int => {
			feedService
				.subscribeFilteredFeed(
					int.source === "app" ? "system" : "external",
					int.feedId,
					{
						expandRefs: false,
						inclusionGeo: poly.entityData.geometry
					},
					(err, response) => {
						if (err) {
							console.log(err);
						} else {
							if (response.ignoreBatches) {
								switch (response.change.type) {
									case "add":
									case "initial":
									case "change":
										dispatch(
											subscriptionDataReceived(
												contextId,
												response.change.new_val,
												"fovItems"
											)
										);
										break;

									case "remove":
										dispatch(
											subscriptionDataRemoved(
												contextId,
												response.change.old_val.id,
												"fovItems"
											)
										);
										break;
									default:
										break;
								}
							} else {
								if (!["all-data", "globalGeo", "globalData"].includes(response.batch)) return;
								const initial = response.changes
									.filter(change => {
										return change.type === "initial";
									})
									.map(change => {
										return change.new_val;
									});

								const changes = response.changes
									.filter(change => {
										return change.type === "change";
									})
									.map(change => {
										return change.new_val;
									});

								const additions = response.changes
									.filter(change => {
										return change.type === "add";
									})
									.map(change => {
										return change.new_val;
									});

								const removals = response.changes
									.filter(change => {
										return change.type === "remove";
									})
									.map(change => {
										return change.old_val.id;
									});

								if (removals.length) {
									_.each(removals, id =>
										dispatch(subscriptionDataRemoved(contextId, id, "fovItems"))
									);
								}
								if (initial.length) {
									dispatch(
										subscriptionDataBatchReceived(
											contextId,
											initial,
											"fovItems"
										)
									);
								}
								if (changes.length) {
									_.each(changes, change =>
										dispatch(
											subscriptionDataUpdated(contextId, change, "fovItems")
										)
									);
								}
								if (additions.length) {
									_.each(additions, addition =>
										dispatch(
											subscriptionDataReceived(contextId, addition, "fovItems")
										)
									);
								}
							}
						}
					},
					true, // ignoreBatches,
					[contextId] // excludeEntities -- Do not include camera in its own FOV item stream
				)
				.then(subscription => {
					dispatch(
						subscriptionReceived(
							contextId,
							subscription.channel,
							"fovItems",
							subscriberRef
						)
					);
				});
		});
	};
};

// Stream FOV
export const startFOVItemStream = (contextId, subscriberRef) => {
	return (dispatch, getState) => {
		Promise.resolve(
			cameraService.streamFOVs([contextId], (err, response) => {
				if (err) {
					console.log(err);
				} else {
					let poly;
					// False is passed in order to override iterable default
					switch (response.type) {
						case "initial-batch":
							poly = response.changes[0];
							dispatch(subscriptionDataReceived(contextId, poly, "fov", false));

							break;
						case "change":
							poly = response.new_val;

							// Remove old FOV Item subscription
							dispatch(
								unsubscribeFromFeed(contextId, "fovItems", subscriberRef)
							);

							if (poly) {
								dispatch(
									subscriptionDataReceived(contextId, poly, "fov", false)
								);
							}
							break;
						default:
							break;
					}
					if (poly) {
						dispatch(getItemsInFOV(contextId, subscriberRef, poly));
					}
				}
			})
		).then(subscription => {
			dispatch(
				subscriptionReceived(
					contextId,
					subscription.channel,
					"fov",
					subscriberRef
				)
			);
		});
	};
};

/*
 * Start a stream of camera objects that are in range
 */
export const startCamerasInRangeStream = (
	contextId,
	entityType,
	subscriberRef
) => {
	return dispatch => {
		associationService
			.streamCameraAssociations(contextId, entityType, "entity", (err, response) => {
				if (err) console.log(err);
				else {
					if (response.add) {
						dispatch(
							subscriptionDataBatchReceived(
								contextId,
								response.add,
								"camerasInRange"
							)
						);
					} else if (response.remove) {
						response.remove.forEach(item => {
							dispatch(
								subscriptionDataRemoved(
									contextId,
									item.id,
									"camerasInRange"
								)
							);
						});
					} else if (response.update) {
						response.update.forEach(update => {
							dispatch(
								subscriptionDataUpdated(
									contextId,
									update,
									"camerasInRange",
									false
								)
							);
						});
					}
				}
			})
			.then(subscription => {
				dispatch(
					subscriptionReceived(
						contextId,
						subscription.channel,
						"camerasInRange",
						subscriberRef
					)
				);
			});
	};
};

/*
 * Start a stream of camera video for a single camera that is in range (Cameras Widget)
 */
export const startCameraInRangeVideoStream = (
	contextId,
	cameraId,
	videoProfile,
	subscriberRef
) => {
	return dispatch => {
		cameraService
			.streamVideo(cameraId, videoProfile, (err, response) => {
				if (err) console.log(err);
				else {
					dispatch(
						subscriptionDataReceived(
							contextId,
							response,
							"cameraInRangeVideo",
							false
						)
					);
				}
			})
			.then(subscription => {
				dispatch(
					subscriptionReceived(
						contextId,
						subscription.channel,
						"cameraInRangeVideo",
						subscriberRef
					)
				);
			});
	};
};

export const startTrackHistoryStream = (contextEntity, subscriberRef, duration, forReplay) => {
	return dispatch => {
		if (forReplay) {
			dispatch(
				subscriptionDataBatchReceived(
					contextEntity.id,
					[],
					"trackHistory",
					false
				)
			);

		} else {
			const now = new Date();
			const startTime = new Date();
			startTime.setMinutes(now.getMinutes() - duration);

			const body = {
				fields: {
					entities: [{ id: contextEntity.id, entityType: contextEntity.entityType, feedId: contextEntity.feedId }],
					startDate: startTime,
					endDate: now,
					duration: duration
				}
			};

			restClient.exec_post(
				"/ecosystem/api/ecolink/track-history",
				JSON.stringify(body),
				(err, result) => {
					if (err) console.log(err);
					else {
						const { data } = result;
						// Exit if no data to return
						// This needs better error handling
						if (!data || !Array.isArray(data[0].groups)) {
							return;
						}
						const { groups } = data[0];
						const rowArray = [];
						if (groups.length > 0) {
							const { rows } = groups[0];
							rows.forEach(row => {
								rowArray.push({
									entityData: {
										geometry: { coordinates: [row.lng, row.lat], type: "Point" },
										properties: { ...row, id: groups[0].id }
									}
								});
							});
						}
						Promise.resolve(
							dispatch(
								subscriptionDataBatchReceived(
									contextEntity.id,
									rowArray,
									"trackHistory",
									false
								)
							)
						)
							.then(subscription => {
								dispatch(
									subscriptionReceived(
										contextEntity.id,
										null,
										"trackHistory",
										subscriberRef
									)
								);

								// subscribe to entity stream to get updates for track history
								feedService
									.streamEntityByType(contextEntity.id, "track", (err, response) => {
										if (err) console.log(err);
										else {
											if (!response) return;
											switch (response.type) {
												case "initial":
													// Add context to state
													dispatch(addContext(contextEntity.id, response.new_val));
													break;
												case "change":
													// Update context entity data (ie updated track details)
													dispatch(updateContext(contextEntity.id, response.new_val));
													break;
												default:
													break;
											}
										}
									})
									.then(subscription => {
										// Set feed subscription
										dispatch(
											subscriptionReceived(
												contextEntity.id,
												subscription.channel,
												"entity",
												subscriberRef
											)
										);
									});
							})
							.then(() => {
								dispatch(addSubscriber(contextEntity.id, "trackHistory", "map"));
							});
					}
				}
			);
		}
		
	};
};

export const startRulesStream = (entityId, subscriberRef) => {
	return dispatch => {
		ruleService
			.streamRules(entityId, (err, res) => {
				if (err) console.log(err);
				else if (!res) {
					return;
				} else {
					const rule = res.new_val;

					// Ensure rule was added to state before attempting to remove it
					if (rule.deleted === true && res.old_val) {
						dispatch(
							subscriptionDataRemoved(entityId, res.old_val.id, "rules")
						);
					} else if (!rule.deleted) {
						dispatch(subscriptionDataReceived(entityId, rule, "rules"));
					}
				}
			})
			.then(subscription => {
				dispatch(
					subscriptionReceived(
						entityId,
						subscription.channel,
						"rules",
						subscriberRef
					)
				);
			});
	};
};

export const startProximityEntitiesStream = (contextId, geometry, radiuses, subscriberRef) => {
	return (dispatch, getState) => {
		const state = getState();

		const proximityEntityTypes = ["track", "shapes", "facility", "camera"];
		const integrations = state.session.user.profile.integrations.filter(
			int => int.config.canView && proximityEntityTypes.includes(int.entityType)
		);
		integrations.forEach(int => {
			eventService
				.streamProximityEntities(contextId, int.feedId, geometry, radiuses, (err, response) => {
					if (err) console.log(err);
					if (!response) return;
					switch (response.type) {
						case "initial-batch":
							dispatch(
								subscriptionDataBatchReceived(contextId, response.changes, "proximityEntities")
							);
							break;

						case "add":
						case "change":
							if (response.new_val) {
								dispatch(
									subscriptionDataReceived(contextId, response.new_val, "proximityEntities")
								);
							}
							break;

						case "remove":
							dispatch(
								subscriptionDataRemoved(contextId, response.old_val.id, "proximityEntities")
							);
							break;
						default:
							break;
					}
				})
				.then(subscription => {
					dispatch(
						subscriptionReceived(
							contextId,
							subscription.channel,
							"proximityEntities",
							subscriberRef
						)
					);
				});
		});
	};
};

// This method is used by action creators to unsubscribe from contextual data subscriptions
// Since it is being wrapped in dispatch, in order to return a function, it must have dispatch also.
// But, because it returns a dispatch, it must be passed down via a Redux container.
export const unsubscribe = channel => {
	return dispatch => {
		realtimeClient
			._unsubscribe(channel)
			.then(data => console.log("Unsubscribed from channel: " + channel, data));
	};
};

// This method does the same thing as the above method, but it is able to be imported directly into
// any file and called like a regular function. This is used mainly for camera streams at the moment,
// and solves the issue of having to pass down the unsubscribe function multiple levels for no reason.
export const simpleUnsub = channel => {
	realtimeClient
		._unsubscribe(channel)
		.then(data => console.log("Unsubscribed from channel*: " + channel, data));
};
