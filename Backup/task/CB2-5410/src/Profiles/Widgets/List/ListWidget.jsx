import React, { Fragment, useEffect, useState, useRef, forwardRef } from "react";
import { listService, eventService } from "client-app-core";
import { SearchField, Dialog as CBDialog } from "orion-components/CBComponents";
import { IconButton, CircularProgress, List, SvgIcon } from "@mui/material";
import { default as Expand } from "@mui/icons-material/ZoomOutMap";
import { default as ListCard } from "./components/ListCard";
// Sortable
import { SortableContainer, SortableElement, arrayMove } from "react-sortable-hoc";
import { Translate, getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import reduce from "lodash/reduce";
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import { contextPanelState } from "orion-components/ContextPanel/Selectors";
import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import { getLookupValues } from "orion-components/GlobalData/Actions";
import { getSelectedContextData } from "orion-components/Profiles/Selectors";
import { getGlobalWidgetState } from "../Selectors";
import { mdiCollapseAll, mdiExpandAll } from "@mdi/js";
import WidgetMenu from "./components/WidgetMenu";

const propTypes = {
	locale: PropTypes.string
};
const defaultProps = {
	locale: "en"
};

const widgetName = "list";

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const SortableItem = SortableElement(({ id, passedProps, dir, locale, collapsed, handleCollapseAndExpand }) => {
	return (
		<ListCard
			sortable={true}
			{...passedProps}
			dir={dir}
			locale={locale}
			collapsed={collapsed}
			handleCollapseAndExpand={handleCollapseAndExpand}
			id={id}
		/>
	);
});

const SortableList = SortableContainer(({ key, children }) => {
	return <ul key={key}>{children}</ul>;
});

const ListDialogBody = (props) => {
	if (props.availableLists) {
		const filteredLists = props.searchValue
			? props.availableLists.filter((list) => list.name.toLowerCase().includes(props.searchValue.toLowerCase()))
			: props.availableLists;

		//organize available categories by their ids into an object
		const convertedCategories = reduce(
			props.availableLists,
			(result, list) => {
				result[list.category] = list.categoryRef;
				return result;
			},
			{}
		);

		//determine which categories will have lists in them
		const occupiedCategories = {};
		filteredLists.forEach((list) => {
			if (list.category && !occupiedCategories[list.category] && convertedCategories[list.category]) {
				occupiedCategories[list.category] = convertedCategories[list.category];
			}
		});

		return (
			<Fragment>
				<List key="add-lists-category-section">
					{Object.values(occupiedCategories).map((category) => {
						return (
							<Fragment key={`add-lists-category-${category.id}-fragment`}>
								<p key={`add-lists-category-${category.id}-label`} style={{ color: "#fff" }}>
									{category.name}
								</p>
								<List key={`add-lists-category-${category.id}`}>
									{filteredLists
										.filter((list) => list.category === category.id)
										.map((list) => {
											return (
												<ListCard
													key={`add-lists-list-${list.id}`}
													{...props.getListCardProps(list, props.cardStyles, true, {
														...props,
														filteredLists
													})}
												/>
											);
										})}
								</List>
							</Fragment>
						);
					})}
					<p key={"add-lists-category-unCategorized-label"} style={{ color: "#fff" }}>
						{getTranslation("global.profiles.widgets.list.main.uncategorizedLists")}
					</p>
					<List key={"add-lists-category-unCategorized"}>
						{filteredLists
							.filter((list) => !list.category)
							.map((list) => {
								return (
									<ListCard
										key={`add-lists-list-${list.id}`}
										{...props.getListCardProps(list, props.cardStyles, true, {
											...props,
											filteredLists
										})}
									/>
								);
							})}
					</List>
				</List>
			</Fragment>
		);
	} else if (props.availableListsError) {
		return (
			<p style={{ paddingTop: "20px", textAlign: "center" }}>
				{" "}
				<Translate value="global.profiles.widgets.list.main.noListsAvail" />{" "}
			</p>
		);
	} else {
		return (
			<div style={{ display: "flex", justifyContent: "center" }}>
				<CircularProgress size={60} thickness={5} />
			</div>
		);
	}
};

const ListWidget = (props, ref) => {
	const {
		contextId,
		subscriberRef,
		expanded,
		selectWidget,
		canAddEditLists,
		canRemoveLists,
		updateListCheckbox,
		selected,
		listAccessAndEventsManage,
		id,
		widgetsExpandable
	} = props;
	const dispatch = useDispatch();
	const user = useSelector((state) => state?.session?.user?.profile);
	const entity = useSelector((state) => getSelectedContextData(state)(contextId, "entity"));
	const enabled = useSelector((state) => expanded || getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const locale = useSelector((state) => state?.i18n?.locale);
	const dialog = useSelector((state) => state.appState?.dialog?.openDialog || "");
	const defaultListPagination = useSelector((state) => state?.clientConfig?.defaultListPagination);
	const listPaginationOptions = useSelector((state) => state?.clientConfig?.listPaginationOptions);
	const lookupData = useSelector((state) => state?.globalData?.listLookupData || {});
	const isPrimary = useSelector((state) => entity && contextId === contextPanelState(state).selectedContext.primary);
	const secondaryExpanded = useSelector((state) => contextPanelState(state)?.secondaryExpanded);
	const lists = useSelector((state) => getSelectedContextData(state)(contextId, "lists"), isEqual);
	const widgetState = useSelector((state) => getGlobalWidgetState(state)(widgetName)) || {};
	const [collapsed, setCollapsed] = useState(!widgetState?.autoExpand);
	const [tempCollapsed, setTempCollapsed] = useState(null);
	const [expandedChildren, setExpandedChildren] = useState([]);
	const [triggered, setTriggered] = useState(false);
	const [childKey, setChildKey] = useState(0); //Used for forcibly updating the  card child component when the same collapse value is required to be passed as a prop.

	const [activeCheckboxes, setActiveCheckboxes] = useState([]);
	const [listSearch, setListSearch] = useState("");
	const [availableLists, setAvailableLists] = useState(null);
	const [availableListsError, setAvailableListsError] = useState(false);
	const [addListDisabled, setAddListDisabled] = useState(false);
	const [sortedListsState, setSortedListsState] = useState();

	//const [Error, setError] = useState(false);

	useEffect(() => {
		organizeSortedLists();

		return () => {
			if (!isPrimary && !expanded) {
				dispatch(unsubscribeFromFeed(contextId, "lists", subscriberRef));
			}
		};
	}, []);

	const prevListsRef = useRef(lists);

	useEffect(() => {
		const prevLists = prevListsRef.current;
		if (prevLists) {
			if (Object.keys(prevLists).length < Object.keys(lists).length || !isEqual(prevLists, lists)) {
				organizeSortedLists();
			}
		}
		prevListsRef.current = lists;
	}, [lists]);

	useEffect(() => {
		if (ref) ref.current = { openListDialog };
	}, [props]);

	const organizeSortedLists = () => {
		// get all lists with an index and put in array, then sort array.
		let sortedLists = sortBy(
			Object.values(lists).filter((list) => hasOwn(list, "index")),
			(list) => list.index
		);

		// take the rest and group by category
		const occupiedCategories = {};
		const unCategorizedLists = [];
		Object.values(lists)
			.filter((list) => !hasOwn(list, "index"))
			.forEach((list) => {
				if (list.category) {
					occupiedCategories[list.category]
						? occupiedCategories[list.category].push(list)
						: (occupiedCategories[list.category] = [list]);
				} else if (!list.category) {
					unCategorizedLists.push(list);
				}
			});
		//, then add to same array
		Object.keys(occupiedCategories)
			.sort()
			.forEach((category) => {
				sortedLists = [...sortedLists, ...occupiedCategories[category]];
			});
		sortedLists = [...sortedLists, ...unCategorizedLists];

		// Save new order
		sortedLists.forEach((list, index) => {
			// For lists with a new sorting index, save them
			if (list.index == null || list.index !== index) {
				eventService.updatePinnedList(list.targetId, list.id, { index }, (err, res) => {
					if (err) console.log(err, res);
				});
			}
		});

		setSortedListsState(sortedLists);
	};

	const onSortEnd = (oldIndex, newIndex) => {
		// Get new sorted list
		const sortedLists = arrayMove(sortedListsState, oldIndex, newIndex);

		// Update list indexes
		for (let i = 0; i < sortedLists.length; i++) {
			const list = sortedLists[i];
			//Redundant safeguard so we only update when necessary
			if (i !== list.index) {
				eventService.updatePinnedList(list.targetId, list.id, { index: i }, (err, res) => {
					if (err) console.log(err, res);
				});
			}
		}

		// Set state
		setSortedListsState(sortedLists);
	};

	const handleExpand = () => {
		dispatch(selectWidget("Event Lists"));
	};

	const getListCardProps = (item, cardStyles, forDialog, dialogProps) => {
		return {
			key: item.id,
			cardStyles: cardStyles,
			defaultListPagination: defaultListPagination,
			listPaginationOptions: listPaginationOptions,
			user: user,
			dir: dir,
			locale: locale,
			lookupData: lookupData,
			getLookupValues: getLookupValues,
			canEdit: forDialog ? false : canAddEditLists,
			canRemove: forDialog ? false : item.targetId ? canAddEditLists : canRemoveLists,
			list: item,
			adding: forDialog ? true : false, // This property controls what type of header is generated
			expanded: expanded,
			secondaryExpanded: secondaryExpanded,
			...(forDialog
				? {
						checked: dialogProps.activeCheckboxes.includes(item.id),
						handleSelectList: () => dialogProps.handleSelectList(item.id),
						updateDialog: dialogProps.updateDialog
				  }
				: {
						updateListCheckbox: updateListCheckbox,
						openDialog: openDialog,
						closeDialog: closeDialog,
						dialog: dialog
				  })
		};
	};

	const openListDialog = () => {
		// Set available lists to add
		listService.getAll((err, response) => {
			if (err) {
				//setError(true);
			} else if (typeof response === "object" && hasOwn(response, "success") && !response.success) {
				setAvailableListsError(true);
			} else {
				setAvailableLists(response);
			}
		});

		setActiveCheckboxes([]);
		setListSearch("");
		dispatch(openDialog("listWidgetDialog"));
	};

	const closeListDialog = () => {
		// Clear error and set lists to null so addable lists will update in real time as permissions are set
		setAvailableListsError(false);
		setAvailableLists(null);
		dispatch(closeDialog("listWidgetDialog"));
	};

	// set controlled inputs
	const handleSelectList = (listId) => {
		const found = activeCheckboxes.includes(listId);

		if (found) {
			const acBoxes = activeCheckboxes.filter((x) => x !== listId);
			setActiveCheckboxes(acBoxes);
		} else {
			setActiveCheckboxes([...activeCheckboxes, listId]);
		}
	};

	const saveAddLists = () => {
		const listIds = activeCheckboxes;
		const type = "Event";
		const eventId = contextId;

		eventService.pinListsByTemplates(listIds, type, eventId, (err, res) => {
			if (err) {
				console.log(err, res);
			} else {
				dispatch(closeDialog("listWidgetDialog"));
			}

			// -- enable add button
			setAddListDisabled(false);
		});

		// -- disable add button
		setAddListDisabled(true);
	};

	// FIXME: Hack to make sure dialog repositions on list expansion
	const updateDialog = () => {
		// forceUpdate();
	};

	const handleCollapseAndExpand = (listId, isExpanded) => {
		if (!triggered) {
			setTriggered(true);
		}
		if (expandedChildren.includes(listId) || !isExpanded) {
			const latestExpanded = expandedChildren.filter((value) => value !== listId);
			setExpandedChildren(latestExpanded);
		} else {
			if (!expandedChildren.includes(listId) && isExpanded) {
				setExpandedChildren([...expandedChildren, listId]);
			}
		}
	};

	useEffect(() => {
		if (triggered) {
			if (expandedChildren?.length > 0) {
				if (sortedListsState.length === expandedChildren.length) {
					setCollapsed(false);
					setTempCollapsed(null);
				} else {
					// Setting temporary collapse here when the list cards are not completely collapsed or expanded.
					// Another reason for using temporary collapse is that it will not be passed to the proximity card component, while the collapsed `useState` variable or hook will be passed.
					setTempCollapsed(true);
				}
			} else {
				if (!collapsed) {
					setCollapsed(!collapsed);
				}
			}
		}
	}, [expandedChildren, triggered]);

	useEffect(() => {
		if (!collapsed) {
			setTempCollapsed(null);
			const listChildren = sortedListsState?.map((element) => element.id);
			setExpandedChildren(listChildren);
		} else {
			setTempCollapsed(null);
			setExpandedChildren([]);
		}
	}, [collapsed, lists]);

	const cardStyles = {
		card: {
			backgroundColor: "#1F1F21",
			marginBottom: ".75rem"
		},
		cardExpanded: {
			backgroundColor: "#35383c",
			marginBottom: "2rem",
			boxShadow: "0px 0px 21px 2px rgba(0, 0, 0, 0.35)"
		},
		cardWrapperExpanded: {
			backgroundColor: "#35383c",
			marginBottom: "5rem",
			margin: "auto",
			width: "90%"
		},
		header: {
			backgroundColor: "#41454A",
			// marginBottom: ".75rem",
			display: "flex",
			padding: 8,
			borderRadius: 4
		},
		checkboxLabel: {
			color: "white",
			overflow: "hidden",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			width: 235
		},
		addListButtons: {
			margin: ".75rem"
		},
		input: {
			backgroundColor: "#35383c",
			padding: "5px",
			width: "100%",
			border: "none"
		},
		widgetExpandButton: {
			width: "auto",
			...(dir === "rtl" && { paddingLeft: 0 }),
			...(dir === "ltr" && { paddingRight: 0 })
		},
		svgIcon: {
			width: "20px",
			height: "20px",
			color: "#FCFDFD",
			cursor: "pointer",
			...(dir === "rtl" && { marginLeft: "17px" }),
			...(dir === "ltr" && { marginRight: "17px" })
		}
	};

	return selected || !enabled ? (
		<div />
	) : (
		<div className="widget-wrapper" style={expanded ? cardStyles.cardWrapperExpanded : {}}>
			{!expanded ? (
				<div className="widget-header" style={{ marginTop: -8 }}>
					<SvgIcon
						style={cardStyles.svgIcon}
						onClick={() => {
							if (tempCollapsed) {
								setCollapsed(false);
								setTempCollapsed(null);
								setChildKey(childKey + 1);
							} else {
								setCollapsed(!collapsed);
							}
						}}
					>
						{tempCollapsed === null && <path d={collapsed ? mdiExpandAll : mdiCollapseAll} />}
						{tempCollapsed !== null && <path d={tempCollapsed ? mdiExpandAll : mdiCollapseAll} />}
					</SvgIcon>
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.list.main.eventLists" />
					</div>
					<div className="widget-header-buttons">
						{widgetsExpandable ? (
							<div className="widget-expand-button">
								<IconButton style={cardStyles.widgetExpandButton} onClick={handleExpand}>
									<Expand />
								</IconButton>
							</div>
						) : null}
						<WidgetMenu
							dir={dir}
							collapsed={collapsed}
							widgetState={widgetState}
							widgetName={widgetName}
							listAccessAndEventsManage={listAccessAndEventsManage}
							openListDialog={openListDialog}
						/>
					</div>
				</div>
			) : null}
			<div className="widget-content">
				{/* Lists that have been added to an event */}
				{sortedListsState && sortedListsState.length > 0 ? (
					<SortableList
						key="lists-sortable-list"
						distance={5}
						lockToContainerEdges={true}
						lockAxis={"y"}
						shouldCancelStart={(e) => {
							// Only let the header be draggable
							const header = e.path.slice(0, 5).some((element) => {
								const classNameCheck = element.className.toString().toLowerCase();
								return classNameCheck && classNameCheck.includes("muicardheader");
							});
							if (!header) {
								return true;
							}
							return false;
						}}
						onSortEnd={({ oldIndex, newIndex }) => onSortEnd(oldIndex, newIndex)}
					>
						{sortedListsState.map((list, index) => {
							return (
								<SortableItem
									index={index}
									key={list.id + childKey}
									passedProps={{
										...getListCardProps(list, cardStyles)
									}}
									dir={dir}
									locale={locale}
									collapsed={collapsed}
									handleCollapseAndExpand={handleCollapseAndExpand}
									id={list.id}
								/>
							);
						})}
					</SortableList>
				) : null}

				<CBDialog
					open={dialog === "listWidgetDialog"}
					title={getTranslation("global.profiles.widgets.list.main.chooseToAdd")}
					confirm={{
						label: getTranslation(
							"global.profiles.widgets.list.main.addSelected",
							activeCheckboxes.length ? activeCheckboxes.length : ""
						),
						action: saveAddLists,
						disabled: !activeCheckboxes.length || addListDisabled
					}}
					abort={{
						label: getTranslation("global.profiles.widgets.list.main.cancel"),
						action: closeListDialog
					}}
					options={{
						onClose: closeListDialog,
						maxWidth: "md",
						fullWidth: true
					}}
					dir={dir}
				>
					<SearchField
						id="list-search"
						handleChange={(e) => setListSearch(e.target.value)}
						handleClear={() => setListSearch("")}
						value={listSearch}
						placeholder={getTranslation("global.profiles.widgets.list.main.searchLists")}
						dir={dir}
						autoFocus={true}
					/>
					{/* <div> */}
					<ListDialogBody
						availableLists={availableLists}
						searchValue={listSearch}
						availableListsError={availableListsError}
						getLookupValues={getLookupValues}
						cardStyles={cardStyles}
						getListCardProps={getListCardProps}
						user={user}
						lookupData={lookupData}
						expanded={expanded}
						activeCheckboxes={activeCheckboxes}
						handleSelectList={handleSelectList}
						updateDialog={updateDialog}
						openDialog={openDialog}
						dir={dir}
					/>
					{/* </div> */}
				</CBDialog>
			</div>
		</div>
	);
};

const forwardListWidget = forwardRef(ListWidget);

forwardListWidget.propTypes = propTypes;
forwardListWidget.defaultProps = defaultProps;

export default forwardListWidget;
