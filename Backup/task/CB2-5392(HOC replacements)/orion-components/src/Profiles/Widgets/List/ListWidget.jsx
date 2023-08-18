import React, { Fragment, useEffect, useState, useRef, forwardRef } from "react";
import { listService, eventService } from "client-app-core";
import { SearchField } from "orion-components/CBComponents";
import { IconButton, FlatButton } from "material-ui";
import { Dialog as CBDialog } from "orion-components/CBComponents";
import { CircularProgress, List } from "@material-ui/core";
import Expand from "material-ui/svg-icons/maps/zoom-out-map";
import LaunchIcon from "@material-ui/icons/Launch";
import { default as ListCard } from "./components/ListCard";
import _ from "lodash";
// Sortable
import {
	SortableContainer,
	SortableElement,
	arrayMove
} from "react-sortable-hoc";
import { Translate, getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

const propTypes = {
	locale: PropTypes.string
};
const defaultProps = {
	locale: "en"
};

const SortableItem = SortableElement(({ passedProps, dir, locale }) => {
	return (
		<ListCard
			sortable={true}
			{...passedProps}
			dir={dir}
			locale={locale}
		/>
	);
});

const SortableList = SortableContainer(({ key, children }) => {
	return (
		<ul key={key}>
			{children}
		</ul>
	);
});

const ListDialogBody = props => {
	if (props.availableLists) {
		const filteredLists = props.searchValue ? props.availableLists.filter(list => list.name.toLowerCase().includes(props.searchValue.toLowerCase())) : props.availableLists;

		//organize available categories by their ids into an object
		const convertedCategories = _.reduce(props.availableLists, (result, list) => {
			result[list.category] = list.categoryRef;
			return result;
		}, {});

		//determine which categories will have lists in them
		const occupiedCategories = {};
		filteredLists.forEach(list => {
			if (list.category && !occupiedCategories[list.category] && convertedCategories[list.category]) {
				occupiedCategories[list.category] = convertedCategories[list.category];
			}
		});

		return (
			<Fragment>
				<List key="add-lists-category-section">
					{
						Object.values(occupiedCategories).map(category => {
							return (
								<Fragment>
									<p key={`add-lists-category-${category.id}-label`}>{category.name}</p>
									<List key={`add-lists-category-${category.id}`}>
										{filteredLists.filter(list => list.category === category.id).map(list => {
											return <ListCard key={`add-lists-list-${list.id}`} {...props.getListCardProps(list, props.cardStyles, true, { ...props, filteredLists })} />;
										})}
									</List>
								</Fragment>
							);
						})
					}
					<p key={"add-lists-category-uncategorized-label"}>{getTranslation("global.profiles.widgets.list.main.uncategorizedLists")}</p>
					<List key={"add-lists-category-uncategorized"}>
						{filteredLists.filter(list => !list.category).map(list => {
							return <ListCard key={`add-lists-list-${list.id}`} {...props.getListCardProps(list, props.cardStyles, true, { ...props, filteredLists })} />;
						})}
					</List>
				</List>
			</Fragment>
		);
	} else if (props.availableListsError) {
		return (
			<p style={{ paddingTop: "20px", textAlign: "center" }}>
				{" "}<Translate value="global.profiles.widgets.list.main.noListsAvail" />{" "}
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

const ListWidget = forwardRef((props, ref) => {
	const {
		lists,
		contextId,
		subscriberRef,
		isPrimary,
		expanded,
		unsubscribeFromFeed,
		selectWidget,
		dialog,
		user,
		lookupData,
		canAddEditLists,
		canRemoveLists,
		getLookupValues,
		updateListCheckbox,
		openDialog,
		closeDialog,
		defaultListPagination,
		listPaginationOptions,
		secondaryExpanded,
		dir,
		locale,
		selected,
		enabled,
		order,
		widgetsExpandable,
		widgetsLaunchable
	} = props;
	const dispatch = useDispatch();

	const [activeCheckboxes, setActiveCheckboxes] = useState([]);
	const [listSearch, setListSearch] = useState("");
	const [availableLists, setAvailableLists] = useState(null);
	const [availableListsError, setAvailableListsError] = useState(false);
	const [addListDisabled, setAddListDisabled] = useState(false);
	const [sortedListsState, setSortedListsState] = useState();
	const [Error, setError] = useState(false);

	useEffect(() => {
		organizeSortedLists();

		return () => {
			if (!isPrimary && !expanded) {
				dispatch(unsubscribeFromFeed(contextId, "lists", subscriberRef));
			}
		};
	}, []);

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};
	const prevProps = usePrevious(props);

	useEffect(() => {
		if (prevProps && prevProps.lists) {
			if (Object.keys(prevProps.lists).length < Object.keys(lists).length || !_.isEqual(prevProps.lists, lists)) {
				organizeSortedLists();
			}
		}
		if (ref) ref.current = { openListDialog };
	}, [props]);

	const organizeSortedLists = () => {
		// get all lists with an index and put in array, then sort array.
		let sortedLists = _.sortBy(Object.values(lists).filter(list => list.hasOwnProperty("index")), list => list.index);

		// take the rest and group by category
		const occupiedCategories = {};
		const uncategorizedLists = [];
		Object.values(lists).filter(list => !list.hasOwnProperty("index")).forEach(list => {
			if (list.category) {
				occupiedCategories[list.category] ? occupiedCategories[list.category].push(list) : occupiedCategories[list.category] = [list];
			} else if (!list.category) {
				uncategorizedLists.push(list);
			}
		});
		//, then add to same array
		Object.keys(occupiedCategories).sort().forEach(category => {
			sortedLists = [...sortedLists, ...occupiedCategories[category]];
		});
		sortedLists = [...sortedLists, ...uncategorizedLists];

		// Save new order
		sortedLists.forEach((list, index) => {
			// For lists with a new sorting index, save them
			if (list.index == null || list.index !== index) {
				eventService.updatePinnedList(list.targetId, list.id, { index }, (err, res) => {
					if (err) console.log(err);
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
					if (err) console.log(err);
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
			...(forDialog ? {
				checked: dialogProps.activeCheckboxes.includes(item.id),
				handleSelectList: () => dialogProps.handleSelectList(item.id),
				updateDialog: dialogProps.updateDialog
			} : {
				updateListCheckbox: updateListCheckbox,
				openDialog: openDialog,
				closeDialog: closeDialog,
				dialog: dialog
			})
		};
	};

	const handleLaunch = () => {

		window.open(`/events-app/#/entity/${contextId}/widget/event-lists`);
	};

	const openListDialog = () => {
		// Set available lists to add
		listService.getAll((err, response) => {
			if (err) {
				setError(true);
			}
			else if (typeof response === "object" && response.hasOwnProperty("success") && !response.success) {
				setAvailableListsError(true);
			}
			else {
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
	const handleSelectList = listId => {
		const found = activeCheckboxes.includes(listId);

		if (found) {
			const activecheckBoxes = activeCheckboxes.filter(x => x !== listId);
			setActiveCheckboxes(activecheckBoxes);
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
				console.log(err);
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
			color: "white", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", width: 235
		},
		addListButtons: {
			margin: ".75rem"
		},
		input: {
			backgroundColor: "#35383c",
			padding: "5px",
			width: "100%",
			border: "none"
		}
	};

	return selected || !enabled ? (
		<div />
	) : (
		<div
			className={`widget-wrapper ${"index-" + order}`}
			style={expanded ? cardStyles.cardWrapperExpanded : {}}
		>
			{!expanded ? (
				<div className="widget-header" style={{ marginTop: -8 }}>
					<div className="cb-font-b2"><Translate value="global.profiles.widgets.list.main.eventLists" /></div>
					{canAddEditLists && (
						<div className="widget-option-button">
							<FlatButton
								label={getTranslation("global.profiles.widgets.list.main.addList")}
								primary={true}
								onClick={openListDialog}
							/>
						</div>
					)}
					<div className="widget-header-buttons">
						{widgetsExpandable ? (
							<div className="widget-expand-button">
								<IconButton
									style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
									onClick={handleExpand}
								>
									<Expand />
								</IconButton>
							</div>
						) : null}
						{widgetsLaunchable ? (
							<div className="widget-expand-button">
								<IconButton
									style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
									onClick={handleLaunch}
								>
									<LaunchIcon />
								</IconButton>
							</div>
						) : null}
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
							const header = e.path.slice(0, 5).some(element => {
								const classNameCheck = element.className.toString().toLowerCase();
								return classNameCheck && classNameCheck.includes("muicardheader");
							});
							if (!header) {
								return true;
							}
							return false;
						}}
						onSortEnd={({ oldIndex, newIndex }) => onSortEnd(oldIndex, newIndex)}
						children={sortedListsState.map((list, index) => {
							return <SortableItem index={index} key={list.id} passedProps={{ ...getListCardProps(list, cardStyles) }} dir={dir} locale={locale} />;
						})}
					/>
				) : null}

				<CBDialog
					open={dialog === "listWidgetDialog"}
					title={getTranslation("global.profiles.widgets.list.main.chooseToAdd")}
					confirm={{
						label: getTranslation("global.profiles.widgets.list.main.addSelected", (activeCheckboxes.length ? activeCheckboxes.length : "")),
						action: saveAddLists,
						disabled: !activeCheckboxes.length || addListDisabled
					}}
					abort={{ label: getTranslation("global.profiles.widgets.list.main.cancel"), action: closeListDialog }}
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
});

ListWidget.propTypes = propTypes;
ListWidget.defaultProps = defaultProps;


export default ListWidget;
