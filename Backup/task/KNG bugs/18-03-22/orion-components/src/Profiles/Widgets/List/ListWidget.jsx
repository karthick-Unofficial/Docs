import React, { Component, Fragment } from "react";
import { listService, eventService } from "client-app-core";
import { Collection } from "orion-components/CBComponents";
import { SearchField } from "orion-components/CBComponents";
import { IconButton, FlatButton } from "material-ui";
import { Dialog as CBDialog } from "orion-components/CBComponents";
import { CircularProgress } from "@material-ui/core";
import Expand from "material-ui/svg-icons/maps/zoom-out-map";
import LaunchIcon from "@material-ui/icons/Launch";
import ListCard from "./components/ListCard";
import _ from "lodash";
import isEqual from "react-fast-compare";
// Sortable
import {
	SortableContainer,
	SortableElement,
	arrayMove
} from "react-sortable-hoc";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import PropTypes from "prop-types";

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

const SortableList = SortableContainer(({ key, primaryText, open, children, dir }) => {

	return (
		<Collection
			key={key}
			primaryText={primaryText}
			open={open}
			children={children}
			dir={dir}
		/>
	);
});

const ListDialogBody = props => {
	if (props.availableLists) {
		const filteredLists = props.searchValue ? props.availableLists.filter(list => list.name.includes(props.searchValue)) : props.availableLists;
		const ownedLists = filteredLists.some(list => list.owner === props.user.id);

		const sharedLists = filteredLists.some(list => list.owner !== props.user.id);
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
				{ownedLists ? (
					<Collection
						key={"my-lists"}
						primaryText={getTranslation("global.profiles.widgets.list.main.myLists")}
						open={true}
						dir={props.dir}
					>
						{
							Object.values(occupiedCategories).map((category, index) => {
								return props.getListCategory(category, true, props.cardStyles, true, { ...props, filteredLists });
							})
						}
						{props.getListCategory(null, true, props.cardStyles, true, { ...props, filteredLists })}
					</Collection>
				) : (
					<div />
				)}
				{sharedLists ? (
					<Collection
						key={"shared-lists"}
						primaryText={getTranslation("global.profiles.widgets.list.main.listsSharedWithMe")}
						dir={props.dir}
					>
						{
							Object.values(occupiedCategories).map((category, index) => {
								return props.getListCategory(category, false, props.cardStyles, true, { ...props, filteredLists });
							})
						}
						{props.getListCategory(null, false, props.cardStyles, true, { ...props, filteredLists })}
					</Collection>
				) : (
					<div />
				)
				}
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

class ListWidget extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listsToAdd: [],
			activeCheckboxes: [],
			availableLists: null,
			availableListsError: false,
			addListDisabled: false
		};
	}

	componentDidMount() {
		this.organizeListsByCategory();
	}

	componentDidUpdate(prevProps) {
		if (Object.keys(prevProps.lists).length < Object.keys(this.props.lists).length || !_.isEqual(prevProps.lists, this.props.lists)) {
			this.organizeListsByCategory();
		}
	}
	componentWillUnmount() {
		const { contextId, subscriberRef, isPrimary, expanded } = this.props;

		if (!isPrimary && !expanded) {
			this.props.unsubscribeFromFeed(contextId, "lists", subscriberRef);
		}
	}

	organizeListsByCategory = () => {
		const { lists } = this.props;

		//determine which categories will have lists in them
		const occupiedCategories = {};
		Object.values(lists).forEach(list => {
			if (list.category) {
				occupiedCategories[list.category] ? occupiedCategories[list.category].push(list) : occupiedCategories[list.category] = [list];
			} else if (!list.category) {
				occupiedCategories["uncategorized"] ? occupiedCategories["uncategorized"].push(list) : occupiedCategories["uncategorized"] = [list];
			}
		});
		Object.keys(occupiedCategories).forEach(category => {
			if (category !== "uncategorized") {
				occupiedCategories[category] = _.sortBy(occupiedCategories[category], list => list.index);
				occupiedCategories[category].forEach((list, index) => {
					if (list.category && list.index == null) {
						eventService.updatePinnedList(list.targetId, list.id, { index }, (err, res) => {
							if (err) console.log(err);
						});
					}
				});
			}
		});
		this.setState({
			listsByCategory: occupiedCategories
		});
	}

	onSortEnd = (oldIndex, newIndex, category) => {
		const listsByCategory = {
			...this.state.listsByCategory,
			[category]: arrayMove(this.state.listsByCategory[category], oldIndex, newIndex)
		};
		for (let i = 0; i < listsByCategory[category].length; i++) {
			const list = listsByCategory[category][i];
			//Redundant safeguard so we only update when necessary 
			if (i !== list.index) {
				eventService.updatePinnedList(list.targetId, list.id, { index: i }, (err, res) => {
					if (err) console.log(err);
				});
			}
		}
		this.setState({
			listsByCategory
		});
	}

	handleExpand = () => {
		this.props.selectWidget("Event Lists");
	};

	getListCategory = (category, owned, cardStyles, forDialog, dialogProps) => {
		const { dialog, user, lookupData, canAddEditLists, canRemoveLists, getLookupValues, updateListCheckbox, openDialog, closeDialog, expanded, defaultListPagination, listPaginationOptions, secondaryExpanded, dir, locale } = this.props;
		const props = (item) => {
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
		const card = (item, index) => {
			return forDialog || !category ? (
				<ListCard
					{...props(item)}
				/>
			) : (
				<SortableItem index={index} key={props(item).key} passedProps={{ ...props(item) }} dir={dir} locale={locale} />
			);
		};

		const lists = forDialog ? dialogProps.filteredLists.filter(list => category ? list.category === category.id : !list.category)
			: this.state.listsByCategory[category ? category.id : "uncategorized"];

		const items = _.pickBy(lists, list => owned ? list.owner === user.id : list.owner !== user.id);
		if (_.size(items) > 0) {
			return forDialog || !category ? (
				<Collection
					key={category ? category.id : "uncategorized"}
					primaryText={category ? category.name : getTranslation("global.profiles.widgets.list.main.uncategorizedLists")}
					secondaryText={_.size(items) === 1 ? getTranslation("global.profiles.widgets.list.main.list", _.size(items)) : getTranslation("global.profiles.widgets.list.main.lists", _.size(items))}
					children={Object.values(items).map(item => {
						return card(item);
					})}
					dir={dir}
				/>
			) : (
				<SortableList
					key={category.id}
					primaryText={category.name}
					distance={5}
					lockToContainerEdges={true}
					lockAxis={"y"}
					shouldCancelStart={(e) => {
						// Don't let users drag a list for sorting if they click anywhere in a notes editor
						const check = e.path.slice(0, 5).some(element => {
							const classNameCheck = element.className.toString();
							return classNameCheck && (classNameCheck.includes("ql-container") || classNameCheck.includes("quill") ||
								classNameCheck.includes("ql-snow") || classNameCheck.includes("ql-editor"));
						});
						if (check) {
							return true;
						}
						return false;
					}}
					onSortEnd={({ oldIndex, newIndex }) => this.onSortEnd(oldIndex, newIndex, category.id)}
					secondaryText={_.size(items) === 1 ? getTranslation("global.profiles.widgets.list.main.list", _.size(items)) : getTranslation("global.profiles.widgets.list.main.lists", _.size(items))}
					children={Object.values(items).map((item, index) => {
						return card(item, index);
					})}
					dir={dir}
				/>
			);
		}

	}

	handleLaunch = () => {
		const { contextId } = this.props;

		window.open(`/events-app/#/entity/${contextId}/widget/event-lists`);
	};

	openListDialog = () => {
		// Set available lists to add
		listService.getAll((err, response) => {
			if (err) {
				this.setState({
					Error: true
				});
			}
			else if (typeof response === "object" && response.hasOwnProperty("success") && !response.success) {
				this.setState({ availableListsError: true });
			}
			else {
				this.setState({ availableLists: response });
			}
		});

		this.props.openDialog("listWidgetDialog");
		this.setState({
			activeCheckboxes: []
		});
	};

	closeListDialog = () => {
		// Clear error and set lists to null so addable lists will update in real time as permissions are set
		this.setState({ availableListsError: false, availableLists: null });
		this.props.closeDialog("listWidgetDialog");
	};

	// set controlled inputs
	handleSelectList = listId => {
		const found = this.state.activeCheckboxes.includes(listId);

		if (found) {
			this.setState({
				activeCheckboxes: this.state.activeCheckboxes.filter(x => x !== listId)
			});
		} else {
			this.setState({
				activeCheckboxes: [...this.state.activeCheckboxes, listId]
			});
		}
	};

	saveAddLists = () => {
		const listIds = this.state.activeCheckboxes;
		const type = "Event";
		const eventId = this.props.contextId;

		eventService.pinListsByTemplates(listIds, type, eventId, (err, res) => {
			if (err) {
				console.log(err);
			} else {
				this.props.closeDialog("listWidgetDialog");
			}

			// -- enable add button
			this.setState({
				addListDisabled: false
			});
		});

		// -- disable add button
		this.setState({
			addListDisabled: true
		});
	};

	// FIXME: Hack to make sure dialog repositions on list expansion
	updateDialog = () => {
		this.forceUpdate();
	};

	render() {
		const {
			selected,
			canAddEditLists,
			expanded,
			enabled,
			getLookupValues,
			lookupData,
			order,
			user,
			widgetsExpandable,
			widgetsLaunchable,
			lists,
			dialog,
			openDialog,
			dir
		} = this.props;
		const {
			activeCheckboxes,
			listSearch,
			addListDisabled
		} = this.state;
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
				paddingTop: 16,
				paddingBottom: 16
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

		const ownedLists = this.state.listsByCategory && lists.some(list => list.owner === user.id);

		const sharedLists = this.state.listsByCategory && lists.some(list => list.owner !== user.id);
		//organize available categories by their ids into an object
		const convertedCategories = _.reduce(lists, (result, list) => {
			result[list.category] = list.categoryRef;
			return result;
		}, {});
		//determine which categories will have lists in them
		const occupiedCategories = {};
		lists.forEach(list => {
			if (list.category && !occupiedCategories[list.category] && convertedCategories[list.category]) {
				occupiedCategories[list.category] = convertedCategories[list.category];
			}
		});
		return selected || !enabled ? (
			<div />
		) : (
			<div
				className={`widget-wrapper ${"index-" + order}`}
				style={expanded ? cardStyles.cardWrapperExpanded : {}}
			>
				{!expanded ? (
					<div className="widget-header">
						<div className="cb-font-b2"><Translate value="global.profiles.widgets.list.main.eventLists" /></div>
						{canAddEditLists && (
							<div className="widget-option-button">
								<FlatButton
									label={getTranslation("global.profiles.widgets.list.main.addList")}
									primary={true}
									onClick={this.openListDialog}
								/>
							</div>
						)}
						<div className="widget-header-buttons">
							{widgetsExpandable ? (
								<div className="widget-expand-button">
									<IconButton
										style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
										onClick={this.handleExpand}
									>
										<Expand />
									</IconButton>
								</div>
							) : null}
							{widgetsLaunchable ? (
								<div className="widget-expand-button">
									<IconButton
										style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
										onClick={this.handleLaunch}
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
					{ownedLists ? (
						<Collection
							key={"my-lists"}
							primaryText={getTranslation("global.profiles.widgets.list.main.myLists")}
							open={true}
							dir={dir}
						>
							{
								Object.values(occupiedCategories).map((category, index) => {
									return this.getListCategory(category, true, cardStyles);
								})
							}
							{this.getListCategory(null, true, cardStyles)}
						</Collection>
					) : (
						<div />
					)}
					{sharedLists ? (
						<Collection
							key={"shared-lists"}
							primaryText={getTranslation("global.profiles.widgets.list.main.listsSharedWithMe")}
							dir={dir}
						>
							{
								Object.values(occupiedCategories).map((category, index) => {
									return this.getListCategory(category, false, cardStyles);
								})
							}
							{this.getListCategory(null, false, cardStyles)}
						</Collection>
					) : (
						<div />
					)}
					<CBDialog
						open={dialog === "listWidgetDialog"}
						title={getTranslation("global.profiles.widgets.list.main.chooseToAdd")}
						confirm={{
							label: getTranslation("global.profiles.widgets.list.main.addSelected", (activeCheckboxes.length ? activeCheckboxes.length : "")),
							action: this.saveAddLists,
							disabled: !activeCheckboxes.length || addListDisabled
						}}
						abort={{ label: getTranslation("global.profiles.widgets.list.main.cancel"), action: this.closeListDialog }}
						options={{
							onClose: this.closeListDialog,
							maxWidth: "xs"
						}}
						dir={dir}
					>
						<SearchField
							id="list-search"
							handleChange={(e) => this.setState({
								listSearch: e.target.value
							})}
							handleClear={() => this.setState({
								listSearch: ""
							})}
							value={listSearch}
							placeholder={getTranslation("global.profiles.widgets.list.main.searchLists")}
							dir={dir}
						/>
						{/* <div> */}
						<ListDialogBody
							availableLists={this.state.availableLists}
							searchValue={listSearch}
							availableListsError={this.state.availableListsError}
							getLookupValues={getLookupValues}
							getListCategory={this.getListCategory}
							cardStyles={cardStyles}
							user={user}
							lookupData={lookupData}
							expanded={expanded}
							activeCheckboxes={this.state.activeCheckboxes}
							handleSelectList={this.handleSelectList}
							updateDialog={this.updateDialog}
							openDialog={openDialog}
							dir={dir}
						/>
						{/* </div> */}
					</CBDialog>
				</div>
			</div>
		);
	}
}


ListWidget.propTypes = propTypes;
ListWidget.defaultProps = defaultProps;


export default ListWidget;
