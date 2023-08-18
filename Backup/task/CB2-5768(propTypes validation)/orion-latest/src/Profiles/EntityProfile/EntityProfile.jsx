import React, { useEffect, useState } from "react";
import { withSpan, captureUserInteraction } from "../../Apm";
import { associationService, restClient, integrationService } from "client-app-core";

// components
import { Dialog } from "../../CBComponents";
import FileWidget from "../Widgets/File/FileWidget";
import RulesWidget from "../Widgets/Rules/RulesWidget";
import EntityDelete from "./components/EntityDelete";
import EntityShare from "./components/EntityShare";
import ShapeAssociation from "./components/ShapeAssociation";
import CamerasWidget from "../Widgets/Cameras/CamerasWidget";
import DetailsWidget from "../Widgets/Details/DetailsWidget"; // get action
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import AlertWidget from "../Widgets/Alert/AlertWidget";
import PinToDialog from "../../SharedComponents/PinToDialog";
import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import ImageViewer from "../../SharedComponents/ImageViewer";
import MarineTrafficParticularsWidget from "../Widgets/MarineTrafficParticulars/MarineTrafficParticularsWidget";
import Activities from "../Widgets/Activities/Activities";
import DroneAssociation from "../Widgets/DroneAssociation/DroneAssociation";

// error boundary
import ErrorBoundary from "../../ErrorBoundary";

// utility
import $ from "jquery";
import { Translate, getTranslation } from "orion-components/i18n";

import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { collectionsSelector, feedInfoSelector } from "orion-components/GlobalData/Selectors";
import { widgetStateSelector, trackHistoryDuration } from "orion-components/AppState/Selectors";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

//actions
import {
	unsubscribeFromFeed,
	startAttachmentStream,
	startActivityStream,
	startCamerasInRangeStream,
	startTrackHistoryStream,
	startRulesStream,
	removeSubscriber
} from "orion-components/ContextualData/Actions";
import { closeNotification } from "orion-components/Dock/Actions/index.js";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import { ignoreEntity } from "orion-components/GlobalData/Actions";
import { setMapTools } from "orion-components/Map/Tools/Actions";
import {
	deleteShape,
	addRemoveFromCollections,
	addRemoveFromEvents,
	createCollection,
	unlinkEntities,
	shareEntityToOrg,
	unshareEntityToOrg
} from "../../SharedActions/entityProfileActions";

import { checkPermissionBasedOnFeedId, canManageByApplication } from "orion-components/Profiles/Selectors";
import { entityWidgetConfig } from "orion-components/Profiles/Selectors/EntityProfileSelectors";

const propTypes = {
	locale: PropTypes.string,
	selectFloorPlanOn: PropTypes.func
};

const defaultProps = {
	locale: "en",
	selectFloorPlanOn: () => { }
};

// cSpell:ignore mapstate mapstatus
const EntityProfile = ({ forReplay, appData, readOnly, endDate, selectFloorPlanOn, floorPlansWithFacFeed }) => {
	const dispatch = useDispatch();

	const user = useSelector((state) => state?.session?.user?.profile?.id);
	const appState = useSelector((state) => state?.appState);
	const globalData = useSelector((state) => state?.globalData || {});
	const context = useSelector((state) => selectedContextSelector(state));
	const entity = context?.entity;
	const dialog = entity && appState?.dialog?.openDialog;
	const dialogData = entity && appState?.dialog?.dialogData;
	const trackHistDuration = useSelector((state) => entity && trackHistoryDuration(state));
	const entityType = entity?.entityType;
	const feedId = entity?.feedId;
	const displayProperties = useSelector((state) => entity && feedInfoSelector(feedId)(state)?.displayProperties);
	const profileIconTemplate = useSelector((state) => entity && feedInfoSelector(feedId)(state)?.profileIconTemplate);
	const marineTrafficVisible = useSelector(
		(state) => entity && feedInfoSelector(feedId)(state)?.marineTrafficVisible
	);
	const widgetState = useSelector((state) => entity && widgetStateSelector(state));
	const entityCollections = useSelector((state) => entity && collectionsSelector(state));
	const feedDisplayProps = entity && displayProperties;
	const notifications = entity && globalData.notifications;
	const contextId = entity?.id;
	const dir = useSelector((state) => getDir(state));
	const floorPlansWithFacilityFeed = useSelector((state) =>
		floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null
	);
	const canViewRules =
		!readOnly && useSelector((state) => canManageByApplication(state)("rules-app", "canView", "config"));
	const canManageRules = !readOnly && useSelector((state) => canManageByApplication(state)("rules-app", "manage"));
	const canManageEvents = useSelector((state) => canManageByApplication(state)("events-app", "manage"));
	const canPinToCollections = useSelector((state) => canManageByApplication(state)("map-app", "manage"));
	const canAccess =
		!readOnly && useSelector((state) => checkPermissionBasedOnFeedId(state)(entity?.feedId, "config"));
	const canManage =
		!readOnly &&
		useSelector((state) => checkPermissionBasedOnFeedId(state)(entity?.feedId, "permissions", "manage"));
	const canDeleteFiles =
		!readOnly &&
		useSelector((state) =>
			entityType !== "track" ? canManage : canManageByApplication(state)("map-app", "manage")
		);

	const [layoutControlsOpen, setLayoutControlsOpen] = useState(false);
	const [scrolledUp, setScrolledUp] = useState(false);
	const [hiding, setHiding] = useState(false);
	const [zetronPhoneVisible, setZetronPhoneVisible] = useState(false);
	const [anchorEl, setAnchorEL] = useState(null);
	const [marineTrafficVesselData, setMarineTrafficVesselData] = useState(null);
	const [widgets, setWidgets] = useState([]);
	const { orgId } = user ?? {};
	const { attachments, rules } = context ?? {};
	const { entityData } = entity ?? {};
	const { properties, geometry } = entityData ?? {};
	const { name, description, type, subtype } = properties ?? {};
	const isMarker = context && entityType === "shapes" && type === "Point";

	const imageAttachments =
		attachments?.filter((attachment) => {
			return /(jpg)|(png)|(jpeg)|(gif)|(svg)/.exec(attachment?.mimeType);
		}) || [];

	useEffect(() => {
		if (marineTrafficVisible) {
			integrationService.getExternalSystemLookup(
				"marine-traffic",
				entity.entityType,
				(err, response) => {
					if (err) console.log("ERROR", err);
					if (!response) return;
					const { data } = response;
					// if error returned will be undefined
					setMarineTrafficVesselData(data);
				},
				`sourceId=${entity.sourceId}&targetId=${entity.id}&targetType=${entity.entityType}`
			);
		} else {
			setWidgets(getWidgetConfig);
		}

		const serviceCallBackExternalSystem = (err, response) => {
			if (err) {
				if (!zetronPhoneVisible) {
					setZetronPhoneVisible(false);
				}
			} else {
				if (response.clientInstalled) {
					setZetronPhoneVisible(true);
				}
			}
		};

		if (contextId) {
			if (!forReplay) {
				dispatch(startActivityStream(contextId, entityType, "profile"));
				dispatch(startAttachmentStream(contextId, "profile"));
				dispatch(startCamerasInRangeStream(contextId, entityType, "profile"));
				dispatch(startRulesStream(contextId, "profile"));

				const { entityData, feedId } = context.entity;

				if (
					entityType === "track" &&
					feedId === "zetron" &&
					entityData &&
					entityData.properties &&
					entityData.properties.subtype &&
					entityData.properties.subtype.toLowerCase() === "zetron"
				) {
					/* Note:
						Suppose to get externalSystems [] from redux state (e.g. state.session.organization.externalSystems)
						but different apps profileContainer needs to be modified in order to pass it as props.
						therefore here fetching directly to avoid modifying multiple apps profile container.
					*/

					integrationService.getExternalSystem("zetron", (errExt, responseExt) => {
						if (errExt) {
							console.log("An error has occurred to check external system is available to user.");
						} else {
							if (responseExt && responseExt.externalSystemId) {
								integrationService.getExternalSystemLookup(
									"zetron",
									"serviceAvailableToUser",
									serviceCallBackExternalSystem
								);
							}
						}
					});
				}
			} else {
				// do we need to do something else here, or leave it up to the widgets to pull in the static data
			}
		}
	}, []);

	useEffect(() => {
		setWidgets(getWidgetConfig);
	}, [marineTrafficVesselData]);

	useEffect(() => {
		handleScroll();
	}, [scrolledUp]);

	const handleInitiateRadioCall = (radioUnitId) => {
		const dataToPost = { radioUnitId: radioUnitId };

		if (radioUnitId) {
			//post example: https://192.168.66.134/integration-app/api/externalSystem/zetron/resource/callRadio
			restClient.exec_post(
				"/integration-app/api/externalSystem/zetron/resource/callRadio",
				dataToPost,
				function (err, response) {
					//Note : At present we just fire and forget and incase of error display standard error message in console.
					if (err) {
						console.log("An error has occurred sending command to zetron interface.", err, response);
					}
				}
			);
		}
	};

	const handleScroll = () => {
		$(".cb-profile-wrapper").on("resize scroll", () => {
			const elementTop = $(".summary-wrapper").offset().top;
			const elementBottom = elementTop + $(".summary-wrapper").outerHeight() + 120; // offset for app/navigation bar
			const viewportTop = $(".cb-profile-wrapper").scrollTop();
			const profileHeight = $(".cb-profile-wrapper").height();
			const viewportBottom = viewportTop + $(".cb-profile-wrapper").height();
			const widgetsHeight = $(".widgets-container").height();
			const scrollLength = viewportBottom - elementBottom;
			const pctScrolled = Math.floor((viewportTop / scrollLength) * 100); // gets percentage scrolled
			if (!scrolledUp && pctScrolled > 1 && widgetsHeight > profileHeight - 66) {
				setScrolledUp(true);
			} else if (scrolledUp && pctScrolled < 2) {
				setScrolledUp(false);
			}
		});
	};

	const toggleTrackHistory = () => {
		if (context.trackHistory) {
			captureUserInteraction("EntityProfile Track History On");
			dispatch(removeSubscriber(contextId, "trackHistory", "map"));
			dispatch(unsubscribeFromFeed(contextId, "trackHistory", "profile", forReplay));
		} else {
			dispatch(startTrackHistoryStream(context.entity, "profile", trackHistDuration, forReplay));
		}
	};

	//this function is not called anywhere
	//const handleCloseEntityProfile = () => {
	//	hideInfo();
	//	updateViewingHistory([]);
	//};

	const handleEditLayout = (event) => {
		event.preventDefault();
		setLayoutControlsOpen(true);
		setAnchorEL(event.currentTarget);
	};

	const handleCloseEditLayout = () => {
		setLayoutControlsOpen(false);
	};

	const handleExpand = () => {
		setScrolledUp(false);
		$(".cb-profile-wrapper").scrollTop(0);
	};

	const handleShareClick = (entity) => {
		entity.isPublic ? dispatch(unshareEntityToOrg(entity.id)) : dispatch(shareEntityToOrg(entity.id));

		dispatch(closeDialog("shareEntityDialog"));
	};

	const getWidgetConfig = useSelector((state) =>
		entityWidgetConfig(state)(context, feedId, marineTrafficVesselData, marineTrafficVisible)
	);

	const getWidgetStatus = (widgetId) => {
		const widgetConfig = getWidgetConfig;
		const widget = widgetConfig.find((widget, index) => {
			widget.index = index;
			return widget.id === widgetId;
		});

		return widget;
	};

	/**
	 * Check association before opening a dialog, throwing an error or failed association dialog if entity is associated
	 * @param {string} dialogId -- Id of dialog you'd like to open if association checks are passed
	 * @param {string} associationAction -- "delete" or "unshare"
	 */
	const openDialogWithAssociation = (dialogId, associationAction) => {
		associationService.checkAssociations(contextId, (err, response) => {
			if (err || response.error) {
				dispatch(
					openDialog(
						"entity-profile-error",
						getTranslation("global.profiles.entityProfile.main.problemOccurred")
					)
				);
			} else if (response) {
				if (response.hasAssociations) {
					// Passing an action along so dialog knows what text to render
					dispatch(
						openDialog("shape-association", {
							...response,
							action: associationAction
						})
					);
				} else {
					dispatch(openDialog(dialogId));
				}
			}
		});
	};

	const summaryWidgetActions = () => {
		let actions = [];

		if (zetronPhoneVisible) {
			actions = [
				...actions,
				{
					name: getTranslation("global.profiles.entityProfile.main.tetraRadioCall"),
					nameText: "Zetron Call",
					action: () => handleInitiateRadioCall(properties.radioUnitId)
				}
			];
		}

		actions = [
			...actions,
			{
				name: getTranslation("global.profiles.entityProfile.main.trackHistory"),
				nameText: "Track History",
				action: () => toggleTrackHistory(contextId)
			},
			{
				name: getTranslation("global.profiles.entityProfile.main.pinTo"),
				nameText: "Pin To",
				action: () => dispatch(openDialog("pinToDialog"))
			}
		];
		if (canManage) {
			actions = [
				...actions,
				{
					name: getTranslation("global.profiles.entityProfile.main.edit"),
					nameText: "Edit",
					action: () =>
						dispatch(
							setMapTools({
								type: "drawing",
								mode: geometry.type === "Point" ? "simple_select" : "direct_select",
								feature: { id: contextId, ...entity.entityData }
							})
						)
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.delete"),
					nameText: "Delete",
					action: () => openDialogWithAssociation("shapeDeleteDialog", "delete")
				}
			];
		}
		actions = [
			...actions,
			{
				name: getTranslation("global.profiles.entityProfile.main.hide"),
				nameText: "Hide",
				action: () => {
					if (context.trackHistory && rules.length === 0) {
						// If track history is on, toggle it off before removing
						toggleTrackHistory(contextId);
					}
					if (rules.length === 0) {
						setHiding(true);
						dispatch(ignoreEntity(contextId, entityType, feedId, appData));
					} else {
						openDialogWithAssociation("shapeHideDialog", "hide");
					}
				},
				debounce: hiding
			}
		];
		return actions;
	};
	const widgetRenderFilters = {
		details: !feedDisplayProps,
		marineTrafficParticulars: !marineTrafficVesselData,
		alerts: !notifications,
		rules: !canViewRules && isMarker
	};

	const renderWidgets = (widgetName) => {
		switch (widgetName) {
			case "details":
				return (
					<DetailsWidget
						id={widgetName}
						key={`${contextId}-details`}
						details={properties}
						displayProps={feedDisplayProps}
					/>
				);
			case "marineTrafficParticulars":
				return (
					<MarineTrafficParticularsWidget id={widgetName} entity={entity} data={marineTrafficVesselData} />
				);
			case "cameras":
				return (
					<CamerasWidget
						id={widgetName}
						key={`${contextId}-cameras`}
						canLink={canManage}
						selectFloorPlanOn={selectFloorPlanOn}
						floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
						unlinkCameras={unlinkEntities}
						contextId={contextId}
						unsubscribeFromFeed={unsubscribeFromFeed}
						subscriberRef="profile"
						readOnly={readOnly}
						disableSlew={readOnly}
						user={user}
					/>
				);
			case "alerts":
				return (
					<AlertWidget
						id={widgetName}
						key={`${contextId}-alerts`}
						contextId={contextId}
						notifications={notifications}
						closeNotification={closeNotification}
					/>
				);
			case "activities":
				return (
					<Activities
						id={widgetName}
						key={`${contextId}-activities`}
						pageSize={5}
						canManage={canAccess}
						contextId={contextId}
						subscriberRef="profile"
						readOnly={readOnly}
						forReplay={forReplay}
						endDate={endDate}
					/>
				);
			case "files":
				return (
					<FileWidget
						id={widgetName}
						key={`${contextId}-files`}
						canDelete={canDeleteFiles}
						hasAccess={canAccess}
						contextId={contextId}
						subscriberRef="profile"
					/>
				);
			case "rules":
				return (
					<RulesWidget
						id={widgetName}
						key={`${contextId}-rules`}
						canManage={canManageRules}
						canViewRules={canViewRules}
						contextId={contextId}
						context={context}
						entityType={entityType}
						rules={rules}
						collections={entityCollections}
						hasLinks={true}
						orgId={orgId}
						subscriberRef="profile"
					/>
				);
			case "drone-association":
				return (
					<DroneAssociation
						id={widgetName}
						key={`${contextId}-drone-association`}
						context={context}
					/>
				);
			default:
				return null;
		}
	};

	if (context) {
		// Height of summary-info (consistent between scrolled and not scrolled state) + padding
		const scrollOffset = scrolledUp ? 167 : 0;
		// Dynamic offset for widget container when SummaryWidget is collapsed
		const widgetsContainerStyle = {
			top: scrollOffset
		};

		return (
			<div className="cb-profile-wrapper" style={{ height: "100%", overflow: "scroll" }}>
				{!scrolledUp && <ImageViewer images={imageAttachments} dir={dir} />}
				<ErrorBoundary>
					<SummaryWidget
						id={contextId}
						zetronPhoneVisible={zetronPhoneVisible}
						context={context}
						name={name}
						type={subtype ? subtype : type}
						geometry={geometry}
						description={description}
						scrolledUp={scrolledUp}
						handleExpand={handleExpand}
						profileIconTemplate={profileIconTemplate}
						actions={summaryWidgetActions()}
						readOnly={readOnly}
					/>
				</ErrorBoundary>
				{!scrolledUp && (
					<div className="layout-control-button">
						<a className="cb-font-link" onClick={handleEditLayout}>
							<Translate value="global.profiles.entityProfile.main.editLayout" />
						</a>
					</div>
				)}
				<div className="widgets-container" style={widgetsContainerStyle}>
					<ErrorBoundary>
						<LayoutControls
							key={`${contextId}-layout-controls`}
							open={layoutControlsOpen}
							anchor={anchorEl}
							close={handleCloseEditLayout}
							widgetOrder={widgetState?.length > 0 ? widgetState : widgets}
							profile="entity"
						/>
					</ErrorBoundary>
					{(widgetState?.length > 0 ? widgetState : widgets)
						.filter((element) => getWidgetStatus(element.id))
						.map((element) => {
							const { id, enabled } = element;

							if (widgetRenderFilters[id]) {
								return false;
							}
							if (!enabled) {
								return false;
							}
							return <ErrorBoundary key={id}>{renderWidgets(id)}</ErrorBoundary>;
						})}

					<PinToDialog
						close={() => dispatch(closeDialog("pinToDialog"))}
						entity={entity}
						canManageEvents={canManageEvents}
						canPinToCollections={canPinToCollections}
						addRemoveFromCollections={addRemoveFromCollections}
						addRemoveFromEvents={addRemoveFromEvents}
						createCollection={createCollection}
						openDialog={openDialog}
						closeDialog={closeDialog}
						dir={dir}
					/>
				</div>

				<EntityDelete closeDialog={closeDialog} deleteShape={deleteShape} id={contextId} name={name} />
				<EntityShare
					handleClick={() => handleShareClick(entity, orgId)}
					handleClose={() => dispatch(closeDialog("shareEntityDialog"))}
					shared={entity.isPublic}
				/>
				<ShapeAssociation closeDialog={closeDialog} dialogData={dialogData} dir={dir} />
				<Dialog
					key="entity-profile-error"
					open={dialog === "entity-profile-error"}
					confirm={{
						label: getTranslation("global.profiles.entityProfile.main.ok"),
						action: () => {
							dispatch(closeDialog("entity-profile-error"));
						}
					}}
					textContent={dialogData}
					dir={dir}
				/>
			</div>
		);
	} else {
		return <div />;
	}
};

// span instead of transaction
EntityProfile.propTypes = propTypes;
EntityProfile.defaultProps = defaultProps;
export default withSpan("entity-profile", "profile")(EntityProfile);
